"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import {
	type DiscoveryTrack,
	discoveryTracksFromApiPayload,
	mapDiscoveryHotTrackToDiscoveryTrack,
} from "@/app/(main)/discovery/_lib/tracks";
import { getDiscoveryFeedService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { DiscoveryFeedSort } from "../types/discovery.types";

const PAGE_LIMIT = 5;

export type FeedPage = {
	total: number;
	offset: number;
	tracks: DiscoveryTrack[];
};

export function useInfiniteFeedTracks(sort: DiscoveryFeedSort) {
	return useInfiniteQuery<FeedPage, Error>({
		initialPageParam: 0,
		queryKey: [DISCOVERY_ENDPOINTS.FEED, sort],
		getNextPageParam: lastPage => {
			const nextOffset = lastPage.offset + PAGE_LIMIT;
			if (nextOffset >= lastPage.total) return undefined;
			return nextOffset;
		},
		queryFn: async ({ pageParam }) => {
			const offset = typeof pageParam === "number" ? pageParam : 0;
			const response = await getDiscoveryFeedService({ sort, offset, limit: PAGE_LIMIT });
			const rows = discoveryTracksFromApiPayload(Array.isArray(response) ? response : response);
			const total = Array.isArray(response) ? rows.length : (response.total ?? rows.length);
			return {
				total,
				offset,
				tracks: rows.map(mapDiscoveryHotTrackToDiscoveryTrack),
			};
		},
	});
}
