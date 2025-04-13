import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'], // mdx may not be compatible with obsidian
	typescript: {
		ignoreBuildErrors: true
	}

};

export default nextConfig
