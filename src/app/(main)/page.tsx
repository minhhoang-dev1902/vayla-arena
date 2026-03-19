"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardLists from "@/features/homes/components/card-list/CardLists";
import InfoCardsSection from "@/features/homes/components/info-cards/InfoCardsSection";
import Slider from "@/features/homes/components/sliders/Slider";

export default function HomePage() {
	const router = useRouter();
	const [hasToken] = useState(() => {
		if (typeof window === "undefined") return false;
		return Boolean(localStorage.getItem("access_token"));
	});

	useEffect(() => {
		if (!hasToken) {
			router.replace("/welcome");
		}
	}, [hasToken, router]);

	if (!hasToken) {
		return <div className="min-h-screen bg-[#020c18]" />;
	}

	return (
		<div className="flex flex-col">
			<Slider />
			<CardLists />
			<InfoCardsSection />
		</div>
	);
}
