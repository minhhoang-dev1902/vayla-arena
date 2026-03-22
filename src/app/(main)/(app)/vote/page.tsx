"use client";

import { ArrowRight, BarChart3, CheckCircle2, Link2 } from "lucide-react";
import Link from "next/link";

const DARK = "#020816";

const STATS = [
	{ value: "12.2K", label: "Votes Cast" },
	{ value: "189k", label: "VAYLA PWR" },
	{ value: "3.5K", label: "Artists" },
];

const HOW_IT_WORKS = [
	{
		icon: CheckCircle2,
		title: "Curated Themes",
		desc: "Music-focused categories designed for maximum quality signaling.",
	},
	{
		icon: Link2,
		title: "On-chain Verification",
		desc: "Transparent records on BNB Chain ensuring vote integrity.",
	},
	{
		icon: BarChart3,
		title: "Trend Signals",
		desc: "Real-world data for the music industry's next big hits.",
	},
];

export default function VotePage() {
	return (
		<div className="flex flex-col pb-24">
			{/* Hero — V-OnChain Chart */}
			<section
				className="relative overflow-hidden px-5 pt-8 pb-10"
				style={{ backgroundColor: DARK }}
			>
				<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_60%)]" />

				<div className="relative z-10">
					<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
						On-Chain Live Network
					</p>

					<h1 className="mt-4 text-4xl leading-[1.1] font-extrabold text-white">
						V-Onchain
						<br />
						Chart
					</h1>

					<p className="mt-4 max-w-[280px] text-sm leading-relaxed text-[#7a8fa3]">
						The heartbeat of Web3 music trends, powered by secure, fan-led token voting on the
						decentralized ledger.
					</p>

					{/* Stats */}
					<div className="mt-6 flex gap-3">
						{STATS.map(stat => (
							<div
								key={stat.label}
								className="rounded-xl px-4 py-2.5"
								style={{ backgroundColor: "rgba(20,184,166,0.12)" }}
							>
								<p className="text-lg font-extrabold text-white">{stat.value}</p>
								<p className="text-[9px] font-semibold uppercase tracking-wider text-[#5a7a8f]">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Monthly Theme Vote card */}
			<section className="px-5 -mt-4">
				<div
					className="relative overflow-hidden rounded-2xl p-5"
					style={{
						background: "linear-gradient(135deg, #0f2e26 0%, #0a1f18 100%)",
						border: "1px solid rgba(20,184,166,0.25)",
					}}
				>
					<div className="flex items-start justify-between">
						<div>
							<h2 className="text-lg font-extrabold text-white">Monthly Theme</h2>
							<h3 className="text-lg font-extrabold text-white">Vote</h3>
						</div>
						<span className="rounded-full bg-primary px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
							Active
						</span>
					</div>

					<p className="mt-4 text-sm leading-relaxed text-[#8fbfb0]">
						Every month, the community decides the focus. Your vote directly impacts the leaderboard
						trajectory.
					</p>

					<div className="mt-4 flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<CheckCircle2 className="size-4 text-primary" />
							<span className="text-xs font-semibold text-[#c0e8dd]">5 Curated Themes</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle2 className="size-4 text-primary" />
							<span className="text-xs font-semibold text-[#c0e8dd]">Gasless On-Chain Voting</span>
						</div>
					</div>

					<Link
						href="/discovery/vote"
						className="mt-5 flex h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold uppercase tracking-wider text-white transition active:scale-[0.98]"
						style={{
							background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
						}}
					>
						Go to Monthly Theme Vote
					</Link>
				</div>
			</section>

			{/* How It Works */}
			<section className="mt-8 px-5">
				<h2 className="text-base font-extrabold uppercase tracking-wide text-[#0f172a]">
					How It Works
				</h2>

				<div className="mt-4 flex flex-col gap-4">
					{HOW_IT_WORKS.map(item => (
						<div key={item.title} className="flex items-start gap-4">
							<div
								className="flex size-11 shrink-0 items-center justify-center rounded-xl"
								style={{ backgroundColor: "rgba(20,184,166,0.1)" }}
							>
								<item.icon className="size-5 text-primary" />
							</div>
							<div>
								<p className="text-sm font-bold text-[#0f172a]">{item.title}</p>
								<p className="mt-1 text-xs leading-relaxed text-[#64748b]">{item.desc}</p>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* What's Coming Next — Prediction Vote */}
			<section className="mt-8 px-5">
				<div
					className="overflow-hidden rounded-2xl p-5"
					style={{
						background: "linear-gradient(135deg, #e8faf8 0%, #d1f5ee 50%, #f0fdfa 100%)",
					}}
				>
					<div className="flex items-center gap-2">
						<h2 className="text-base font-extrabold text-[#0f172a]">What&apos;s Coming Next</h2>
						<span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0f766e]">
							Coming Soon
						</span>
					</div>

					<h3 className="mt-3 text-xl font-extrabold text-[#0f766e]">Prediction Vote</h3>
					<p className="mt-2 text-sm leading-relaxed text-[#475569]">
						Earn exclusive rewards by predicting the Top 3 monthly artists.
					</p>

					<Link
						href="/vote/prediction"
						className="mt-4 inline-flex items-center gap-1 text-sm font-bold uppercase text-primary"
					>
						Learn More
						<ArrowRight className="size-4" />
					</Link>
				</div>
			</section>

			{/* Why This Matters */}
			<section className="mt-8 px-5">
				<p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#94a3b8]">
					Why This Matters
				</p>
				<p className="mt-3 text-sm leading-relaxed text-[#475569]">
					V-Onchain Chart isn&apos;t just a list. It&apos;s a{" "}
					<span className="font-bold italic text-primary">validated sentiment layer</span>. By using
					on-chain signals, we capture the true commitment of fans, filtering out noise.
				</p>
			</section>
		</div>
	);
}
