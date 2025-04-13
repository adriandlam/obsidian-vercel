import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
	return (
		<div className="relative h-screen w-screen bg-background text-foreground">
			{/* Background border */}
			<BgBorder />

			{/* Content area */}
			<div className="absolute left-[10%] right-[10%] md:left-[20%] md:right-[20%] top-[10%] md:top-[15%] bottom-[10%] md:bottom-[15%] flex items-center justify-center overflow-hidden">
				<div className="max-w-full p-8 text-center space-y-6">
					<h1 className="text-5xl font-medium tracking-tight">
						Obsidian Vercel
					</h1>
					<p className="mt-4 text-lg max-w-lg">
						A quick, easy setup for publishing your Obsidian notes to{" "}
						<Link
							href="https://vercel.com"
							className="text-primary hover:underline"
						>
							Vercel
						</Link>{" "}
						for easy syncing and publishing on the go.
					</p>
					<div className="flex justify-center">
						<ul className="list-disc list-inside text-left space-y-2 max-w-lg">
							<li>Supports Markdown notes, attachments, and embedded images</li>
							<li>Optional password protection for private publishing</li>
							<li>Zero-config deploy to Vercel in seconds</li>
							<li>Secure-by-default with no exposed metadata</li>
						</ul>
					</div>
					<div className="rounded-md border border-dashed p-4 bg-muted/50 text-muted-foreground text-sm max-w-md mx-auto">
						See the example folder structure in <code>content/</code> to
						understand how your notes are organized and rendered.
					</div>
					<div className="space-x-4">
						<Button size="lg" asChild>
							<Link
								target="_blank"
								href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fadriandlam%2Fobsidian-vercel&project-name=obsidian-vercel&repository-name=obsidian-vercel"
							>
								Deploy on{" "}
								<span className="flex items-center gap-1.5 ml-1.5">
									<Image
										src="/vercel.svg"
										alt="Vercel"
										width={15}
										height={15}
										className="inline-block dark:invert"
									/>
									Vercel
								</span>
							</Link>
						</Button>
						<Button size="lg" variant="link" asChild>
							<Link href="https://github.com/adriandlam/obsidian-vercel">
								<Star className="size-4" />
								Star on GitHub
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function BgBorder() {
	return (
		<>
			{/* Vertical borders */}
			<div className="absolute left-[5%] md:left-[20%] top-0 h-full border-l border-dashed" />
			<div className="absolute right-[5%] md:right-[20%] top-0 h-full border-l border-dashed" />

			{/* Horizontal borders */}
			<div className="absolute top-[10%] md:top-[15%] left-0 w-full border-t border-dashed" />
			<div className="absolute bottom-[10%] md:bottom-[15%] left-0 w-full border-t border-dashed" />

			{/* Crosses at intersections */}
			{/* Top-left intersection */}
			<div className="absolute left-[5%] top-[10%] md:left-[20%] md:top-[15%] w-4 h-[2px] bg-primary z-10 rounded-sm" />
			<div className="absolute left-[5%] top-[10%] md:left-[20%] md:top-[15%] w-[2px] h-4 bg-primary z-10 rounded-sm" />

			{/* Top-right intersection */}
			<div className="absolute right-[5%] top-[10%] md:right-[20%] md:top-[15%] w-4 h-[2px] bg-primary z-10 rounded-sm" />
			<div className="absolute right-[5%] top-[10%] md:right-[20%] md:top-[15%] w-[2px] h-4 bg-primary z-10 rounded-sm" />

			{/* Bottom-left intersection */}
			<div className="absolute left-[5%] bottom-[10%] md:left-[20%] md:bottom-[15%] w-4 h-[2px] bg-primary z-10 rounded-sm" />
			<div className="absolute left-[5%] bottom-[10%] md:left-[20%] md:bottom-[15%] w-[2px] h-4 bg-primary z-10 rounded-sm" />

			{/* Bottom-right intersection */}
			<div className="absolute right-[5%] bottom-[10%] md:right-[20%] md:bottom-[15%] w-4 h-[2px] bg-primary z-10 rounded-sm" />
			<div className="absolute right-[5%] bottom-[10%] md:right-[20%] md:bottom-[15%] w-[2px] h-4 bg-primary z-10 rounded-sm" />
		</>
	);
}
