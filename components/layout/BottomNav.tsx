"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
	{ href: "/", label: "Home", icon: "/icons/home.svg" },
	{ href: "/discovery", label: "Discovery", icon: "/icons/discovery.svg" },
	{ href: "/reward", label: "Reward", icon: "/icons/reward.svg" },
	{ href: "/vote", label: "Vote", icon: "/icons/vote.svg" },
]

function isActivePath(pathname: string, href: string) {
	if (href === "/") return pathname === "/"
	return pathname === href || pathname.startsWith(`${href}/`)
}

export default function BottomNav() {
	const pathname = usePathname()

	return (
		<nav className="fixed bottom-0 left-1/2 z-40 flex h-16 w-full max-w-xl -translate-x-1/2 items-center justify-around border-t border-gray-200 bg-white/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
			{NAV_ITEMS.map((item) => {
				const active = isActivePath(pathname, item.href)

				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex min-w-14 flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
							active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
						)}
					>
						<Image src={item.icon} alt={item.label} width={20} height={20} className="size-5" />
						<span>{item.label}</span>
					</Link>
				)
			})}
		</nav>
	)
}
