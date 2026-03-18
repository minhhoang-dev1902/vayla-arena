"use client";

import { useRouter } from "next/navigation";
import waterBombImage from "@/assets/images/water-bomb.png";
import SlideDiscovery from "@/features/homes/components/sliders/slides_template/SlideDiscovery";
import SlideFunding from "@/features/homes/components/sliders/slides_template/SlideFunding";
import SlideVOnchainChart from "@/features/homes/components/sliders/slides_template/SlideVOnchainChart";
import CustomSlider from "@/share/components/custom/slider/CustomSlider";

const END_TIME = Date.now() + 12 * 24 * 60 * 60 * 1000;

const DISCOVERY_ENTRIES = [
	{ rank: 1, highlighted: false, artistName: "LUNA K", trackName: "Midnight Echo" },
	{ rank: 2, highlighted: false, artistName: "NOVA", trackName: "City Lights" },
	{ rank: 3, highlighted: true, artistName: "JAYDEN", trackName: "Neon Heart" },
];

export default function Slider() {
	const router = useRouter();

	const slides = [
		{
			id: "funding",
			content: (
				<SlideFunding
					time={END_TIME}
					title="Waterbomb Festival Funding"
					backgroundImageSrc={waterBombImage}
					buttonTitle="Participate in Web3.0 Funding"
					buttonAction={() => router.push("/funding")}
				/>
			),
		},
		{
			id: "v-onchain-chart",
			content: (
				<SlideVOnchainChart
					title="V-ONCHAIN CHART"
					liveLabel="Live voting now"
					subtitle="Fans decide the ranking"
					backgroundImageSrc={waterBombImage}
					buttonAction={() => router.push("/vote")}
					subtitle2="Powered by Fandom Token Voting"
					buttonTitle="Participate in Vote & Earn Rewards"
				/>
			),
		},
		{
			id: "discovery",
			content: (
				<SlideDiscovery
					title="VAYLA Discovery"
					hotLabel="Hot Discovery"
					entries={DISCOVERY_ENTRIES}
					buttonTitle="Explore Discovery"
					backgroundImageSrc={waterBombImage}
					subtitle="Where fans discover new artists"
					buttonAction={() => router.push("/discovery")}
				/>
			),
		},
	];

	return <CustomSlider slides={slides} />;
}
