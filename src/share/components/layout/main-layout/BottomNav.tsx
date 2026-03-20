"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_HEIGHT_PX, LAYOUT_MAX_WIDTH_PX } from "@/share/constants/layout";
import { cn } from "@/share/utils/tailwind-merge";

const NAV_ITEMS = [
	{ href: "/", label: "Home", icon: "/icons/home.svg" },
	{ href: "/discovery", label: "Discovery", icon: "/icons/discovery.svg" },
	{ href: "/reward", label: "Reward", icon: "/icons/reward.svg" },
	{ href: "/vote", label: "Vote", icon: "/icons/vote.svg" },
];

function isActivePath(pathname: string, href: string) {
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
}

export default function BottomNav() {
	const pathname = usePathname();

	return (
		<nav
			style={{ height: BOTTOM_NAV_HEIGHT_PX, maxWidth: LAYOUT_MAX_WIDTH_PX }}
			className="fixed bottom-0 left-1/2 z-40 flex w-full -translate-x-1/2 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur supports-backdrop-filter:bg-card/80"
		>
			{NAV_ITEMS.map(item => {
				const active = isActivePath(pathname, item.href);

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex min-w-14 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
							active ? "text-primary" : "text-muted-foreground hover:text-foreground",
						)}
					>
						<Image width={20} height={20} src={item.icon} alt={item.label} className="size-5" />
						<span>{item.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}
