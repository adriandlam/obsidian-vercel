/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	experimental: {
		mdxRs: false,
	},
	transpilePackages: ["next-mdx-remote"],
};

export default nextConfig;
