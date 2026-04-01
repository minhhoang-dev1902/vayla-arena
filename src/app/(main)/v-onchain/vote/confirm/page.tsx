"use client";

import {
	AlertCircle,
	CheckCircle2,
	ExternalLink,
	Gift,
	Music2,
	RefreshCw,
	Shield,
	Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "discovery:voteSelection";

type PageState = "confirm" | "submitting" | "success" | "failed";

type StoredVote = {
	submittedAt: string;
	trackIds: string[];
	tracks: { id: string; title: string; artist: string; chartRank: number }[];
};

function ordinalLabel(n: number): string {
	return `#${n}`;
}

function generateFakeTxHash(): string {
	const chars = "0123456789abcdef";
	let hash = "0x";
	for (let i = 0; i < 40; i++) hash += chars[Math.floor(Math.random() * 16)];
	return hash;
}

function shortenHash(hash: string): string {
	return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

const COST_ITEMS = [
	"Free vote (no payment required)",
	"Network fees covered by the platform",
	"No BNB required",
];

const REWARD_ITEMS = [
	{ icon: Trophy, text: "Counts toward this month's Discovery results" },
	{ icon: Gift, text: "Earn a Discovery Participation NFT after 3 votes" },
	{ icon: Shield, text: "Recorded on-chain as proof of participation" },
];

/* ── Submitting overlay ── */
function SubmittingOverlay() {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center justify-between bg-[#020816] px-6 py-10">
			{/* Top spacer */}
			<div />

			{/* Center content */}
			<div className="flex flex-col items-center">
				<div className="relative flex size-36 items-center justify-center">
					{/* Outer ring pulse */}
					<div className="absolute inset-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-primary/15" />
					{/* Middle ring */}
					<div className="absolute inset-3 rounded-full border border-primary/10 bg-primary/5" />
					{/* Inner circle */}
					<div className="relative flex size-20 items-center justify-center rounded-full border-2 border-primary/25 bg-white shadow-[0_0_40px_rgba(20,184,166,0.15)]">
						<span className="text-3xl font-extrabold text-[#0f172a]">V</span>
					</div>
				</div>

				<h1 className="mt-10 text-center text-[26px] leading-tight font-extrabold text-white">
					Submitting your
					<br />
					vote on-chain…
				</h1>
				<p className="mt-3 text-[13px] text-[#5a7a8f]">This may take a few seconds</p>
			</div>

			{/* Bottom progress */}
			<div className="w-full max-w-sm">
				<div className="flex items-center justify-between">
					<span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#3a5a6f]">
						Blockchain Confirmation
					</span>
					<span className="text-[9px] font-bold uppercase tracking-[0.25em] text-primary">
						Syncing
					</span>
				</div>
				<div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-[#0d2030]">
					<div
						className="h-full rounded-full transition-all duration-[2500ms] ease-out"
						style={{
							width: "65%",
							background: "linear-gradient(90deg, var(--primary), #0d9488)",
							animation: "progress-pulse 2s ease-in-out infinite",
						}}
					/>
				</div>
				<p className="mt-3 flex items-center gap-2 text-[11px] text-[#3a5a6f]">
					<span className="size-1.5 shrink-0 rounded-full bg-primary" />
					Securely processing on Polygon Mainnet
				</p>
			</div>

			<style>{`
				@keyframes progress-pulse {
					0%, 100% { width: 45%; opacity: 0.8; }
					50% { width: 75%; opacity: 1; }
				}
			`}</style>
		</div>
	);
}

/* ── Success overlay ── */
function SuccessOverlay({
	txHash,
	onViewVote,
	onClose,
}: {
	txHash: string;
	onViewVote: () => void;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#e8faf8] via-[#f0fdfa] to-white px-6 pt-16 pb-8">
			{/* Icon */}
			<div className="flex size-16 items-center justify-center rounded-full bg-[#ccfbf1] shadow-md shadow-primary/10">
				<CheckCircle2 className="size-9 text-primary" />
			</div>

			{/* Title */}
			<h1 className="mt-8 text-center text-[26px] leading-tight font-extrabold text-[#0f172a]">
				Vote Submitted
				<br />
				Successfully 🎉
			</h1>
			<p className="mt-3 text-center text-[13px] text-[#64748b]">
				Your prediction has been recorded on-chain.
			</p>

			{/* Transaction hash */}
			<div className="mt-8 flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-4 shadow-sm">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0fdfa]">
					<span className="text-base text-primary">⎔</span>
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
						Transaction Hash
					</p>
					<p className="mt-0.5 text-sm font-bold text-[#0f172a]">{shortenHash(txHash)}</p>
				</div>
				<a
					href={`https://polygonscan.com/tx/${txHash}`}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-xs font-bold text-primary"
				>
					View
					<ExternalLink className="size-3" />
				</a>
			</div>

			{/* Buttons */}
			<div className="mt-auto w-full max-w-sm pt-8">
				<button
					type="button"
					onClick={onViewVote}
					className="flex h-13 w-full items-center justify-center rounded-full text-sm font-extrabold tracking-wider text-white transition active:scale-[0.98]"
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
				>
					View My Vote
				</button>
				<button
					type="button"
					onClick={onClose}
					className="mt-3 flex h-13 w-full items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-sm font-extrabold tracking-wider text-[#64748b] transition hover:bg-slate-50"
				>
					Close
				</button>
			</div>
		</div>
	);
}

/* ── Failed overlay ── */
function FailedOverlay({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#fff1f1] via-[#fff8f8] to-white px-6 pt-16 pb-8">
			{/* V badge */}
			<div className="flex w-full justify-end">
				<div className="flex size-8 items-center justify-center rounded-full bg-[#334155] text-white">
					<span className="text-[10px] font-bold">V</span>
				</div>
			</div>

			{/* Error icon */}
			<div className="mt-4 flex flex-col items-center">
				<div className="relative flex size-24 items-center justify-center">
					<div className="absolute inset-0 animate-[ping_3s_ease-in-out_infinite] rounded-full bg-[#fee2e2]/40" />
					<div className="absolute inset-2 rounded-full bg-[#fee2e2]/50" />
					<div className="relative flex size-16 items-center justify-center rounded-full border-2 border-[#fca5a5] bg-white shadow-md">
						<AlertCircle className="size-8 text-[#ef4444]" />
					</div>
				</div>

				<h1 className="mt-8 text-center text-[26px] leading-tight font-extrabold text-[#0f172a]">
					Transaction <span className="text-[#ef4444]">Failed</span>
				</h1>
				<p className="mt-3 text-center text-sm font-medium text-[#64748b]">No VAYLA was used.</p>
				<p className="mt-5 text-center text-xs leading-relaxed text-[#94a3b8]">
					Check your wallet balance or network
					<br />
					connection
				</p>
				<button
					type="button"
					className="mt-2 text-xs font-bold text-primary underline underline-offset-2"
				>
					Need help? Contact Support
				</button>
			</div>

			{/* Buttons */}
			<div className="mt-auto w-full max-w-sm pt-8">
				<button
					type="button"
					onClick={onRetry}
					className="flex h-13 w-full items-center justify-center gap-2 rounded-full text-sm font-extrabold tracking-wider text-white transition active:scale-[0.98]"
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
				>
					<RefreshCw className="size-4" />
					Try Again
				</button>
				<button
					type="button"
					onClick={onClose}
					className="mt-3 flex h-13 w-full items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-sm font-extrabold tracking-wider text-[#64748b] transition hover:bg-slate-50"
				>
					Close
				</button>
			</div>
		</div>
	);
}

/* ── Main confirm page ── */
export default function DiscoveryVoteConfirmPage() {
	const router = useRouter();
	const [payload, setPayload] = useState<StoredVote | null>(null);
	const [ready, setReady] = useState(false);
	const [pageState, setPageState] = useState<PageState>("confirm");
	const [txHash] = useState(() => generateFakeTxHash());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY);
			if (raw) {
				const data = JSON.parse(raw) as StoredVote;
				if (data?.trackIds?.length) {
					setPayload(data);
					setReady(true);
					return;
				}
			}
		} catch {
			// ignore
		}
		router.replace("/discovery/vote");
	}, [router]);

	const submitVote = useCallback(() => {
		setPageState("submitting");
		timerRef.current = setTimeout(() => {
			const success = Math.random() > 0.2;
			setPageState(success ? "success" : "failed");
		}, 3000);
	}, []);

	const handleRetry = useCallback(() => {
		submitVote();
	}, [submitVote]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	if (!ready || !payload) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
				Loading...
			</div>
		);
	}

	return (
		<>
			{/* Confirm form */}
			<div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#f8fafb]">
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-8">
					<h1 className="text-center text-2xl leading-tight font-extrabold text-[#0f172a]">
						Confirm Your <span className="text-primary">Discovery</span>
						<br />
						Vote
					</h1>
					<p className="mt-2 text-center text-sm italic text-[#94a3b8]">
						Final submission — you can&apos;t edit after submitting.
					</p>

					{/* Your Picks */}
					<div className="mt-8 rounded-2xl border border-[#e8f0f6] bg-white p-5">
						<div className="flex items-center gap-2">
							<Music2 className="size-5 text-primary" />
							<h2 className="text-base font-bold text-[#0f172a]">Your Picks</h2>
						</div>
						<ul className="mt-4 space-y-0">
							{payload.tracks.map((track, i) => (
								<li
									key={track.id}
									className="flex items-start gap-3 border-l-2 border-primary py-3 pl-4"
								>
									<span className="mt-0.5 shrink-0 text-sm font-extrabold text-primary">
										{ordinalLabel(i + 1)}
									</span>
									<div className="min-w-0">
										<p className="text-sm font-bold text-[#0f172a]">{track.title}</p>
										<p className="text-xs text-[#94a3b8]">{track.artist}</p>
									</div>
								</li>
							))}
						</ul>
					</div>

					{/* Cost */}
					<div className="mt-4 rounded-2xl border border-[#e8f0f6] bg-white p-5">
						<div className="flex items-center gap-2">
							<Shield className="size-5 text-primary" />
							<h2 className="text-base font-bold text-[#0f172a]">Cost</h2>
						</div>
						<ul className="mt-4 space-y-3">
							{COST_ITEMS.map(item => (
								<li key={item} className="flex items-start gap-2.5">
									<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
									<span className="text-sm text-[#475569]">{item}</span>
								</li>
							))}
						</ul>
						<p className="mt-4 text-[11px] italic text-[#cbd5e1]">
							✦ This action does not require any payment.
						</p>
					</div>

					{/* Rewards */}
					<div className="mt-4 rounded-2xl border border-[#e8f0f6] bg-white p-5">
						<div className="flex items-center gap-2">
							<Gift className="size-5 text-primary" />
							<h2 className="text-base font-bold text-[#0f172a]">Rewards</h2>
						</div>
						<ul className="mt-4 space-y-3">
							{REWARD_ITEMS.map(item => (
								<li key={item.text} className="flex items-start gap-2.5">
									<item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
									<span className="text-sm text-[#475569]">{item.text}</span>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom buttons */}
				<div className="shrink-0 bg-[#f8fafb] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
					<button
						type="button"
						onClick={submitVote}
						className="flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold uppercase tracking-wider text-white transition active:scale-[0.98]"
						style={{
							background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
						}}
					>
						Confirm
					</button>
					<button
						type="button"
						onClick={() => router.back()}
						className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-sm font-extrabold uppercase tracking-wider text-[#64748b] transition hover:bg-slate-50"
					>
						Cancel
					</button>
				</div>
			</div>

			{/* Overlays based on state */}
			{pageState === "submitting" && <SubmittingOverlay />}

			{pageState === "success" && (
				<SuccessOverlay
					txHash={txHash}
					onViewVote={() => router.push("/discovery")}
					onClose={() => router.push("/discovery")}
				/>
			)}

			{pageState === "failed" && (
				<FailedOverlay onRetry={handleRetry} onClose={() => router.push("/discovery")} />
			)}
		</>
	);
}
