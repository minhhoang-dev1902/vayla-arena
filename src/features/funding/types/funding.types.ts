export type FundingProjectType = "music_campaign" | "event_funding";

export type FundingProjectStatus = "draft" | "active" | "funded" | "failed" | "cancelled";

export interface FundingProject {
	id: string;
	type: FundingProjectType;
	title: string;
	status: FundingProjectStatus;
	end_date: string;
	goal_amount: number;
	raised_amount: number;
	progress_pct: number;
	creator_username: string;
}

export interface FundingListData {
	total: number;
	projects: FundingProject[];
}

export interface GetFundingListParams {
	limit?: number;
	offset?: number;
	type?: FundingProjectType;
	status?: FundingProjectStatus;
}
