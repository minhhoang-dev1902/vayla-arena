"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/use-app-mutation";
import type { ApiError } from "@/types/api";
import { submitTrackService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { SubmitTrackPayload, SubmitTrackResponse } from "../types/discovery.types";

interface UseSubmitTrackOptions {
	onError?: (error: ApiError) => void;
	onSuccess?: (data: SubmitTrackResponse) => void;
}

export function useSubmitTrack(options?: UseSubmitTrackOptions) {
	const queryClient = useQueryClient();

	const mutation = useAppMutation<SubmitTrackResponse, SubmitTrackPayload>({
		mutationFn: payload => submitTrackService(payload),
		onError: error => {
			options?.onError?.(error);
		},
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: [DISCOVERY_ENDPOINTS.FEED] });
			queryClient.invalidateQueries({ queryKey: [DISCOVERY_ENDPOINTS.HOT] });
			queryClient.invalidateQueries({ queryKey: [DISCOVERY_ENDPOINTS.MY_SUBMISSIONS] });
			options?.onSuccess?.(data);
		},
	});

	return {
		...mutation,
		submit: mutation.mutateAsync,
	};
}
