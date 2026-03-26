"use client";

import { useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 400;

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const [showContent, setShowContent] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		timerRef.current = setTimeout(() => setShowContent(true), DEBOUNCE_MS);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const debouncedReset = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		setShowContent(false);
		timerRef.current = setTimeout(() => setShowContent(true), DEBOUNCE_MS);
		reset();
	};

	return (
		<div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center">
			{!showContent ? (
				<div className="flex flex-col items-center gap-3">
					<div
						className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
						aria-hidden
					/>
					<p className="text-sm text-white/50">Checking what went wrong…</p>
				</div>
			) : (
				<>
					<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-red-400/90">Error</p>
					<h1 className="mt-3 text-2xl font-extrabold text-white">Something went wrong</h1>
					<p className="mt-2 max-w-md text-sm leading-relaxed text-white/55">
						An unexpected error occurred. You can try again or return to the home page.
					</p>
					{process.env.NODE_ENV === "development" && error.message ? (
						<pre className="mt-4 max-h-32 max-w-full overflow-auto rounded-lg border border-white/10 bg-white/5 p-3 text-left text-xs text-red-300/90">
							{error.message}
						</pre>
					) : null}
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={debouncedReset}
							className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:opacity-90"
						>
							Try again
						</button>
						<a
							href="/"
							className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
						>
							Back to Home
						</a>
					</div>
				</>
			)}
		</div>
	);
}
