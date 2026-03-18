"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/share/components/ui/button";

export type SlideFundingProps = {
	time: number; // end date timestamp (ms)
	title: string;
	buttonTitle: string;
	buttonAction: () => void;
	backgroundImageSrc?: string | StaticImageData;
};

function useCountdown(endTime: number) {
	const [diff, setDiff] = useState(0);

	useEffect(() => {
		const tick = () => setDiff(Math.max(0, endTime - Date.now()));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [endTime]);

	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((diff % (1000 * 60)) / 1000);

	return { days, hours, minutes, seconds };
}

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

export default function SlideFunding({
	time,
	title,
	buttonTitle,
	buttonAction,
	backgroundImageSrc,
}: SlideFundingProps) {
	const { days, hours, minutes, seconds } = useCountdown(time);

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
				<div className="flex w-full max-w-[320px] flex-col items-center gap-8">
					<h2 className="text-center text-3xl font-bold leading-tight text-foreground drop-shadow-sm">
						{title}
					</h2>

					<div className="flex w-full items-center justify-center rounded-full bg-foreground/20 px-4 py-4 backdrop-blur-sm">
						<span className="font-mono text-xl font-bold tabular-nums text-foreground/90">
							{days}
							<span className="text-sm font-medium">D</span> : {pad(hours)}
							<span className="text-sm font-medium">H</span> : {pad(minutes)}
							<span className="text-sm font-medium">M</span> :{" "}
							<span className="text-secondary">
								{pad(seconds)}
								<span className="text-sm font-medium">S</span>
							</span>
						</span>
					</div>

					<Button
						type="button"
						onClick={buttonAction}
						className="mt-5 w-full rounded-md bg-primary px-6 py-6 font-bold text-md  text-primary-foreground shadow-lg transition hover:bg-primary/90"
					>
						{buttonTitle}
					</Button>
				</div>
			</div>
		</div>
	);
}
