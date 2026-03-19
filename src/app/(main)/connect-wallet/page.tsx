"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/share/components/ui/button";

const WALLETS = [
	{
		id: "metamask",
		name: "MetaMask",
		icon: "/icons/wallets/metamask.svg",
		recommended: true,
	},
	{
		id: "okx",
		name: "OKX Wallet",
		icon: "/icons/wallets/okx.svg",
		recommended: false,
	},
	{
		id: "walletconnect",
		name: "WalletConnect",
		icon: "/icons/wallets/walletconnect.svg",
		recommended: false,
	},
	{
		id: "coinbase_wallet",
		name: "Coinbase Wallet",
		icon: "/icons/wallets/coinbase.svg",
		recommended: false,
	},
] as const;

export default function ConnectWalletPage() {
	const router = useRouter();
	const { ready, authenticated, login } = usePrivy();

	useEffect(() => {
		if (ready && authenticated) {
			router.replace("/");
		}
	}, [ready, authenticated, router]);

	useEffect(() => {
		if (typeof window !== "undefined" && localStorage.getItem("access_token")) {
			router.replace("/");
		}
	}, [router]);

	const handleConnect = () => {
		login();
	};

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#020816]">
				<Loader2 className="size-8 animate-spin text-[#1ce8d7]" />
			</div>
		);
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-[#020816] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(37,229,221,0.12),transparent_50%),linear-gradient(180deg,#05142a_0%,#010714_100%)]" />

			<div className="relative z-10 mt-auto flex flex-col">
				{/* Handle bar */}
				<div className="flex justify-center pt-4 pb-2">
					<div className="h-1 w-10 rounded-full bg-[#2a4a5a]" />
				</div>

				{/* Header */}
				<div className="px-6 pt-4 pb-2 text-center">
					<h1 className="text-2xl font-bold tracking-tight">Connect Wallet</h1>
					<p className="mt-2 text-sm leading-relaxed text-[#8da2ba]">
						Choose your preferred wallet to access VAYLA Arena
					</p>
				</div>

				{/* Wallet list */}
				<div className="mt-4 flex flex-col gap-3 px-6">
					{WALLETS.map(wallet => (
						<button
							key={wallet.id}
							type="button"
							onClick={handleConnect}
							className="group flex items-center gap-4 rounded-2xl border border-[#12d8d1]/20 bg-[#0a1f2e]/60 px-4 py-4 transition-all hover:border-[#12d8d1]/40 hover:bg-[#0a1f2e]/90"
						>
							<div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
								<Image
									src={wallet.icon}
									alt={wallet.name}
									width={48}
									height={48}
									className="size-12"
								/>
							</div>

							<div className="flex flex-col items-start gap-0.5">
								<span className="text-base font-semibold text-white">{wallet.name}</span>
								{wallet.recommended && (
									<span className="text-xs font-bold uppercase tracking-wider text-[#f5841f]">
										Recommended
									</span>
								)}
							</div>

							<ChevronRight className="ml-auto size-5 text-[#4a6a80] transition-colors group-hover:text-[#8da2ba]" />
						</button>
					))}
				</div>

				{/* Don't have a wallet */}
				<button
					type="button"
					onClick={handleConnect}
					className="mx-auto mt-6 text-sm font-semibold text-[#1ce8d7] hover:text-[#58f2e5]"
				>
					Don&apos;t have a wallet?
				</button>

				{/* Close button */}
				<div className="px-6 pt-4 pb-8">
					<Button
						type="button"
						onClick={() => router.back()}
						className="w-full rounded-xl border border-[#1a3a4a] bg-[#0a1f2e]/80 py-6 text-base font-semibold text-white hover:bg-[#0a1f2e]"
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);
}
