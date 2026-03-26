import { apiService } from "@/lib/api";
import { VOTING_ENDPOINTS } from "../endpoints/voting.endpoints";
import type { VoteTrackPayload, VoteTrackResponse } from "../types/voting.types";

export const voteTrackService = (payload: VoteTrackPayload): Promise<VoteTrackResponse> =>
	apiService.post({
		url: VOTING_ENDPOINTS.TRACK_VOTE,
		payload: payload as Record<string, unknown>,
	});
