import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/vs2015.css";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import remarkSmartypants from "remark-smartypants";
import { CONTENT_DIR } from "@/data";

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

export default async function Page({ params }: { params: { slug: string[] } }) {
	const slugArray = params.slug ?? [];

	if (slugArray.length === 0) {
		notFound();
	}

	const note = await getNoteBySlug(slugArray);

	if (!note) {
		notFound();
	}

	const { metadata, content } = note;

	if (metadata.publish === false) {
		notFound();
	}

	const generateHeadingId = (children: React.ReactNode): string => {
		return (
			children
				?.toString()
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.trim()
				.replace(/\s+/g, "-") ?? ""
		);
	};

	return (
		<article className="prose prose-invert max-w-none">
			{metadata.title && <h1 className="!mb-0">{metadata.title}</h1>}
			{metadata.subtitle && (
				<p className="text-zinc-400 !mt-2">{metadata.subtitle}</p>
			)}
			<MDXRemote
				source={content}
				components={{
					h1: ({ children }) => (
						<h1
							className="text-4xl mt-12 mb-6 font-medium"
							id={generateHeadingId(children)}
						>
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2
							className="text-3xl mt-10 mb-4 font-medium"
							id={generateHeadingId(children)}
						>
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3
							className="text-2xl mt-8 mb-3 font-medium"
							id={generateHeadingId(children)}
						>
							{children}
						</h3>
					),
					h4: ({ children }) => (
						<h4
							className="text-xl mt-6 mb-2 font-medium"
							id={generateHeadingId(children)}
						>
							{children}
						</h4>
					),
					p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
					ul: ({ children }) => (
						<ul className="list-disc ml-6 my-4">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal ml-6 my-4">{children}</ol>
					),
					li: ({ children }) => <li className="mb-2">{children}</li>,
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground my-6">
							{children}
						</blockquote>
					),
					code: ({ children }) => (
						<code className="hljs px-10 !rounded-sm !text-sm">{children}</code>
					),
					pre: ({ children }) => (
						<pre className="hljs !rounded-sm !text-sm">{children}</pre>
					),
					a: ({ children, href }) => (
						<a
							className="text-blue-500 inline-flex items-center gap-1"
							href={href}
						>
							{children}
							<ExternalLink className="size-4" />
						</a>
					),
				}}
				options={{
					mdxOptions: {
						remarkPlugins: [remarkSmartypants, remarkMath, remarkGfm],
						rehypePlugins: [
							rehypeKatex,
							[rehypeHighlight, { detect: true, ignoreMissing: true }],
						],
					},
					scope: metadata,
				}}
			/>
		</article>
	);
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

export async function generateStaticParams() {
	const allPaths = findMarkdownPaths(CONTENT_DIR);
	return allPaths;
}

export const dynamicParams = false;

export async function generateMetadata({
	params,
}: { params: { slug: string[] } }): Promise<Metadata> {
	const slugArray = params.slug ?? [];
	const note = await getNoteBySlug(slugArray);

	if (!note) {
		return {
			title: "Not Found",
			description: "The requested page could not be found.",
		};
	}

	const defaultTitle = slugArray
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" - ");

	return {
		title: note.metadata.title || defaultTitle,
		description:
			note.metadata.description || `Content for ${slugArray.join("/")}.`,
	};
}
