"use client";

import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { DotButton } from "./ButtonsSlider";
import "./slider.css";

export type SliderSlide = {
	id: string;
	content: React.ReactNode;
};

export type SliderProps = {
	autoplay?: boolean;
	className?: string;
	slides: SliderSlide[];
	autoplayIntervalMs?: number;
};

export default function Slider({
	slides,
	className,
	autoplay = false,
	autoplayIntervalMs = 5000,
}: SliderProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
	const [selectedIndex, setSelectedIndex] = useState(0);
	const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

	const onSelect = useCallback(
		(api: EmblaCarouselType) => {
			setSelectedIndex(api.selectedScrollSnap() % slides.length);
		},
		[slides.length],
	);

	useEffect(() => {
		if (!emblaApi) return;
		const syncFromApi = () => onSelect(emblaApi);
		queueMicrotask(syncFromApi);
		emblaApi.on("reInit", onSelect).on("select", onSelect);
	}, [emblaApi, onSelect]);

	useEffect(() => {
		if (!autoplay || !emblaApi || slides.length <= 1) return;
		autoplayRef.current = setInterval(() => {
			emblaApi.scrollNext();
		}, autoplayIntervalMs);
		return () => {
			if (autoplayRef.current) clearInterval(autoplayRef.current);
		};
	}, [autoplay, autoplayIntervalMs, emblaApi, slides.length]);

	if (!slides.length) return null;

	return (
		<div className={["embla", className].filter(Boolean).join(" ")}>
			<div ref={emblaRef} className="embla__viewport">
				<div className="embla__container">
					{slides.map(slide => (
						<div key={slide.id} className="embla__slide">
							{slide.content}
						</div>
					))}
				</div>
			</div>

			<div className="embla__dots-overlay">
				<div className="embla__dots">
					{slides.map((_, index) => (
						<DotButton
							key={slides[index].id}
							onClick={() => scrollTo(index)}
							selected={index === selectedIndex}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
