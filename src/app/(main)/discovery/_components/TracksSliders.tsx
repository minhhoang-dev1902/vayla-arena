"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetHotTracks } from "@/features/discovery/hooks/use-get-hot-tracks";
import { type DiscoveryTrack, youtubeThumb } from "../_lib/tracks";

function HeroSlide({ track }: { track: DiscoveryTrack }) {
	const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);

	return (
		<div className="relative min-w-0 shrink-0 grow-0 basis-full px-1">
			<div
				style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
				className="relative flex aspect-[4/5.5] w-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-200 bg-cover bg-center shadow-lg py-4"
			>
				<div className="mx-4 mb-10 rounded-2xl border border-white/20 bg-white/15 px-5 py-6 backdrop-blur-xl">
					<h2 className="text-[22px] leading-tight font-extrabold text-white drop-shadow-sm">
						{track.title}
					</h2>
					<p className="mt-1 text-sm font-medium text-white/80">Artist: {track.artist}</p>
					<p className="text-xs text-white/55">Challenge: {track.challenge}</p>
				</div>

				<div className="mx-4 mb-2 flex items-end justify-between">
					<div>
						<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/90">Votes</p>
						<p className="text-2xl font-bold text-white drop-shadow-xl">
							{track.votes.toLocaleString()}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Link
							href={`/discovery/vote?track=${encodeURIComponent(track.id)}`}
							className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md"
						>
							Vote
						</Link>
						<Link
							href={`/discovery/track/${encodeURIComponent(track.id)}`}
							className="rounded-md border border-white/80 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm"
						>
							View
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function TracksSliders() {
	const { data: apiTracks } = useGetHotTracks({ limit: 20, offset: 0 });
	const tracks = useMemo(() => (apiTracks?.length ? apiTracks.slice(0, 5) : []), [apiTracks]);
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

	return (
		<section className="px-3 pt-4">
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
					{tracks.map(track => (
						<HeroSlide track={track} key={track.id} />
					))}
				</div>
			</div>
			<div className="mt-3 flex items-center justify-center gap-1.5">
				{tracks.map((t, i) => (
					<span
						key={t.id}
						className={`h-2 rounded-full transition-all ${i === heroIdx ? "w-5 bg-primary" : "w-2 bg-[#cbd5e1]"}`}
					/>
				))}
			</div>
		</section>
	);
}
