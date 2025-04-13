import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ModeToggle } from "@/components/ModeToggle";
import SearchDialog from "@/components/SearchDialog";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Obsidian Vercel",
	description:
		"Publish your Obsidian notes with Vercel, securely and effortlessly.",
	robots: "noindex",
	openGraph: {
		title: "Obsidian Vercel",
		description:
			"Publish your Obsidian notes with Vercel, securely and effortlessly.",
		type: "website",
		images: [
			{
				url: "/preview.png",
				width: 1200,
				height: 630,
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressContentEditableWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<div className="fixed right-2 top-2">
						<SearchDialog />
					</div>
					<div className="fixed right-2 bottom-2">
						<ModeToggle />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
