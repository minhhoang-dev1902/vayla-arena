"use client";

import { AlertTriangle, Check, ChevronLeft, Clock, Copy, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetDepositAddress } from "@/features/wallet/hooks/use-get-deposit-address";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import type { NetworkType } from "@/features/wallet/types/wallet.types";
import { AppSidebar } from "@/share/components/layout/main-layout/AppSidebar";

const NETWORKS: { id: NetworkType; label: string; sub: string }[] = [
	{ id: "ethereum", label: "Ethereum", sub: "ERC-20" },
	{ id: "bsc", label: "BSC", sub: "BEP-20" },
	{ id: "solana", label: "Solana", sub: "SOL" },
];

const WARNINGS = [
	{
		icon: AlertTriangle,
		color: "text-amber-500",
		text: "Only supported network deposits will be credited. Ensure you select the correct chain before sending funds.",
	},
	{
		icon: XCircle,
		color: "text-red-400",
		text: "Wrong network transfers may be lost and are not recoverable by VAYLA. Double-check the network and address.",
	},
	{
		icon: Clock,
		color: "text-blue-400",
		text: "Deposits may take time to confirm depending on network congestion. Wait for network confirmations before expecting platform credit.",
	},
];

function truncateAddress(addr: string): string {
	if (addr.length <= 16) return addr;
	return `${addr.slice(0, 12)}...`;
}

export default function AddVaylaPage() {
	const router = useRouter();
	const [network, setNetwork] = useState<NetworkType>("ethereum");
	const [copied, setCopied] = useState(0);

	const { data: balance } = useGetWalletBalance();
	const { data: depositData, isLoading: addressLoading } = useGetDepositAddress(network);

	const withdrawable = balance?.withdrawableBalance
		? parseFloat(balance.withdrawableBalance).toLocaleString()
		: "—";

	const address = depositData?.address ?? "";

	function handleCopy() {
		if (!address) return;
		navigator.clipboard.writeText(address).catch(_err => {
			/* ignore clipboard errors */
		});
		setCopied(prev => prev + 1);
	}

	return (
		<div className="min-h-dvh bg-white pb-8">
			{/* Header */}
			<header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1f5f9] bg-white px-4 py-3">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex size-8 items-center justify-center rounded-full text-[#64748b] hover:text-[#0f172a]"
					>
						<ChevronLeft className="size-5" />
					</button>
					<h1 className="text-base font-bold text-[#0f172a]">Add VAYLA</h1>
				</div>
				<AppSidebar />
			</header>

			<div className="space-y-5 px-4 pt-4">
				{/* Balance card */}
				<div className="flex items-center justify-between rounded-2xl border border-[#e2e8f0] bg-white px-4 py-3 shadow-sm">
					<div>
						<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
							Withdrawable Balance
						</p>
						<p className="mt-1 text-2xl font-extrabold text-[#0f172a]">
							{withdrawable} <span className="text-base font-semibold text-[#64748b]">VAYLA</span>
						</p>
					</div>
					<span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
						Available
					</span>
				</div>

				{/* QR / Deposit visual */}
				<div className="flex flex-col items-center gap-4 rounded-2xl bg-primary/5 px-4 py-6">
					<div className="flex size-36 items-center justify-center rounded-2xl bg-primary">
						<div className="flex flex-col items-center gap-2">
							<div className="grid grid-cols-5 gap-0.5">
								{(
									[
										"a0",
										"a1",
										"a2",
										"a3",
										"a4",
										"b0",
										"b1",
										"b2",
										"b3",
										"b4",
										"c0",
										"c1",
										"c2",
										"c3",
										"c4",
										"d0",
										"d1",
										"d2",
										"d3",
										"d4",
										"e0",
										"e1",
										"e2",
										"e3",
										"e4",
									] as const
								).map((id, i) => {
									const pattern = [0, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 24];
									return (
										<div
											key={id}
											className={`size-4 rounded-[1px] ${pattern.includes(i) ? "bg-white" : "bg-primary"}`}
										/>
									);
								})}
							</div>
							<p className="text-[8px] font-bold tracking-[0.3em] text-white">DEPOSIT</p>
						</div>
					</div>

					<div className="w-full space-y-3 text-center">
						<div className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5">
							<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
								<span className="text-[10px] font-extrabold text-primary">V</span>
							</div>
							<p className="flex-1 truncate text-left text-sm font-mono font-semibold text-[#0f172a]">
								{addressLoading ? "Loading..." : truncateAddress(address)}
							</p>
						</div>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={handleCopy}
								disabled={!address}
								style={{
									background:
										"linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
								}}
								className="flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold text-white disabled:opacity-50"
							>
								{copied > 0 ? <Check className="size-4" /> : <Copy className="size-4" />}
								Copy Address
							</button>
							<span className="shrink-0 text-xs text-[#94a3b8]">Copied {copied} times</span>
						</div>
					</div>

					<p className="text-center text-xs text-[#64748b]">
						Deposited VAYLA will be added to your Platform Balance
					</p>
				</div>

				{/* Network selection */}
				<div className="space-y-2">
					<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
						Select Network
					</p>
					<div className="flex gap-2">
						{NETWORKS.map(n => (
							<button
								key={n.id}
								type="button"
								onClick={() => setNetwork(n.id)}
								className={`flex flex-1 flex-col items-center rounded-xl border py-2.5 text-center transition-colors ${
									network === n.id
										? "border-primary bg-white text-primary"
										: "border-[#e2e8f0] bg-white text-[#64748b]"
								}`}
							>
								<span className="text-xs font-bold">{n.label}</span>
								<span className="text-[10px] text-[#94a3b8]">{n.sub}</span>
							</button>
						))}
					</div>
				</div>

				{/* Important warnings */}
				<div className="rounded-2xl border border-[#f1f5f9] bg-[#fafafa] p-4">
					<p className="mb-3 text-sm font-bold text-[#0f172a]">Important</p>
					<div className="space-y-3">
						{WARNINGS.map(w => (
							<div key={w.text.slice(0, 20)} className="flex items-start gap-2.5">
								<w.icon className={`mt-0.5 size-4 shrink-0 ${w.color}`} />
								<p className="text-xs leading-relaxed text-[#64748b]">{w.text}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom actions */}
			<div className="mt-6 flex gap-3 px-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="flex h-12 flex-1 items-center justify-center rounded-full border border-[#e2e8f0] text-sm font-bold text-[#0f172a]"
				>
					I've Sent VAYLA
				</button>
				<button
					type="button"
					onClick={handleCopy}
					disabled={!address}
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
					className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold text-white disabled:opacity-50"
				>
					<Copy className="size-4" />
					Copy Address
				</button>
			</div>
		</div>
	);
}
