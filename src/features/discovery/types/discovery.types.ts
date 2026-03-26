// ─── Hot Tracks ─────────────────────────────────────────────────

export interface GetDiscoveryHotParams {
	limit?: number;
	offset?: number;
}

export interface DiscoveryHotTrack {
	rank: number;
	genre: string;
	eventId: string;
	voteCount: number;
	eventName: string;
	createdAt: string;
	trackTitle: string;
	artistName: string;
	youtubeUrl: string;
	rankChange: string;
	submissionId: string;
}

export interface DiscoveryHotListResponse {
	total: number;
	limit: number;
	offset: number;
	tracks: DiscoveryHotTrack[];
}

// ─── Track Detail ───────────────────────────────────────────────

export interface DiscoveryTrackDetailApi {
	genre: string;
	eventId: string;
	voteCount: number;
	likeCount: number;
	viewCount: number;
	eventName: string;
	eventSlug: string;
	createdAt: string;
	userLiked: boolean;
	trackTitle: string;
	artistName: string;
	youtubeUrl: string;
	eventStatus: string;
	description: string;
	submissionId: string;
	eventEndDate: string;
	lyrics: string | null;
	userVotesCast: number;
	eventStartDate: string;
	eventPrizePool: string;
}

// ─── Discovery Feed ─────────────────────────────────────────────

export type DiscoveryFeedSort = "trending" | "new" | "ending_soon";

export interface GetDiscoveryFeedParams {
	limit?: number;
	offset?: number;
	[key: string]: unknown;
	sort: DiscoveryFeedSort;
}

export type DiscoveryFeedResponse = DiscoveryHotListResponse;

// ─── My Submissions ─────────────────────────────────────────────

/** API có thể trả `pending` (filter query) hoặc `pending_review`. */
export type SubmissionStatus = "approved" | "rejected" | "pending_review" | "pending" | "closed";

export interface MySubmissionItem {
	genre: string;
	eventId: string;
	voteCount: number;
	eventName: string;
	status: SubmissionStatus;
	createdAt: string;
	trackTitle: string;
	artistName: string;
	youtubeUrl: string;
	submissionId: string;
}

export interface MySubmissionsResponse {
	total: number;
	submissions: MySubmissionItem[];
}

export type MySubmissionsApiStatus = "pending" | "approved" | "rejected";

export interface GetMySubmissionsParams {
	limit?: number;
	offset?: number;
	/** Query `status` trên `/submissions/my/submissions` — bỏ qua khi xem tab All. */
	status?: MySubmissionsApiStatus;
}

// ─── Submissions ────────────────────────────────────────────────

export interface SubmitTrackPayload {
	genre: string;
	eventId: string;
	lyrics?: string;
	youtubeUrl: string;
	trackTitle: string;
	artistName: string;
	description?: string;
}

export interface SubmitTrackResponse {
	submissionId: string;
	eventId: string;
	trackTitle: string;
	artistName: string;
	youtubeUrl: string;
	genre: string;
	description: string | null;
	lyrics: string | null;
	createdAt: string;
}

// ─── Challenges ─────────────────────────────────────────────────

export interface GetDiscoveryChallengesParams {
	limit?: number;
	offset?: number;
}

export interface DiscoveryChallengeApiItem {
	name: string;
	slug: string;
	eventId: string;
	endDate: string;
	startDate: string;
	totalVotes: number;
	contentType: string;
	description: string;
	thumbnailUrl: string;
	vaylaPrizePool: string;
	submissionCount: number;
}

export interface DiscoveryChallengesListResponse {
	total: number;
	limit: number;
	offset: number;
	challenges: DiscoveryChallengeApiItem[];
}
