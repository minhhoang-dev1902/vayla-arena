import type {
	DiscoveryHotListResponse,
	DiscoveryHotTrack,
	DiscoveryTrackDetailApi,
} from "@/features/discovery/types/discovery.types";

export type DiscoveryTrack = {
	id: string;
	rank: number;
	title: string;
	votes: number;
	artist: string;
	challenge: string;
	youtubeUrl: string;
	thumbnail?: string;
};

export interface DiscoveryTrackDetail extends DiscoveryTrack {
	genre: string;
	likes: number;
	views: number;
	eventId: string;
	eventSlug: string;
	createdAt: string;
	userLiked: boolean;
	eventStatus: string;
	description: string;
	eventEndDate: string;
	lyrics: string | null;
	userVotesCast: number;
	eventPrizePool: string;
	eventStartDate: string;
}

export function mapDiscoveryTrackDetailApiToTrackDetail(
	t: DiscoveryTrackDetailApi,
): DiscoveryTrackDetail {
	return {
		rank: 0,
		genre: t.genre,
		lyrics: t.lyrics,
		likes: t.likeCount,
		views: t.viewCount,
		id: t.submissionId,
		eventId: t.eventId,
		title: t.trackTitle,
		artist: t.artistName,
		createdAt: t.createdAt,
		userLiked: t.userLiked,
		eventSlug: t.eventSlug,
		youtubeUrl: t.youtubeUrl,
		eventStatus: t.eventStatus,
		description: t.description,
		eventEndDate: t.eventEndDate,
		userVotesCast: t.userVotesCast,
		votes: Number(t.voteCount ?? 0),
		eventPrizePool: t.eventPrizePool,
		eventStartDate: t.eventStartDate,
		challenge: t.eventName || "Discovery",
	};
}

export const MOCK_DISCOVERY_TRACKS: DiscoveryTrack[] = [
	{
		id: "1",
		rank: 1,
		votes: 1248,
		artist: "Kira Vale",
		title: "Midnight Drive",
		challenge: "Neon Nightbeat",
		youtubeUrl: "https://www.youtube.com/watch?v=PNu-lyOH7bk",
	},
	{
		id: "2",
		rank: 2,
		votes: 842,
		title: "Solar Echo",
		artist: "Nova Sato",
		challenge: "Dawn Patrol",
		youtubeUrl: "https://www.youtube.com/watch?v=ArmDp-zijuc",
	},
	{
		id: "3",
		rank: 3,
		votes: 619,
		artist: "Orion Pax",
		title: "Velvet Drive",
		challenge: "Neon Nightbeat",
		youtubeUrl: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
	},
	{
		id: "4",
		rank: 4,
		votes: 431,
		artist: "Elyx Rain",
		title: "Pulse Theory",
		challenge: "Beat Lab",
		youtubeUrl: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
	},
	{
		id: "5",
		rank: 5,
		votes: 298,
		artist: "Sera Kline",
		title: "Midnight Echoes",
		challenge: "Midnight Session",
		youtubeUrl: "https://www.youtube.com/watch?v=fMcnFSzlfv4",
	},
];

/** Normalized rows from GET /discovery/hot (after axios unwrap). */
export function discoveryTracksFromApiPayload(
	response: DiscoveryHotListResponse | DiscoveryHotTrack[],
): DiscoveryHotTrack[] {
	return Array.isArray(response) ? response : (response?.tracks ?? []);
}

export function mapDiscoveryHotTrackToDiscoveryTrack(t: DiscoveryHotTrack): DiscoveryTrack {
	return {
		rank: t.rank,
		id: t.submissionId,
		title: t.trackTitle,
		artist: t.artistName,
		youtubeUrl: t.youtubeUrl,
		votes: Number(t.voteCount ?? 0),
		challenge: t.eventName || "Discovery",
	};
}

export function mapDiscoveryTracksResponseToDiscoveryTracks(
	response: DiscoveryHotListResponse | DiscoveryHotTrack[],
): DiscoveryTrack[] {
	const rows = discoveryTracksFromApiPayload(response);
	return rows.map(t => mapDiscoveryHotTrackToDiscoveryTrack(t));
}

export function youtubeThumb(url: string): string | null {
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

export function youtubeEmbedUrl(url: string): string | null {
	try {
		const u = new URL(url);
		let videoId: string | null = null;
		if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v");
		else if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1);
		return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : null;
	} catch {
		return null;
	}
}

export function formatDiscoveryVotes(n: number) {
	if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
	return String(n);
}
