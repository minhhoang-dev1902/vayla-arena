"use client";

import {
	type DiscoveryTrack,
	mapDiscoveryTracksResponseToDiscoveryTracks,
} from "@/app/(main)/discovery/_lib/tracks";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getDiscoveryHotService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { GetDiscoveryHotParams } from "../types/discovery.types";

export function useGetHotTracks(params: GetDiscoveryHotParams = { limit: 20, offset: 0 }) {
	return useAppQuery<DiscoveryTrack[]>({
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.HOT, params as Record<string, unknown>),
		queryFn: async () => {
			const response = await getDiscoveryHotService(params);
			return mapDiscoveryTracksResponseToDiscoveryTracks(response);
		},
	});
}
