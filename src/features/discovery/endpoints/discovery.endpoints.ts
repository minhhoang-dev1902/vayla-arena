export const DISCOVERY_ENDPOINTS = {
	HOT: "/discovery/hot",
	FEED: "/discovery/feed",
	SUBMISSIONS: "/submissions",
	MY_SUBMISSIONS: "/submissions/my",
	CHALLENGES: "/discovery/challenges",
	TRACK_DETAIL: (submissionId: string) => `/discovery/track/${submissionId}`,
} as const;
