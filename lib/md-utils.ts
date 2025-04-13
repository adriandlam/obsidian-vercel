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
	if (React.isValidElement(node)) return extractText(node.props.children);
	return "";
}

export { generateHeadingId, extractText };
