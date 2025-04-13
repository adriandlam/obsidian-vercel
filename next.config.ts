import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* other config options */
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    typescript: {
        ignoreBuildErrors: true
    },
	outputFileTracingIncludes: {
		'/**/*': ['./content/**/*']
	},
};

export default nextConfig;