"use client";

import { ChevronLeft, Clock, Edit2, Heart, Info } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetMySubmissions } from "@/features/discovery/hooks/use-get-my-submissions";
import type {
	MySubmissionItem,
	SubmissionStatus,
} from "@/features/discovery/types/discovery.types";
import { AppSidebar } from "@/share/components/layout/main-layout/AppSidebar";

function youtubeThumb(url: string): string {
	const match =
		url.match(/[?&]v=([^&#]+)/) ??
		url.match(/youtu\.be\/([^?#]+)/) ??
		url.match(/shorts\/([^?#]+)/);
	return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

function formatDate(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString("en-US", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	} catch {
		return iso;
	}
}

type FilterTab = "all" | SubmissionStatus;

const TABS: { id: FilterTab; label: string }[] = [
	{ id: "all", label: "All" },
	{ label: "Pending", id: "pending_review" },
	{ id: "approved", label: "Approved" },
	{ id: "rejected", label: "Rejected" },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
	closed: {
		label: "CLOSED",
		className: "bg-slate-600 text-white",
	},
	rejected: {
		label: "REJECTED",
		className: "bg-red-500 text-white",
	},
	approved: {
		label: "APPROVED",
		className: "bg-emerald-500 text-white",
	},
	pending_review: {
		label: "PENDING REVIEW",
		className: "bg-amber-500 text-white",
	},
	pending: {
		label: "PENDING REVIEW",
		className: "bg-amber-500 text-white",
	},
};

const FALLBACK_STATUS_STYLE = {
	label: "UNKNOWN",
	className: "bg-slate-500 text-white",
};

function getStatusConfig(status: string) {
	return (
		STATUS_CONFIG[status] ?? {
			...FALLBACK_STATUS_STYLE,
			label: status.replace(/_/g, " ").toUpperCase() || FALLBACK_STATUS_STYLE.label,
		}
	);
}

function ActionIcon({ status }: { status: SubmissionStatus | string }) {
	if (status === "pending_review" || status === "pending") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full border border-[#e2e8f0]">
				<Edit2 className="size-3.5 text-[#64748b]" />
			</div>
		);
	}
	if (status === "rejected") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full border border-[#e2e8f0]">
				<Info className="size-3.5 text-[#64748b]" />
			</div>
		);
	}
	if (status === "closed") {
		return (
			<div className="flex size-8 items-center justify-center rounded-full border border-[#e2e8f0]">
				<Clock className="size-3.5 text-[#64748b]" />
			</div>
		);
	}
	return (
		<div className="flex size-8 items-center justify-center rounded-full border border-[#e2e8f0]">
			<svg
				role="img"
				fill="none"
				strokeWidth={2}
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-label="View submission"
				className="size-3.5 text-[#64748b]"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
				/>
			</svg>
		</div>
	);
}

function SubmissionCard({ item }: { item: MySubmissionItem }) {
	const thumb = youtubeThumb(item.youtubeUrl);
	const statusCfg = getStatusConfig(item.status);

	return (
		<div className="flex items-center gap-3 border-b border-[#f1f5f9] py-4">
			<div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
				{thumb ? (
					<Image fill src={thumb} sizes="64px" alt={item.trackTitle} className="object-cover" />
				) : (
					<div className="flex size-full items-center justify-center bg-slate-200">
						<span className="text-xl text-slate-400">♪</span>
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-bold text-[#0f172a]">{item.trackTitle}</p>
						<p className="truncate text-xs text-[#64748b]">{item.eventName}</p>
					</div>
					<span className="shrink-0 text-[10px] text-[#94a3b8]">{formatDate(item.createdAt)}</span>
				</div>

				<div className="mt-2 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1 text-xs text-[#64748b]">
							<Heart className="size-3 fill-[#64748b] text-[#64748b]" />
							{item.voteCount.toLocaleString()} votes
						</span>
						<span
							className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wider ${statusCfg.className}`}
						>
							{statusCfg.label}
						</span>
					</div>
					<ActionIcon status={item.status} />
				</div>
			</div>
		</div>
	);
}

function SkeletonCard() {
	return (
		<div className="flex items-center gap-3 border-b border-[#f1f5f9] py-4">
			<div className="size-16 shrink-0 animate-pulse rounded-xl bg-slate-100" />
			<div className="flex-1 space-y-2">
				<div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
				<div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
				<div className="h-5 w-28 animate-pulse rounded-full bg-slate-100" />
			</div>
		</div>
	);
}

export default function MySubmissionsPage() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<FilterTab>("all");

	const listParams = useMemo(() => {
		const base = { limit: 20, offset: 0 as const };
		if (activeTab === "all") return base;
		const status =
			activeTab === "pending_review"
				? ("pending" as const)
				: (activeTab as "approved" | "rejected");
		return { ...base, status };
	}, [activeTab]);

	const { isLoading, data: submissions } = useGetMySubmissions(listParams);
	const list = submissions ?? [];

	return (
		<div className="min-h-dvh bg-white">
			{/* Header */}
			<header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#f1f5f9] bg-white px-4 py-3">
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={() => router.back()}
						className="flex size-8 items-center justify-center rounded-full text-[#64748b] hover:text-[#0f172a]"
					>
						<ChevronLeft className="size-5" />
					</button>
					<h1 className="text-base font-bold text-[#0f172a]">My Submissions</h1>
				</div>
				<AppSidebar />
			</header>

			{/* Filter tabs */}
			<div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
				{TABS.map(tab => {
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
								isActive
									? "bg-primary text-white"
									: "border border-[#e2e8f0] bg-white text-[#64748b]"
							}`}
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* List */}
			<div className="px-4">
				{isLoading ? (
					["s1", "s2", "s3", "s4"].map(k => <SkeletonCard key={k} />)
				) : list.length === 0 ? (
					<div className="flex flex-col items-center justify-center gap-3 py-20">
						<span className="text-4xl">🎵</span>
						<p className="text-sm font-semibold text-[#64748b]">
							{activeTab === "all"
								? "No submissions yet"
								: `No ${TABS.find(t => t.id === activeTab)?.label.toLowerCase()} submissions`}
						</p>
						<button
							type="button"
							onClick={() => router.push("/discovery/upload")}
							className="mt-1 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white"
						>
							Submit a Track
						</button>
					</div>
				) : (
					list.map(item => <SubmissionCard item={item} key={item.submissionId} />)
				)}
			</div>
		</div>
	);
}
