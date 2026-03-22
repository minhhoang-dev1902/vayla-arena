"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/share/components/ui/button";

const TEAL = "#14b8a6";

type OverlayState = "idle" | "confirming" | "success" | "failed";

const CRITERIA = [
	"Music is under 1 minute",
	"Video is uploaded to YouTube",
	"This is original content",
	"Maximum 2 uploads per musician",
] as const;

const GENRES = [
	"Pop",
	"Hip-Hop",
	"R&B",
	"Electronic",
	"Rock",
	"Jazz",
	"Classical",
	"Lo-fi",
	"Indie",
	"Other",
] as const;

const uploadSchema = z.object({
	genre: z.string().optional(),
	description: z.string().max(500).optional(),
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

/* ── Confirming overlay ── */
function ConfirmingOverlay() {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#eaf9f7] via-[#f4fdfb] to-white px-6 py-14">
			<div className="flex-1" />

			<div className="flex flex-col items-center">
				<div className="relative flex size-36 items-center justify-center">
					<div className="absolute inset-0 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-[#14b8a6]/15" />
					<div className="absolute inset-3 rounded-full border border-[#14b8a6]/10 bg-[#14b8a6]/5" />
					<div className="relative flex size-24 items-center justify-center rounded-full border-4 border-[#14b8a6] bg-[#d7f2ef] shadow-[0_0_0_10px_rgba(20,184,166,0.08),0_20px_45px_rgba(20,184,166,0.15)]">
						<span className="text-5xl font-semibold" style={{ color: TEAL }}>
							V
						</span>
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
							background: `linear-gradient(90deg, ${TEAL}, #0d9488)`,
							animation: "upload-progress 2s ease-in-out infinite",
						}}
					/>
				</div>
				<p className="mt-5 flex items-center justify-center gap-2 text-sm text-[#83919a]">
					<span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: TEAL }} />
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

/* ── Success overlay ── */
function SuccessOverlay({
	onViewUpload,
	onClose,
}: {
	onViewUpload: () => void;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-[200] flex flex-col items-center bg-gradient-to-b from-[#e8faf8] via-[#f0fdfa] to-white px-6 pt-20 pb-8">
			<div className="flex flex-col items-center">
				<div className="flex size-16 items-center justify-center rounded-full bg-[#ccfbf1] shadow-md shadow-[#14b8a6]/10">
					<CheckCircle2 className="size-9" style={{ color: TEAL }} />
				</div>

				<h1 className="mt-8 text-center text-[26px] leading-tight font-extrabold text-[#184f4d]">
					Upload Submitted
					<br />
					Successfully 🎉
				</h1>
				<p className="mt-4 text-center text-sm text-[#0d9893]">
					Your track has been recorded on-chain.
				</p>
			</div>

			<div className="mt-auto w-full max-w-sm pt-8">
				<button
					type="button"
					onClick={onViewUpload}
					className="flex h-13 w-full items-center justify-center rounded-full text-sm font-extrabold tracking-wider text-white transition active:scale-[0.98]"
					style={{
						background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
					}}
				>
					View My Upload
				</button>
				<button
					type="button"
					onClick={onClose}
					className="mt-3 flex h-13 w-full items-center justify-center text-sm font-extrabold tracking-wider text-[#64748b] transition hover:text-[#475569]"
				>
					Close
				</button>
			</div>
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
				<p className="mt-2 text-center text-base font-semibold" style={{ color: TEAL }}>
					No VAYLA was used.
				</p>
				<p className="mt-6 text-center text-sm leading-relaxed text-[#94a3b8]">
					Your digital assets remain secure in
					<br />
					your wallet. The network was unable to
					<br />
					process this request at the moment.
				</p>
			</div>

			<div className="mt-auto w-full max-w-sm pt-8">
				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={onClose}
						className="flex h-13 items-center justify-center rounded-full border border-[#14b8a6] text-sm font-extrabold tracking-wider transition hover:bg-[#f0fdfa]"
						style={{ color: TEAL }}
					>
						Close
					</button>
					<button
						type="button"
						onClick={onRetry}
						className="flex h-13 items-center justify-center gap-2 rounded-full text-sm font-extrabold tracking-wider text-white transition active:scale-[0.98]"
						style={{
							background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #0f766e 100%)",
						}}
					>
						<RefreshCw className="size-4" />
						Try Again
					</button>
				</div>
			</div>
		</div>
	);
}

/* ── Step indicator ── */
function StepIndicator({ step }: { step: 1 | 2 }) {
	return (
		<div className="flex flex-col items-end gap-1.5">
			<span className="text-xs font-bold uppercase tracking-wide text-primary">
				Step {step} of 2
			</span>
			<div className="h-1 w-16 overflow-hidden rounded-full bg-primary/20">
				<div
					style={{ width: step === 1 ? "50%" : "100%" }}
					className="h-full rounded-full bg-primary transition-all duration-300"
				/>
			</div>
		</div>
	);
}

/* ── Step 1 ── */
function StepOne({ onContinue }: { onContinue: () => void }) {
	return (
		<div className="flex h-full flex-col gap-6">
			<div className="flex items-start justify-between">
				<h1 className="text-2xl font-bold leading-tight text-card-foreground">
					Upload Your
					<br />
					Music
				</h1>
				<StepIndicator step={1} />
			</div>

			<div>
				<p className="text-sm font-semibold text-primary">[February Theme]</p>
				<p className="text-sm font-bold text-card-foreground">Short-form Ready Music</p>
				<p className="mt-2 text-xs leading-relaxed text-muted-foreground">
					Please ensure your content meets the following criteria for this discovery pool.
				</p>
			</div>

			<ul className="flex flex-col gap-3">
				{CRITERIA.map(item => (
					<li key={item} className="flex items-center gap-3">
						<CheckCircle2 className="size-6 shrink-0 text-primary" />
						<span className="text-sm text-card-foreground">{item}</span>
					</li>
				))}
			</ul>

			<div className="rounded-xl border border-border bg-card p-4">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
						<span className="text-lg font-bold text-primary">V</span>
					</div>
					<div>
						<p className="text-sm font-semibold text-card-foreground">
							Total cost: 1 VAYLA + Network Fee
						</p>
						<p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
							<CheckCircle2 className="size-3.5" />
							No BNB required
						</p>
					</div>
				</div>
			</div>

			<p className="text-xs leading-relaxed text-muted-foreground">
				<CheckCircle2 className="mr-1 inline size-3 text-muted-foreground" />
				Your transaction will be processed on the VAYLA Discovery network securely and
				transparently.
			</p>

			<div className="mt-auto flex flex-col gap-3 pb-1">
				<Button
					type="button"
					onClick={onContinue}
					className="w-full rounded-xl bg-primary py-8 text-xl font-bold text-primary-foreground"
				>
					Continue
				</Button>
				<Button
					asChild
					variant="outline"
					className="w-full rounded-xl py-8 text-xl font-bold text-primary-foreground"
				>
					<Link href="/discovery">Cancel</Link>
				</Button>
			</div>
		</div>
	);
}

/* ── Step 2 ── */
function StepTwo({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UploadFormValues>({
		resolver: zodResolver(uploadSchema),
		defaultValues: {
			genre: "",
			trackTitle: "",
			artistName: "",
			youtubeUrl: "",
			description: "",
		},
	});

	const handleFormSubmit = async () => {
		onSubmit();
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col gap-6">
			<div className="flex items-start justify-between">
				<h1 className="text-2xl font-bold leading-tight text-card-foreground">Upload Your Music</h1>
				<StepIndicator step={2} />
			</div>

			<div>
				<p className="text-sm font-semibold text-primary">[February Theme]</p>
				<p className="text-sm font-bold text-card-foreground">Short-form Ready Music</p>
			</div>

			<fieldset disabled={isSubmitting} className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
				<div className="flex flex-col gap-1.5">
					<label htmlFor="trackTitle" className="text-sm font-semibold text-card-foreground">
						Track Title <span className="font-normal text-muted-foreground">(Required)</span>
					</label>
					<input
						id="trackTitle"
						{...register("trackTitle")}
						placeholder="Enter track title"
						className="rounded-xl border border-primary/45 bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
					/>
					{errors.trackTitle && (
						<p className="text-xs text-destructive">{errors.trackTitle.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label htmlFor="artistName" className="text-sm font-semibold text-card-foreground">
						Artist Name <span className="font-normal text-muted-foreground">(Required)</span>
					</label>
					<input
						id="artistName"
						{...register("artistName")}
						placeholder="Enter artist name"
						className="rounded-xl border border-primary/45 bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
					/>
					{errors.artistName && (
						<p className="text-xs text-destructive">{errors.artistName.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label htmlFor="youtubeUrl" className="text-sm font-semibold text-card-foreground">
						YouTube URL <span className="font-normal text-muted-foreground">(Required)</span>
					</label>
					<input
						id="youtubeUrl"
						{...register("youtubeUrl")}
						placeholder="https://youtube.com/watch?v=..."
						className="rounded-xl border border-primary/45 bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
					/>
					{errors.youtubeUrl && (
						<p className="text-xs text-destructive">{errors.youtubeUrl.message}</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<label htmlFor="genre" className="text-sm font-semibold text-card-foreground">
						Genre <span className="font-normal text-muted-foreground">(Optional)</span>
					</label>
					<div className="relative">
						<select
							id="genre"
							{...register("genre")}
							defaultValue=""
							className="w-full appearance-none rounded-xl border border-primary/45 bg-card px-4 py-3 text-sm text-card-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
						>
							<option value="" disabled>
								Select a genre
							</option>
							{GENRES.map(g => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
						<ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					</div>
				</div>

				<div className="flex flex-col gap-1.5">
					<label htmlFor="description" className="text-sm font-semibold text-card-foreground">
						Description <span className="font-normal text-muted-foreground">(Optional)</span>
					</label>
					<textarea
						id="description"
						{...register("description")}
						rows={3}
						placeholder="Tell us about this track..."
						className="resize-none rounded-xl border border-primary/45 bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 focus:outline-none"
					/>
				</div>
			</fieldset>

			<div className="mt-auto grid grid-cols-2 gap-3 pb-1">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-xl bg-primary py-6 text-base font-bold text-primary-foreground"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="size-5 animate-spin" />
							Submitting...
						</>
					) : (
						"Submit & Pay"
					)}
				</Button>
				<Button
					type="button"
					onClick={onBack}
					variant="outline"
					disabled={isSubmitting}
					className="w-full rounded-xl py-6 text-base font-medium"
				>
					Back
				</Button>
			</div>
		</form>
	);
}

/* ── Main page ── */
export default function DiscoveryUploadPage() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2>(1);
	const [overlayState, setOverlayState] = useState<OverlayState>("idle");
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const submitUpload = useCallback(() => {
		setOverlayState("confirming");
		timerRef.current = setTimeout(() => {
			const success = Math.random() > 0.2;
			setOverlayState(success ? "success" : "failed");
		}, 3000);
	}, []);

	const handleRetry = useCallback(() => {
		submitUpload();
	}, [submitUpload]);

	return (
		<>
			<div className="flex h-full flex-col px-5 py-8">
				{step === 1 ? (
					<StepOne onContinue={() => setStep(2)} />
				) : (
					<StepTwo onBack={() => setStep(1)} onSubmit={submitUpload} />
				)}
			</div>

			{overlayState === "confirming" && <ConfirmingOverlay />}

			{overlayState === "success" && (
				<SuccessOverlay
					onViewUpload={() => router.push("/discovery")}
					onClose={() => router.push("/discovery")}
				/>
			)}

			{overlayState === "failed" && (
				<FailedOverlay onRetry={handleRetry} onClose={() => setOverlayState("idle")} />
			)}
		</>
	);
}
