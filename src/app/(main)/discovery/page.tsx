"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { Calendar, Loader2, Music2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { useGetChallenges } from "@/features/discovery/hooks/use-get-challenges";
import { useInfiniteFeedTracks } from "@/features/discovery/hooks/use-infinite-feed-tracks";
import type { DiscoveryFeedSort } from "@/features/discovery/types/discovery.types";
import { DiscoveryHeader } from "./_components/DiscoveryHeader";
import TracksSliders from "./_components/TracksSliders";
import { formatDiscoveryVotes, youtubeThumb } from "./_lib/tracks";

type TabId = "trending" | "new" | "ending";
const TABS: { id: TabId; label: string }[] = [
	{ id: "trending", label: "Trending" },
	{ id: "new", label: "New" },
	{ id: "ending", label: "Ending Soon" },
];

export default function DiscoveryPage() {
	const [activeTab, setActiveTab] = useState<TabId>("trending");
	const parentRef = useRef<HTMLDivElement>(null);

	const { data: apiChallenges } = useGetChallenges();

	const feedSort: DiscoveryFeedSort =
		activeTab === "new" ? "new" : activeTab === "ending" ? "ending_soon" : "trending";

	const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
		useInfiniteFeedTracks(feedSort);

	const challengeList = apiChallenges?.length ? apiChallenges : [];
	const allTracks = data?.pages.flatMap(page => page.tracks) ?? [];

	const rowVirtualizer = useVirtualizer({
		overscan: 5,
		estimateSize: () => 94,
		getScrollElement: () => parentRef.current,
		count: hasNextPage ? allTracks.length + 1 : allTracks.length,
		measureElement:
			typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
				? el => el?.getBoundingClientRect().height ?? 94
				: undefined,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			if (!hasNextPage || isFetchingNextPage) return;
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			if (scrollHeight - scrollTop - clientHeight < 200) {
				fetchNextPage();
			}
		},
		[fetchNextPage, hasNextPage, isFetchingNextPage],
	);

	return (
		<div className="flex min-h-dvh flex-col ">
			<DiscoveryHeader />

			{/* Hero Carousel */}
			<TracksSliders />

			{/* Submit Track */}
			<section className="my-6 px-4">
				<Link
					href="/discovery/upload"
					className="flex w-full items-center justify-center rounded-xl border-2 border-primary bg-primary py-4 text-sm font-bold tracking-wider text-white"
				>
					Submit Track
				</Link>
			</section>

			{/* Challenges Slider */}
			<section className="mt-5">
				<div className="mb-3 flex items-center justify-between px-4">
					<h2 className="text-base font-bold text-[#0f172a]">Active Challenges</h2>
					<span className="text-xs font-semibold text-primary">
						{challengeList.filter(c => c.isActive).length} active
					</span>
				</div>
				<div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
					{challengeList.map(challenge => (
						<Link
							key={challenge.id}
							href={`/discovery/challenge/${challenge.id}`}
							className="flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e2eeec] bg-white shadow-sm"
						>
							<div className="relative h-[140px] w-full bg-slate-200">
								{challenge.coverImage && (
									<Image
										fill
										sizes="280px"
										alt={challenge.title}
										className="object-cover"
										src={challenge.coverImage}
									/>
								)}
								<div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
								{challenge.isActive && (
									<span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-bold uppercase text-white">
										Active
									</span>
								)}
								<span className="absolute top-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[9px] font-semibold text-white backdrop-blur-sm">
									Ends in {challenge.endsIn}
								</span>
							</div>
							<div className="flex flex-1 flex-col p-3.5">
								<p className="text-sm font-bold leading-snug text-[#0f172a]">{challenge.title}</p>
								<p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#64748b]">
									{challenge.description}
								</p>
								<div className="mt-3 flex items-center gap-4 border-t border-[#f1f5f9] pt-2.5">
									<div className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
										<Music2 className="size-3.5 text-primary" />
										<span className="font-bold text-[#0f172a]">{challenge.reward}</span>
									</div>
									<div className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
										<Users className="size-3.5 text-primary" />
										<span className="font-bold text-[#0f172a]">{challenge.submissions}</span>
									</div>
									<div className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
										<Calendar className="size-3.5 text-primary" />
										<span className="font-bold text-[#0f172a]">
											{challenge.period.split(" - ")[0]}
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
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

			{/* Track List – virtualized + infinite scroll */}
			<section className="mt-4 px-4 pb-8">
				{isLoading ? (
					<div className="flex h-40 items-center justify-center">
						<Loader2 className="size-6 animate-spin text-primary" />
					</div>
				) : (
					<div
						ref={parentRef}
						onScroll={handleScroll}
						style={{ contain: "strict" }}
						className="h-[480px] overflow-y-auto scrollbar-none"
					>
						<div
							style={{
								width: "100%",
								position: "relative",
								height: rowVirtualizer.getTotalSize(),
							}}
						>
							{virtualItems.map(virtualRow => {
								const isLoaderRow = virtualRow.index >= allTracks.length;
								const track = allTracks[virtualRow.index];

								return (
									<div
										key={virtualRow.key}
										data-index={virtualRow.index}
										ref={rowVirtualizer.measureElement}
										style={{
											top: 0,
											left: 0,
											width: "100%",
											position: "absolute",
											paddingBottom: "10px",
											transform: `translateY(${virtualRow.start}px)`,
										}}
									>
										{isLoaderRow ? (
											<div className="flex items-center justify-center py-4">
												<Loader2 className="size-5 animate-spin text-primary" />
											</div>
										) : (
											(() => {
												const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);
												return (
													<div className="flex items-center gap-3 rounded-2xl border border-[#e8f0f6] bg-white p-3 shadow-sm">
														<div className="relative aspect-[4.5/5] w-16 shrink-0 overflow-hidden rounded-lg">
															{thumb ? (
																<Image
																	fill
																	src={thumb}
																	sizes="48px"
																	alt={track.title}
																	className="object-cover"
																/>
															) : (
																<div className="flex size-full min-h-full items-center justify-center bg-slate-100">
																	<Music2 className="size-5 opacity-40" />
																</div>
															)}
														</div>
														<div className="min-w-0 flex-1">
															<p className="truncate text-sm font-bold text-[#0f172a]">
																{track.title}
															</p>
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
																href={`/discovery/vote?track=${encodeURIComponent(track.id)}`}
																className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white"
															>
																Vote
															</Link>
														</div>
													</div>
												);
											})()
										)}
									</div>
								);
							})}
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
