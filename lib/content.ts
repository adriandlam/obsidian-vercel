import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { extractTextFromMarkdown } from "./md-utils";
import { CONTENT_DIR } from "@/data";

export interface SearchIndexItem {
    slug: string[];
    title: string;
    excerpt?: string;
    textContent: string;
}

// Helper function to safely check if a file exists
export function safeFileExists(filePath: string): boolean {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        console.error(`[safeFileExists] Error checking if file exists: ${filePath}`, error);
        return false;
    }
}

// Helper function to read file and parse frontmatter
// Returns null if file doesn't exist or reading fails
export function readFileAndMatter(
    filePath: string,
): { metadata: Record<string, unknown>; content: string } | null {
    try {
        // Check if file exists *before* trying to read
        if (!safeFileExists(filePath)) {
            return null;
        }
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data: metadata, content } = matter(fileContent);
        return { metadata, content };
    } catch (error: any) {
        // Log errors other than ENOENT (which existsSync should prevent)
        console.error(`[readFileAndMatter] Error reading file ${filePath}:`, error);
        return null;
    }
}

// Helper function to get the MDX content and metadata
export async function getNoteBySlug(slugArray: string[]) {
    if (!slugArray || slugArray.length === 0) {
        console.error("[getNoteBySlug] Received empty or invalid slugArray:", slugArray);
        return null;
    }

    const slugPath = path.join(CONTENT_DIR, ...slugArray);

    let note: { metadata: Record<string, unknown>; content: string } | null = null;

    // 1. Try direct file match (.md then .mdx)
    const mdPath = `${slugPath}.md`;
    const mdxPath = `${slugPath}.mdx`;
    
    note = readFileAndMatter(mdPath);
    if (note) {
        return note;
    }

    note = readFileAndMatter(mdxPath);
    if (note) {
        return note;
    }

    // 2. Try index file within the directory (.md then .mdx)
    const indexMdPath = path.join(slugPath, "index.md");
    const indexMdxPath = path.join(slugPath, "index.mdx");
    
    note = readFileAndMatter(indexMdPath);
    if (note) {
        return note;
    }

    note = readFileAndMatter(indexMdxPath);
    if (note) {
        return note;
    }

    console.error(`[getNoteBySlug] Failed to find note content for slug: [${slugArray.join(', ')}] at path: ${slugPath}`);
    return null;
}

// Helper function to safely get directory entries
function safeReadDir(dir: string): fs.Dirent[] {
    try {
        if (!safeFileExists(dir)) {
            console.error(`[safeReadDir] Directory does not exist: ${dir}`);
            return [];
        }
        return fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
        console.error(`[safeReadDir] Error reading directory ${dir}:`, error);
        return [];
    }
}

// Recursive function to find all .md/.mdx files and return their slug paths
export function findMarkdownPaths(
    dir: string,
    basePath?: string,
): { params: { slug: string[] } }[] {
    
    const absoluteDir = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
    const base = basePath || absoluteDir;
    let paths: { params: { slug: string[] } }[] = [];

    const entries = safeReadDir(absoluteDir);

    for (const entry of entries) {
        const fullPath = path.join(absoluteDir, entry.name);
        // Skip hidden files/folders
        if (entry.name.startsWith('.')) {
            continue;
        }

        const relativePath = path.relative(base, fullPath);
        const pathSegments = relativePath.split(path.sep).filter(Boolean); // Filter out empty segments

        if (entry.isDirectory()) {
            paths = paths.concat(findMarkdownPaths(fullPath, base));
        } else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
            const parsedPath = path.parse(entry.name);
            let slug: string[];

            // If it's an index file, the slug is the directory path
            if (/^index$/i.test(parsedPath.name)) {
                // pathSegments includes the filename, so slice it off
                slug = pathSegments.slice(0, -1);
            } else {
                // Otherwise, slug includes the filename (without extension)
                // pathSegments includes the filename, replace last segment with name w/o ext
                slug = [...pathSegments.slice(0, -1), parsedPath.name];
            }

            // Ensure slug is not empty (e.g., for content/index.md) and doesn't contain hidden segments
            if (slug.length > 0 && !slug.some((segment) => segment.startsWith("."))) {
                paths.push({ params: { slug } });
            } else if (slug.length === 0 && /^index$/i.test(parsedPath.name) && absoluteDir === base) {
                // Handle root index file
                paths.push({ params: { slug: [] } });
            }
        }
    }
    
    return paths;
}

export async function getAllPublishedNotesData(): Promise<SearchIndexItem[]> {
    const allPaths = findMarkdownPaths(CONTENT_DIR);
    
    const allNotesData: SearchIndexItem[] = [];

    for (const pathData of allPaths) {
        const slug = pathData.params.slug;
        const note = await getNoteBySlug(slug);

        if (note && note.metadata.publish !== false) {
            const textContent = await extractTextFromMarkdown(note.content);
            allNotesData.push({
                slug: slug,
                title: (note.metadata.title as string) || slug.join(" "),
                excerpt: (note.metadata.excerpt as string) || undefined,
                textContent: textContent,
            });
        } else if (!note) {
            console.warn(`[getAllPublishedNotesData] Note not found for generated slug: [${slug.join('/')}], skipping index entry.`);
        } else {
            // Note exists but publish is false
        }
    }

    return allNotesData;
}