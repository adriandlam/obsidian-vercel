import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { CONTENT_DIR } from "../data";
import { extractTextFromMarkdown } from "./md-utils";

export interface SearchIndexItem {
	slug: string[];
	title: string;
	excerpt?: string;
	textContent: string;
}

// Helper function to read file and parse frontmatter
// Returns null if file doesn't exist or reading fails
function readFileAndMatter(
	filePath: string,
): { metadata: Record<string, unknown>; content: string } | null {
	try {
		const fileContent = fs.readFileSync(filePath, "utf8");
		const { data: metadata, content } = matter(fileContent);
		return { metadata, content };
	} catch (error: any) {
		if (error.code === "ENOENT") {
			// File not found, this is expected in some cases
		} else {
			// Log other errors (e.g., permission issues)
			console.error(`Error reading file ${filePath}:`, error);
		}
		return null;
	}
}

// Helper function to get the MDX content and metadata
async function getNoteBySlug(slugArray: string[]) {
	if (!slugArray || slugArray.length === 0) {
		return null;
	}

	// Try reading direct file match (e.g., /class-1/example -> content/class-1/example.md)
	const directPathBase = path.join(CONTENT_DIR, ...slugArray);
	let note = readFileAndMatter(`${directPathBase}.md`);
	if (note) return note;

	note = readFileAndMatter(`${directPathBase}.mdx`);
	if (note) return note;

	// If no direct file, try reading an index file within a directory of the same name
	// (e.g., /class-1 -> content/class-1/index.md)
	const indexPathBase = path.join(CONTENT_DIR, ...slugArray);
	note = readFileAndMatter(`${indexPathBase}/index.md`);
	if (note) return note;

	note = readFileAndMatter(`${indexPathBase}/index.mdx`);
	if (note) return note;

	// If neither found, return null
	console.warn(`No content file found for slug: ${slugArray.join("/")}`);
	return null;
}

// Recursive function to find all .md/.mdx files and return their slug paths
function findMarkdownPaths(
	dir: string,
	basePath: string = dir,
): { params: { slug: string[] } }[] {
	let paths: { params: { slug: string[] } }[] = [];
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		const relativePath = path.relative(basePath, fullPath);
		const pathSegments = relativePath.split(path.sep);

		if (entry.isDirectory()) {
			// Recursively search in subdirectories
			paths = paths.concat(findMarkdownPaths(fullPath, basePath));
		} else if (entry.isFile() && /\.(md|mdx)$/i.test(entry.name)) {
			// Found a markdown file
			const parsedPath = path.parse(entry.name);

			let slug: string[];

			// See if it's an index file
			if (/^index$/i.test(parsedPath.name)) {
				slug = pathSegments.slice(0, -1);
			} else {
				slug = [...pathSegments.slice(0, -1), parsedPath.name];
			}

			if (slug.length > 0 && !slug.some((segment) => segment.startsWith("."))) {
				paths.push({ params: { slug } });
			}
		}
	}

	return paths;
}

async function getAllPublishedNotesData(): Promise<SearchIndexItem[]> {
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
		}
	}

	return allNotesData;
}

export { readFileAndMatter, getNoteBySlug, findMarkdownPaths, getAllPublishedNotesData};