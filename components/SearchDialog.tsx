"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState, useRef } from "react";

export default function SearchDialog() {
	const [isOpen, setIsOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		document.addEventListener("keydown", (e) => {
			if (e.key === "/") {
				setIsOpen(true);
			} else if (e.key === "Escape") {
				setIsOpen(false);
			}
		});
	}, []);

	useEffect(() => {
		if (isOpen) {
			inputRef.current?.focus();
		}
	}, [isOpen]);

	return (
		<div>
			<div className="relative">
				<Search className="size-4 absolute top-1/2 -translate-y-1/2 left-2.5 text-muted-foreground" />
				<Input
					placeholder="Search..."
					className="pl-9 w-[15dvw] pr-8"
					onClick={() => setIsOpen(true)}
				/>
				<kbd className="text-muted-foreground absolute top-1/2 -translate-y-1/2 right-2.5 font-mono text-sm">
					/
				</kbd>
			</div>
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur transition-opacity duration-200 ease-in-out ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
			/>
		</div>
	);
}
