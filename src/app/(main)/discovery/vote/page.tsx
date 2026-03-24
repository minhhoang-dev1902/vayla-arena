"use client";

import { Minus, Music2, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type DiscoveryTrack, MOCK_DISCOVERY_TRACKS, youtubeThumb } from "../_lib/tracks";

const COST_PER_VOTE = 10;
const MAX_VOTES = 10;
const PLATFORM_BALANCE = 50;
const WITHDRAWABLE_BALANCE = 0;
const STORAGE_KEY = "discovery:voteSelection";
const PRE_SELECT_KEY = "discovery:preSelectedTrack";

export default function DiscoveryVotePage() {
	const router = useRouter();
	const [track, setTrack] = useState<DiscoveryTrack | null>(null);
	const [voteCount, setVoteCount] = useState(1);

	useEffect(() => {
		let selected: DiscoveryTrack | null = null;
		try {
			const raw = sessionStorage.getItem(PRE_SELECT_KEY);
			if (raw) {
				sessionStorage.removeItem(PRE_SELECT_KEY);
				const pre = JSON.parse(raw) as { id?: string; rank?: number; title?: string };
				selected =
					MOCK_DISCOVERY_TRACKS.find(
						t => t.id === pre.id || t.title === pre.title || t.rank === pre.rank,
					) ?? null;
			}
		} catch {
			// ignore
		}
		setTrack(selected ?? MOCK_DISCOVERY_TRACKS[0]);
	}, []);

	if (!track) return null;

	const totalCost = voteCount * COST_PER_VOTE;
	const canConfirm = totalCost <= PLATFORM_BALANCE;
	const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);

	const handleConfirm = () => {
		if (!canConfirm) return;
		try {
			sessionStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					track,
					voteCount,
					totalCost,
					trackId: track.id,
					submittedAt: new Date().toISOString(),
				}),
			);
		} catch {
			// ignore
		}
		router.push("/discovery/vote/confirm");
	};

	return (
		<div className="flex min-h-dvh flex-col bg-[#f5f7fa] px-4 py-5">
			<div className="rounded-3xl bg-white shadow-sm overflow-hidde px-3">
				{/* Header */}
				<div className="flex items-center justify-between pt-5 pb-4">
					<h1 className="text-[17px] font-bold text-[#0f172a]">Confirm Vote</h1>
					<Link
						href="/discovery"
						aria-label="Close"
						className="flex size-7 items-center justify-center rounded-full text-[#94a3b8] hover:text-[#64748b]"
					>
						<X className="size-5" />
					</Link>
				</div>

				{/* Track card */}
				<div className="overflow-hidden rounded-2xl border border-[#e8f0f6]">
					<div className="flex items-center gap-3 px-3 py-3  bg-foreground">
						<div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
							{thumb ? (
								<Image fill sizes="" src={thumb} alt={track.title} className="object-cover" />
							) : (
								<div className="flex size-full items-center justify-center">
									<Music2 className="size-6 text-slate-300" />
								</div>
							)}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-[15px] font-bold text-[#0f172a]">{track.title}</p>
							<p className="text-sm font-medium text-primary">{track.artist}</p>

							{/* Total votes band */}
							<div className="flex items-center justify-between bg-primary/10 px-4 py-2 rounded-lg mt-2">
								<span className="text-[11px] font-bold text-[#0f172a]">Total Votes</span>
								<span className="text-[13px] font-extrabold text-primary">
									{track.votes.toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Cost per vote */}
				<div className="flex items-center justify-between  border-[#f1f5f9] px-5 my-2">
					<span className="text-sm text-[#64748b]">Cost per vote</span>
					<span className="text-sm font-bold text-[#0f172a]">{COST_PER_VOTE} VAYLA</span>
				</div>

				{/* Number of votes */}
				<div className="rounded-xl border border-[#eef2f7] bg-white px-3 py-2">
					<div className="flex items-center justify-between">
						<span className="text-[14px] font-bold text-[#0f4b46]">Number of votes</span>
						<span className="rounded-lg bg-[#fff5e6] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[#d28a00]">
							MAX {MAX_VOTES}
						</span>
					</div>
					<div className="mt-2 flex items-center gap-2">
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => setVoteCount(v => Math.max(1, v - 1))}
								className="flex size-8 items-center justify-center rounded-full bg-[#edf1f4] transition active:scale-95"
							>
								<Minus className="size-4 text-[#0f4b46]" />
							</button>
							<div className="flex   items-center justify-center rounded-full bg-[#edf1f4] px-6 p-2">
								<span className="text-sm font-bold leading-none text-[#0f4b46]">{voteCount}</span>
							</div>
							<button
								type="button"
								onClick={() => setVoteCount(v => Math.min(MAX_VOTES, v + 1))}
								className="flex size-8 items-center justify-center rounded-full bg-[#edf1f4] transition active:scale-95"
							>
								<Plus className="size-4 text-[#0f4b46]" />
							</button>
						</div>
						<div className="flex-1 text-right">
							<p className="text-[10px] font-bold uppercase leading-tight tracking-wider text-[#6f9f9c]">
								Votes Selected
							</p>
							<p className="text-xl font-extrabold leading-none text-[#0f4b46] mt-2">{voteCount}</p>
						</div>
					</div>
				</div>

				{/* Total cost */}
				<div className="flex items-center justify-between border-t border-[#f1f5f9] px-5 py-3.5">
					<span className="text-sm font-bold text-[#0f172a]">Total cost</span>
					<span className="text-[17px] font-extrabold text-primary">{totalCost} VAYLA</span>
				</div>

				{/* Balances */}
				<div className="border-t border-[#f1f5f9] px-4 py-3 space-y-2">
					<div className="flex items-center justify-between rounded-xl bg-[#f8fafb] px-4 py-3">
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
								Platform Balance
							</p>
							<p className="mt-0.5 text-[15px] font-extrabold text-[#0f172a]">
								{PLATFORM_BALANCE} VAYLA
							</p>
						</div>
						<p className="text-[10px] text-[#94a3b8]">Available for voting</p>
					</div>
					<div className="flex items-center justify-between rounded-xl bg-[#f8fafb] px-4 py-3">
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
								Withdrawable Balance
							</p>
							<p className="mt-0.5 text-[15px] font-extrabold text-[#0f172a]">
								{WITHDRAWABLE_BALANCE} VAYLA
							</p>
						</div>
						<p className="max-w-[110px] text-right text-[10px] text-[#94a3b8]">
							Voting uses Platform Balance only
						</p>
					</div>
				</div>

				{/* Max votes label */}
				<p className="py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.25em] text-[#94a3b8]">
					Max {MAX_VOTES} Votes Per Track
				</p>

				{/* Buttons */}
				<div className="border-t border-[#f1f5f9] px-4 pb-5 pt-4 flex flex-col gap-3">
					<button
						type="button"
						disabled={!canConfirm}
						onClick={handleConfirm}
						style={{
							background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
						}}
						className="flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold text-white transition active:scale-[0.98] disabled:opacity-50"
					>
						Confirm Vote
					</button>
					<Link
						href="/discovery"
						className="flex h-12 w-full items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-sm font-extrabold text-[#64748b] transition hover:bg-slate-50"
					>
						Cancel
					</Link>
					<p className="text-center text-[10px] leading-relaxed text-[#94a3b8]">
						By confirming, you agree to deduct {COST_PER_VOTE} VAYLA tokens from your balance per
						selected vote.
					</p>
				</div>
			</div>
		</div>
	);
}
