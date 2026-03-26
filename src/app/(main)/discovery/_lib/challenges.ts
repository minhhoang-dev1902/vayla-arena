import type {
	DiscoveryChallengeApiItem,
	DiscoveryChallengesListResponse,
} from "@/features/discovery/types/discovery.types";
import type { DiscoveryTrack } from "./tracks";

export interface DiscoveryChallenge {
	id: string;
	title: string;
	endsIn: string;
	period: string;
	reward: string;
	eventId?: string;
	subtitle: string;
	isActive: boolean;
	coverImage: string;
	description: string;
	submissions: number;
	featuredTracks: DiscoveryTrack[];
}

function formatVaylaPrizePool(raw: string): string {
	const n = Number.parseFloat(raw);
	if (Number.isNaN(n)) return `${raw.trim()} VAYLA`;
	return `${Math.round(n).toLocaleString("en-US")} VAYLA`;
}

function formatChallengePeriod(startIso: string, endIso: string): string {
	const s = new Date(startIso);
	const e = new Date(endIso);
	const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
	return `${s.toLocaleDateString("en-US", opts)} - ${e.toLocaleDateString("en-US", opts)}`;
}

function formatCountdownTo(targetMs: number, nowMs: number): string {
	const diff = Math.max(0, targetMs - nowMs);
	const day = 86_400_000;
	const hour = 3_600_000;
	const minute = 60_000;
	const days = Math.floor(diff / day);
	const hours = Math.floor((diff % day) / hour);
	const minutes = Math.floor((diff % hour) / minute);
	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${minutes}m`;
	if (minutes > 0) return `${minutes}m`;
	return "<1m";
}

function formatChallengeEndsIn(item: DiscoveryChallengeApiItem, now: Date): string {
	const start = new Date(item.startDate).getTime();
	const end = new Date(item.endDate).getTime();
	const nowMs = now.getTime();
	if (nowMs > end) return "Ended";
	if (nowMs < start) return `${formatCountdownTo(start, nowMs)} until open`;
	return formatCountdownTo(end, nowMs);
}

export function mapDiscoveryApiChallengeToDiscoveryChallenge(
	item: DiscoveryChallengeApiItem,
	now = new Date(),
): DiscoveryChallenge {
	const start = new Date(item.startDate);
	const end = new Date(item.endDate);
	const nowMs = now.getTime();
	const isActive = nowMs >= start.getTime() && nowMs <= end.getTime();
	const slugOrId = item.slug?.trim() || item.eventId;

	return {
		isActive,
		id: slugOrId,
		title: item.name,
		featuredTracks: [],
		eventId: item.eventId,
		coverImage: item.thumbnailUrl,
		description: item.description,
		submissions: item.submissionCount,
		endsIn: formatChallengeEndsIn(item, now),
		reward: formatVaylaPrizePool(item.vaylaPrizePool),
		subtitle: `CHALLENGE • ${item.contentType.toUpperCase()}`,
		period: formatChallengePeriod(item.startDate, item.endDate),
	};
}

export function mapDiscoveryChallengesListFromApi(
	response: DiscoveryChallengesListResponse,
	now = new Date(),
): DiscoveryChallenge[] {
	const rows = response.challenges ?? [];
	return rows.map(item => mapDiscoveryApiChallengeToDiscoveryChallenge(item, now));
}

export const MOCK_CHALLENGES: DiscoveryChallenge[] = [
	{
		id: "summer",
		isActive: true,
		submissions: 342,
		endsIn: "06d 11h",
		reward: "1,200 VAYLA",
		period: "Jun 02 - Jun 09",
		subtitle: "CHALLENGE • VAYLA ARENA",
		title: "Beat Battle: Summer Discovery",
		coverImage: "https://img.youtube.com/vi/PNu-lyOH7bk/maxresdefault.jpg",
		description:
			"Submit your best summer-inspired tracks and compete for community recognition and exclusive rewards. Shape the sound of the season.",
		featuredTracks: [
			{
				rank: 1,
				id: "s1",
				votes: 1200,
				artist: "Nova Rhyme",
				title: "Sunset Serum",
				challenge: "Beat Battle: Summer Discovery",
				youtubeUrl: "https://www.youtube.com/watch?v=PNu-lyOH7bk",
			},
			{
				rank: 2,
				id: "s2",
				votes: 980,
				artist: "Kairo Beats",
				title: "Ocean Drive Loop",
				challenge: "Beat Battle: Summer Discovery",
				youtubeUrl: "https://www.youtube.com/watch?v=ArmDp-zijuc",
			},
			{
				rank: 3,
				id: "s3",
				votes: 2400,
				title: "Tidal Groove",
				artist: "Luma Fields",
				challenge: "Beat Battle: Summer Discovery",
				youtubeUrl: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
			},
			{
				rank: 4,
				id: "s4",
				votes: 760,
				artist: "Echo Vale",
				title: "Neon Breeze",
				challenge: "Beat Battle: Summer Discovery",
				youtubeUrl: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
			},
		],
	},
	{
		id: "neon",
		isActive: true,
		submissions: 189,
		endsIn: "12d 03h",
		reward: "800 VAYLA",
		period: "Jun 10 - Jun 20",
		title: "Neon Nights Remix",
		subtitle: "CHALLENGE • VAYLA ARENA",
		coverImage: "https://img.youtube.com/vi/ArmDp-zijuc/maxresdefault.jpg",
		description:
			"Create a synth-driven remix that evokes a late-night city cruise. Neon lights, big bass, and endless vibes.",
		featuredTracks: [
			{
				rank: 1,
				id: "n1",
				votes: 1248,
				artist: "Kira Vale",
				title: "Midnight Drive",
				challenge: "Neon Nights Remix",
				youtubeUrl: "https://www.youtube.com/watch?v=PNu-lyOH7bk",
			},
			{
				rank: 2,
				id: "n2",
				votes: 619,
				artist: "Orion Pax",
				title: "Velvet Drive",
				challenge: "Neon Nights Remix",
				youtubeUrl: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
			},
		],
	},
	{
		id: "beat",
		isActive: false,
		endsIn: "Ended",
		submissions: 510,
		reward: "500 VAYLA",
		period: "May 20 - May 30",
		title: "Beat Lab: Lo-fi Edition",
		subtitle: "CHALLENGE • VAYLA ARENA",
		coverImage: "https://img.youtube.com/vi/fMcnFSzlfv4/maxresdefault.jpg",
		description:
			"Craft a chill lo-fi beat under 60 seconds. Vinyl crackle and soft keys encouraged.",
		featuredTracks: [
			{
				rank: 1,
				id: "b1",
				votes: 431,
				artist: "Elyx Rain",
				title: "Pulse Theory",
				challenge: "Beat Lab: Lo-fi Edition",
				youtubeUrl: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
			},
		],
	},
];

export function findChallengeById(
	id: string,
	list: DiscoveryChallenge[] = MOCK_CHALLENGES,
): DiscoveryChallenge | undefined {
	let decoded = id;
	try {
		decoded = decodeURIComponent(id);
	} catch {
		// keep raw id
	}
	return list.find(c => c.id === decoded || c.eventId === decoded);
}
