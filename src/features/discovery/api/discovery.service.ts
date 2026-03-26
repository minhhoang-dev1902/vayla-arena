import { apiService } from "@/lib/api";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type {
	DiscoveryChallengesListResponse,
	DiscoveryFeedResponse,
	DiscoveryHotListResponse,
	DiscoveryHotTrack,
	DiscoveryTrackDetailApi,
	GetDiscoveryChallengesParams,
	GetDiscoveryFeedParams,
	GetDiscoveryHotParams,
	GetMySubmissionsParams,
	MySubmissionsResponse,
	SubmitTrackPayload,
	SubmitTrackResponse,
} from "../types/discovery.types";

export const getDiscoveryHotService = (
	params: GetDiscoveryHotParams = {},
): Promise<DiscoveryHotListResponse | DiscoveryHotTrack[]> =>
	apiService.get({
		url: DISCOVERY_ENDPOINTS.HOT,
		params: params as Record<string, unknown>,
	});

export const getDiscoveryTrackDetailService = (
	submissionId: string,
): Promise<DiscoveryTrackDetailApi> =>
	apiService.get({ url: DISCOVERY_ENDPOINTS.TRACK_DETAIL(submissionId) });

export const getDiscoveryFeedService = (
	params: GetDiscoveryFeedParams,
): Promise<DiscoveryFeedResponse | DiscoveryHotTrack[]> =>
	apiService.get({
		params,
		url: DISCOVERY_ENDPOINTS.FEED,
	});

export const submitTrackService = (payload: SubmitTrackPayload): Promise<SubmitTrackResponse> =>
	apiService.post({
		url: DISCOVERY_ENDPOINTS.SUBMISSIONS,
		payload,
	});

export const getMySubmissionsService = (
	params: GetMySubmissionsParams = {},
): Promise<MySubmissionsResponse> =>
	apiService.get({
		url: DISCOVERY_ENDPOINTS.MY_SUBMISSIONS,
		params: params as Record<string, unknown>,
	});

export const getDiscoveryChallengesService = (
	params: GetDiscoveryChallengesParams = {},
): Promise<DiscoveryChallengesListResponse> =>
	apiService.get({
		url: DISCOVERY_ENDPOINTS.CHALLENGES,
		params: params as Record<string, unknown>,
	});
