import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
	/* config options here */
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'], // mdx may not be compatible with obsidian
	experimental: {
		mdxRs: false
	},
	transpilePackages: ["next-mdx-remote"]
};

const withMDX = createMDX({
	extension: /\.(md|mdx)$/
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
