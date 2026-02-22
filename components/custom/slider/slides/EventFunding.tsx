import MainSlideTemplate from "./main-slide-template"

export type EventFundingSlideProps = {
  image?: string
  imageAlt?: string
  title?: string
  subtitle?: string
  items?: string[]
  buttonText?: string
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
}

export function EventFundingSlide(props: EventFundingSlideProps) {
  const {
    image = defaults.image,
    imageAlt = defaults.imageAlt,
    title = defaults.title,
    subtitle = defaults.subtitle,
    items = defaults.items,
    buttonText = defaults.buttonText,
  } = props

  return (
    <MainSlideTemplate
      image={image}
      imageAlt={imageAlt}
      title={title}
      subtitle={subtitle}
      content={
        <ul className=" list-disc pl-5 text-left text-lg italic leading-normal text-white/95">
          {items.map((item, i) => (
            <li key={i} className="mb-0.5">
              {item}
            </li>
          ))}
        </ul>
      }
      buttonText={buttonText}
      action={() => {}}
    />
  )
}
