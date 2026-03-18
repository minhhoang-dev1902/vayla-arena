"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Button } from "@/share/components/ui/button";

export type SlideVOnchainChartProps = {
	title: string;
	subtitle: string;
	liveLabel: string;
	subtitle2: string;
	buttonTitle: string;
	buttonAction: () => void;
	backgroundImageSrc?: string | StaticImageData;
};

export default function SlideVOnchainChart({
	title,
	subtitle,
	liveLabel,
	subtitle2,
	buttonTitle,
	buttonAction,
	backgroundImageSrc,
}: SlideVOnchainChartProps) {
	return (
		<div className="relative flex min-h-[500px] w-full flex-col overflow-hidden bg-background">
			{backgroundImageSrc ? (
				<>
					<Image fill alt="" src={backgroundImageSrc} className="object-cover" />
					<div className="absolute inset-0 bg-background/50" />
				</>
			) : (
				<div className="absolute inset-0 bg-linear-to-b from-muted/80 to-background" />
			)}

			<div className="absolute inset-0 justify-center items-center z-10 flex flex-col px-4">
				<div className="flex w-full justify-center items-center flex-col gap-4">
					<div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-foreground/10 px-3 py-1.5">
						<span className="size-2 rounded-full bg-destructive" />
						<span className="text-xs font-medium uppercase tracking-wide text-foreground">
							{liveLabel}
						</span>
					</div>

					<div className="flex flex-col gap-2 items-center">
						<h2 className="text-4xl font-bold leading-tight text-foreground drop-shadow-sm">
							{title}
						</h2>
						<p className="text-md text-foreground/90">{subtitle}</p>
						<p className="text-md font-bold text-primary/90">{subtitle2}</p>
					</div>

					<Button
						type="button"
						onClick={buttonAction}
						className="mt-6 w-full  rounded-lg bg-primary px-6 py-6 text-primary-foreground shadow-lg transition hover:bg-primary/90 text-md font-bold"
					>
						{buttonTitle}
					</Button>
				</div>
			</div>
		</div>
	);
}
