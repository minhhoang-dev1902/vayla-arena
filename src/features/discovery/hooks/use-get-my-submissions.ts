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

function omitUndefined<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
	return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

export function useGetMySubmissions(
	params: GetMySubmissionsParams = DEFAULT_MY_SUBMISSIONS_PARAMS,
) {
	const merged = { ...DEFAULT_MY_SUBMISSIONS_PARAMS, ...params };
	const requestParams = omitUndefined(merged as Record<string, unknown>) as GetMySubmissionsParams;
	const queryKeyPayload = omitUndefined(merged as Record<string, unknown>);

	return useAppQuery<MySubmissionItem[]>({
		queryKey: createQueryKey(DISCOVERY_ENDPOINTS.MY_SUBMISSIONS, queryKeyPayload),
		queryFn: async () => {
			const response = await getMySubmissionsService(requestParams);
			if (Array.isArray(response)) return response as MySubmissionItem[];
			return normalizeMySubmissionsList(response);
		},
	});
}
