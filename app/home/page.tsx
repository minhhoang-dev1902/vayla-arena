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

      <div className="px-8">
        <div className="flex flex-col gap-4 justify-center items-center py-5 mt-10">
          <SectionCard
            label="Funding"
            imageSrc="/images/card-funding.png"
            imageAlt="funding"
            title="Participate in Web3 funding projects"
            buttonText="Explore Funding"
            action={() => { }}
          />
          <SectionCard
            label="V-Onchain Chart"
            imageSrc="/images/card-vchart.png"
            imageAlt="v-onchain chart"
            title="Vote and influence on-chain rankings"
            buttonText="View Chart"
            action={() => { }}
          />
          <SectionCard
            label="Discovery"
            imageSrc="/images/card-discovery.png"
            imageAlt="vayla discovery"
            title="Discover and support new creators"
            buttonText="Go to Discovery"
            action={() => { }}
          />
        </div>


        {/* What is Vayla Arena */}
        <div className="flex flex-col gap-4 justify-center items-center px-8 py-5 mt-10 bg-[#eee] rounded-3xl">
          <h2 className="text-[1.5rem] font-bold text-[#927000] text-center mb-2">
            What is VAYLA Arena?
          </h2>
          <p className="text-center text-[1.15rem] text-blue-700 font-medium leading-snug px-6 pb-8">
            VAYLA Arena is a Web3-powered platform<br />
            where fans participate directly in music,<br />
            events, and creative projects through<br />
            funding, voting, and rewards.
          </p>
        </div>



        {/* What is Vayla token */}
        <div className="flex flex-col gap-4 justify-center items-center px-8 py-5 mt-10 bg-[#eee] rounded-3xl">
          <h2 className="text-[1.5rem] font-bold text-[#927000] text-center mb-2">
            What is VAYLA Arena?
          </h2>
          <p className="text-center text-[1.15rem] text-blue-700 font-medium leading-snug px-6 pb-8">
            VAYLA Token powers the ecosystem.<br />
            It is used for voting,<br />
            rewards, NFTs,<br />
            and participation across<br />
            the Arena.
          </p>
        </div>
      </div>

    </main>
  )
}
