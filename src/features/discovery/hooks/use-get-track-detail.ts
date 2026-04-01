"use client";

import {
	type DiscoveryTrackDetail,
	mapDiscoveryTrackDetailApiToTrackDetail,
} from "@/app/(main)/discovery/_lib/tracks";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getDiscoveryTrackDetailService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";

export function useGetTrackDetail(submissionId: string) {
	return useAppQuery<DiscoveryTrackDetail | null>({
		enabled: !!submissionId,
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.TRACK_DETAIL(submissionId)),
		queryFn: async () => {
			const response = await getDiscoveryTrackDetailService(submissionId);
			return mapDiscoveryTrackDetailApiToTrackDetail(response);
		},
	});
}
