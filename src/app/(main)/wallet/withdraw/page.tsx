"use client";

import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import { useWithdraw } from "@/features/wallet/hooks/use-withdraw";
import type { NetworkType } from "@/features/wallet/types/wallet.types";
import { AppSidebar } from "@/share/components/layout/main-layout/AppSidebar";

const NETWORKS: { id: NetworkType; label: string; sub: string }[] = [
	{ id: "ethereum", label: "Ethereum", sub: "ERC-20" },
	{ id: "bsc", label: "BSC", sub: "BEP-20" },
	{ id: "solana", label: "Solana", sub: "SOL" },
];

const FEE_RATE = 0.008;
const MIN_FEE = 0.5;

function calcFee(amount: number): number {
	return Math.max(MIN_FEE, amount * FEE_RATE);
}

type PageState = "idle" | "submitting" | "success" | "error";

export default function WithdrawPage() {
	const router = useRouter();
	const [amount, setAmount] = useState("");
	const [address, setAddress] = useState("");
	const [network, setNetwork] = useState<NetworkType>("ethereum");
	const [pageState, setPageState] = useState<PageState>("idle");
	const [errorMsg, setErrorMsg] = useState("");

	const { data: balance } = useGetWalletBalance();
	const { withdraw } = useWithdraw();

	const maxAmount = balance?.withdrawableBalance ? parseFloat(balance.withdrawableBalance) : 0;

	const displayBalance = maxAmount > 0 ? maxAmount.toLocaleString() : "—";
	const numAmount = parseFloat(amount) || 0;
	const fee = numAmount > 0 ? calcFee(numAmount) : 0;
	const estimatedReceive = numAmount > 0 ? Math.max(0, numAmount - fee) : 0;

	const isValid = numAmount > 0 && numAmount <= maxAmount && address.trim().length > 5;

	const handleSetMax = () => {
		setAmount(maxAmount.toString());
	};

	const handleSubmit = useCallback(async () => {
		if (!isValid) return;
		setPageState("submitting");
		setErrorMsg("");
		try {
			await withdraw({
				amount: numAmount.toString(),
				network,
				toAddress: address.trim(),
			});
			setPageState("success");
		} catch (err: unknown) {
			const msg =
				err &&
				typeof err === "object" &&
				"message" in err &&
				typeof (err as { message: unknown }).message === "string"
					? (err as { message: string }).message
					: "Withdrawal failed. Please try again.";
			setErrorMsg(msg);
			setPageState("error");
		}
	}, [isValid, withdraw, numAmount, network, address]);

	if (pageState === "success") {
		return (
			<div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center">
				<div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
					<span className="text-3xl">✓</span>
				</div>
				<h2 className="text-xl font-bold text-[#0f172a]">Withdrawal Submitted</h2>
				<p className="text-sm leading-relaxed text-[#64748b]">
					Your withdrawal request has been submitted. It may take a few minutes to process on the
					blockchain.
				</p>
				<button
					type="button"
					onClick={() => router.push("/")}
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
					className="mt-4 h-12 w-full rounded-full text-sm font-bold text-white"
				>
					Back to Home
				</button>
				<button
					type="button"
					onClick={() => router.push("/discovery/my-submissions")}
					className="text-sm font-semibold text-primary underline underline-offset-2"
				>
					View My Submissions
				</button>
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-white pb-10">
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
					<h1 className="text-base font-bold text-[#0f172a]">Withdrawal</h1>
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
							{displayBalance} <span className="text-base font-semibold text-[#64748b]">VAYLA</span>
						</p>
						<p className="mt-1 text-[10px] text-[#94a3b8]">
							Only Withdrawable Balance can be withdrawn. Platform Balance is not eligible for
							withdrawal.
						</p>
					</div>
					<span className="shrink-0 self-start rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
						Available
					</span>
				</div>

				{/* Amount */}
				<div className="space-y-1.5">
					<label
						htmlFor="amount"
						className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]"
					>
						Amount
					</label>
					<div className="flex items-center rounded-xl border border-[#e2e8f0] px-4 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
						<input
							id="amount"
							type="number"
							min="0"
							placeholder="0"
							value={amount}
							onChange={e => setAmount(e.target.value)}
							className="flex-1 bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[#cbd5e1]"
						/>
						<button
							type="button"
							onClick={handleSetMax}
							className="shrink-0 text-xs font-bold text-primary"
						>
							Max
						</button>
					</div>
					{numAmount > maxAmount && maxAmount > 0 && (
						<p className="text-xs text-red-500">Amount exceeds withdrawable balance</p>
					)}
				</div>

				{/* Wallet address */}
				<div className="space-y-1.5">
					<label
						htmlFor="wallet-address"
						className="block text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]"
					>
						Wallet Address
					</label>
					<input
						id="wallet-address"
						type="text"
						value={address}
						onChange={e => setAddress(e.target.value)}
						placeholder="0xABC123... Enter your wallet address"
						className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
					/>
					<p className="flex items-center gap-1 text-xs text-[#94a3b8]">
						<AlertCircle className="size-3" />
						Ensure the address supports the selected network
					</p>
				</div>

				{/* Network */}
				<div className="space-y-2">
					<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">Network</p>
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

				{/* Fee breakdown */}
				{numAmount > 0 && (
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-2xl border border-[#f1f5f9] bg-[#fafafa] px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
								Estimated Fee
							</p>
							<p className="mt-1 text-base font-extrabold text-[#0f172a]">
								{fee.toFixed(2)} <span className="text-xs font-semibold text-[#64748b]">VAYLA</span>
							</p>
						</div>
						<div className="rounded-2xl border border-[#f1f5f9] bg-[#fafafa] px-4 py-3">
							<p className="text-[10px] font-bold uppercase tracking-widest text-[#94a3b8]">
								Estimated Receive
							</p>
							<p className="mt-1 text-base font-extrabold text-[#0f172a]">
								{estimatedReceive.toFixed(2)}{" "}
								<span className="text-xs font-semibold text-[#64748b]">VAYLA</span>
							</p>
						</div>
					</div>
				)}

				{/* Warning */}
				<div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 px-3.5 py-3">
					<span className="mt-0.5 size-2 shrink-0 rounded-full bg-emerald-500" />
					<p className="text-xs leading-relaxed text-emerald-700">
						Blockchain withdrawals may take time and incorrect wallet addresses cannot be reversed.
					</p>
				</div>

				{/* Error */}
				{pageState === "error" && errorMsg && (
					<div className="flex items-start gap-2.5 rounded-xl bg-red-50 px-3.5 py-3">
						<AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500" />
						<p className="text-xs leading-relaxed text-red-600">{errorMsg}</p>
					</div>
				)}

				{/* Submit */}
				<button
					type="button"
					disabled={!isValid || pageState === "submitting"}
					onClick={handleSubmit}
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
					className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-extrabold text-white transition active:scale-[0.98] disabled:opacity-50"
				>
					{pageState === "submitting" ? (
						<>
							<Loader2 className="size-4 animate-spin" />
							Processing…
						</>
					) : (
						"Confirm Withdrawal"
					)}
				</button>

				<button
					type="button"
					onClick={() => router.push("/discovery/my-submissions")}
					className="flex h-11 w-full items-center justify-center rounded-full border border-[#e2e8f0] text-sm font-semibold text-[#0f172a]"
				>
					View My Submissions
				</button>
			</div>
		</div>
	);
}
