"use client";

import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getFeaturedFundingProjectService } from "../api/funding.service";
import { FUNDING_ENDPOINTS } from "../endpoints/funding.endpoints";
import type { FundingProject } from "../types/funding.types";

const FEATURED_PARAMS = { limit: 1, offset: 0 };

export function useGetFeaturedFundingProject() {
	return useAppQuery<FundingProject | null>({
		queryKey: createQueryKey(FUNDING_ENDPOINTS.LIST, FEATURED_PARAMS as Record<string, unknown>),
		queryFn: () => getFeaturedFundingProjectService(),
	});
}
