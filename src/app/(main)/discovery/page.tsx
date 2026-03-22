"use client";

import useEmblaCarousel from "embla-carousel-react";
import { Music2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getDiscoveryHotApi } from "@/apis/discovery.api";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";

const TEAL = "#14b8a6";

type Track = {
	id: string;
	rank: number;
	title: string;
	artist: string;
	challenge: string;
	votes: number;
	youtubeUrl: string;
	thumbnail?: string;
};

const MOCK_TRACKS: Track[] = [
	{
		id: "1",
		rank: 1,
		title: "Midnight Drive",
		artist: "Kira Vale",
		challenge: "Neon Nightbeat",
		votes: 1248,
		youtubeUrl: "https://www.youtube.com/watch?v=PNu-lyOH7bk",
	},
	{
		id: "2",
		rank: 2,
		title: "Solar Echo",
		artist: "Nova Sato",
		challenge: "Dawn Patrol",
		votes: 842,
		youtubeUrl: "https://www.youtube.com/watch?v=ArmDp-zijuc",
	},
	{
		id: "3",
		rank: 3,
		title: "Velvet Drive",
		artist: "Orion Pax",
		challenge: "Neon Nightbeat",
		votes: 619,
		youtubeUrl: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
	},
	{
		id: "4",
		rank: 4,
		title: "Pulse Theory",
		artist: "Elyx Rain",
		challenge: "Beat Lab",
		votes: 431,
		youtubeUrl: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
	},
	{
		id: "5",
		rank: 5,
		title: "Midnight Echoes",
		artist: "Sera Kline",
		challenge: "Midnight Session",
		votes: 298,
		youtubeUrl: "https://www.youtube.com/watch?v=fMcnFSzlfv4",
	},
];

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

function youtubeThumb(url: string): string | null {
	try {
		const u = new URL(url);
		let videoId: string | null = null;
		if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v");
		else if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1);
		return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
	} catch {
		return null;
	}
}

function formatVotes(n: number) {
	if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
	return String(n);
}

/* ── Hero Slide ── */
function HeroSlide({ track }: { track: Track }) {
	const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);

	return (
		<div className="relative min-w-0 shrink-0 grow-0 basis-full px-1">
			<div className="relative w-full overflow-hidden rounded-3xl bg-slate-200 shadow-lg">
				{/* Thumbnail full bleed */}
				{thumb ? (
					<Image src={thumb} alt={track.title} fill className="object-cover" sizes="100vw" />
				) : (
					<div className="absolute inset-0 flex items-center justify-center">
						<Music2 className="size-12 opacity-30" />
					</div>
				)}

				{/* Spacer to set height */}
				<div className="relative z-10 flex aspect-[3/4] flex-col justify-end">
					{/* Glass info card */}
					<div className="mx-4 mb-3 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 backdrop-blur-xl">
						<h2 className="text-[22px] leading-tight font-extrabold text-white drop-shadow-sm">
							{track.title}
						</h2>
						<p className="mt-1 text-sm font-medium text-white/80">Artist: {track.artist}</p>
						<p className="text-xs text-white/55">Challenge: {track.challenge}</p>

						<div className="mt-3 flex items-center gap-2.5">
							<div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
								<div className="h-full w-1/3 rounded-full" style={{ backgroundColor: TEAL }} />
							</div>
							<span className="text-[10px] tabular-nums text-white/50">00:08 / 00:20</span>
						</div>
					</div>

					{/* Votes + buttons */}
					<div className="mx-4 mb-2 flex items-end justify-between">
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Votes</p>
							<p className="text-3xl font-extrabold text-white drop-shadow-sm">
								{track.votes.toLocaleString()}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Link
								href="/discovery/vote"
								className="rounded-xl px-6 py-2.5 text-sm font-extrabold text-white shadow-md"
								style={{ backgroundColor: TEAL }}
							>
								Vote
							</Link>
							<button
								type="button"
								className="rounded-xl border-2 border-white/80 px-6 py-2.5 text-sm font-extrabold text-white backdrop-blur-sm"
							>
								View
							</button>
						</div>
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

	const { data: apiTracks } = useAppQuery<Track[]>({
		queryKey: createQueryKey("/discovery/hot", { limit: 20, offset: 0 }),
		queryFn: async () => {
			const response = await getDiscoveryHotApi({ limit: 20, offset: 0 });
			const tracks = Array.isArray(response) ? response : (response?.tracks ?? []);
			if (tracks.length === 0) return MOCK_TRACKS;
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

	const allTracks = apiTracks?.length ? apiTracks : MOCK_TRACKS;
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
							className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-5" : "w-2"}`}
							style={{ backgroundColor: i === heroIdx ? TEAL : "#cbd5e1" }}
						/>
					))}
				</div>
			</section>

			{/* Submit Track */}
			<section className="mt-4 px-4">
				<Link
					href="/discovery/upload"
					className="flex h-12 w-full items-center justify-center rounded-full border-2 text-sm font-extrabold tracking-wider"
					style={{ borderColor: TEAL, color: TEAL }}
				>
					Submit Track
				</Link>
			</section>

			{/* Challenge Card */}
			<section className="mt-5 px-4">
				<div className="overflow-hidden rounded-2xl border border-[#e2eeea] bg-white p-4 shadow-sm">
					<div className="flex gap-3">
						<div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#0c2520] to-[#1a4a3a]">
							<Music2 className="size-6" style={{ color: TEAL }} />
						</div>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-2">
								<p className="text-sm font-bold text-[#0f172a]">{CHALLENGE.title}</p>
								<span
									className="rounded-full px-2 py-0.5 text-[8px] font-bold text-white"
									style={{ backgroundColor: TEAL }}
								>
									Active
								</span>
							</div>
							<p className="mt-1 text-xs leading-relaxed text-[#64748b]">{CHALLENGE.desc}</p>
							<p
								className="mt-1.5 flex items-center gap-1 text-[10px] font-bold"
								style={{ color: TEAL }}
							>
								<Trophy className="size-3" />
								Prize: {CHALLENGE.prize}
							</p>
						</div>
					</div>

					<div className="mt-3 flex items-center justify-between">
						<span className="text-xs font-bold text-[#0f172a]">Ends in {CHALLENGE.endsIn}</span>
						<button
							type="button"
							className="rounded-lg border px-3 py-1.5 text-[10px] font-bold"
							style={{ borderColor: TEAL, color: TEAL }}
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
							className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
								activeTab === tab.id ? "text-white" : "border border-[#e2e8f0] text-[#64748b]"
							}`}
							style={activeTab === tab.id ? { backgroundColor: TEAL } : undefined}
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
							<div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
								{thumb ? (
									<Image src={thumb} alt={track.title} fill className="object-cover" sizes="48px" />
								) : (
									<div className="flex size-full items-center justify-center bg-slate-100">
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
									Votes: {formatVotes(track.votes)}
								</p>
							</div>
							<Link
								href="/discovery/vote"
								className="shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold text-white"
								style={{ backgroundColor: TEAL }}
							>
								Vote
							</Link>
						</div>
					);
				})}
			</section>
		</div>
	);
}
