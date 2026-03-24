"use client";

import { ArrowLeft, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import calendarIcon from "@/assets/icons/calendar-icon.svg";
import moneyIcon from "@/assets/icons/money-icon.svg";
import usersIcon from "@/assets/icons/users-icon.svg";
import { findChallengeById, MOCK_CHALLENGES } from "../../_lib/challenges";
import { formatDiscoveryVotes, youtubeThumb } from "../../_lib/tracks";

export default function ChallengeDetailPage() {
	const { id } = useParams<{ id: string }>();
	const challenge = useMemo(() => findChallengeById(id) ?? MOCK_CHALLENGES[0], [id]);

	return (
		<div className="min-h-dvh bg-white px-4 pb-8">
			{/* Header */}
			<div className="flex items-center gap-3 py-3.5">
				<Link
					aria-label="Back"
					href="/discovery"
					className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a]"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<div className="min-w-0">
					<h1 className="truncate text-[15px] font-bold text-[#0f172a]">{challenge.title}</h1>
					<p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#94a3b8]">
						{challenge.subtitle}
					</p>
				</div>
			</div>

			<div className="border border-[#e2e8f0] p-4 rounded-2xl">
				{/* Cover image */}
				<div className="relative overflow-hidden rounded-2xl">
					<div className="relative aspect-16/10 w-full">
						<Image
							fill
							alt={challenge.title}
							className="object-cover"
							src={challenge.coverImage}
							sizes="(max-width: 768px) 100vw, 768px"
						/>
						<div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
					</div>
					<div className="absolute top-3 left-3 right-3 flex items-center justify-between">
						{challenge.isActive && (
							<span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white shadow-sm">
								Active
							</span>
						)}
						<span className="ml-auto rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
							Ends in {challenge.endsIn}
						</span>
					</div>
				</div>

				{/* Title + description */}
				<div className="mt-5">
					<h2 className="text-xl font-extrabold text-[#0f172a]">{challenge.title}</h2>
					<p className="mt-2 text-sm leading-relaxed text-[#64748b]">{challenge.description}</p>
				</div>
			</div>

			{/* Stats — 3 equal columns, short vertical dividers */}
			<div className="mt-5 flex items-stretch rounded-2xl border border-[#dfe7ee] bg-white px-1">
				<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-1 border-r border-[#dfe7ee] py-5">
					<div className="flex items-center justify-center size-8 rounded-full bg-[#F0F4F3]">
						<Image width={18} height={18} alt="Reward" src={moneyIcon} />
					</div>
					<p className="text-center text-[12px] font-extrabold leading-tight text-[#0f172a]">
						{challenge.reward}
					</p>
					<p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Reward</p>
				</div>

				<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-1 border-r border-[#dfe7ee] py-5">
					<div className="flex items-center justify-center size-8 rounded-full bg-[#F0F4F3]">
						<Image width={18} height={18} src={usersIcon} alt="Submissions" />
					</div>
					<p className="text-center text-[12px] font-extrabold leading-tight text-[#0f172a]">
						{challenge.submissions}
					</p>
					<p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
						Submissions
					</p>
				</div>

				<div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-1">
					<div className="flex items-center justify-center size-8 rounded-full bg-[#F0F4F3]">
						<Image width={15} height={15} alt="Period" src={calendarIcon} />
					</div>
					<p className="text-center text-[12px] font-extrabold leading-tight text-[#0f172a]">
						{challenge.period}
					</p>
					<p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Period</p>
				</div>
			</div>

			{/* Featured Tracks */}
			<div className="mt-6">
				<h3 className="text-base font-bold text-[#0f172a]">Featured Tracks</h3>

				<div className="mt-3 flex flex-col gap-3">
					{challenge.featuredTracks.map(track => {
						const thumb = track.thumbnail ?? youtubeThumb(track.youtubeUrl);
						return (
							<div
								key={track.id}
								className="flex items-center gap-3 rounded-2xl border border-[#e8f0f6] bg-white p-3"
							>
								<div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
									{thumb ? (
										<Image
											fill
											src={thumb}
											sizes="56px"
											alt={track.title}
											className="object-cover"
										/>
									) : (
										<div className="flex size-full items-center justify-center">
											<Music2 className="size-5 opacity-40" />
										</div>
									)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-bold text-[#0f172a]">{track.title}</p>
									<p className="text-[11px] text-[#64748b]">Artist: {track.artist}</p>
								</div>
								<div className="flex shrink-0 flex-col items-end gap-1.5">
									<span className="text-[10px] font-medium text-[#94a3b8]">
										{formatDiscoveryVotes(track.votes)}
									</span>
									<Link
										href={`/discovery/track/${encodeURIComponent(track.id)}`}
										className="rounded-lg bg-primary px-3.5 py-1.5 text-[11px] font-bold text-white"
									>
										View Track
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Submit Track */}
			<div className="mt-7">
				<Link
					href="/discovery/upload"
					className="flex h-12 w-full items-center justify-center rounded-2xl text-sm font-extrabold text-white"
					style={{
						background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
					}}
				>
					Submit Track
				</Link>
			</div>
		</div>
	);
}
