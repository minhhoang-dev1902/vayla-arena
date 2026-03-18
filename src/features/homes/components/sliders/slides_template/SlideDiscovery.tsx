"use client";

import { Flame } from "lucide-react";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Button } from "@/share/components/ui/button";

export type DiscoveryEntry = {
	rank: number;
	trackName: string;
	artistName: string;
	highlighted?: boolean;
};

export type SlideDiscoveryProps = {
	title: string;
	subtitle: string;
	hotLabel: string;
	buttonTitle: string;
	buttonAction: () => void;
	entries: DiscoveryEntry[];
	backgroundImageSrc?: string | StaticImageData;
};

export default function SlideDiscovery({
	title,
	entries,
	subtitle,
	hotLabel,
	buttonTitle,
	buttonAction,
	backgroundImageSrc,
}: SlideDiscoveryProps) {
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

			<div className="absolute bottom-20 left-0 right-0 z-10 flex flex-col mx-auto  items-center px-4 max-w-[320px]">
				<div className="flex w-full   flex-col justify-center items-center gap-4">
					<div className="flex flex-col gap-1 items-center">
						<h2 className="text-4xl font-bold leading-tight text-foreground drop-shadow-sm">
							{title}
						</h2>
						<p className="text-sm text-foreground/90">{subtitle}</p>
					</div>

					<div className="flex items-center gap-1.5 mt-5">
						<Flame className="size-4 text-orange-500" />
						<span className="text-xs font-medium uppercase tracking-wide text-foreground">
							{hotLabel}
						</span>
					</div>

					<div className="flex flex-col gap-2.5  w-full">
						{entries.map(entry => (
							<div
								key={entry.rank}
								className={`rounded-full px-3 py-2.5 backdrop-blur-lg ${
									entry.highlighted
										? "border border-dashed border-primary/60 bg-foreground/15"
										: "bg-foreground/10"
								}`}
							>
								<span className="text-sm font-medium text-foreground">
									#{entry.rank} {entry.trackName} - {entry.artistName}
								</span>
							</div>
						))}
					</div>

					<Button
						type="button"
						onClick={buttonAction}
						className="mt-4 w-full  rounded-lg bg-primary px-6 py-6 text-primary-foreground shadow-lg transition hover:bg-primary/90 text-md font-bold"
					>
						{buttonTitle}
					</Button>
				</div>
			</div>
		</div>
	);
}
