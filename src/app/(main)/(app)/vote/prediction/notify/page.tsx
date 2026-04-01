"use client";

import { ArrowLeft, Award, Bell } from "lucide-react";
import Link from "next/link";

export default function PredictionNotifyPage() {
	return (
		<div className="flex min-h-0 w-full flex-1 flex-col bg-white">
			{/* Header */}
			<div className="flex items-center gap-3 px-5 py-4">
				<Link
					href="/vote/prediction"
					className="rounded-full p-1.5 text-[#0f172a] hover:bg-slate-100"
					aria-label="Back"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<h1 className="text-base font-bold text-[#0f172a]">Notification Set</h1>
			</div>

			{/* Content */}
			<div className="flex flex-1 flex-col items-center px-6 pt-6 pb-8">
				{/* Bell icon with decorations */}
				<div className="relative flex size-48 items-center justify-center">
					<div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#e8faf8] to-[#f0fdfa]" />

					{/* Sparkles */}
					<span className="absolute top-4 left-6 text-lg text-primary opacity-40">✦</span>
					<span className="absolute top-8 right-6 size-2 rounded-full bg-primary opacity-30" />
					<span className="absolute right-10 bottom-12 size-3 rotate-45 bg-primary opacity-20" />

					<div className="relative flex size-24 items-center justify-center rounded-full bg-white shadow-lg shadow-primary/10">
						<Bell className="size-12 text-primary" strokeWidth={2.5} />
					</div>
				</div>

				{/* Title */}
				<h2 className="mt-6 text-center text-2xl leading-tight font-extrabold text-[#0f172a]">
					Success! You&apos;re on the list
				</h2>
				<p className="mt-1 text-2xl">🔔</p>

				{/* Description */}
				<p className="mt-4 max-w-[300px] text-center text-sm leading-relaxed text-[#64748b]">
					We&apos;ll notify you the moment Prediction Vote launches. Get ready to analyze the hits
					and claim your rewards.
				</p>

				{/* Early Supporter Benefit */}
				<div className="mt-8 w-full max-w-sm rounded-2xl border border-[#e8f0f6] bg-[#fafcfd] p-5">
					<p className="text-center text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
						Early Supporter Benefit
					</p>

					<div className="mt-4 flex flex-col items-center">
						<div className="flex size-20 items-center justify-center rounded-xl border-2 border-dashed border-[#cbd5e1]/60 bg-white">
							<Award className="size-8 text-[#94a3b8]" />
						</div>
						<p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
							Pre-Launch NFT
						</p>
					</div>

					<p className="mt-4 text-center text-sm font-semibold text-[#0f172a]">
						Exclusive Badge Unlocked
					</p>
				</div>

				{/* Back to Home */}
				<div className="mt-auto w-full max-w-sm pt-8">
					<Link
						href="/"
						className="flex h-14 w-full items-center justify-center rounded-full text-sm font-extrabold uppercase tracking-wider text-white transition active:scale-[0.98]"
						style={{
							background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
						}}
					>
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
