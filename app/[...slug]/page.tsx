//@ts-nocheck

import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/vs2015.css";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Copy, ExternalLink } from "lucide-react";
import remarkSmartypants from "remark-smartypants";
import { CONTENT_DIR } from "@/data";
import { cn } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";
import { findMarkdownPaths, getNoteBySlug } from "@/lib/content";
import { generateHeadingId, extractText } from "@/lib/md-utils";

export default async function Page({ params }: { params: { slug: string[] } }) {
	const slugArray = params.slug ?? [];

	// Handle root index.md or index.mdx if slug is empty
	if (slugArray.length === 0) {
		slugArray.push("index");
	}

	console.log(`[Page Runtime] Rendering slug: ${slugArray.join("/")}`);
	console.log(`[Page Runtime] CONTENT_DIR from import: ${CONTENT_DIR}`);

	try {
		// Let's see what's in the current working directory of the function
		const cwd = process.cwd();
		console.log(`[Page Runtime] Current Working Directory (cwd): ${cwd}`);
		const cwdContents = await fs.readdir(cwd);
		console.log(`[Page Runtime] Contents of cwd (${cwd}):`, cwdContents);

		// Let's see what's in the parent directory of cwd
		try {
			const parentDir = path.dirname(cwd);
			console.log(`[Page Runtime] Parent Directory: ${parentDir}`);
			const parentDirContents = await fs.readdir(parentDir);
			console.log(
				`[Page Runtime] Contents of Parent Directory (${parentDir}):`,
				parentDirContents,
			);
		} catch (parentErr) {
			console.error(
				`[Page Runtime] Error listing parent directory:`,
				parentErr,
			);
		}

		// Now check the specific CONTENT_DIR path Vercel *should* have created
		const expectedContentPath = path.join(cwd, "content"); // Assuming it's copied relative to cwd
		console.log(
			`[Page Runtime] Checking expected path: ${expectedContentPath}`,
		);
		const expectedDirContents = await fs.readdir(expectedContentPath);
		console.log(
			`[Page Runtime] Contents of expected path (${expectedContentPath}):`,
			expectedDirContents,
		);

		// Try accessing a specific file within the expected path
		const testFilePath = path.join(expectedContentPath, "example", "index.md"); // Adjust if needed
		console.log(
			`[Page Runtime] Attempting access to test file: ${testFilePath}`,
		);
		await fs.access(testFilePath);
		console.log(
			`[Page Runtime] SUCCESS: Test file accessible at ${testFilePath}`,
		);
	} catch (error) {
		console.error(
			`[Page Runtime] ERROR accessing directories or test file:`,
			error,
		);
	}

	console.log(
		`[Page Runtime] Calling getNoteBySlug for: ${slugArray.join("/")}`,
	);
	const note = await getNoteBySlug(slugArray);

	if (!note) {
		console.error(
			`[Page Runtime] getNoteBySlug returned null for slug: ${slugArray.join("/")}. Calling notFound().`,
		);
		notFound();
	}

	const { metadata, content } = note;

	// Check publish status *after* confirming the note exists
	if (metadata.publish === false) {
		console.log(`Note "${slugArray.join("/")}" is not published.`);
		notFound();
	}

	return (
		<article className="prose prose-invert max-w-none">
			{metadata.title && <h1 className="!mb-0 text-lg">{metadata.title}</h1>}
			{metadata.created && (
				<p className="text-muted-foreground text-sm">
					Created {new Date(metadata.created).toDateString()}
				</p>
			)}
			{metadata.updated && (
				<p className="text-muted-foreground text-sm">
					Last updated {new Date(metadata.updated).toDateString()}
				</p>
			)}
			{metadata.excerpt && (
				<p className="text-muted-foreground text-sm mt-4">{metadata.excerpt}</p>
			)}
			<div className="w-full border-b h-1 mt-4" />
			<MDXRemote
				source={content}
				components={{
					h1: ({ children, ...props }) => (
						<h1
							className="text-4xl mt-12 mb-6 font-medium"
							id={generateHeadingId(children)}
							{...props}
						>
							{children}
						</h1>
					),
					h2: ({ children, ...props }) => (
						<h2
							className="text-3xl mt-10 mb-4 font-medium"
							id={generateHeadingId(children)}
							{...props}
						>
							{children}
						</h2>
					),
					h3: ({ children, ...props }) => (
						<h3
							className="text-2xl mt-8 mb-3 font-medium"
							id={generateHeadingId(children)}
							{...props}
						>
							{children}
						</h3>
					),
					h4: ({ children, ...props }) => (
						<h4
							className="text-xl mt-6 mb-2 font-medium"
							id={generateHeadingId(children)}
							{...props}
						>
							{children}
						</h4>
					),
					p: ({ children, ...props }) => (
						<p className="my-4 leading-7" {...props}>
							{children}
						</p>
					),
					ul: ({ children, ...props }) => (
						<ul className="list-disc ml-6 my-4" {...props}>
							{children}
						</ul>
					),
					ol: ({ children, ...props }) => (
						<ol className="list-decimal ml-6 my-4" {...props}>
							{children}
						</ol>
					),
					li: ({ children, ...props }) => (
						<li className="mb-2" {...props}>
							{children}
						</li>
					),
					blockquote: ({ children, ...props }) => (
						<blockquote
							className="border-l-4 border-muted-foreground pl-4 italic text-muted-foreground my-6"
							{...props}
						>
							{children}
						</blockquote>
					),
					pre: ({ children, ...props }) => {
						let language = "plaintext";

						if (React.isValidElement(children) && children.props) {
							const childProps = children.props as { className?: string };
							const className = childProps.className ?? "";
							const match = className.match(/language-(\S+)/);
							if (match && match[1]) {
								language = match[1];
							}
						}

						return (
							<pre
								className="hljs !rounded-2xl !text-sm overflow-x-auto !shadow"
								data-language={language}
								{...props}
							>
								<div className="border-b px-4 py-2 border-muted-foreground/50 flex justify-between items-center">
									{language}
									<CopyButton content={extractText(children.toString())} />
								</div>
								<div className="p-4">{children}</div>
							</pre>
						);
					},
					code: ({ children, className, ...props }) => {
						const isInline =
							typeof children === "string" &&
							!children.toString().includes("\n") &&
							!className?.includes("language-");

						if (isInline) {
							return (
								<code
									className="!rounded !text-sm bg-muted px-1.5 py-0.5 font-mono text-red-500"
									{...props}
								>
									{children}
								</code>
							);
						}
						return (
							<code className={cn("!p-0", className)} {...props}>
								{children}
							</code>
						);
					},
					a: ({ children, href, ...props }) => {
						const isExternal = href?.startsWith("http");
						return (
							<a
								className="text-blue-500 hover:text-blue-400 hover:underline inline-flex items-center gap-1"
								href={href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								{...props}
							>
								{children}
								{isExternal && <ExternalLink className="size-4 ml-0.5" />}
							</a>
						);
					},
				}}
				options={{
					mdxOptions: {
						remarkPlugins: [remarkSmartypants, remarkMath, remarkGfm],
						rehypePlugins: [
							rehypeKatex,
							[rehypeHighlight, { detect: true, ignoreMissing: true }],
						],
					},
					scope: metadata, // Pass frontmatter data to MDX
				}}
			/>
		</article>
	);
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
