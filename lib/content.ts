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

export interface DirectoryNode {
	name: string;
	slug: string[] | null;
	children: DirectoryNode[];
	isFolder: boolean;
}

// Helper to get title from frontmatter or derive from name
function getNodeName(
	filePath: string | null,
	defaultName: string,
	isIndex: boolean,
): string {
	if (filePath) {
		const fileData = readFileAndMatter(filePath);
		if (fileData?.metadata?.title) {
			return fileData.metadata.title as string;
		}
	}
	// For index files without a title, use "index"
	if (isIndex && defaultName.toLowerCase() === "index") {
		return "index";
	}
	// Otherwise, use the default name (filename/dirname without extension)
	// Capitalize first letter for better display unless it's 'index'
	return defaultName === "index"
		? defaultName
		: defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
}

// Recursive function to build the directory tree
export function getDirectoryTree(
	dir: string,
	basePath: string = dir,
): DirectoryNode[] {
	const absoluteDir = path.resolve(dir);
	const tree: DirectoryNode[] = [];

	if (!safeFileExists(absoluteDir)) {
		console.warn(`[getDirectoryTree] Directory not found: ${absoluteDir}`);
		return [];
	}

	const entries = safeReadDir(absoluteDir);

	// Separate directories and files
	const dirs = entries.filter((entry) => entry.isDirectory());
	const files = entries.filter(
		(entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name),
	);

	// Process directories first
	for (const entry of dirs) {
		const currentPath = path.join(absoluteDir, entry.name);
		// Skip hidden directories
		if (entry.name.startsWith(".")) continue;

		const children = getDirectoryTree(currentPath, basePath);

		// Check for an index file within this directory
		let indexFilePath: string | null = null;
		let indexSlug: string[] | null = null;
		const indexMd = path.join(currentPath, "index.md");
		const indexMdx = path.join(currentPath, "index.mdx");

		if (safeFileExists(indexMd)) {
			indexFilePath = indexMd;
		} else if (safeFileExists(indexMdx)) {
			indexFilePath = indexMdx;
		}

		// Calculate slug relative to the base content directory
		const relativePath = path.relative(basePath, currentPath);
		const currentSlug = relativePath.split(path.sep).filter(Boolean);

		if (indexFilePath) {
			// If index file exists, this directory node represents a page
			indexSlug = currentSlug;
		}

		// Determine the name for the directory node
		const dirName = getNodeName(indexFilePath, entry.name, true);

		// Add the directory node
		tree.push({
			name: dirName,
			slug: indexSlug,
			children: children,
			isFolder: true,
		});
	}

	// Process files (excluding index files, handled above)
	for (const entry of files) {
		const parsedPath = path.parse(entry.name);
		// Skip index files here, they determine the folder's properties
		if (/^index$/i.test(parsedPath.name)) continue;
		// Skip hidden files
		if (entry.name.startsWith(".")) continue;

		const filePath = path.join(absoluteDir, entry.name);
		const relativePath = path.relative(basePath, filePath);
		const currentSlug = relativePath
			.replace(/\.(md|mdx)$/i, "")
			.split(path.sep)
			.filter(Boolean);

		const fileName = getNodeName(filePath, parsedPath.name, false);

		tree.push({
			name: fileName,
			slug: currentSlug,
			children: [],
			isFolder: false,
		});
	}

	tree.sort((a, b) => {
		if (a.isFolder && !b.isFolder) return -1;
		if (!a.isFolder && b.isFolder) return 1;
		return a.name.localeCompare(b.name);
	});

	return tree;
}

// Helper function to safely check if a file exists
export function safeFileExists(filePath: string): boolean {
	try {
		return fs.existsSync(filePath);
	} catch (error) {
		console.error(
			`[safeFileExists] Error checking if file exists: ${filePath}`,
			error,
		);
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
		console.error(
			"[getNoteBySlug] Received empty or invalid slugArray:",
			slugArray,
		);
		return null;
	}

	const slugPath = path.join(CONTENT_DIR, ...slugArray);

	let note: { metadata: Record<string, unknown>; content: string } | null =
		null;

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

	console.error(
		`[getNoteBySlug] Failed to find note content for slug: [${slugArray.join(", ")}] at path: ${slugPath}`,
	);
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
	const absoluteDir = path.isAbsolute(dir)
		? dir
		: path.join(process.cwd(), dir);
	const base = basePath || absoluteDir;
	let paths: { params: { slug: string[] } }[] = [];

	const entries = safeReadDir(absoluteDir);

	for (const entry of entries) {
		const fullPath = path.join(absoluteDir, entry.name);
		// Skip hidden files/folders
		if (entry.name.startsWith(".")) {
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
			} else if (
				slug.length === 0 &&
				/^index$/i.test(parsedPath.name) &&
				absoluteDir === base
			) {
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
			console.warn(
				`[getAllPublishedNotesData] Note not found for generated slug: [${slug.join("/")}], skipping index entry.`,
			);
		} else {
			// Note exists but publish is false
		}
	}

	return allNotesData;
}
