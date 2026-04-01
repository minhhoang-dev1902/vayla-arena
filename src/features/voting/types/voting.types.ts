export interface VoteTrackPayload {
	voteCount: number;
	submissionId: string;
}

export interface VoteTrackResponse {
	votesCast: number;
	vaylaCost: number;
	voteCount: number;
	submissionId: string;
	totalVotesCast: number;
}
