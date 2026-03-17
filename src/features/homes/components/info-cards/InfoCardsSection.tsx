"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InfoCardsSection() {
	const router = useRouter();

	return (
		<section className="flex flex-col gap-4 px-4 py-6">
			<article className="rounded-xl  p-5">
				<h3 className="text-lg font-bold text-primary">What is VAYLA Arena?</h3>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					VAYLA Arena is a Web3-powered platform where fans participate directly in music, events,
					and creative projects through funding, voting, and rewards.
				</p>
			</article>

			<article className="rounded-xl bg-primary/5 p-5">
				<div className="flex items-start justify-between gap-3">
					<div className="flex flex-col gap-1">
						<h3 className="text-lg font-bold text-primary">VAYLA Token</h3>
						<span className="text-xs font-medium uppercase tracking-wide text-primary/80">
							ECOSYSTEM UTILITY
						</span>
					</div>
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/60 bg-primary">
						<div className="size-3 rounded-full bg-primary-foreground/20" />
					</div>
				</div>
				<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
					VAYLA Token powers the entire ecosystem. It is used for voting, rewards, and unlocking
					premium benefits.
				</p>
				<Link
					href="/token"
					onClick={() => router.push("/token")}
					className="mt-3 inline-flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-primary hover:underline"
				>
					More details
					<ChevronRight className="size-4" />
				</Link>
			</article>
		</section>
	);
}
