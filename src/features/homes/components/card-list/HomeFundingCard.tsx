"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FundingProject } from "@/features/funding/types/funding.types";
import { Button } from "@/share/components/ui/button";

function formatUsd(amount: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(amount);
}

function formatEndDate(iso: string): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function HomeFundingCardSkeleton() {
	return (
		<article className="overflow-hidden rounded-xl bg-card shadow-lg">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-2">
					<div className="h-3 w-16 animate-pulse rounded bg-muted" />
					<div className="h-6 w-4/5 max-w-[280px] animate-pulse rounded bg-muted" />
				</div>
				<div className="relative aspect-16/10 w-full animate-pulse rounded-lg bg-muted" />
				<div className="h-2 w-full animate-pulse rounded-full bg-muted" />
				<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
				<div className="h-14 w-full animate-pulse rounded-sm bg-muted" />
			</div>
		</article>
	);
}

type HomeFundingCardProps = {
	project: FundingProject;
	image: string | StaticImageData;
	onCta: () => void;
};

export default function HomeFundingCard({ project, image, onCta }: HomeFundingCardProps) {
	const pct = Math.min(100, Math.max(0, project.progress_pct));
	const endLabel = formatEndDate(project.end_date);

	return (
		<article className="overflow-hidden rounded-xl bg-card shadow-lg">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-2">
					<span className="text-xs font-medium uppercase tracking-wide text-primary">
						[FUNDING]
					</span>
					<h3 className="text-lg font-bold leading-snug text-card-foreground">{project.title}</h3>
					<p className="text-xs text-muted-foreground">
						by {project.creator_username}
						{endLabel ? ` · ends ${endLabel}` : null}
					</p>
				</div>

				<div className="relative aspect-16/10 w-full overflow-hidden rounded-lg">
					<Image
						fill
						alt=""
						src={image}
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 400px"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
						<div
							className="h-full rounded-full bg-primary transition-[width] duration-300"
							style={{ width: `${pct}%` }}
						/>
					</div>
					<div className="flex flex-wrap items-baseline justify-between gap-1 text-sm">
						<span className="font-semibold text-primary">
							{formatUsd(project.raised_amount)} raised
						</span>
						<span className="text-muted-foreground">
							{formatUsd(project.goal_amount)} goal · {pct.toFixed(pct % 1 === 0 ? 0 : 1)}%
						</span>
					</div>
				</div>

				<Button
					type="button"
					onClick={onCta}
					className="w-full rounded-sm py-6 font-bold uppercase tracking-wide"
				>
					Explore Funding
				</Button>
			</div>
		</article>
	);
}
