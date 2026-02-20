"use client"

import Slider from "@/components/custom/slider/Slider"
import { EventFundingSlide, PromotionSlide } from "@/components/custom/slider/slides"

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
              <PromotionSlide
                headline="V-Onchain Chart"
                description="Fans decide the ranking"
                ctaText="Participate in Vote & Earn Rewards"
              />
            ),
          },
          {
            id: "event-funding-2",
            content: (
              <EventFundingSlide
                subtitle="Community Pool"
                items={["Status: Live", "Goal: $5,000.", "Progress: 100%", "Ended"]}
                buttonText="View results"
              />
            ),
          },
        ]}
        autoplay
        autoplayIntervalMs={5000}
      />
    </main>
  )
}
