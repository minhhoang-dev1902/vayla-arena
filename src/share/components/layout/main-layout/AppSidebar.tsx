"use client";

import { Menu, PlusCircle, Send, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import { SidebarWalletPicker } from "@/share/components/layout/main-layout/SidebarWalletPicker";
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
	triggerClassName?: string;
}

export function AppSidebar({ triggerClassName }: AppSidebarProps) {
	const { walletAddress, linkedWallets, setActiveWalletAddress } = useAuth();
	const { data: balance } = useGetWalletBalance();

	const displayBalance = balance?.platformBalance
		? parseFloat(balance.platformBalance).toLocaleString()
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

			<SheetContent
				side="right"
				showCloseButton={false}
				className={cn(
					"w-72 border-l border-white/10 bg-black p-0 text-white shadow-xl sm:max-w-xs",
				)}
			>
				<SheetTitle className="sr-only">Navigation Menu</SheetTitle>

				<div className="flex h-full flex-col overflow-y-auto pt-3">
					<div className="flex items-center justify-between border-b border-white/10 px-4 pb-2.5">
						<p className="text-base font-bold tracking-tight text-white">Menu</p>
						<SheetClose
							type="button"
							className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
						>
							<X className="size-5" aria-hidden />
							<span className="sr-only">Close menu</span>
						</SheetClose>
					</div>

					<div className="mx-4 mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
						<p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Balance</p>
						<p className="mt-1 text-xl font-extrabold text-white">
							{displayBalance} <span className="text-sm font-semibold text-primary">VAYLA</span>
						</p>
					</div>

					<SidebarWalletPicker
						wallets={linkedWallets}
						activeAddress={walletAddress}
						onSelectAddress={setActiveWalletAddress}
					/>

					<nav className="mt-1 flex flex-col px-2 pb-6">
						{MENU_ITEMS.map(item => (
							<SheetClose asChild key={item.href}>
								<Link
									href={item.href}
									className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-white/10"
								>
									<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
										<item.icon className="size-[18px] text-primary" />
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-[15px] font-bold text-white">{item.label}</p>
										<p className="mt-0.5 text-xs leading-snug text-white/55">{item.description}</p>
									</div>
								</Link>
							</SheetClose>
						))}
					</nav>
				</div>
			</SheetContent>
		</Sheet>
	);
}
