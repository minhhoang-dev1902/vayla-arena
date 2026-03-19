"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CardLists from "@/features/homes/components/card-list/CardLists";
import InfoCardsSection from "@/features/homes/components/info-cards/InfoCardsSection";
import Slider from "@/features/homes/components/sliders/Slider";

export default function HomePage() {
	const router = useRouter();
	const { ready, authenticated } = usePrivy();

	useEffect(() => {
		if (ready && !authenticated) {
			router.replace("/welcome");
		}
	}, [ready, authenticated, router]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#020c18]">
				<Loader2 className="size-8 animate-spin text-[#1ce8d7]" />
			</div>
		);
	}

	if (!authenticated) {
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
