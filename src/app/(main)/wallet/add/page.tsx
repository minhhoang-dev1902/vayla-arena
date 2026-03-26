"use client";

import { AlertTriangle, Check, ChevronLeft, Clock, Copy, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import walletIcon from "@/assets/icons/wallet-icon.svg";
import vaylaLogo from "@/assets/images/vayla-logo.png";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import type { NetworkType } from "@/features/wallet/types/wallet.types";
import { AppSidebar } from "@/share/components/layout/main-layout/AppSidebar";

const NETWORKS: { sub: string; label: string; id: NetworkType }[] = [
	{ sub: "ERC-20", id: "ethereum", label: "Ethereum" },
	{ id: "bsc", label: "BSC", sub: "BEP-20" },
	{ sub: "SOL", id: "solana", label: "Solana" },
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

const QR_KEYS = [
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
] as const;
const QR_PATTERN = new Set([0, 2, 4, 5, 7, 9, 10, 12, 14, 15, 17, 19, 20, 22, 24]);

function truncateAddress(addr: string): string {
	if (addr.length <= 18) return addr;
	return `${addr.slice(0, 14)}...`;
}

export default function AddVaylaPage() {
	const router = useRouter();
	const [network, setNetwork] = useState<NetworkType>("ethereum");
	const [copied, setCopied] = useState(0);

	const { walletAddress } = useAuth();
	const { data: balance } = useGetWalletBalance();

	const withdrawable = balance?.withdrawableBalance
		? parseFloat(balance.withdrawableBalance).toLocaleString()
		: "—";

	const address = walletAddress ?? "";

	function handleCopy() {
		if (!address) return;
		navigator.clipboard.writeText(address).catch(() => {
			/* ignore clipboard errors */
		});
		setCopied(prev => prev + 1);
	}

	return (
		<div className="min-h-dvh bg-[#f8fafc] pb-8">
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

			<div className="space-y-4 px-4 pt-4">
				{/* Balance card */}
				<div className="rounded-2xl border border-[#e2e8f0] bg-white px-4 py-4 shadow-sm">
					<div className="flex items-center justify-between">
						<p className="text-[11px] font-semibold text-[#94a3b8]">Withdrawable Balance</p>
						<span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
							Available
						</span>
					</div>
					<div className="mt-2 flex items-center justify-between  gap-3">
						<Image
							width={40}
							alt="VAYLA"
							height={40}
							src={vaylaLogo}
							className="size-10 object-contain"
						/>
						<p className="text-3xl font-extrabold text-[#0f172a]">
							{withdrawable} <span className="text-base font-semibold text-[#64748b]">VAYLA</span>
						</p>
					</div>
				</div>

				{/* Deposit card */}
				<div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
					{/* QR visual area */}
					<div className="flex items-center justify-center bg-primary px-4 py-8">
						<div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-lg">
							<div className="grid grid-cols-5 gap-1">
								{QR_KEYS.map((id, i) => (
									<div
										key={id}
										className={`size-5 rounded-[2px] ${QR_PATTERN.has(i) ? "bg-[#0f172a]" : "bg-white"}`}
									/>
								))}
							</div>
							<p className="mt-1 text-[9px] font-extrabold tracking-[0.35em] text-[#0f172a]">
								DEPOSIT
							</p>
						</div>
					</div>

					{/* Deposit info */}
					<div className="space-y-4 px-4 py-5">
						{/* Title row */}
						<div className="flex items-center gap-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
								<Image
									width={10}
									alt="VAYLA"
									height={10}
									src={walletIcon}
									className="size-5 object-contain"
								/>
							</div>
							<div>
								<p className="text-[15px] font-bold text-[#0f172a]">Deposit Wallet</p>
								<p className="text-xs text-[#64748b]">Use this address to deposit VAYLA</p>
							</div>
						</div>

						{/* Address */}
						<p className="font-mono text-sm font-semibold text-[#0f172a]">
							{address ? truncateAddress(address) : "Loading..."}
						</p>

						{/* Copy row */}
						<div className="flex items-center gap-3">
							<button
								type="button"
								disabled={!address}
								onClick={handleCopy}
								className="flex h-10 items-center gap-2 rounded-md px-5 text-sm font-bold text-white disabled:opacity-50"
								style={{
									background:
										"linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
								}}
							>
								{copied > 0 ? <Check className="size-4" /> : <Copy className="size-4" />}
								Copy Address
							</button>
							{/* <span className="text-xs text-[#94a3b8]">Copied {copied} times</span> */}
						</div>

						<p className="text-xs text-[#94a3b8]">
							Deposited VAYLA will be added to your Platform Balance
						</p>
					</div>
				</div>

				{/* Network selection */}
				<div className="space-y-2">
					<p className="text-[11px] font-bold uppercase tracking-widest text-[#94a3b8]">
						Select Network
					</p>
					<div className="flex gap-2">
						{NETWORKS.map(n => (
							<button
								key={n.id}
								type="button"
								onClick={() => setNetwork(n.id)}
								className={`flex flex-1 flex-col items-center rounded-xl border py-2.5 transition-colors ${
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
				<div className="rounded-2xl border border-[#f1f5f9] bg-white p-4">
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
			<div className="mt-5 flex gap-3 px-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="flex h-12 flex-1 items-center justify-center rounded-md border border-[#e2e8f0] text-sm font-bold text-[#0f172a]"
				>
					I&apos;ve Sent VAYLA
				</button>
				<button
					type="button"
					disabled={!address}
					onClick={handleCopy}
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
					className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md text-sm font-bold text-white disabled:opacity-50"
				>
					<Copy className="size-4" />
					Copy Address
				</button>
			</div>
		</div>
	);
}
