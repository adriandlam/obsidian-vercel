"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectoryNode } from "@/lib/content";

interface DirectoryItemProps {
	node: DirectoryNode;
	level?: number; // for identation
}

export default function DirectoryItem({ node, level = 0 }: DirectoryItemProps) {
	const [isOpen, setIsOpen] = useState(false);
	const hasChildren = node.isFolder && node.children.length > 0;

	const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (node.isFolder) {
			e.preventDefault();
			setIsOpen(!isOpen);
		}
	};

	const itemContent = (
		<>
			{node.isFolder && (
				<ChevronRight
					className={cn(
						"size-4 mr-1 transition-transform duration-150 flex-shrink-0",
						isOpen ? "rotate-90" : "",
						!hasChildren ? "invisible" : "",
					)}
				/>
			)}
			{!node.isFolder && (
				<span className="inline-block w-4 mr-1 flex-shrink-0" />
			)}{" "}
			{/* Placeholder for alignment */}
			<span className="truncate">{node.name}</span>
		</>
	);

	const commonClasses =
		"flex items-center gap-1 cursor-pointer text-muted-foreground hover:text-foreground ease-in duration-200 transition-colors leading-0 text-sm py-1 w-full text-left";

	return (
		<div style={{ paddingLeft: `${level * 0.75}rem` }}>
			{/* Indentation */}
			{node.slug ? (
				// If slug exists, it's a link (either file or folder with index)
				<Link
					href={`/${node.slug.join("/")}`}
					className={cn(commonClasses)}
					onClick={
						hasChildren
							? (e) => {
									setIsOpen(!isOpen);
								}
							: undefined
					}
				>
					{itemContent}
				</Link>
			) : (
				// If no slug, it's a folder without an index - acts only as a toggle
				<button
					type="button"
					onClick={handleToggle}
					className={cn(commonClasses, !hasChildren ? "cursor-default" : "")}
					disabled={!hasChildren}
				>
					{itemContent}
				</button>
			)}
			{/* Render Children */}
			{hasChildren && isOpen && (
				<div className="mt-1 relative">
					{/* Vertical connector line */}
					<div
						className="absolute left-[calc(0.5rem_+_2px)] top-0 bottom-0 w-px bg-border -translate-x-1/2"
						style={{ left: `${level * 1 + 0.5}rem` }}
					/>
					{node.children.map((child) => (
						<DirectoryItem
							key={child.name + (child.slug?.join("-") ?? "")}
							node={child}
							level={level + 1}
						/>
					))}
				</div>
			)}
		</div>
	);
}
