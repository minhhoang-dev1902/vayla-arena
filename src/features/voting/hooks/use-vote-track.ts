"use client";

import { useQueryClient } from "@tanstack/react-query";
import { DISCOVERY_ENDPOINTS } from "@/features/discovery/endpoints/discovery.endpoints";
import { WALLET_ENDPOINTS } from "@/features/wallet/endpoints/wallet.endpoints";
import { useAppMutation } from "@/hooks/use-app-mutation";
import type { ApiError } from "@/types/api";
import { voteTrackService } from "../api/voting.service";
import type { VoteTrackPayload, VoteTrackResponse } from "../types/voting.types";

interface UseVoteTrackOptions {
	onError?: (error: ApiError) => void;
	onSuccess?: (data: VoteTrackResponse) => void;
}

export function useVoteTrack(options?: UseVoteTrackOptions) {
	const queryClient = useQueryClient();

	const mutation = useAppMutation<VoteTrackResponse, VoteTrackPayload>({
		mutationFn: payload => voteTrackService(payload),
		onError: error => {
			options?.onError?.(error);
		},
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: [WALLET_ENDPOINTS.BALANCE] });
			queryClient.invalidateQueries({ queryKey: [DISCOVERY_ENDPOINTS.FEED] });
			queryClient.invalidateQueries({ queryKey: [DISCOVERY_ENDPOINTS.HOT] });
			options?.onSuccess?.(data);
		},
	});

	return {
		...mutation,
		vote: mutation.mutateAsync,
	};
}
