"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";
import type { LinkedWalletOption } from "@/features/auth/hooks/use-auth";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/share/components/ui/select";
import { cn } from "@/share/utils/tailwind-merge";

function truncateAddress(address: string, head = 6, tail = 4): string {
	if (address.length <= head + tail + 1) return address;
	return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

type SidebarWalletPickerProps = {
	wallets: LinkedWalletOption[];
	activeAddress: string | null;
	onSelectAddress: (address: string) => void;
	className?: string;
};

export function SidebarWalletPicker({
	wallets,
	activeAddress,
	onSelectAddress,
	className,
}: SidebarWalletPickerProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		if (!activeAddress || typeof navigator === "undefined" || !navigator.clipboard) return;
		try {
			await navigator.clipboard.writeText(activeAddress);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// ignore
		}
	}, [activeAddress]);

	if (wallets.length === 0 || !activeAddress) return null;

	return (
		<div className={cn("mx-4 mt-3 flex flex-col gap-2", className)}>
			<p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Wallet</p>
			<div className="flex items-stretch gap-2">
				<Select value={activeAddress} onValueChange={onSelectAddress}>
					<SelectTrigger
						size="sm"
						className="min-w-0 flex-1 rounded-xl border-white/15 bg-white/5 py-2.5 text-xs text-white hover:bg-white/10 focus-visible:border-primary focus-visible:ring-primary/40 [&_svg]:text-white/60"
					>
						<SelectValue placeholder="Select wallet" />
					</SelectTrigger>
					<SelectContent className="border-white/15 bg-[#0f172a] text-white">
						{wallets.map(w => (
							<SelectItem
								key={w.address}
								value={w.address}
								className="focus:bg-white/10 focus:text-white"
							>
								<span className="font-mono text-xs">{w.label}</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<button
					type="button"
					onClick={handleCopy}
					className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-primary"
					aria-label={copied ? "Copied" : "Copy wallet address"}
				>
					{copied ? (
						<Check className="size-4 text-primary" aria-hidden />
					) : (
						<Copy className="size-4" aria-hidden />
					)}
				</button>
			</div>
			<p className="truncate font-mono text-[11px] text-white/45" title={activeAddress}>
				{truncateAddress(activeAddress)}
			</p>
		</div>
	);
}
