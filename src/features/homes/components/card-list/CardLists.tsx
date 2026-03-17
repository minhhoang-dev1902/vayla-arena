"use client";

import { useRouter } from "next/navigation";
import CardAction from "@/share/components/custom/Cards/CardAction";
import { MOCK_CARD_ACTIONS } from "@/share/constants/data_mock";

export default function CardLists() {
	const router = useRouter();

	return (
		<ul className="grid gap-4 px-4 py-6 sm:grid-cols-2 lg:grid-cols-2">
			{MOCK_CARD_ACTIONS.map(item => (
				<li key={`${item.href}-${item.title}`}>
					<CardAction
						image={item.image}
						title={item.title}
						category={item.category}
						buttonTitle={item.buttonTitle}
						buttonAction={() => router.push(item.href)}
					/>
				</li>
			))}
		</ul>
	);
}
