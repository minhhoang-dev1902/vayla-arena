"use client";

import { ArrowLeft, Play, Vote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getDiscoveryHotApi } from "@/apis/discovery.api";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import {
	type DiscoveryTrack,
	MOCK_DISCOVERY_TRACKS,
	youtubeEmbedUrl,
	youtubeThumb,
} from "../../_lib/tracks";

const VOTE_COST_VAYLA = 10;
const ENDS_ON_LABEL = "Mar 28, 2026 · 23:59 UTC";

function defaultAbout(track: DiscoveryTrack) {
	return `“${track.title}” blends crisp synth textures with a late-night pulse—built for short-form energy and replayable hooks. ${track.artist} leans into neon-toned pads and tight drums that feel at home on city drives and discovery feeds alike.`;
}

export default function DiscoveryTrackDetailPage() {
	const params = useParams();
	const rawId = params.id;
	const id = typeof rawId === "string" ? decodeURIComponent(rawId) : "";

	const [showEmbed, setShowEmbed] = useState(false);

	const { isLoading, data: apiTracks } = useAppQuery<DiscoveryTrack[]>({
		queryKey: createQueryKey("/discovery/hot", { limit: 20, offset: 0 }),
		queryFn: async () => {
			const response = await getDiscoveryHotApi({ limit: 20, offset: 0 });
			const tracks = Array.isArray(response) ? response : (response?.tracks ?? []);
			if (tracks.length === 0) return MOCK_DISCOVERY_TRACKS;
			return tracks.map((t, i) => ({
				rank: t.rank,
				title: t.trackTitle,
				artist: t.artistName,
				youtubeUrl: t.youtubeUrl,
				id: t.submissionId || String(i),
				votes: Number(t.voteCount ?? 0),
				challenge: t.eventName || "Discovery",
			}));
		},
	});

	const track = useMemo(() => {
		const list = apiTracks?.length ? apiTracks : MOCK_DISCOVERY_TRACKS;
		return list.find(t => t.id === id) ?? null;
	}, [apiTracks, id]);

	const thumb = track ? (track.thumbnail ?? youtubeThumb(track.youtubeUrl)) : null;
	const embedSrc = track ? youtubeEmbedUrl(track.youtubeUrl) : null;

	if (!isLoading && !track) {
		return (
			<div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f5f7fa] px-6">
				<p className="text-center text-sm text-[#64748b]">Không tìm thấy track.</p>
				<Link
					href="/discovery"
					className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white"
				>
					Về Discovery
				</Link>
			</div>
		);
	}

	if (!track) {
		return (
			<div className="flex min-h-dvh items-center justify-center bg-[#f5f7fa] text-sm text-[#64748b]">
				Đang tải…
			</div>
		);
	}

	return (
		<div className="min-h-dvh bg-[#f5f7fa] pb-10">
			{/* Header */}
			<div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#e8f0f6] bg-[#f5f7fa]/95 px-4 py-3 backdrop-blur">
				<Link
					href="/discovery"
					aria-label="Back"
					className="flex size-9 items-center justify-center rounded-full text-[#0f172a] hover:bg-white"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<span className="text-sm font-bold text-[#0f172a]">Track</span>
			</div>

			<div className="px-4 pt-4">
				{/* Track hero — white card */}
				<section className="rounded-3xl bg-white p-4 shadow-md">
					<div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-slate-200">
						{thumb ? (
							<Image
								fill
								priority
								src={thumb}
								alt={track.title}
								className="object-cover"
								sizes="(max-width:768px) 100vw, 28rem"
							/>
						) : (
							<div className="flex size-full items-center justify-center text-slate-400">
								No preview
							</div>
						)}
					</div>

					<div className="mt-4">
						<h1 className="text-2xl font-extrabold text-[#0f2922]">{track.title}</h1>
						<p className="mt-1.5 text-sm text-[#5a7a72]">
							{track.artist} <span className="text-[#94a3b8]">•</span> Artist
						</p>
						<span className="mt-3 inline-block rounded-full bg-[#e0f3ef] px-3 py-1.5 text-[11px] font-bold text-[#0d9488]">
							Challenge : {track.challenge}
						</span>
					</div>
				</section>

				{/* Video preview */}
				<div className="mt-6">
					<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#cbd5e1]">
						{showEmbed && embedSrc ? (
							<iframe
								allowFullScreen
								title={track.title}
								className="size-full"
								src={`${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							/>
						) : (
							<button
								type="button"
								onClick={() => setShowEmbed(true)}
								className="relative flex size-full items-center justify-center"
							>
								{thumb ? (
									<Image
										fill
										alt=""
										src={thumb}
										sizes="100vw"
										className="object-cover opacity-90"
									/>
								) : null}
								<span className="absolute inset-0 bg-black/25" />
								<span className="relative flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-lg">
									<Play className="ml-1 size-8 fill-current" />
								</span>
							</button>
						)}
					</div>
					<p className="mt-2 text-center text-xs font-semibold text-primary">
						YouTube Embed Preview
					</p>
				</div>

				{/* About */}
				<section className="mt-8">
					<h2 className="text-base font-extrabold text-[#0f172a]">About this Track</h2>
					<p className="mt-2 text-sm leading-relaxed text-[#64748b]">{defaultAbout(track)}</p>
				</section>

				{/* Vote card */}
				<section className="mt-8 rounded-2xl border border-[#e8f0f6] bg-white p-4 shadow-sm">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
								Total votes
							</p>
							<p className="mt-0.5 text-2xl font-extrabold tabular-nums text-[#0f172a]">
								{track.votes.toLocaleString()}
							</p>
						</div>
						<div className="text-right">
							<p className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
								Ends on
							</p>
							<p className="mt-0.5 text-xs font-semibold text-[#475569]">{ENDS_ON_LABEL}</p>
						</div>
					</div>
					<Link
						href="/discovery/vote"
						className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-extrabold text-white shadow-sm"
					>
						<Vote className="size-4" />
						Vote with {VOTE_COST_VAYLA} VAYLA
					</Link>
					<p className="mt-2 text-center text-[11px] text-[#94a3b8]">Max 10 Votes per Track</p>
				</section>

				{/* Balance row */}
				<div className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-2xl border border-[#e8f0f6] bg-white px-4 py-4 shadow-sm">
						<p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
							Platform Balance
						</p>
						<p className="mt-2 flex items-baseline gap-1">
							<span className="text-[32px] font-extrabold leading-none text-[#0f172a]">50</span>
							<span className="text-xs  text-[black]">Vayla</span>
						</p>
						<button
							type="button"
							className="mt-4 w-full rounded-xl bg-primary/10 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/20"
						>
							Top Up
						</button>
					</div>
					<div className="rounded-2xl border border-[#e8f0f6] bg-white px-4 py-4 shadow-sm">
						<p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
							Withdrawable
						</p>
						<p className="mt-2 flex items-end gap-1">
							<span className="text-[32px] font-extrabold leading-none text-[#0f172a]">0</span>
							<span className="text-xs  text-[black]">Vayla</span>
						</p>
						<button
							type="button"
							className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90"
						>
							Withdraw
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
