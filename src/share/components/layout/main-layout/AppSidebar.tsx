"use client";

import { Menu, PlusCircle, Send, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logoWithText from "@/assets/images/logo-with-text.png";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/share/components/ui/sheet";
import { cn } from "@/share/utils/tailwind-merge";

const MENU_ITEMS = [
	{
		icon: Wallet,
		label: "My Submissions",
		href: "/discovery/my-submissions",
		description: "View your submitted tracks",
	},
	{
		icon: PlusCircle,
		label: "Add VAYLA",
		href: "/wallet/add",
		description: "Deposit VAYLA to your wallet",
	},
	{
		icon: Send,
		label: "Withdraw",
		href: "/wallet/withdraw",
		description: "Withdraw to external wallet",
	},
];

interface AppSidebarProps {
	/** Colour of the hamburger icon */
	triggerClassName?: string;
}

export function AppSidebar({ triggerClassName }: AppSidebarProps) {
	const { data: balance } = useGetWalletBalance();

	const withdrawable = balance?.withdrawableBalance
		? parseFloat(balance.withdrawableBalance).toLocaleString()
		: "—";

	return (
		<Sheet>
			<SheetTrigger
				className={cn(
					"cursor-pointer p-2",
					triggerClassName ?? "text-[#64748b] hover:text-[#0f172a]",
				)}
			>
				<Menu className="size-5" />
			</SheetTrigger>

			<SheetContent side="right" showCloseButton={false} className="w-72 p-0 sm:max-w-xs">
				<SheetTitle className="sr-only">Navigation Menu</SheetTitle>

				{/* Sidebar header */}
				<div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
					<Image alt="Vayla" width={110} src={logoWithText} className="object-contain" />
					<SheetClose className="rounded-full p-1.5 text-[#64748b] hover:bg-slate-100">
						<svg
							role="img"
							fill="none"
							strokeWidth={2}
							className="size-5"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-label="Close menu"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</SheetClose>
				</div>

				{/* Balance chip */}
				<div className="mx-5 mt-4 rounded-2xl border border-[#e2f4f1] bg-primary/5 px-4 py-3">
					<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
						Withdrawable Balance
					</p>
					<p className="mt-0.5 text-xl font-extrabold text-[#0f172a]">
						{withdrawable} <span className="text-sm font-semibold text-primary">VAYLA</span>
					</p>
				</div>

				{/* Nav items */}
				<nav className="mt-4 flex flex-col px-3">
					{MENU_ITEMS.map(item => (
						<SheetClose asChild key={item.href}>
							<Link
								href={item.href}
								className="flex items-center gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-slate-50"
							>
								<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
									<item.icon className="size-4.5 text-primary" />
								</div>
								<div>
									<p className="text-sm font-semibold text-[#0f172a]">{item.label}</p>
									<p className="text-xs text-[#94a3b8]">{item.description}</p>
								</div>
							</Link>
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}
