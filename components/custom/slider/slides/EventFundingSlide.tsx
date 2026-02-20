import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export type EventFundingSlideProps = {
  image?: string
  imageAlt?: string
  title?: string
  subtitle?: string
  items?: string[]
  buttonText?: string
  buttonHref?: string
}

const defaults = {
  image: "/images/slider-1.png",
  imageAlt: "Waterbomb Festival",
  title: "VAYLA Funding",
  subtitle: "2026 Waterbomb Festival Funding",
  items: [
    "Status: Live",
    "Goal: $10,000.",
    "Progress: 62%",
    "Ends in: 12 days",
  ],
  buttonText: "Participate in Web3.0 Funding",
  buttonHref: "#",
}

export function EventFundingSlide(props: EventFundingSlideProps) {
  const {
    image = defaults.image,
    imageAlt = defaults.imageAlt,
    title = defaults.title,
    subtitle = defaults.subtitle,
    items = defaults.items,
    buttonText = defaults.buttonText,
    buttonHref = defaults.buttonHref,
  } = props

  return (
    <div className="relative h-full w-full">
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/75"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center px-4 pt-[25%] pb-20">
        <div className="w-full max-w-[340px]">
          <p className="mb-1 text-center text-2xl font-bold leading-tight text-amber-400">
            {title}
          </p>
          <h2 className="mt-6 text-center text-2xl font-semibold italic leading-snug text-white">
            {subtitle}
          </h2>
          <ul className="mt-20 list-disc pl-5 text-left text-lg italic leading-normal text-white/95">
            {items.map((item, i) => (
              <li key={i} className="mb-0.5">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto w-full max-w-[300px]">
          <Button
            variant="default"
            className="flex w-full items-center justify-center rounded-sm bg-[#0000ff] px-5 py-3.5"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
