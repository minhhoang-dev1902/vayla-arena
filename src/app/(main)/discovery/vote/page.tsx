"use client";

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft, GripHorizontal, Play, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";

const MAX_PICKS = 3;
const TEAL = "#14b8a6";
const STORAGE_KEY = "discovery:voteSelection";

export type VoteTrack = {
	id: string;
	chartRank: number;
	title: string;
	artist: string;
	url: string;
};

const TRACKS: VoteTrack[] = [
	{
		id: "t1",
		chartRank: 1,
		title: "Seven (feat. Latto)",
		artist: "JUNG KOOK",
		url: "https://www.youtube.com/watch?v=PNu-lyOH7bk&list=RDPNu-lyOH7bk&start_radio=1",
	},
	{
		id: "t2",
		chartRank: 2,
		title: "Super Shy",
		artist: "NEWJEANS",
		url: "https://www.youtube.com/watch?v=ArmDp-zijuc",
	},
	{
		id: "t3",
		chartRank: 3,
		title: "Fast Forward",
		artist: "JEON SOMI",
		url: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
	},
	{
		id: "t4",
		chartRank: 4,
		title: "Baddie",
		artist: "IVE",
		url: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
	},
	{
		id: "t5",
		chartRank: 5,
		title: "Perfect Night",
		artist: "LE SSERAFIM",
		url: "https://www.youtube.com/watch?v=fMcnFSzlfv4",
	},
	{
		id: "t6",
		chartRank: 6,
		title: "Drama",
		artist: "AESPA",
		url: "https://www.youtube.com/watch?v=lczBFPOGEGo",
	},
	{
		id: "t7",
		chartRank: 7,
		title: "Love Lee",
		artist: "AKMU",
		url: "https://www.youtube.com/watch?v=4K_3jg0C6HE",
	},
];

function youtubeEmbedUrl(url: string): string | null {
	try {
		const u = new URL(url);
		let videoId: string | null = null;
		if (u.hostname.includes("youtube.com")) {
			videoId = u.searchParams.get("v");
		} else if (u.hostname.includes("youtu.be")) {
			videoId = u.pathname.slice(1);
		}
		return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
	} catch {
		return null;
	}
}

function ordinalLabel(n: number): string {
	if (n === 1) return "1ST";
	if (n === 2) return "2ND";
	if (n === 3) return "3RD";
	return `${n}TH`;
}

/* ── Preview dialog ── */
function TrackPreviewDialog({
	track,
	isSelected,
	canSelect,
	onSelect,
	onClose,
}: {
	track: VoteTrack;
	isSelected: boolean;
	canSelect: boolean;
	onSelect: () => void;
	onClose: () => void;
}) {
	const backdropRef = useRef<HTMLDivElement>(null);
	const embedSrc = youtubeEmbedUrl(track.url);

	return (
		<div
			ref={backdropRef}
			role="dialog"
			className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020816]/80 backdrop-blur-sm"
			onClick={e => {
				if (e.target === backdropRef.current) onClose();
			}}
			onKeyDown={e => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div className="relative mx-4 w-full max-w-lg rounded-2xl bg-[#0c1e2e] p-6 shadow-2xl">
				{/* Close */}
				<button
					type="button"
					onClick={onClose}
					className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-[#2a4a5a] text-white/70 transition hover:bg-[#3a5a6a] hover:text-white"
				>
					<X className="size-4" />
				</button>

				{/* Video embed */}
				<div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
					{embedSrc ? (
						<iframe
							src={embedSrc}
							title={track.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="size-full"
						/>
					) : (
						<div className="flex size-full items-center justify-center text-sm text-white/40">
							Video not available
						</div>
					)}
				</div>

				{/* Track info */}
				<div className="mt-4 text-center">
					<p className="text-lg font-bold text-white">{track.title}</p>
					<p className="mt-1 text-xs font-bold uppercase tracking-[0.15em] text-[#8da2ba]">
						{track.artist}
					</p>
				</div>

				{/* Select button */}
				{!isSelected && canSelect && (
					<button
						type="button"
						onClick={() => {
							onSelect();
							onClose();
						}}
						className="mt-5 w-full rounded-full py-3.5 text-sm font-extrabold uppercase tracking-wider text-white transition active:scale-[0.97]"
						style={{ backgroundColor: TEAL }}
					>
						Select This Song
					</button>
				)}

				{isSelected && (
					<div
						className="mt-5 w-full rounded-full py-3.5 text-center text-sm font-extrabold uppercase tracking-wider text-white"
						style={{ backgroundColor: TEAL, opacity: 0.6 }}
					>
						Already Selected
					</div>
				)}
			</div>
		</div>
	);
}

/* ── Selected track row (sortable) ── */
function SelectedTrackItem({
	track,
	voteRank,
	onPlay,
}: {
	track: VoteTrack;
	voteRank: number;
	onPlay: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: track.id,
	});

	return (
		<li
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				zIndex: isDragging ? 50 : "auto",
				opacity: isDragging ? 0.85 : 1,
				borderColor: TEAL,
			}}
			className="flex items-center gap-3 rounded-[28px] border-2 bg-white px-4 py-3.5"
		>
			<span
				className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
				style={{ backgroundColor: TEAL }}
			>
				{ordinalLabel(voteRank)}
			</span>
			<button
				type="button"
				onClick={onPlay}
				className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border-2 bg-white transition hover:scale-105"
				style={{ borderColor: TEAL, color: TEAL }}
			>
				<Play className="ml-0.5 size-3.5 fill-current" />
			</button>
			<div className="min-w-0 flex-1">
				<p className="truncate text-[15px] font-bold text-[#0f172a]">{track.title}</p>
				<p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
					{track.artist}
				</p>
			</div>
			<span
				className="shrink-0 cursor-grab text-[#cbd5e1] active:cursor-grabbing"
				{...attributes}
				{...listeners}
			>
				<GripHorizontal className="size-5" />
			</span>
		</li>
	);
}

const PRE_SELECT_KEY = "discovery:preSelectedTrack";

/* ── Main page ── */
export default function DiscoveryVotePage() {
	const router = useRouter();
	const [selectedIds, setSelectedIds] = useState<string[]>(() => {
		if (typeof window === "undefined") return [];
		try {
			const raw = sessionStorage.getItem(PRE_SELECT_KEY);
			if (raw) {
				sessionStorage.removeItem(PRE_SELECT_KEY);
				const preSelected = JSON.parse(raw) as { rank?: number; title?: string };
				const match = TRACKS.find(
					t => t.title === preSelected.title || t.chartRank === preSelected.rank,
				);
				if (match) return [match.id];
			}
		} catch {
			// ignore
		}
		return [];
	});
	const [previewTrack, setPreviewTrack] = useState<VoteTrack | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
	);

	const selectionComplete = selectedIds.length === MAX_PICKS;
	const trackMap = useMemo(() => new Map(TRACKS.map(t => [t.id, t])), []);
	const unselectedTracks = useMemo(
		() => TRACKS.filter(t => !selectedIds.includes(t.id)),
		[selectedIds],
	);

	const toggleTrack = useCallback((trackId: string) => {
		setSelectedIds(prev => {
			if (prev.includes(trackId)) return prev.filter(id => id !== trackId);
			if (prev.length >= MAX_PICKS) return prev;
			return [...prev, trackId];
		});
	}, []);

	const handleDragEnd = useCallback((event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		setSelectedIds(prev => {
			const oldIdx = prev.indexOf(String(active.id));
			const newIdx = prev.indexOf(String(over.id));
			if (oldIdx === -1 || newIdx === -1) return prev;
			return arrayMove(prev, oldIdx, newIdx);
		});
	}, []);

	const handleSaveOrder = () => {
		if (!selectionComplete) return;
		const orderedTracks = selectedIds
			.map(id => trackMap.get(id))
			.filter((t): t is VoteTrack => t != null);
		try {
			sessionStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					submittedAt: new Date().toISOString(),
					trackIds: selectedIds,
					tracks: orderedTracks,
				}),
			);
		} catch {
			// ignore
		}
		router.push("/discovery/vote/confirm");
	};

	return (
		<>
			<div className="mx-auto flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-white text-[#0f172a]">
				<div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 py-5">
					{/* Header */}
					<div className="relative flex items-center justify-center">
						<Link
							href="/discovery"
							className="absolute left-0 rounded-full p-2 text-[#0f172a] hover:bg-slate-100"
							aria-label="Back"
						>
							<ArrowLeft className="size-6" />
						</Link>
						<h1 className="text-center text-xl font-bold">Vote and Earn Rewards</h1>
					</div>

					{/* Status badge */}
					<div className="mt-5 flex items-center justify-center gap-2">
						<span
							className={`rounded-full px-4 py-1.5 text-xs font-bold ${
								selectionComplete ? "bg-[#ccfbf1] text-[#0f766e]" : "bg-slate-100 text-slate-500"
							}`}
						>
							{selectedIds.length}/{MAX_PICKS} Selected
							{selectionComplete ? " ✓" : ""}
						</span>
					</div>

					{/* Selected tracks — draggable */}
					{selectedIds.length > 0 && (
						<div className="mt-6">
							<div className="flex items-center justify-between">
								<h2 className="text-sm font-bold text-[#0f172a]">Theme Chart</h2>
								{selectionComplete && (
									<span className="text-[10px] font-bold uppercase tracking-wider text-[#0d9488]">
										Selection complete
									</span>
								)}
							</div>
							<p className="mt-0.5 text-[10px] font-medium text-[#94a3b8]">
								Drag to reorder your ranking
							</p>

							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext items={selectedIds} strategy={verticalListSortingStrategy}>
									<ul className="mt-3 space-y-3">
										{selectedIds.map((id, idx) => {
											const track = trackMap.get(id);
											if (!track) return null;
											return (
												<SelectedTrackItem
													key={track.id}
													track={track}
													voteRank={idx + 1}
													onPlay={() => setPreviewTrack(track)}
												/>
											);
										})}
									</ul>
								</SortableContext>
							</DndContext>
						</div>
					)}

					{/* Unselected tracks */}
					{unselectedTracks.length > 0 && (
						<div className="mt-8">
							{selectedIds.length > 0 && (
								<p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#cbd5e1]">
									{selectionComplete ? "Other nominees" : "Tap to select"}
								</p>
							)}

							<ul className="space-y-2.5">
								{unselectedTracks.map(track => (
									<li key={track.id}>
										<button
											type="button"
											onClick={() => toggleTrack(track.id)}
											disabled={selectionComplete}
											className={`flex w-full items-center gap-3 rounded-[28px] border border-[#eef2f7] bg-white px-4 py-3.5 text-left transition-all ${
												selectionComplete
													? "cursor-not-allowed opacity-40"
													: "opacity-70 hover:opacity-100"
											}`}
										>
											<span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-[#cbd5e1]">
												{track.chartRank}
											</span>
											<button
												type="button"
												onClick={e => {
													e.stopPropagation();
													setPreviewTrack(track);
												}}
												className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] text-[#cbd5e1] transition hover:border-[#14b8a6] hover:text-[#14b8a6]"
											>
												<Play className="ml-0.5 size-3.5 fill-current" />
											</button>
											<div className="min-w-0 flex-1">
												<p className="truncate text-[15px] font-semibold text-[#64748b]">
													{track.title}
												</p>
												<p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-[#aab6c6]">
													{track.artist}
												</p>
											</div>
											<span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#e2e8f0] text-[#cbd5e1]">
												<Plus className="size-[18px]" strokeWidth={2} />
											</span>
										</button>
									</li>
								))}
							</ul>
						</div>
					)}

					{selectedIds.length > 0 && !selectionComplete && (
						<p className="mt-4 text-center text-xs text-slate-400">
							Chọn thêm {MAX_PICKS - selectedIds.length} track
						</p>
					)}
				</div>

				{/* Bottom bar */}
				<div className="shrink-0 border-t border-slate-100 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
					<div className="flex gap-3">
						<Link
							href="/discovery"
							className="flex h-12 flex-1 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-xs font-extrabold uppercase tracking-wider text-[#64748b] transition hover:bg-slate-50"
						>
							Cancel
						</Link>
						<button
							type="button"
							disabled={!selectionComplete}
							onClick={handleSaveOrder}
							className="flex h-12 flex-[1.8] items-center justify-center rounded-full text-xs font-extrabold uppercase tracking-wider text-white transition active:scale-[0.98] disabled:opacity-50"
							style={{
								background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
							}}
						>
							Save New Order
						</button>
					</div>
				</div>
			</div>

			{/* Preview dialog */}
			{previewTrack && (
				<TrackPreviewDialog
					track={previewTrack}
					isSelected={selectedIds.includes(previewTrack.id)}
					canSelect={selectedIds.length < MAX_PICKS}
					onSelect={() => toggleTrack(previewTrack.id)}
					onClose={() => setPreviewTrack(null)}
				/>
			)}
		</>
	);
}
