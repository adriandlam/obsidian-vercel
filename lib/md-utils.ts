import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStrip from "strip-markdown";
import remarkStringify from "remark-stringify";
import React from "react";

function generateHeadingId(children: React.ReactNode): string {
	// Basic slugification, consider a more robust library if needed
	return (
		children
			?.toString()
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
			.trim()
			.replace(/\s+/g, "-") // Replace spaces with hyphens
			.replace(/-+/g, "-") ?? "" // Replace multiple hyphens with single one
	);
}

function extractText(node: React.ReactNode): string {
	if (typeof node === "string") return node;
	if (Array.isArray(node)) return node.map(extractText).join("");

	if (React.isValidElement(node) && node.props) {
		const propsWithChildren = node.props as React.PropsWithChildren<unknown>;
		return extractText(propsWithChildren.children);
	}
	return "";
}

async function extractTextFromMarkdown(
	markdownContent: string,
): Promise<string> {
	const file = await unified()
		.use(remarkParse)
		.use(remarkStrip)
		.use(remarkStringify)
		.process(markdownContent);
	return String(file);
}

export { generateHeadingId, extractText, extractTextFromMarkdown };
