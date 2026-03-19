import { apiService } from "@/lib/api";

export interface GetDiscoveryHotParams {
	limit?: number;
	offset?: number;
}

export interface DiscoveryHotTrack {
	rank: number;
	submissionId: string;
	trackTitle: string;
	artistName: string;
	genre: string;
	youtubeUrl: string;
	voteCount: number;
	eventId: string;
	eventName: string;
	rankChange: string;
	createdAt: string;
}

export interface DiscoveryHotListResponse {
	tracks: DiscoveryHotTrack[];
	total: number;
	limit: number;
	offset: number;
}

export const getDiscoveryHotApi = (
	params: GetDiscoveryHotParams = {},
): Promise<DiscoveryHotListResponse | DiscoveryHotTrack[]> =>
	apiService.get({
		url: "/discovery/hot",
		params: params as Record<string, unknown>,
	});
