"use client"

import Slider from "@/components/custom/slider/Slider"
import { EventFundingSlide, PromotionSlide } from "@/components/custom/slider/slides"
import { DiscoverySlide } from "@/components/custom/slider/slides/Discovery"
import { SectionCard } from "./_components/SectionCard"

export default function Home() {
  return (
    <main>
      <Slider
        slides={[
          {
            id: "event-funding",
            content: <EventFundingSlide />,
          },
          {
            id: "promotion",
            content: (
              <PromotionSlide />
            ),
          },
          {
            id: "discovery",
            content: <DiscoverySlide />,
          },
        ]}
        autoplay
        autoplayIntervalMs={5000}
      />
      <div className="flex flex-col gap-4 bg-red-500 justify-center items-center px-8 py-5">
        <SectionCard
          label="Funding"
          imageSrc="/images/card-funding.png"
          imageAlt="funding"
          title="Participate in Web3 funding projects"
          buttonText="Explore Funding"
          action={() => { }}
        />
      </div>
    </main>
  )
}
