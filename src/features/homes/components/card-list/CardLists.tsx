"use client";

import { useRouter } from "next/navigation";
import { useGetFeaturedFundingProject } from "@/features/funding/hooks/use-get-featured-funding-project";
import HomeFundingCard, {
	HomeFundingCardSkeleton,
} from "@/features/homes/components/card-list/HomeFundingCard";
import CardAction from "@/share/components/custom/Cards/CardAction";
import { MOCK_CARD_ACTIONS } from "@/share/constants/data_mock";

export default function CardLists() {
	const router = useRouter();
	const { data: featuredFunding, isPending } = useGetFeaturedFundingProject();

	return (
		<ul className="grid gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-2">
			{MOCK_CARD_ACTIONS.map(item => {
				if (item.href === "/funding") {
					if (isPending) {
						return (
							<li key="funding-loading">
								<HomeFundingCardSkeleton />
							</li>
						);
					}
					if (featuredFunding) {
						return (
							<li key={`funding-${featuredFunding.id}`}>
								<HomeFundingCard
									project={featuredFunding}
									image={item.image}
									onCta={() => router.push("/funding")}
								/>
							</li>
						);
					}
				}
				return (
					<li key={`${item.href}-${item.title}`}>
						<CardAction
							image={item.image}
							title={item.title}
							category={item.category}
							buttonTitle={item.buttonTitle}
							buttonAction={() => router.push(item.href)}
						/>
					</li>
				);
			})}
		</ul>
	);
}
