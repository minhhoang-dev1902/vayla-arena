import { apiService } from "@/lib/api";
import { FUNDING_ENDPOINTS } from "../endpoints/funding.endpoints";
import type { FundingListData, FundingProject, GetFundingListParams } from "../types/funding.types";

function normalizeListPayload(raw: unknown): FundingListData {
	if (raw && typeof raw === "object" && "projects" in raw) {
		const o = raw as { projects?: FundingProject[]; total?: number };
		return {
			projects: Array.isArray(o.projects) ? o.projects : [],
			total: typeof o.total === "number" ? o.total : (o.projects?.length ?? 0),
		};
	}
	return { projects: [], total: 0 };
}

export const getFundingListService = async (
	params: GetFundingListParams = {},
): Promise<FundingListData> => {
	const raw = await apiService.get<unknown>({
		url: FUNDING_ENDPOINTS.LIST,
		params: params as Record<string, unknown>,
	});
	return normalizeListPayload(raw);
};

/** First project for home spotlight (limit=1 on the API). */
export const getFeaturedFundingProjectService = async (): Promise<FundingProject | null> => {
	const { projects } = await getFundingListService({ limit: 1, offset: 0 });
	return projects[0] ?? null;
};
