import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
	return (
		<footer className="border-t pt-4">
			<p className="text-center text-sm text-muted-foreground">
				Created with{" "}
				<Button asChild variant="link" className="px-0">
					<Link
						href="https://github.com/adriandlam/obsidian-vercel"
						target="_blank"
					>
						Obsidian Vercel
					</Link>
				</Button>
			</p>
		</footer>
	);
}
