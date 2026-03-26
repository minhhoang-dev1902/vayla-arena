import { apiService } from "@/lib/api";
import { WALLET_ENDPOINTS } from "../endpoints/wallet.endpoints";
import type {
	DepositAddressResponse,
	NetworkType,
	WalletBalanceResponse,
	WithdrawPayload,
	WithdrawResponse,
} from "../types/wallet.types";

export const getWalletBalanceService = (): Promise<WalletBalanceResponse> =>
	apiService.get({ url: WALLET_ENDPOINTS.BALANCE });

export const getDepositAddressService = (network: NetworkType): Promise<DepositAddressResponse> =>
	apiService.get({
		url: WALLET_ENDPOINTS.DEPOSIT_ADDRESS,
		params: { network },
	});

export const withdrawService = (payload: WithdrawPayload): Promise<WithdrawResponse> =>
	apiService.post({
		url: WALLET_ENDPOINTS.WITHDRAW,
		payload: payload as unknown as Record<string, unknown>,
	});
