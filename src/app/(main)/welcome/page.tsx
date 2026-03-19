"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LogIn, Wallet } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/share/components/ui/button";

export default function WelcomePage() {
	const router = useRouter();
	const { ready, authenticated } = usePrivy();

	useEffect(() => {
		if (ready && authenticated) {
			router.replace("/");
		}
	}, [ready, authenticated, router]);

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden bg-[#020816] px-6 pb-8 pt-12 text-white">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_14%,rgba(37,229,221,0.28),transparent_34%),radial-gradient(circle_at_50%_42%,rgba(13,63,88,0.45),transparent_62%),linear-gradient(180deg,#05142a_0%,#010714_100%)]" />

			<div className="relative z-10 mx-auto flex h-full w-full max-w-sm flex-1 flex-col">
				<div className="mx-auto mt-2 flex h-56 w-56 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(21,65,80,0.58)_0%,rgba(7,20,36,0.9)_72%)] shadow-[0_0_120px_rgba(45,231,227,0.25)]">
					<div className="relative h-24 w-[172px]">
						<div className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-white/40" />
						<div className="absolute left-1/2 top-1/2 h-16 w-full -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-t border-white/45 opacity-95" />
						<div className="absolute left-1/2 top-1/2 h-20 w-full -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-b border-white/25 opacity-70" />
						<div className="absolute left-1/2 top-1/2 h-12 w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-t border-white/30 opacity-90" />
					</div>
				</div>

				<div className="mt-10 text-center">
					<p className="text-4xl font-bold tracking-tight sm:text-5xl">Welcome to</p>
					<h1 className="mt-1 text-5xl font-extrabold tracking-tight text-[#1ce8d7] sm:text-6xl">
						VAYLA Arena
					</h1>
					<p className="mx-auto mt-6 max-w-[270px] text-lg leading-relaxed text-[#96acc4] sm:text-xl">
						Experience the future with our Web3 powered platform.
					</p>
				</div>

				<div className="mt-12 flex flex-col gap-3">
					<Button
						asChild
						className="h-11 rounded-xl bg-[linear-gradient(90deg,#2de8dc_0%,#119e9c_100%)] text-base font-semibold text-[#022531] hover:opacity-95"
					>
						<Link href="/connect-wallet" className="flex items-center justify-center gap-2">
							Connect Wallet
							<Wallet className="size-4" />
						</Link>
					</Button>

					<Button
						asChild
						variant="outline"
						className="h-11 rounded-xl border border-[#1fe1d4]/55 bg-transparent text-base font-semibold text-[#1fe1d4] hover:bg-[#1fe1d4]/10"
					>
						<Link href="/login" className="flex items-center justify-center gap-2">
							Log In with Email
							<LogIn className="size-4" />
						</Link>
					</Button>
				</div>

				<p className="mt-auto pt-14 text-center text-[10px] uppercase tracking-[0.65em] text-[#7f95ac]">
					Powered by VAYLA
				</p>
			</div>
		</div>
	);
}
