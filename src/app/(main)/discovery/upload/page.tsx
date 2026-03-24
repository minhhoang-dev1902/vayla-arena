"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, RefreshCw, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type OverlayState = "idle" | "confirming" | "success" | "failed";
const UPLOAD_SUBMISSION_STORAGE_KEY = "discovery:uploadSubmission";

const CHALLENGES = [
	{ id: "summer", label: "Summer Discovery" },
	{ id: "neon", label: "Neon Nights Remix" },
	{ id: "beat", label: "Beat Battle" },
] as const;

const DAILY_LIMIT = 2;
const UPLOAD_COST = 10;
const PLATFORM_BALANCE = 50;

const uploadSchema = z.object({
	description: z.string().max(500).optional(),
	challenge: z.string().min(1, "Please select a challenge"),
	trackTitle: z.string().min(1, "Track title is required").max(100),
	artistName: z.string().min(1, "Artist name is required").max(100),
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
					Wallet Gate
				</p>
				<h1 className="mt-4 text-center text-[28px] leading-tight font-extrabold text-[#1a1f2a]">
					Confirming
					<br />
					on-chain…
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
					Securing transaction
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
function FailedOverlay({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
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
					Transaction Failed
				</h1>
				<p className="mt-2 text-center text-base font-semibold text-primary">No VAYLA was used.</p>
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
	const [selectedChallenge, setSelectedChallenge] = useState<string>(CHALLENGES[0].id);
	const [youtubePreviewUrl, setYoutubePreviewUrl] = useState<string>("");
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const {
		watch,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UploadFormValues>({
		resolver: zodResolver(uploadSchema),
		defaultValues: {
			trackTitle: "",
			artistName: "",
			youtubeUrl: "",
			description: "",
			challenge: CHALLENGES[0].id,
		},
	});

	const youtubeUrlValue = watch("youtubeUrl");

	useEffect(() => {
		const thumb = youtubeThumbFromUrl(youtubeUrlValue ?? "");
		setYoutubePreviewUrl(thumb ?? "");
	}, [youtubeUrlValue]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const submitUpload = useCallback(() => {
		setOverlayState("confirming");
		timerRef.current = setTimeout(() => {
			const success = Math.random() > 0.2;
			if (success) {
				router.push("/discovery/upload/submitted");
				return;
			}
			setOverlayState("failed");
		}, 3000);
	}, [router]);

	const handleRetry = useCallback(() => {
		submitUpload();
	}, [submitUpload]);

	const onSubmit = (values: UploadFormValues) => {
		const selectedChallengeName =
			CHALLENGES.find(challenge => challenge.id === selectedChallenge)?.label ??
			CHALLENGES[0].label;
		try {
			const submittedAt = new Date();
			const timeFormatOptions: Intl.DateTimeFormatOptions = {};
			timeFormatOptions.month = "short";
			timeFormatOptions.day = "2-digit";
			timeFormatOptions.hour = "2-digit";
			timeFormatOptions.minute = "2-digit";
			timeFormatOptions.hour12 = true;
			const timeLabel = submittedAt.toLocaleString("en-US", timeFormatOptions);
			const txHashPreview = `0x${Date.now().toString(16).slice(-3)}...${Date.now()
				.toString(16)
				.slice(-4)}`;
			const submissionPayload: Record<string, unknown> = {};
			submissionPayload.trackTitle = values.trackTitle;
			submissionPayload.challengeName = selectedChallengeName;
			submissionPayload.submissionTime = timeLabel;
			submissionPayload.txHashPreview = txHashPreview;
			submissionPayload.thumbnail = youtubeThumbFromUrl(values.youtubeUrl);

			sessionStorage.setItem(UPLOAD_SUBMISSION_STORAGE_KEY, JSON.stringify(submissionPayload));
		} catch {
			// ignore storage failure
		}

		submitUpload();
	};

	return (
		<>
			<div className="min-h-dvh bg-white">
				{/* Header */}
				<div className="flex items-center gap-3 border-b border-[#f1f5f9] px-4 py-3.5">
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

				<form className="px-4 py-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
					{/* Track title */}
					<div className="space-y-1.5">
						<label
							htmlFor="trackTitle"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							Track
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
							className="w-full rounded-xl border border-[black]/40  px-4 py-3 text-sm text-[#0f172a] placeholder:text-[#cbd5e1] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
						/>
						{errors.artistName && (
							<p className="text-xs text-red-500">{errors.artistName.message}</p>
						)}
					</div>

					{/* Challenge selection */}
					<div className="space-y-2">
						<p className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
							Challenge Selection
						</p>
						<div className="flex gap-2">
							{CHALLENGES.map(c => {
								const isSelected = selectedChallenge === c.id;
								return (
									<button
										key={c.id}
										type="button"
										onClick={() => setSelectedChallenge(c.id)}
										className={`flex flex-1 flex-col items-center gap-2 rounded-xl border px-2 py-3 transition ${
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
											className={`text-center text-[11px] font-semibold leading-tight ${
												isSelected ? "text-[#0f172a]" : "text-[#94a3b8]"
											}`}
										>
											{c.label}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* YouTube URL */}
					<div className="space-y-2">
						<label
							htmlFor="youtubeUrl"
							className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]"
						>
							YouTube Embed Link
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
						{/* Preview card */}
						<div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-3 mt-4">
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
								Paste a public YouTube embed link to preview your track here.
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
					<div className="rounded-2xl border border-[black]/20  bg-white p-4 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">
								Policy
							</p>
							<div className="flex size-7 items-center justify-center rounded-full bg-[#f8fafb] border border-[black]/10">
								<Shield className="size-4 text-[#cbd5e1]" />
							</div>
						</div>
						<h3 className="mt-1 text-base font-extrabold text-[#0f172a]">Submission Rules</h3>

						<div className="mt-3 grid grid-cols-2 gap-2">
							<div className="rounded-xl border border-[black]/10 bg-[#f8fafb] p-3">
								<p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
									Daily Upload Limit
								</p>
								<p className="mt-1 text-[15px] font-extrabold text-[#0f172a]">
									{DAILY_LIMIT} tracks
								</p>
							</div>
							<div className="rounded-xl border border-[black]/10 bg-[#f8fafb] p-3">
								<p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
									Upload Cost
								</p>
								<p className="mt-1 text-[15px] font-extrabold text-[#0f172a]">
									{UPLOAD_COST} VAYLA
								</p>
							</div>
						</div>

						<div className="mt-2 flex items-center justify-between rounded-xl border border-[black]/10 bg-[#f8fafb] p-3">
							<div>
								<p className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8]">
									Platform Balance
								</p>
								<p className="mt-1 text-[15px] font-extrabold text-[#0f172a]">
									{PLATFORM_BALANCE} VAYLA
								</p>
							</div>
							<div className="flex size-9 items-center justify-center rounded-full bg-primary">
								<span className="text-sm font-extrabold text-white">V</span>
							</div>
						</div>
					</div>

					{/* Submit button */}
					<div className="pb-6">
						<button
							type="submit"
							disabled={isSubmitting}
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
				<FailedOverlay onRetry={handleRetry} onClose={() => setOverlayState("idle")} />
			)}
		</>
	);
}
