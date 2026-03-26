import { apiService } from "@/lib/api";
import { WALLET_ENDPOINTS } from "../endpoints/wallet.endpoints";
import type { WalletBalanceResponse } from "../types/wallet.types";

export const getWalletBalanceService = (): Promise<WalletBalanceResponse> =>
	apiService.get({ url: WALLET_ENDPOINTS.BALANCE });
