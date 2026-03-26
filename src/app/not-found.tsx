import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 text-center">
			<p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">404</p>
			<h1 className="mt-3 text-2xl font-extrabold text-white">Page not found</h1>
			<p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
				The page you’re looking for doesn’t exist or was moved.
			</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row">
				<Link
					href="/"
					className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition hover:opacity-90"
				>
					Back to Home
				</Link>
				<Link
					href="/discovery"
					className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
				>
					Discovery
				</Link>
			</div>
		</div>
	);
}
