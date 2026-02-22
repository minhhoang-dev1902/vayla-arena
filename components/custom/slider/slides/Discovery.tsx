import MainSlideTemplate from "./main-slide-template"

export type DiscoverySlideProps = {
    image?: string
    imageAlt?: string
    headline?: string
    description?: string
    ctaText?: string
}

const defaults = {
    image: "/images/slider-discovery.png",
    imageAlt: "Discovery",
    headline: "VAYLA Discovery",
    description: "VAYLA Discovery Where fans discover new artist",
    ctaText: "Explore Discovery",
}

const Content = () => {
    return (
        <div className="flex flex-col justify-center items-center text-[white]">
            <p className="text-lg font-medium mb-6">Hot Discovery</p>
            <p>[#1 Song Title - Artist]</p>
            <p>[#2 Song Title - Artist]</p>
            <p>[#3 Song Title - Artist]</p>
        </div>
    )
}

export function DiscoverySlide(props: DiscoverySlideProps) {
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
            content={<Content />}
            buttonText={ctaText}
            action={() => { }}
        />
    )
}
