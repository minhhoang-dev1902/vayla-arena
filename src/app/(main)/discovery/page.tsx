import { CheckCircle2, Music, Play, Shield, TrendingUp, Upload, Vote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import discoveryHeroImage from "@/assets/images/card_discovery.png";
import { Button } from "@/share/components/ui/button";

const HOT_THIS_MONTH = [
	{ rank: 1, artist: "LUMINA FLOW", title: "Neon Horizons" },
	{ rank: 2, artist: "ECHO SOUL", title: "Bassline Drift" },
	{ rank: 3, title: "Crystal Dreams", artist: "MIDNIGHT SYNTH" },
];

const DISCOVERING_NOW = [
	{ rank: 1, votes: 542, artist: "AURORA", title: "Starlight" },
	{ rank: 2, votes: 418, artist: "COAST", title: "Ocean Drive" },
	{ rank: 3, votes: 391, artist: "PULSE", title: "Electric Dreams" },
];

export default function DiscoveryPage() {
	return (
		<div className="flex flex-col pb-24">
			{/* Hero (matches mock flow) */}
			<section>
				<div className="relative overflow-hidden  border border-border bg-background text-foreground shadow-sm">
					<Image
						fill
						alt=""
						src={discoveryHeroImage}
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 768px"
					/>
					<div className="absolute inset-0 bg-background/35" />

					<div className="relative z-10 p-4">
						<div className="flex flex-col gap-5 rounded-3xl border border-border bg-background/45 p-5 backdrop-blur-xl">
							<span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
								February Edition
							</span>

							<div>
								<h1 className="text-3xl font-bold leading-tight">VAYLA Discovery</h1>
								<p className="mt-1 text-sm text-muted-foreground">Short-Form Music</p>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									Create music made to move emotions in under one minute.
								</p>
							</div>

							<div className="grid grid-cols-2 gap-x-6 gap-y-3">
								<div className="flex items-center gap-2">
									<CheckCircle2 className="size-4 text-primary" />
									<span className="text-sm text-foreground/90">Max 1 min</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="size-4 text-primary" />
									<span className="text-sm text-foreground/90">Original Video</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="size-4 text-primary" />
									<span className="text-sm text-foreground/90">Ends Feb 28</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="size-4 text-primary" />
									<span className="text-sm text-foreground/90">Top 3 Prizes</span>
								</div>
							</div>

							<div className="flex flex-col gap-3">
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold uppercase tracking-wide text-foreground">
										Hot This Month
									</p>
									<TrendingUp className="size-4 text-muted-foreground" />
								</div>

								<div className="flex flex-col gap-2 rounded-2xl border border-border bg-foreground/10 p-3">
									{HOT_THIS_MONTH.map(item => {
										const isHighlighted = item.rank === 3;
										return (
											<div
												key={item.rank}
												className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${
													isHighlighted
														? "border border-primary/60 bg-foreground/10"
														: "bg-foreground/5"
												}`}
											>
												<div className="flex size-9 items-center justify-center rounded-full bg-foreground/10">
													<Play className="size-4 text-foreground/80" />
												</div>
												<div className="min-w-0">
													<p className="truncate text-sm font-semibold text-foreground">
														<span className="mr-1 text-primary">#{item.rank}</span>
														{item.title}
													</p>
													<p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
														{item.artist}
													</p>
												</div>
											</div>
										);
									})}
								</div>

								<Button
									asChild
									className="text-sm mt-4 w-full rounded-xl bg-primary py-7 font-bold uppercase tracking-wide text-primary-foreground shadow-lg hover:bg-primary/90"
								>
									<Link href="/discovery/upload" className="flex items-center justify-center gap-2">
										<Upload className="size-5" />
										Upload as a musician
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="flex flex-col gap-8 px-4 mt-4">
				{/* Discovering Now */}
				<section>
					<div className="">
						<h2 className="font-extrabold text-card-foreground text-lg">Discovering Now</h2>
						<p className="text-muted-foreground text-sm">Trending tracks in the ecosystem</p>
					</div>
					<ul className="flex flex-col gap-2 rounded-xl border border-border p-3">
						{DISCOVERING_NOW.map(item => (
							<li
								key={item.rank}
								className="flex items-center justify-between rounded-lg px-3 py-2.5"
							>
								<div className="flex items-center gap-3">
									<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
										{item.rank}
									</span>
									<div>
										<p className="font-medium text-card-foreground">{item.title}</p>
										<p className="text-xs text-muted-foreground">{item.artist}</p>
									</div>
								</div>
								<span className="text-xs font-medium text-primary">{item.votes} votes</span>
							</li>
						))}
					</ul>
				</section>

				{/* CTA Vote */}
				<Button
					asChild
					className="w-full rounded-xl bg-primary py-4 font-medium uppercase tracking-wide text-primary-foreground"
				>
					<Link href="/discovery/vote" className="flex items-center gap-2">
						<Vote className="size-5" />
						Vote For This Rank
					</Link>
				</Button>

				{/* Why VAYLA Discovery? */}
				<section>
					<h2 className="mb-3 text-base font-semibold text-card-foreground">
						Why VAYLA Discovery?
					</h2>
					<p className="text-sm leading-relaxed text-muted-foreground">
						VAYLA Discovery is where fans discover new artists and musicians get heard. Upload your
						short-form music, climb the ranks with community votes, and earn rewards—all powered
						on-chain for transparency and fairness.
					</p>
				</section>

				{/* How It Works */}
				<section>
					<h2 className="mb-3 text-base font-semibold text-card-foreground">How It Works?</h2>
					<div className="flex flex-col gap-4">
						<div className="rounded-xl border border-border bg-card p-4">
							<h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
								<Music className="size-4" />
								For Musicians
							</h3>
							<ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
								<li>Upload your track (under 1 min, YouTube link)</li>
								<li>Get discovered by the community</li>
								<li>Advance on the chart and earn rewards</li>
							</ol>
						</div>
						<div className="rounded-xl border border-border bg-card p-4">
							<h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
								<TrendingUp className="size-4" />
								For Users
							</h3>
							<ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
								<li>Discover new music on the chart</li>
								<li>Vote for your top picks (rank your top 3)</li>
								<li>Earn Discovery Perks and on-chain proof</li>
							</ol>
						</div>
					</div>
				</section>

				{/* Why It's Worth It? */}
				<section>
					<h2 className="mb-3 text-base font-semibold text-card-foreground">
						Why It&apos;s Worth It?
					</h2>
					<div className="flex flex-col gap-3">
						<div className="rounded-xl border border-border bg-primary/10 p-4">
							<p className="mb-2 text-sm font-medium text-card-foreground">For Musicians</p>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>• USDT rewards for top rankings</li>
								<li>• Limited NFT mints for chart toppers</li>
							</ul>
						</div>
						<div className="rounded-xl border border-border bg-secondary/10 p-4">
							<p className="mb-2 text-sm font-medium text-card-foreground">For Users</p>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>• Ranking participation rewards</li>
								<li>• Discovery Perks and exclusive access</li>
							</ul>
						</div>
					</div>
				</section>

				{/* Why On-Chain Matters? */}
				<section>
					<div className="rounded-xl bg-background p-5 text-foreground">
						<div className="mb-2 flex items-center gap-2">
							<Shield className="size-5 text-primary" />
							<h2 className="text-base font-semibold">Why On-Chain Matters?</h2>
						</div>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Every vote and upload is recorded on-chain. Transparent, tamper-proof rankings and
							rewards—so artists and fans get a fair, verifiable ecosystem.
						</p>
					</div>
				</section>
			</div>
		</div>
	);
}
