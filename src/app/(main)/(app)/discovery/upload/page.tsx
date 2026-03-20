"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/share/components/ui/button";

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
					className="w-full rounded-xl  py-8 text-xl font-bold text-primary-foreground"
				>
					<Link href="/discovery">Cancel</Link>
				</Button>
			</div>
		</div>
	);
}

function StepTwo({ onBack }: { onBack: () => void }) {
	const router = useRouter();
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

	const onSubmit = async () => {
		router.push("/discovery/upload/processing?result=success");
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col gap-6">
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

export default function DiscoveryUploadPage() {
	const [step, setStep] = useState<1 | 2>(1);

	return (
		<div className="flex h-full flex-col px-5 py-8">
			{step === 1 ? (
				<StepOne onContinue={() => setStep(2)} />
			) : (
				<StepTwo onBack={() => setStep(1)} />
			)}
		</div>
	);
}
