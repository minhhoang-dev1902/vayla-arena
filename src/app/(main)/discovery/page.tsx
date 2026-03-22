"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Music2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDiscoveryHotApi } from "@/apis/discovery.api";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import {
	type DiscoveryTrack,
	formatDiscoveryVotes,
	MOCK_DISCOVERY_TRACKS,
	youtubeThumb,
} from "./_lib/tracks";

const CHALLENGE = {
	title: "Neon Nightbeat",
	desc: "Create a synth-driven 16-bar loop that evokes a late-night city cruise...",
	prize: "500 VAYLA",
	endsIn: "2d 5h",
};

type TabId = "trending" | "new" | "ending";
const TABS: { id: TabId; label: string }[] = [
	{ id: "trending", label: "Trending" },
	{ id: "new", label: "New" },
	{ id: "ending", label: "Ending Soon" },
];

/* ── Hero Slide ── */
function HeroSlide({ track }: { track: DiscoveryTrack }) {
	const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);

	return (
		<div className="relative min-w-0 shrink-0 grow-0 basis-full px-1">
			<div
				className="relative flex aspect-[4/5.5] w-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-200 bg-cover bg-center shadow-lg py-4"
				style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
			>
				{/* {!thumb && (
					<div className="absolute inset-0 flex items-center justify-center">
						<Music2 className="size-12 opacity-30" />
					</div>
				)} */}

				{/* Glass info card */}
				<div className="mx-4 mb-10 rounded-2xl border border-white/20 bg-white/15 px-5 py-6 backdrop-blur-xl">
					<h2 className="text-[22px] leading-tight font-extrabold text-white drop-shadow-sm">
						{track.title}
					</h2>
					<p className="mt-1 text-sm font-medium text-white/80">Artist: {track.artist}</p>
					<p className="text-xs text-white/55">Challenge: {track.challenge}</p>

					{/* <div className="mt-3 flex items-center gap-2.5">
							<div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
								<div className="h-full w-1/3 rounded-full bg-primary" />
							</div>
							<span className="text-[10px] tabular-nums text-white/50">00:08 / 00:20</span>
						</div> */}
				</div>

				{/* Votes + buttons */}
				<div className="mx-4 mb-2 flex items-end justify-between">
					<div>
						<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">Votes</p>
						<p className="text-2xl font-bold text-white drop-shadow-xl">
							{track.votes.toLocaleString()}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href="/discovery/vote"
							className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md"
						>
							Vote
						</Link>
						<Link
							href={`/discovery/track/${encodeURIComponent(track.id)}`}
							className="rounded-md border-1 border-white/80 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm"
						>
							View
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ── Main ── */
export default function DiscoveryPage() {
	const [activeTab, setActiveTab] = useState<TabId>("trending");
	const [heroIdx, setHeroIdx] = useState(0);

	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 25 });

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setHeroIdx(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		queueMicrotask(onSelect);
		emblaApi.on("select", onSelect).on("reInit", onSelect);
	}, [emblaApi, onSelect]);

	useEffect(() => {
		if (!emblaApi) return;
		const timer = setInterval(() => emblaApi.scrollNext(), 5000);
		emblaApi.on("pointerDown", () => clearInterval(timer));
		return () => clearInterval(timer);
	}, [emblaApi]);

	const { data: apiTracks } = useAppQuery<DiscoveryTrack[]>({
		queryKey: createQueryKey("/discovery/hot", { limit: 20, offset: 0 }),
		queryFn: async () => {
			const response = await getDiscoveryHotApi({ limit: 20, offset: 0 });
			const tracks = Array.isArray(response) ? response : (response?.tracks ?? []);
			if (tracks.length === 0) return MOCK_DISCOVERY_TRACKS;
			return tracks.map((t, i) => ({
				id: t.submissionId || String(i),
				rank: t.rank,
				title: t.trackTitle,
				artist: t.artistName,
				challenge: t.eventName || "Discovery",
				votes: Number(t.voteCount ?? 0),
				youtubeUrl: t.youtubeUrl,
			}));
		},
	});

	const allTracks = apiTracks?.length ? apiTracks : MOCK_DISCOVERY_TRACKS;
	const heroTracks = useMemo(() => allTracks.slice(0, 5), [allTracks]);
	const listTracks = useMemo(() => allTracks, [allTracks]);

	return (
		<div className="flex min-h-dvh flex-col bg-[#f5f7fa]">
			{/* Hero Carousel */}
			<section className="px-3 pt-4">
				<div ref={emblaRef} className="overflow-hidden">
					<div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
						{heroTracks.map(track => (
							<HeroSlide key={track.id} track={track} />
						))}
					</div>
				</div>

				{/* Dots */}
				<div className="mt-3 flex items-center justify-center gap-1.5">
					{heroTracks.map((t, i) => (
						<span
							key={t.id}
							className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-5 bg-primary" : "w-2 bg-[#cbd5e1]"}`}
						/>
					))}
				</div>
			</section>

			{/* Submit Track */}
			<section className="my-6 px-4">
				<Link
					href="/discovery/upload"
					className="flex py-4 w-full items-center justify-center rounded-xl border-2 border-primary text-sm font-bold tracking-wider text-white bg-primary"
				>
					Submit Track
				</Link>
			</section>

			{/* Challenge Card */}
			<section className="mt-5 px-4">
				<div className="overflow-hidden rounded-2xl border border-[#c8e6e0] bg-[#e0f3ef] p-4">
					<div className="flex gap-3">
						<div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0c2520] to-[#1a4a3a]">
							<Music2 className="size-6 text-[#3ee8d8]" />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<p className="text-sm font-bold text-[#0f172a]">{CHALLENGE.title}</p>
								<span className="rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold text-white">
									Active
								</span>
							</div>
							<p className="mt-1.5 text-xs leading-relaxed text-[#5a7a72]">{CHALLENGE.desc}</p>
							<div className="mt-2 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-1.5 shadow-sm">
								<Trophy className="size-3.5 shrink-0 text-[#064e3b]" strokeWidth={2.5} />
								<span className="text-[10px] font-bold tracking-wide text-[#064e3b] uppercase">
									Prize: {CHALLENGE.prize}
								</span>
							</div>
						</div>
					</div>

					<div className="mt-8 flex items-center justify-between">
						<span className="text-xs font-bold text-[#0f172a]">Ends in {CHALLENGE.endsIn}</span>
						<button
							type="button"
							className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white shadow-sm"
						>
							Explore Challenge
						</button>
					</div>
				</div>
			</section>

			{/* Tabs */}
			<section className="mt-5 px-4">
				<div className="flex items-center gap-2">
					{TABS.map(tab => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
								activeTab === tab.id
									? "bg-primary text-white"
									: "border border-[#e2e8f0] text-[#64748b]"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>
			</section>

			{/* Track List */}
			<section className="mt-4 flex flex-col gap-2.5 px-4 pb-8">
				{listTracks.map(track => {
					const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);
					return (
						<div
							key={track.id}
							className="flex items-center gap-3 rounded-2xl border border-[#e8f0f6] bg-white p-3 shadow-sm"
						>
							<div className="relative aspect-[4.5/5] w-16 shrink-0 overflow-hidden rounded-lg">
								{thumb ? (
									<Image src={thumb} alt={track.title} fill className="object-cover" sizes="48px" />
								) : (
									<div className="flex size-full min-h-full items-center justify-center bg-slate-100">
										<Music2 className="size-5 opacity-40" />
									</div>
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-bold text-[#0f172a]">{track.title}</p>
								<p className="truncate text-[11px] text-[#64748b]">
									by: {track.artist} • Challenge: {track.challenge}
								</p>
								<p className="mt-0.5 text-xs font-semibold text-[#94a3b8]">
									Votes: {formatDiscoveryVotes(track.votes)}
								</p>
							</div>
							<div className="flex shrink-0 items-center gap-2">
								<Link
									href={`/discovery/track/${encodeURIComponent(track.id)}`}
									className="rounded-lg border border-primary px-3 py-1.5 text-xs font-bold text-primary"
								>
									View
								</Link>
								<Link
									href="/discovery/vote"
									className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white"
								>
									Vote
								</Link>
							</div>
						</div>
					);
				})}
			</section>
		</div>
	);
}
