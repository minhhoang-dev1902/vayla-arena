"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import IconPlay from "@/assets/icons/icon-play.svg";
import { Button } from "@/share/components/ui/button";

type DiscoveringNowItem = {
	rank: number;
	votes: number;
	artist: string;
	title: string;
};

function chunk<T>(arr: readonly T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

function formatVotes(votes: number) {
	if (votes >= 1000) return `${(votes / 1000).toFixed(votes >= 10000 ? 0 : 1)}k`;
	return `${votes}`;
}

export function DiscoveringNowCarousel({
	items,
	pageSize = 6,
}: {
	items: readonly DiscoveringNowItem[];
	pageSize?: number;
}) {
	const pages = useMemo(() => chunk(items, pageSize), [items, pageSize]);
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
	const [activePage, setActivePage] = useState(0);
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	const scrollToPage = useCallback(
		(idx: number) => {
			emblaApi?.scrollTo(idx);
		},
		[emblaApi],
	);

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setActivePage(emblaApi.selectedScrollSnap());
		setCanPrev(emblaApi.canScrollPrev());
		setCanNext(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		const sync = () => onSelect();
		queueMicrotask(sync);
		emblaApi.on("reInit", onSelect).on("select", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<section>
			<div>
				<h2 className="text-lg font-extrabold text-card-foreground">Discovering Now</h2>
				<p className="text-sm text-muted-foreground">Trending tracks in the ecosystem</p>
			</div>

			<div className="mt-3 rounded-xl border border-border p-3 shadow-lg">
				<div ref={emblaRef} className="overflow-hidden">
					<div className="flex touch-pan-y">
						{pages.map((page, pageIdx) => (
							<div
								key={`page-${pageIdx}-${Date.now()}`}
								className="min-w-0 shrink-0 grow-0 basis-full"
							>
								<ul className="flex flex-col gap-2">
									{page.map(item => (
										<li
											key={item.rank}
											className="flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2.5"
										>
											<div className="flex min-w-0 items-center gap-3">
												<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ccc]/40">
													{/* <Play className="size-4 text-foreground/100" /> */}
													<Image
														src={IconPlay}
														alt="Play"
														width={16}
														height={16}
														className="size-4 text-foreground/100"
													/>
												</div>
												<div className="min-w-0">
													<p className="truncate font-medium text-card-foreground">
														<span className="mr-1 font-semibold text-primary">#{item.rank}</span>
														{item.title}
													</p>
													<p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
														{item.artist}
													</p>
												</div>
											</div>
											<span className="shrink-0 text-xs font-medium text-muted-foreground">
												{formatVotes(item.votes)}
											</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{pages.length > 1 ? (
					<div className="mt-4 flex items-center justify-center gap-4">
						<button
							type="button"
							onClick={scrollPrev}
							disabled={!canPrev}
							className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground disabled:opacity-40"
						>
							‹
						</button>
						<button
							type="button"
							onClick={scrollNext}
							disabled={!canNext}
							className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground disabled:opacity-40"
						>
							›
						</button>
					</div>
				) : null}

				{pages.length > 1 ? (
					<div className="mt-2 flex items-center justify-center gap-2">
						{pages.map((_, idx) => (
							<button
								key={`dot-${idx}-${Date.now()}`}
								type="button"
								aria-label={`Go to page ${idx + 1}`}
								onClick={() => scrollToPage(idx)}
								className={`h-2 w-2 rounded-full ${idx === activePage ? "bg-primary" : "bg-muted"}`}
							/>
						))}
					</div>
				) : null}

				<Button
					asChild
					className="mt-6 w-full rounded-xl bg-primary py-4 font-medium uppercase tracking-wide text-primary-foreground"
				>
					<Link href="/discovery/vote" className="flex items-center gap-2 py-6">
						Vote For This Rank
					</Link>
				</Button>
			</div>
		</section>
	);
}
