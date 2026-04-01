"use client";

import {
	type DiscoveryChallenge,
	mapDiscoveryChallengesListFromApi,
} from "@/app/(main)/discovery/_lib/challenges";
import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getDiscoveryChallengesService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { GetDiscoveryChallengesParams } from "../types/discovery.types";

const DEFAULT_PARAMS: GetDiscoveryChallengesParams = { limit: 50, offset: 0 };

export function useGetChallenges(params: GetDiscoveryChallengesParams = DEFAULT_PARAMS) {
	return useAppQuery<DiscoveryChallenge[]>({
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.CHALLENGES, params as Record<string, unknown>),
		queryFn: async () => {
			const response = await getDiscoveryChallengesService(params);
			return mapDiscoveryChallengesListFromApi(response);
		},
	});
}
