"use client";

import { ArrowLeft, CircleCheck, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SubmissionData {
	trackTitle: string;
	challengeName: string;
	txHashPreview: string;
	submissionTime: string;
	thumbnail: string | null;
}

const STORAGE_KEY = "discovery:uploadSubmission";

const FALLBACK_DATA: SubmissionData = {
	thumbnail: null,
	trackTitle: "Midnight Orbit",
	txHashPreview: "0x7a...4e2d",
	submissionTime: "Oct 24, 14:02 PM",
	challengeName: "Neo-Synth Challenge",
};

export default function UploadSubmittedPage() {
	const [data, setData] = useState<SubmissionData>(FALLBACK_DATA);

	useEffect(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as Partial<SubmissionData>;
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setData({
				thumbnail: parsed.thumbnail ?? FALLBACK_DATA.thumbnail,
				trackTitle: parsed.trackTitle ?? FALLBACK_DATA.trackTitle,
				challengeName: parsed.challengeName ?? FALLBACK_DATA.challengeName,
				txHashPreview: parsed.txHashPreview ?? FALLBACK_DATA.txHashPreview,
				submissionTime: parsed.submissionTime ?? FALLBACK_DATA.submissionTime,
			});
		} catch {
			// ignore read errors
		}
	}, []);

	return (
		<div className="min-h-dvh bg-white">
			<div className="flex items-center gap-3 border-b border-[#f1f5f9] px-4 py-3.5">
				<Link
					aria-label="Back"
					href="/discovery/upload"
					className="flex size-9 items-center justify-center rounded-full border border-[#e2e8f0] text-[#0f172a]"
				>
					<ArrowLeft className="size-5" />
				</Link>
				<h1 className="text-lg font-bold text-[#0f172a]">VAYLA Discovery</h1>
			</div>

			<div className="px-5 py-6">
				<div className="flex flex-col items-center">
					<div className="flex size-[72px] items-center justify-center rounded-full bg-[#74edd9] shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
						<CircleCheck className="size-9 fill-[#065f57] text-[#065f57]" />
					</div>
					<h2 className="mt-5 text-center text-2xl font-extrabold leading-tight text-[#053c3b]">
						Submission Received
					</h2>
					<p className="mt-2.5 text-center text-md  text-[#2d6966]">
						Your track has been submitted for review Admin approval is required before public
						listing.
					</p>
				</div>

				<div className="mt-6 rounded-2xl border border-[#dbe8e8] bg-white p-4">
					<div className="flex items-center gap-3">
						<div className="relative w-[120px] h-[120px] aspect-square overflow-hidden rounded-lg bg-[#edf7f6]">
							{data.thumbnail ? (
								<Image
									fill
									sizes="100px"
									src={data.thumbnail}
									alt={data.trackTitle}
									className="object-cover w-full h-full aspect-square"
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full aspect-square text-[#90a4ae]">
									♪
								</div>
							)}
						</div>
						<div className="min-w-0">
							<p className="mt-4 text-[10px] font-bold uppercase  text-[#7aa8a3]">Track Title</p>
							<p className="truncate text-md font-bold text-[#103f3c]">{data.trackTitle}</p>
							<p className="mt-4 text-[10px] font-bold uppercase  text-[#7aa8a3]">Challenge Name</p>
							<p className=" text-md font-medium text-[#2c5f5b]">{data.challengeName}</p>
						</div>
					</div>

					<div className="mt-4 border-t border-[#e4efee] pt-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-[9px] font-bold uppercase text-[#7aa8a3]">Submission Time</p>
								<p className="mt-1 text-sm font-medium text-[#2c5f5b]">{data.submissionTime}</p>
							</div>
							<div className="text-right">
								<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7aa8a3]">
									Status
								</p>
								<span className="mt-1 inline-flex rounded-full bg-[#dff8f2] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#00a688]">
									Processing
								</span>
							</div>
						</div>
					</div>

					<div className="mt-4 flex items-center justify-between border-t border-[#e4efee] pt-3">
						<p className="text-[12px] text-[#6f9f9c]">🔗 {data.txHashPreview}</p>
						<Link href="#" className="text-[12px] font-semibold text-[#00a688]">
							View Transaction
						</Link>
					</div>
				</div>

				<div className="mt-6 space-y-3">
					<Link
						href="/discovery/upload"
						className="flex py-3 items-center justify-center rounded-md bg-[linear-gradient(135deg,var(--primary)_0%,#0d9488_55%,#0f766e_100%)] text-md font-bold text-white"
					>
						View My Submissions
					</Link>
					<Link
						href="/discovery"
						className="flex py-3 items-center justify-center rounded-md border border-[#d8e3e2] bg-white text-md font-bold text-[#184f4d]"
					>
						Back to Discovery
					</Link>
				</div>

				<div className="mt-5 flex justify-center">
					<div className="inline-flex items-center gap-2 rounded-full bg-[#eef4f3] px-3 py-1.5 text-[10px] font-bold uppercase  text-[#3f6f6c]">
						<Info className="size-3.5 text-[#00a688]" />
						Estimated Reward: 250 VAYLA
					</div>
				</div>
			</div>
		</div>
	);
}
