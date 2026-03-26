"use client";

import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getMySubmissionsService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { GetMySubmissionsParams, MySubmissionItem } from "../types/discovery.types";

const DEFAULT_MY_SUBMISSIONS_PARAMS: GetMySubmissionsParams = { limit: 20, offset: 0 };

function normalizeMySubmissionsList(raw: unknown): MySubmissionItem[] {
	if (Array.isArray(raw)) return raw as MySubmissionItem[];
	if (raw && typeof raw === "object" && "submissions" in raw) {
		const list = (raw as { submissions?: unknown }).submissions;
		return Array.isArray(list) ? (list as MySubmissionItem[]) : [];
	}
	return [];
}

export function useGetMySubmissions(
	params: GetMySubmissionsParams = DEFAULT_MY_SUBMISSIONS_PARAMS,
) {
	const merged = { ...DEFAULT_MY_SUBMISSIONS_PARAMS, ...params };

	return useAppQuery<MySubmissionItem[]>({
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.MY_SUBMISSIONS, merged as Record<string, unknown>),
		queryFn: async () => {
			const response = await getMySubmissionsService(merged);
			if (Array.isArray(response)) return response as MySubmissionItem[];
			return normalizeMySubmissionsList(response);
		},
	});
}
