import BgBorder from "@/components/BgBorder";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="w-screen h-screen">
			<BgBorder />
			<div className="absolute left-[10%] right-[10%] md:left-[20%] md:right-[20%] top-[10%] md:top-[15%] bottom-[10%] md:bottom-[15%] flex items-center justify-center overflow-hidden">
				<div className="p-8 text-center space-y-6 max-w-xl">
					<span className="text-muted-foreground text-lg">404</span>
					<h1 className="text-5xl font-medium">¯\_(ツ)_/¯</h1>
					<p className="mt-4 text-lg mx-auto">
						Looks like you hit a dead link—or maybe this note hasn&apos;t made
						it through the publishing yet.
					</p>
					<div className="rounded-md border border-dashed p-4 text-muted-foreground text-sm max-w-md mx-auto flex gap-2">
						<Info className="size-4 shrink-0 mt-0.5" />
						<p className="text-muted-foreground text-sm text-left">
							Notes must have <code>publish: true</code> in their frontmatter
							and be placed inside the <code>content/</code> directory to be
							published to Vercel.
						</p>
					</div>
					<div className="space-x-4">
						<Button size="lg" asChild>
							<Link href="/">Back to home</Link>
						</Button>
						<Button size="lg" variant="link" asChild>
							<Link href="https://github.com/adriandlam/obsidian-vercel/issues/new">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1024"
									height="1024"
									viewBox="0 0 1024 1024"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
										transform="scale(64)"
									/>
								</svg>
								Open a GitHub issue
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
