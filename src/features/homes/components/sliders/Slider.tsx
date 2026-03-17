"use client";

import { useRouter } from "next/navigation";
import waterBombImage from "@/assets/images/water-bomb.png";
import SlideFunding from "@/features/homes/components/sliders/slides_template/SlideFunding";
import CustomSlider from "@/share/components/custom/slider/CustomSlider";

const END_TIME = Date.now() + 12 * 24 * 60 * 60 * 1000;

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
			id: "reward festival",
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
			id: "waterbomb festival",
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
	];

	return <CustomSlider slides={slides} />;
}
