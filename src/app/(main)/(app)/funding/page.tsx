import { BarChart3, Gift, Info, Play, Sparkles, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import fundingHeroImage from "@/assets/images/water-bomb.png";
import { Button } from "@/share/components/ui/button";

export default function FundingDetailPage() {
	return (
		<div className="flex flex-col pb-8">
			{/* Hero */}
			<div className="relative aspect-[16/10] w-full overflow-hidden rounded-b-2xl">
				<Image
					fill
					alt="Waterbomb 2026 Hong Kong"
					src={fundingHeroImage}
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 768px"
				/>
				<div className="absolute inset-0 bg-background/30" />
				<span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
					LIVE
				</span>
			</div>

			<div className="flex flex-col gap-6 px-4 pt-6">
				{/* Title */}
				<div className="flex flex-col gap-1 text-center">
					<h1 className="text-2xl font-bold text-card-foreground">Waterbomb 2026 in Hong Kong</h1>
					<p className="text-sm text-muted-foreground">
						Global K-Pop & Water Festival Crowdfunding
					</p>
				</div>

				{/* Funding Summary */}
				<section>
					<div className="mb-3 flex items-center gap-2">
						<BarChart3 className="size-4 text-primary" />
						<h2 className="text-base font-semibold text-card-foreground">Funding Summary</h2>
					</div>
					<div className="rounded-xl bg-muted/30 p-4">
						<div className="grid gap-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total Goal</span>
								<span className="font-medium text-primary">$10,000</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">PERIOD</span>
								<span className="text-card-foreground">Feb 20 – Mar 31, 2026</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">STATUS</span>
								<span className="flex items-center gap-1.5 text-card-foreground">
									<span className="size-1.5 rounded-full bg-primary" />
									Active
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">MINIMUM</span>
								<span className="text-card-foreground">$100</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">MAXIMUM</span>
								<span className="text-card-foreground">$10,000</span>
							</div>
						</div>
					</div>
				</section>

				{/* Rewards */}
				<section>
					<div className="mb-3 flex items-center gap-2">
						<Gift className="size-4 text-primary" />
						<h2 className="text-base font-semibold text-card-foreground">Rewards</h2>
					</div>
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
								<Wallet className="size-5 text-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="font-medium text-card-foreground">5% USDT Reward</p>
								<p className="text-xs text-muted-foreground">Distributed after settlement.</p>
							</div>
							<span className="text-primary">✓</span>
						</div>
						<div className="flex items-center gap-3 rounded-xl border border-dashed border-primary/60 bg-primary/5 p-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/30">
								<div className="size-4 rounded-full border-2 border-primary" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="font-medium text-card-foreground">2.5% VAYLA Token Reward</p>
								<p className="text-xs text-muted-foreground">Platform utility token bonus.</p>
							</div>
							<span className="text-primary">✓</span>
						</div>
						<div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
								<Sparkles className="size-5 text-amber-600" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="font-medium text-card-foreground">Waterbomb 2026 NFT</p>
								<p className="text-xs text-muted-foreground">Limited edition collectible.</p>
							</div>
							<span className="text-primary">✓</span>
						</div>
					</div>
				</section>

				{/* Exclusive Participant Benefits */}
				<section>
					<div className="mb-3 flex items-center gap-2">
						<Sparkles className="size-4 text-primary" />
						<h2 className="text-base font-semibold text-card-foreground">
							Exclusive Participant Benefits
						</h2>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 p-4 text-center">
							<span className="text-2xl font-bold text-primary">50%</span>
							<span className="text-xs font-medium text-card-foreground">
								Ticket Purchase Benefit
							</span>
						</div>
						<div className="flex flex-col items-center gap-2 rounded-xl bg-primary/20 p-4 text-center">
							<Play className="size-8 fill-primary text-primary" />
							<span className="text-xs font-medium text-card-foreground">
								Behind-the-scenes Videos
							</span>
						</div>
						<div className="flex flex-col items-center gap-2 rounded-xl bg-secondary/20 p-4 text-center">
							<Sparkles className="size-8 text-secondary" />
							<span className="text-xs font-medium text-card-foreground">Lucky Draw</span>
							<span className="text-[10px] text-muted-foreground">
								DJ-signed merchandise lottery entry
							</span>
						</div>
					</div>
				</section>

				{/* Note */}
				<div className="flex gap-2 rounded-lg bg-muted/30 p-3">
					<Info className="size-4 shrink-0 text-muted-foreground" />
					<p className="text-xs text-muted-foreground">
						Rewards are scheduled to be distributed on May 30, 2026, after ticket sales and
						settlement are completed.
					</p>
				</div>

				{/* CTA */}
				<Button
					asChild
					className="w-full rounded-xl bg-primary py-4 font-medium text-primary-foreground shadow-lg hover:bg-primary/90"
				>
					<Link href="/funding/participate" className="flex items-center justify-center gap-2">
						Participate in Web3.0 Funding
						<svg
							aria-hidden
							className="size-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Next</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</Link>
				</Button>
			</div>
		</div>
	);
}
