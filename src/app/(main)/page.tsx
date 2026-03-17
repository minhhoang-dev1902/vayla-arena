import CardLists from "@/features/homes/components/card-list/CardLists";
import InfoCardsSection from "@/features/homes/components/info-cards/InfoCardsSection";
import Slider from "@/features/homes/components/sliders/Slider";

export default function HomePage() {
	return (
		<div className="flex flex-col">
			<Slider />
			<CardLists />
			<InfoCardsSection />
		</div>
	);
}
