"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Button } from "@/share/components/ui/button";

const WALLETS = [
	{
		id: "metamask",
		name: "MetaMask",
		recommended: true,
		icon: "/icons/wallets/metamask.svg",
	},
	{
		id: "okx",
		name: "OKX Wallet",
		recommended: false,
		icon: "/icons/wallets/okx.svg",
	},
	{
		recommended: false,
		id: "walletconnect",
		name: "WalletConnect",
		icon: "/icons/wallets/walletconnect.svg",
	},
	{
		recommended: false,
		id: "coinbase_wallet",
		name: "Coinbase Wallet",
		icon: "/icons/wallets/coinbase.svg",
	},
] as const;

export default function ConnectWalletPage() {
	const router = useRouter();
	const { login } = usePrivy();
	const { ready, isAuthenticated } = useAuth();

	useEffect(() => {
		if (!ready || typeof window === "undefined") return;

		/* Chỉ rời trang khi Privy đã xác nhận session; storage token không đủ một mình (tránh vòng với AuthGuard). */
		if (!isAuthenticated) return;

		const goHomeIfReady = () => {
			if (!localStorage.getItem("access_token")) return false;
			router.replace("/");
			return true;
		};

		if (goHomeIfReady()) return;

		/* PrivyTokenSync ghi access_token bất đồng bộ — poll ngắn. */
		const interval = window.setInterval(() => {
			if (goHomeIfReady()) window.clearInterval(interval);
		}, 400);
		const stop = window.setTimeout(() => window.clearInterval(interval), 60_000);

		return () => {
			window.clearInterval(interval);
			window.clearTimeout(stop);
		};
	}, [ready, isAuthenticated, router]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#020816]">
				<Loader2 className="size-8 animate-spin text-[#1ce8d7]" />
			</div>
		);
	}

	return (
		<div className="relative flex h-dvh flex-col overflow-y-auto bg-[#020816] text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(37,229,221,0.12),transparent_50%),linear-gradient(180deg,#05142a_0%,#010714_100%)]" />

			<div className="relative z-10 mt-auto flex flex-col">
				<div className="flex justify-center pt-4 pb-2">
					<div className="h-1 w-10 rounded-full bg-[#2a4a5a]" />
				</div>

				<div className="px-6 pt-4 pb-2 text-center">
					<h1 className="text-2xl font-bold tracking-tight">Connect Wallet</h1>
					<p className="mt-2 text-sm leading-relaxed text-[#8da2ba]">
						Choose your preferred wallet to access VAYLA Arena
					</p>
				</div>

				<div className="mt-4 flex flex-col gap-3 px-6">
					{WALLETS.map(wallet => (
						<button
							type="button"
							key={wallet.id}
							onClick={() => login()}
							className="group flex items-center gap-4 rounded-2xl border border-[#12d8d1]/20 bg-[#0a1f2e]/60 px-4 py-4 transition-all hover:border-[#12d8d1]/40 hover:bg-[#0a1f2e]/90"
						>
							<div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full">
								<Image
									width={48}
									height={48}
									alt={wallet.name}
									src={wallet.icon}
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

				<button
					type="button"
					onClick={() => login()}
					className="mx-auto mt-6 text-sm font-semibold text-[#1ce8d7] hover:text-[#58f2e5]"
				>
					Don&apos;t have a wallet?
				</button>

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
