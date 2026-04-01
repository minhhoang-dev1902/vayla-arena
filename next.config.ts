import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "img.youtube.com",
			},
			{
				protocol: "https",
				hostname: "cdn.vayla.io",
			},
		],
	},
};

export default nextConfig;
