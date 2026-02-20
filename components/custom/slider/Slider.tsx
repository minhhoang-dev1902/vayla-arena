"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType } from "embla-carousel"
import { DotButton } from "./Buttons"
import "./slider.css"

export type SliderSlide = {
  id: string
  content: React.ReactNode
}

export type SliderProps = {
  slides: SliderSlide[]
  autoplay?: boolean
  autoplayIntervalMs?: number
  className?: string
}

export default function Slider({
  slides,
  autoplay = false,
  autoplayIntervalMs = 5000,
  className,
}: SliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(
    (api: EmblaCarouselType) => {
      setSelectedIndex(api.selectedScrollSnap() % slides.length)
    },
    [slides.length]
  )

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect).on("select", onSelect)
  }, [emblaApi, onSelect])

  // useEffect(() => {
  //   if (!autoplay || !emblaApi || slides.length <= 1) return
  //   autoplayRef.current = setInterval(() => {
  //     emblaApi.scrollNext()
  //   }, autoplayIntervalMs)
  //   return () => {
  //     if (autoplayRef.current) clearInterval(autoplayRef.current)
  //   }
  // }, [autoplay, autoplayIntervalMs, emblaApi, slides.length])

  if (!slides.length) return null

  return (
    <div className={["embla", className].filter(Boolean).join(" ")}>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide.id}>
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
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
