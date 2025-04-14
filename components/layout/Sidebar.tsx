"use client";

import { useState } from "react";
import DirectoryItem from "../DirectoryItem";
import type { DirectoryNode } from "@/lib/content";
import Link from "next/link";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SearchDialog from "../SearchDialog";

interface SidebarProps {
	treeData: DirectoryNode[];
}

export default function Sidebar({ treeData }: SidebarProps) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="h-screen sticky top-0">
			<aside
				className={cn(
					"sticky top-0 left-0 h-full shrink-0 z-10",
					"transition-all duration-300 ease-in-out",
					"overflow-hidden bg-background",
					isOpen ? "w-72 border-r" : "w-0 border-none",
				)}
			>
				<div
					className={cn(
						"p-5 h-full flex flex-col mt-6",
						"transition-opacity duration-200 ease-in-out",
						isOpen ? "opacity-100" : "opacity-0 invisible pointer-events-none",
					)}
				>
					<h3 className="text-xl font-medium mb-4 shrink-0">
						<Link href="/">Directory</Link>
					</h3>

					<div className="flex items-center gap-1">
						<SearchDialog />
					</div>
					<div className="space-y-1 flex-grow overflow-y-auto mt-6">
						{treeData.map((node) => (
							<DirectoryItem
								key={node.name + (node.slug?.join("-") ?? "")}
								node={node}
								level={0}
							/>
						))}
					</div>
				</div>
			</aside>
			<Button
				size="icon"
				variant="outline"
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"absolute top-2 z-20 shadow-none",
					"p-0 size-8 rounded-md",
					"transition-[left] duration-300 ease-in-out",
					isOpen ? "left-[calc(17rem-2rem)]" : "left-2",
				)}
			>
				{isOpen ? (
					<SidebarClose className="size-4" />
				) : (
					<SidebarOpen className="size-4" />
				)}
			</Button>
		</div>
	);
}
