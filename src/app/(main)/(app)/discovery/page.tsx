import {
	BadgeCheck,
	CheckCircle2,
	Music,
	Play,
	Shield,
	Star,
	TrendingUp,
	Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import iconCheck from "@/assets/icons/icon-check-circle.svg";
import discoveryHeroImage from "@/assets/images/card_discovery.png";
import { Button } from "@/share/components/ui/button";
import { DiscoveringNowCarousel } from "./_components/discovering-now";

const HOT_THIS_MONTH = [
	{ rank: 1, artist: "LUMINA FLOW", title: "Neon Horizons" },
	{ rank: 2, artist: "ECHO SOUL", title: "Bassline Drift" },
	{ rank: 3, title: "Crystal Dreams", artist: "MIDNIGHT SYNTH" },
];

const DISCOVERING_NOW = [
	{ rank: 1, votes: 542, artist: "AURORA", title: "Starlight" },
	{ rank: 2, votes: 418, artist: "COAST", title: "Ocean Drive" },
	{ rank: 3, votes: 391, artist: "PULSE", title: "Electric Dreams" },
	{ rank: 4, votes: 980, artist: "IGNIS NOVA", title: "Solar Flare" },
	{ rank: 5, votes: 750, artist: "CYBER NEON", title: "Midnight City" },
	{ rank: 6, votes: 420, title: "Velvet Sky", artist: "ETHERIAL CLOUDS" },
	{ rank: 7, votes: 610, artist: "NOVA LANE", title: "Sidewalk Satellites" },
	{ rank: 8, votes: 365, artist: "MOONBYTE", title: "Lunar Loop" },
	{ rank: 9, votes: 520, artist: "AQUA VIBE", title: "Tide Runner" },
	{ rank: 10, votes: 290, artist: "EMBERLINE", title: "Heatwave Letters" },
	{ rank: 11, votes: 735, title: "Colorwave", artist: "PRISM RIVER" },
	{ rank: 12, votes: 455, artist: "WAVEFORM", title: "Signal Bloom" },
	{ rank: 13, votes: 315, title: "Night Map", artist: "DUSK ATLAS" },
	{ rank: 14, votes: 620, title: "Bloom Error", artist: "GLITCH GARDEN" },
	{ rank: 15, votes: 840, title: "Cosmic Pop", artist: "SATURN SODA" },
	{ rank: 16, votes: 250, title: "Radio Sunrise", artist: "SKYWARD STATIC" },
	{ rank: 17, votes: 410, title: "Plasma Kisses", artist: "VIOLET CIRCUIT" },
	{ rank: 18, votes: 560, artist: "ECHO LAGOON", title: "Shoreline Echo" },
	{ rank: 19, votes: 330, artist: "ORBITAL ROSES", title: "Garden of Gravity" },
	{ rank: 20, votes: 690, artist: "VOLT VELVET", title: "Afterglow Run" },
];

const HERO_CHECKS = [
	{ label: "Max 1 min" },
	{ label: "Original Video" },
	{ label: "Ends Feb 28" },
	{ label: "Top 3 Prizes" },
] as const;

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
								<p className="mt-1 text-md text-muted-foreground">Short-Form Music</p>
								<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
									Create music made to move emotions in under one minute.
								</p>
							</div>

							<div className="grid grid-cols-2 gap-x-6 gap-y-3">
								{HERO_CHECKS.map(item => (
									<div key={item.label} className="flex items-center gap-2">
										<CheckCircle2 className={`size-4 text-white`} />
										<span className="text-sm text-foreground/90">{item.label}</span>
									</div>
								))}
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

			<div className="flex flex-col gap-6 px-4 mt-4">
				{/* Discovering Now */}
				<DiscoveringNowCarousel items={DISCOVERING_NOW} />

				<div className="flex flex-col gap-6 mt-6">
					{/* Why VAYLA Discovery? */}
					<section>
						<h2 className="text-base font-semibold text-card-foreground">Why VAYLA Discovery?</h2>
						<p className="text-sm leading-relaxed text-muted-foreground bg-foreground rounded-xl p-4">
							VAYLA Discovery is where fans discover new artists and musicians get heard. Upload
							your short-form music, climb the ranks with community votes, and earn rewards—all
							powered on-chain for transparency and fairness.
						</p>
					</section>

					{/* How It Works */}
					<section>
						<h2 className="text-base font-semibold text-card-foreground">How It Works?</h2>
						<div className="flex flex-col gap-4">
							<div className="rounded-xl border border-border bg-card p-4 shadow-lg">
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
							<div className="rounded-xl border border-border bg-card p-4 shadow-lg">
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
						<h2 className="text-base font-extrabold uppercase tracking-wide text-card-foreground">
							Why It&apos;s Worth It?
						</h2>
						<div className="flex flex-col gap-3">
							<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
								<div className="mb-3 flex items-center gap-3">
									<Star className="size-5 shrink-0 text-card-foreground" />
									<p className="text-sm font-extrabold text-card-foreground">
										Rewards for Musicians
									</p>
								</div>
								<ol className="space-y-2 text-sm text-card-foreground">
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full  text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>1. USDT rewards &amp; official NFTs</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full  text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>2. Platform support and exposure</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full  text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>3. Qualification for semi-annual finals</span>
									</li>
								</ol>
							</div>

							<div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
								<div className="mb-3 flex items-center gap-3">
									<BadgeCheck className="size-5 shrink-0 text-card-foreground" />
									<p className="text-sm font-extrabold text-card-foreground">Rewards for Users</p>
								</div>
								<ol className="space-y-2 text-sm text-card-foreground">
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>1. Free voting participation</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>2. Discovery NFTs</span>
									</li>
									<li className="flex items-start gap-3">
										<span className="mt-0.5 flex size-5 items-center justify-center rounded-full text-card">
											<Image width={15} alt="Check" height={15} src={iconCheck} />
										</span>
										<span>3. On-chain proof of participation</span>
									</li>
								</ol>
							</div>
						</div>
					</section>

					{/* Why On-Chain Matters? */}
					<section>
						<div className="mb-2 flex items-center gap-2">
							<h2 className="text-[black] font-bold uppercase tracking-wide">
								Why On-Chain Matters?
							</h2>
						</div>
						<div className="rounded-xl bg-background p-5 text-foreground flex flex-col gap-2 items-center justify-center">
							<Shield className="size-5 text-primary" />
							<p>Trust is On-Chain</p>
							<p className="text-sm leading-relaxed text-muted-foreground text-center">
								Every vote and upload is recorded on-chain. Transparent, tamper-proof rankings and
								rewards—so artists and fans get a fair, verifiable ecosystem.
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
