import Image from "next/image"

export type PromotionSlideProps = {
  image?: string
  imageAlt?: string
  headline?: string
  description?: string
  ctaText?: string
}

const defaults = {
  image: "/images/waterboom-2.jpeg",
  imageAlt: "Promotion",
  headline: "V-Onchain Chart",
  description: "Fans decide the ranking",
  ctaText: "Participate in Vote & Earn Rewards",
}

export function PromotionSlide(props: PromotionSlideProps) {
  const {
    image = defaults.image,
    imageAlt = defaults.imageAlt,
    headline = defaults.headline,
    description = defaults.description,
    ctaText = defaults.ctaText,
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
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-amber-400">
            {headline}
          </h2>
          <p className="mt-1 text-lg italic text-white">{description}</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-6 py-3.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {ctaText}
        </button>
      </div>
    </div>
  )
}
