"use client";

import { Check, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/share/components/ui/select";

function formatTokenAmount(raw: string | undefined): string {
	if (raw == null || raw === "") return "—";
	const n = Number.parseFloat(raw);
	if (Number.isNaN(n)) return "—";
	return n.toLocaleString(undefined, { maximumFractionDigits: 8 });
}

type TokenRowProps = {
	symbol: string;
	badge: string;
	badgeClassName?: string;
	subtitle: string;
	amount: string;
	usdLabel: string;
	accentClass: string;
};

function TokenRow({
	symbol,
	badge,
	badgeClassName = "text-[11px]",
	subtitle,
	amount,
	usdLabel,
	accentClass,
}: TokenRowProps) {
	return (
		<div className="flex items-center gap-4 rounded-xl border border-border/80 bg-background/40 px-4 py-3.5">
			<div
				className={`flex size-11 shrink-0 items-center justify-center rounded-full font-bold leading-none text-white ${badgeClassName} ${accentClass}`}
			>
				{badge}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-base font-bold text-card-foreground">{symbol}</p>
				<p className="text-xs text-muted-foreground">{subtitle}</p>
			</div>
			<div className="text-right">
				<p className="font-mono text-sm font-semibold tabular-nums text-card-foreground">
					{amount}
				</p>
				<p className="text-xs text-muted-foreground">{usdLabel}</p>
			</div>
		</div>
	);
}

export default function MePage() {
	const { ready, linkedWallets, walletAddress, setActiveWalletAddress } = useAuth();
	const { data: balance, isPending: balanceLoading } = useGetWalletBalance();
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		if (!walletAddress || typeof navigator === "undefined" || !navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(walletAddress);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// ignore
		}
	}, [walletAddress]);

	const vaylaAmount = formatTokenAmount(balance?.platformBalance);

	if (!ready) {
		return (
			<div className="flex flex-1 items-center justify-center py-24">
				<Loader2 className="size-8 animate-spin text-primary" aria-hidden />
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-lg px-4 py-6">
			<h1 className="text-2xl font-bold tracking-tight text-foreground">My Page</h1>
			<p className="mt-1 text-sm text-muted-foreground">Balances for the selected wallet</p>

			<div className="mt-6 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
				<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
					Wallet
				</p>

				{linkedWallets.length === 0 ? (
					<p className="mt-3 text-sm text-muted-foreground">
						No linked wallets.{" "}
						<Link
							href="/connect-wallet"
							className="font-semibold text-primary underline-offset-4 hover:underline"
						>
							Connect a wallet
						</Link>
					</p>
				) : walletAddress ? (
					<div className="mt-3 flex flex-col gap-2">
						<div className="flex items-stretch gap-2">
							<Select value={walletAddress} onValueChange={setActiveWalletAddress}>
								<SelectTrigger className="min-w-0 flex-1 rounded-xl border-border bg-background/60 font-mono text-xs">
									<SelectValue placeholder="Select wallet address" />
								</SelectTrigger>
								<SelectContent>
									{linkedWallets.map(w => (
										<SelectItem key={w.address} value={w.address}>
											<span className="font-mono text-xs">{w.label}</span>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<button
								type="button"
								onClick={handleCopy}
								className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60 text-muted-foreground transition-colors hover:bg-muted/30 hover:text-primary"
								aria-label={copied ? "Copied" : "Copy address"}
							>
								{copied ? (
									<Check className="size-4 text-primary" aria-hidden />
								) : (
									<Copy className="size-4" aria-hidden />
								)}
							</button>
						</div>
						<p
							className="truncate font-mono text-[11px] text-muted-foreground"
							title={walletAddress}
						>
							{walletAddress}
						</p>
					</div>
				) : null}
			</div>

			<div className="mt-6 space-y-3">
				<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
					Assets
				</p>

				{balanceLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="size-6 animate-spin text-primary" aria-hidden />
					</div>
				) : (
					<div className="flex flex-col gap-3">
						<TokenRow
							symbol="BNB"
							badge="BNB"
							subtitle="BNB Chain · native"
							amount="—"
							usdLabel="USD · —"
							accentClass="bg-[#F0B90B]"
						/>
						<TokenRow
							symbol="VAYLA"
							badge="VAY"
							subtitle="Native token"
							amount={vaylaAmount}
							usdLabel="USD · —"
							accentClass="bg-primary"
						/>
						<TokenRow
							symbol="USDT"
							badge="USDT"
							badgeClassName="text-[8px] tracking-tight"
							subtitle="Stablecoin"
							amount="—"
							usdLabel="USD · —"
							accentClass="bg-[#26a17b]"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
