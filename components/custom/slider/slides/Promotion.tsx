import MainSlideTemplate from "./main-slide-template"

export type PromotionSlideProps = {
  image?: string
  imageAlt?: string
  headline?: string
  description?: string
  ctaText?: string
}

const defaults = {
  image: "/images/slider-onchain.png",
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
    <MainSlideTemplate
      image={image}
      imageAlt={imageAlt}
      title={headline}
      subtitle={description}
      content={<></>}
      buttonText={ctaText}
      action={() => {}}
    />
  )
}
