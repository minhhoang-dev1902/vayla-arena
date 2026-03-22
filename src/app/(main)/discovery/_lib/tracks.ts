export type DiscoveryTrack = {
	id: string;
	rank: number;
	title: string;
	artist: string;
	challenge: string;
	votes: number;
	youtubeUrl: string;
	thumbnail?: string;
};

export const MOCK_DISCOVERY_TRACKS: DiscoveryTrack[] = [
	{
		id: "1",
		rank: 1,
		title: "Midnight Drive",
		artist: "Kira Vale",
		challenge: "Neon Nightbeat",
		votes: 1248,
		youtubeUrl: "https://www.youtube.com/watch?v=PNu-lyOH7bk",
	},
	{
		id: "2",
		rank: 2,
		title: "Solar Echo",
		artist: "Nova Sato",
		challenge: "Dawn Patrol",
		votes: 842,
		youtubeUrl: "https://www.youtube.com/watch?v=ArmDp-zijuc",
	},
	{
		id: "3",
		rank: 3,
		title: "Velvet Drive",
		artist: "Orion Pax",
		challenge: "Neon Nightbeat",
		votes: 619,
		youtubeUrl: "https://www.youtube.com/watch?v=lHWHKLHb1a0",
	},
	{
		id: "4",
		rank: 4,
		title: "Pulse Theory",
		artist: "Elyx Rain",
		challenge: "Beat Lab",
		votes: 431,
		youtubeUrl: "https://www.youtube.com/watch?v=PBFSIe7MYGU",
	},
	{
		id: "5",
		rank: 5,
		title: "Midnight Echoes",
		artist: "Sera Kline",
		challenge: "Midnight Session",
		votes: 298,
		youtubeUrl: "https://www.youtube.com/watch?v=fMcnFSzlfv4",
	},
];

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
