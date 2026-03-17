import type { StaticImageData } from "next/image";
import imgDiscovery from "@/assets/images/card_discovery.png";
import imgFunding from "@/assets/images/card_funding_web3.png";
import imgChart from "@/assets/images/card_vote.png"; // Make sure to have this image, or replace with an existing suitable one

export type MockCardActionItem = {
	href: string;
	title: string;
	category: string;
	buttonTitle: string;
	image: string | StaticImageData;
};

export const MOCK_CARD_ACTIONS: MockCardActionItem[] = [
	{
		href: "/funding",
		image: imgFunding,
		category: "FUNDING",
		buttonTitle: "Explore Funding",
		title: "Participate in Web3 funding projects",
	},
	{
		image: imgChart,
		href: "/onchain-chart",
		category: "ONCHAIN CHART",
		buttonTitle: "View Chart",
		title: "Vote and influence on-chain rankings",
	},
	{
		href: "/discovery",
		image: imgDiscovery,
		category: "DISCOVERY",
		buttonTitle: "Go to Discovery",
		title: "Discover and support new creators",
	},
];
