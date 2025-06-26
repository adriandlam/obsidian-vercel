"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ content }: { content: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = (content: string) => {
		navigator.clipboard.writeText(content).catch((err) => {
			console.error("Failed to copy to clipboard:", err);
		});
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	};

	return (
		<Button
			onClick={() => handleCopy(content)}
			disabled={copied}
			className="h-6 font-sans bg-transparent text-background/65 hover:text-background hover:bg-transparent !px-2"
		>
			{copied ? <Check /> : <Copy />}
			Copy
		</Button>
	);
}
