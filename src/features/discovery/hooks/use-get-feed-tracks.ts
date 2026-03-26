"use client";

import {
	type DiscoveryTrack,
	mapDiscoveryTracksResponseToDiscoveryTracks,
} from "@/app/(main)/discovery/_lib/tracks";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getDiscoveryFeedService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { GetDiscoveryFeedParams } from "../types/discovery.types";

export function useGetFeedTracks(params: GetDiscoveryFeedParams) {
	return useAppQuery<DiscoveryTrack[]>({
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.FEED, params as Record<string, unknown>),
		queryFn: async () => {
			const response = await getDiscoveryFeedService(params);
			return mapDiscoveryTracksResponseToDiscoveryTracks(response);
		},
	});
}
