"use client";

import { ArrowLeft, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TEAL = "#14b8a6";

const STEPS = [
	{
		num: 1,
		title: "Select the Top 3",
		desc: "Choose the artists you think will lead the next V-Chart based on social heat and streaming signals.",
	},
	{
		num: 2,
		title: "Lock Your Vote",
		desc: "Submit your prediction on-chain before the weekly deadline. Gas-free for active VAYLA holders.",
	},
	{
		num: 3,
		title: "Claim Your Prize",
		desc: "The more accurate your prediction, the bigger the reward. Rewards are auto-airdropped to your wallet.",
	},
];

const REWARD_TIERS = [
	{ match: "3/3 Correct", reward: "Master NFT + 500 VAYLA" },
	{ match: "2/3 Correct", reward: "Elite Badge + 150 VAYLA" },
	{ match: "1/3 Correct", reward: "50 VAYLA Pwr" },
];

export default function PredictionVotePage() {
	const router = useRouter();

	return (
		<div className="flex flex-col pb-24">
			{/* Header */}
			<div className="flex items-center gap-3 px-5 py-4">
				<Link
					href="/vote"
					className="rounded-full p-1.5 text-[#0f172a] hover:bg-slate-100"
					aria-label="Back"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<h1 className="text-base font-bold text-[#0f172a]">Prediction Vote</h1>
			</div>

			{/* Hero banner */}
			<section className="px-5">
				<div className="relative overflow-hidden rounded-2xl">
					<Image
						src="/images/prediction-hero.jpg"
						alt="Prediction Vote"
						width={400}
						height={220}
						className="h-[220px] w-full object-cover"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

					<div className="absolute inset-0 flex flex-col justify-end p-5">
						<span
							className="mb-3 w-fit rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white"
							style={{ backgroundColor: TEAL }}
						>
							Live Rewards
						</span>
						<h2 className="text-2xl leading-tight font-extrabold text-white">
							Predict the Hits,
							<br />
							Earn the Rewards
						</h2>
						<p className="mt-2 text-xs leading-relaxed text-white/80">
							Analyze the trends and secure your spot on the leaderboard.
						</p>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section className="mt-8 px-5">
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#94a3b8]">
					How It Works
				</p>

				<div className="mt-6 flex flex-col gap-8">
					{STEPS.map(step => (
						<div key={step.num} className="flex gap-4">
							<span className="mt-0.5 shrink-0 text-2xl font-extrabold" style={{ color: TEAL }}>
								{step.num}
							</span>
							<div>
								<p className="text-base font-bold text-[#0f172a]">{step.title}</p>
								<p className="mt-2 text-sm leading-relaxed text-[#64748b]">{step.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Reward Tiers */}
			<section className="mt-8 px-5">
				<div className="rounded-2xl border border-[#e8f0f6] bg-white p-5">
					<div className="flex items-center gap-3">
						<div
							className="flex size-10 items-center justify-center rounded-xl"
							style={{ backgroundColor: "rgba(20,184,166,0.1)" }}
						>
							<span className="text-lg" style={{ color: TEAL }}>
								🏆
							</span>
						</div>
						<div>
							<p className="text-sm font-bold text-[#0f172a]">Reward Tiers</p>
							<p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
								Per Accurate Guess
							</p>
						</div>
					</div>

					<div className="mt-4 flex flex-col gap-2">
						{REWARD_TIERS.map((tier, i) => (
							<div
								key={tier.match}
								className="flex items-center justify-between rounded-xl px-4 py-3"
								style={{
									backgroundColor: i === 0 ? "rgba(20,184,166,0.08)" : "#f8fafc",
									border: i === 0 ? `1px solid rgba(20,184,166,0.2)` : "1px solid #f1f5f9",
								}}
							>
								<span className="text-sm font-bold" style={{ color: i === 0 ? TEAL : "#64748b" }}>
									{tier.match}
								</span>
								<span className="text-sm font-bold text-[#0f172a]">{tier.reward}</span>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Notify CTA */}
			<section className="mt-8 px-5">
				<button
					type="button"
					onClick={() => router.push("/vote/prediction/notify")}
					className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full text-sm font-extrabold uppercase tracking-wider text-white transition active:scale-[0.98]"
					style={{
						background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
					}}
				>
					<Bell className="size-4" />
					Notify Me on Launch
				</button>
			</section>
		</div>
	);
}
