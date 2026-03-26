"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function DiscoveryInnerHeader() {
	return (
		<header className="sticky top-0 z-10 flex items-center gap-3 border-b border-[#e8f0f6] bg-white px-4 py-3">
			<Link
				href="/discovery"
				aria-label="Back"
				className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a]"
			>
				<ArrowLeft className="size-5" />
			</Link>
			<p className="text-base font-bold text-[#0f172a]">
				<span className="font-extrabold">VAYLA</span> Discovery
			</p>
		</header>
	);
}
