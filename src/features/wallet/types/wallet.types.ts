export interface WalletBalanceResponse {
	totalVayla: string;
	platformBalance: string;
	withdrawableBalance: string;
}

export type NetworkType = "ethereum" | "bsc" | "solana";

export interface DepositAddressResponse {
	address: string;
	network: NetworkType;
}

export interface WithdrawPayload {
	amount: string;
	network: NetworkType;
	toAddress: string;
}

export interface WithdrawResponse {
	txHash: string;
	amount: string;
	network: NetworkType;
	toAddress: string;
	estimatedFee: string;
}
