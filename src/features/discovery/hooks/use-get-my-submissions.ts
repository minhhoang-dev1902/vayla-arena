"use client";

import { useAppQuery } from "@/hooks/use-app-query";
import { getMySubmissionsService } from "../api/discovery.service";
import { DISCOVERY_ENDPOINTS } from "../endpoints/discovery.endpoints";
import type { MySubmissionItem } from "../types/discovery.types";

export function useGetMySubmissions() {
	return useAppQuery<MySubmissionItem[]>({
		queryKey: [DISCOVERY_ENDPOINTS.MY_SUBMISSIONS],
		queryFn: async () => {
			const response = await getMySubmissionsService();
			if (Array.isArray(response)) return response as unknown as MySubmissionItem[];
			return response.submissions ?? [];
		},
	});
}
