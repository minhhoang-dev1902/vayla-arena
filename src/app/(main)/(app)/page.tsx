"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardLists from "@/features/homes/components/card-list/CardLists";
import InfoCardsSection from "@/features/homes/components/info-cards/InfoCardsSection";
import Slider from "@/features/homes/components/sliders/Slider";

function useIsAuthenticated() {
	const { ready, authenticated } = usePrivy();
	const [hasLegacyToken] = useState(() => {
		if (typeof window === "undefined") return false;
		return Boolean(localStorage.getItem("access_token"));
	});

	return {
		ready,
		isAuthenticated: authenticated || hasLegacyToken,
	};
}

export default function HomePage() {
	const router = useRouter();
	const { ready, isAuthenticated } = useIsAuthenticated();

	useEffect(() => {
		if (ready && !isAuthenticated) {
			router.replace("/welcome");
		}
	}, [ready, isAuthenticated, router]);

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="size-8 animate-spin text-[#1ce8d7]" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<>
			<Slider />
			<CardLists />
			<InfoCardsSection />
		</>
	);
}
