"use client";

import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoWithText from "@/assets/images/logo-with-text.png";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";

export function DiscoveryHeader() {
	const router = useRouter();
	const { data: balance } = useGetWalletBalance();

	const platformBalance = balance?.platformBalance
		? parseFloat(balance.platformBalance).toLocaleString()
		: "—";

	return (
		<header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/20 bg-[black] px-4 py-3">
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => router.push("/")}
					className="flex items-center  hover:text-white"
				>
					<ChevronLeft className="h-5 w-5" />
				</button>
				<Image alt="Vayla" width={120} src={logoWithText} className="object-contain" />
			</div>
			<span className="text-sm text-white/60">
				Balance: <span className="font-semibold text-white">{platformBalance} Vayla</span>
			</span>
		</header>
	);
}
