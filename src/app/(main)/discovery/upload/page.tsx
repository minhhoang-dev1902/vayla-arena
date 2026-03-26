"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, RefreshCw, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useGetChallenges } from "@/features/discovery/hooks/use-get-challenges";
import { useSubmitTrack } from "@/features/discovery/hooks/use-submit-track";
import { useGetWalletBalance } from "@/features/wallet/hooks/use-get-wallet-balance";
import { AppSidebar } from "@/share/components/layout/main-layout/AppSidebar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/share/components/ui/select";

type OverlayState = "idle" | "confirming" | "failed";
const UPLOAD_SUBMISSION_STORAGE_KEY = "discovery:uploadSubmission";
const UPLOAD_COST = 10;

const GENRES = ["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Lo-fi", "Jazz", "Other"] as const;

const uploadSchema = z.object({
	description: z.string().max(500).optional(),
	genre: z.string().min(1, "Genre is required"),
	artistName: z.string().min(1, "Artist name is required").max(100),
	trackTitle: z.string().min(1, "Track title is required").max(100),
	youtubeUrl: z
		.string()
		.min(1, "YouTube URL is required")
		.url("Please enter a valid URL")
		.refine(
			url =>
				/^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)/.test(
					url,
				),
			"Must be a valid YouTube URL",
		),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

function youtubeThumbFromUrl(url: string): string | null {
	try {
		const u = new URL(url);
		let videoId: string | null = null;
		if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v");
		else if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1);
		return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
	} catch {
		return null;
	}
}

/* ── Confirming overlay ── */
function ConfirmingOverlay() {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#eaf9f7] via-[#f4fdfb] to-white px-6 py-14">
			<div className="flex-1" />
			<div className="flex flex-col items-center">
				<div className="relative flex size-36 items-center justify-center">
					<div className="absolute inset-0 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-primary/15" />
					<div className="absolute inset-3 rounded-full border border-primary/10 bg-primary/5" />
					<div className="relative flex size-24 items-center justify-center rounded-full border-4 border-primary bg-[#d7f2ef] shadow-[0_0_0_10px_rgba(20,184,166,0.08),0_20px_45px_rgba(20,184,166,0.15)]">
						<span className="text-5xl font-semibold text-primary">V</span>
					</div>
				</div>
				<p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#67bdb8]">
					Submitting
				</p>
				<h1 className="mt-4 text-center text-[28px] leading-tight font-extrabold text-[#1a1f2a]">
					Submitting
					<br />
					your track…
				</h1>
			</div>
			<div className="flex-1" />
			<div className="w-full max-w-[300px]">
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#c9d9df]">
					<div
						className="h-full rounded-full"
						style={{
							animation: "upload-progress 2s ease-in-out infinite",
							background: "linear-gradient(90deg, var(--primary), #0d9488)",
						}}
					/>
				</div>
				<p className="mt-5 flex items-center justify-center gap-2 text-sm text-[#83919a]">
					<span className="size-2 shrink-0 rounded-full bg-primary" />
					Sending to server
				</p>
			</div>
			<style>{`
				@keyframes upload-progress {
					0%, 100% { width: 40%; opacity: 0.8; }
					50% { width: 75%; opacity: 1; }
				}
			`}</style>
		</div>
	);
}

/* ── Failed overlay ── */
function FailedOverlay({
	message,
	onClose,
	onRetry,
}: {
	message?: string;
	onClose: () => void;
	onRetry: () => void;
}) {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#fff1f1] via-[#fff8f8] to-white px-6 pt-16 pb-8">
			<div className="flex flex-col items-center">
				<div className="relative flex size-24 items-center justify-center">
					<div className="absolute inset-0 animate-[ping_3s_ease-in-out_infinite] rounded-full bg-[#fee2e2]/40" />
					<div className="absolute inset-2 rounded-full bg-[#fee2e2]/50" />
					<div className="relative flex size-16 items-center justify-center rounded-full border-2 border-[#fca5a5] bg-white shadow-md">
						<AlertCircle className="size-8 text-[#ef4444]" />
					</div>
				</div>
				<h1 className="mt-8 text-center text-[26px] leading-tight font-extrabold text-[#1b2436]">
					Submission Failed
				</h1>
				<p className="mt-2 text-center text-sm text-[#64748b]">
					{message ?? "Something went wrong. Please try again."}
				</p>
			</div>
			<div className="mt-auto w-full max-w-sm pt-8">
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={onClose}
						className="flex h-12 items-center justify-center rounded-full border border-primary text-sm font-extrabold text-primary transition hover:bg-[#f0fdfa]"
					>
						Close
					</button>
					<button
						type="button"
						onClick={onRetry}
						style={{
							background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
						}}
						className="flex h-12 items-center justify-center gap-2 rounded-full text-sm font-extrabold text-white transition active:scale-[0.98]"
					>
						<RefreshCw className="size-4" />
						Try Again
					</button>
				</div>
			</div>
		</div>
	);
}

/* ── Main page ── */
export default function DiscoveryUploadPage() {
	const router = useRouter();
	const [overlayState, setOverlayState] = useState<OverlayState>("idle");
	const [selectedEventId, setSelectedEventId] = useState<string>("");
	const [youtubePreviewUrl, setYoutubePreviewUrl] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const lastValuesRef = useRef<UploadFormValues | null>(null);

	const { data: apiChallenges, isLoading: challengesLoading } = useGetChallenges();
	const { data: walletBalance } = useGetWalletBalance();
	const { submit } = useSubmitTrack();

	const challenges = useMemo(() => apiChallenges?.filter(c => c.isActive) ?? [], [apiChallenges]);

	const platformBalance = walletBalance?.platformBalance
		? parseFloat(walletBalance.platformBalance).toLocaleString()
		: "—";

	useEffect(() => {
		if (challenges.length > 0 && !selectedEventId) {
			setSelectedEventId(challenges[0].eventId ?? "");
		}
	}, [challenges, selectedEventId]);

	const {
		watch,
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UploadFormValues>({
		resolver: zodResolver(uploadSchema),
		defaultValues: { genre: "", trackTitle: "", artistName: "", youtubeUrl: "", description: "" },
	});

	const youtubeUrlValue = watch("youtubeUrl");

	useEffect(() => {
		setYoutubePreviewUrl(youtubeThumbFromUrl(youtubeUrlValue ?? "") ?? "");
	}, [youtubeUrlValue]);

	const doSubmit = useCallback(
		async (values: UploadFormValues) => {
			setOverlayState("confirming");
			try {
				const result = await submit({
					genre: values.genre,
					eventId: selectedEventId,
					youtubeUrl: values.youtubeUrl,
					trackTitle: values.trackTitle,
					artistName: values.artistName,
					description: values.description,
				});

				const submittedAt = new Date();
				const timeLabel = submittedAt.toLocaleString("en-US", {
					hour12: true,
					day: "2-digit",
					month: "short",
					hour: "2-digit",
					minute: "2-digit",
				});

				try {
					sessionStorage.setItem(
						UPLOAD_SUBMISSION_STORAGE_KEY,
						JSON.stringify({
							submissionTime: timeLabel,
							trackTitle: result.trackTitle,
							thumbnail: youtubeThumbFromUrl(values.youtubeUrl),
							txHashPreview: `0x${result.submissionId.slice(0, 4)}...${result.submissionId.slice(-4)}`,
							challengeName:
								challenges.find(c => c.eventId === selectedEventId)?.title ?? "Discovery",
						}),
					);
				} catch {
					// ignore storage failure
				}

				router.push("/discovery/my-submissions");
			} catch (err: unknown) {
				const msg =
					err &&
					typeof err === "object" &&
					"message" in err &&
					typeof (err as { message: unknown }).message === "string"
						? (err as { message: string }).message
						: undefined;
				setErrorMessage(msg ?? "");
				setOverlayState("failed");
			}
		},
		[submit, selectedEventId, challenges, router],
	);

	const onSubmit = (values: UploadFormValues) => {
		lastValuesRef.current = values;
		doSubmit(values);
	};

	const handleRetry = useCallback(() => {
		if (lastValuesRef.current) doSubmit(lastValuesRef.current);
	}, [doSubmit]);

	return (
		<>
			<div className="min-h-dvh bg-white">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-[#f1f5f9] px-4 py-3.5">
					<div className="flex items-center gap-3">
						<Link
							href="/discovery"
							aria-label="Back"
							className="flex size-9 items-center justify-center rounded-full text-[#0f172a] hover:bg-slate-100"
						>
							<ArrowLeft className="size-5" />
						</Link>
						<div>
							<h1 className="text-[15px] font-bold text-[#0f172a]">Submit Track</h1>
							<p className="text-[11px] text-[#94a3b8]">Submit your track to an active challenge</p>
						</div>
					</div>
					<AppSidebar />
				</div>

				<form className="space-y-5 px-4 py-5" onSubmit={handleSubmit(onSubmit)}>
					{/* Track title */}
					<div className="space-y-1.5">
						<label
							htmlFor="trackTitle"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							Track Title
						</label>
						<input
							id="trackTitle"
							{...register("trackTitle")}
							placeholder="Enter track title"
							className="w-full rounded-xl border border-[black]/40 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
						/>
						{errors.trackTitle && (
							<p className="text-xs text-red-500">{errors.trackTitle.message}</p>
						)}
					</div>

					{/* Artist name */}
					<div className="space-y-1.5">
						<label
							htmlFor="artistName"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							Artist Name
						</label>
						<input
							id="artistName"
							{...register("artistName")}
							placeholder="Artist or band name"
							className="w-full rounded-xl border border-[black]/40 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
						/>
						{errors.artistName && (
							<p className="text-xs text-red-500">{errors.artistName.message}</p>
						)}
					</div>

					{/* Genre */}
					<div className="space-y-1.5">
						<label
							htmlFor="genre"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							Genre
						</label>
						<Controller
							name="genre"
							control={control}
							render={({ field }) => (
								<Select
									onValueChange={field.onChange}
									value={field.value === "" ? undefined : field.value}
								>
									<SelectTrigger id="genre" className="w-full" aria-invalid={Boolean(errors.genre)}>
										<SelectValue placeholder="Select a genre" />
									</SelectTrigger>
									<SelectContent position="popper">
										{GENRES.map(g => (
											<SelectItem key={g} value={g}>
												{g}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.genre && <p className="text-xs text-red-500">{errors.genre.message}</p>}
					</div>

					{/* Challenge selection */}
					<div className="space-y-2">
						<p className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
							Challenge
						</p>
						{challengesLoading ? (
							<div className="flex gap-2">
								{[1, 2, 3].map(i => (
									<div key={i} className="h-16 flex-1 animate-pulse rounded-xl bg-slate-100" />
								))}
							</div>
						) : challenges.length === 0 ? (
							<p className="text-sm text-[#94a3b8]">No active challenges at the moment.</p>
						) : (
							<div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
								{challenges.map(c => {
									const isSelected = selectedEventId === c.eventId;
									return (
										<button
											type="button"
											key={c.eventId}
											onClick={() => setSelectedEventId(c.eventId ?? "")}
											className={`flex w-[120px] shrink-0 flex-col items-center gap-2 rounded-xl border px-2 py-3 transition ${
												isSelected ? "border-primary bg-white" : "border-[#e2e8f0] bg-white"
											}`}
										>
											<span
												className={`flex size-4 items-center justify-center rounded-full border-2 ${
													isSelected ? "border-primary bg-primary" : "border-[#cbd5e1] bg-white"
												}`}
											>
												{isSelected && <span className="size-1.5 rounded-full bg-white" />}
											</span>
											<span
												className={`line-clamp-2 text-center text-[11px] font-semibold leading-tight ${
													isSelected ? "text-[#0f172a]" : "text-[#94a3b8]"
												}`}
											>
												{c.title}
											</span>
										</button>
									);
								})}
							</div>
						)}
					</div>

					{/* YouTube URL */}
					<div className="space-y-2">
						<label
							htmlFor="youtubeUrl"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							YouTube Link
						</label>
						<input
							id="youtubeUrl"
							{...register("youtubeUrl")}
							placeholder="https://youtube.com/watch?v=..."
							className="w-full rounded-xl border border-[black]/40 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
						/>
						{errors.youtubeUrl && (
							<p className="text-xs text-red-500">{errors.youtubeUrl.message}</p>
						)}
						<div className="mt-4 flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-3">
							<div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-primary/20">
								{youtubePreviewUrl ? (
									<Image
										fill
										sizes="56px"
										alt="preview"
										src={youtubePreviewUrl}
										className="object-cover"
									/>
								) : (
									<div className="flex size-full items-center justify-center">
										<span className="text-lg text-primary/40">▶</span>
									</div>
								)}
							</div>
							<p className="text-xs leading-relaxed text-[#47817a]">
								Paste a public YouTube link to preview your track here.
							</p>
						</div>
					</div>

					{/* Short description */}
					<div className="space-y-1.5">
						<label
							htmlFor="description"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							Short Description
						</label>
						<textarea
							id="description"
							{...register("description")}
							rows={3}
							placeholder="Add a short description of the track and its mood"
							className="w-full resize-none rounded-xl border border-[black]/40 px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
						/>
					</div>

					{/* AI note */}
					<p className="text-[11px] text-primary">
						<span className="font-bold">NOTE:</span> AI-generated music is allowed — disclose if
						primarily AI-assisted.
					</p>

					{/* Policy card */}
					<div className="rounded-2xl border border-[black]/20 bg-white p-4 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
								Policy
							</p>
							<div className="flex size-7 items-center justify-center rounded-full border border-[black]/10 bg-[#f8fafb]">
								<Shield className="size-4 text-[#cbd5e1]" />
							</div>
						</div>
						<h3 className="mt-1 text-base font-extrabold text-[#0f172a]">Submission Rules</h3>
						<div className="mt-3 grid grid-cols-2 gap-2">
							<div className="rounded-xl border border-[black]/10 bg-[#f8fafb] p-3">
								<p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
									Upload Cost
								</p>
								<p className="mt-1 text-[15px] font-extrabold text-[#0f172a]">
									{UPLOAD_COST} VAYLA
								</p>
							</div>
							<div className="rounded-xl border border-[black]/10 bg-[#f8fafb] p-3">
								<p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
									Platform Balance
								</p>
								<p className="mt-1 text-[15px] font-extrabold text-[#0f172a]">
									{platformBalance} VAYLA
								</p>
							</div>
						</div>
					</div>

					{/* Submit button */}
					<div className="pb-6">
						<button
							type="submit"
							disabled={overlayState === "confirming" || !selectedEventId}
							style={{
								background: "linear-gradient(135deg, var(--primary) 0%, #0d9488 50%, #0f766e 100%)",
							}}
							className="flex h-12 w-full items-center justify-center rounded-full text-sm font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
						>
							Submit for Review
						</button>
						<p className="mt-2.5 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
							Tracks are published only after admin approval
						</p>
					</div>
				</form>
			</div>

			{overlayState === "confirming" && <ConfirmingOverlay />}

			{overlayState === "failed" && (
				<FailedOverlay
					onRetry={handleRetry}
					message={errorMessage}
					onClose={() => setOverlayState("idle")}
				/>
			)}
		</>
	);
}
