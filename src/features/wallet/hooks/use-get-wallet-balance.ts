"use client";

import { useAppQuery } from "@/hooks/use-app-query";
import { createQueryKey } from "@/lib/query-key";
import { getWalletBalanceService } from "../api/wallet.service";
import { WALLET_ENDPOINTS } from "../endpoints/wallet.endpoints";
import type { WalletBalanceResponse } from "../types/wallet.types";

export function useGetWalletBalance() {
	return useAppQuery<WalletBalanceResponse>({
		queryFn: () => getWalletBalanceService(),
		queryKey: createQueryKey(WALLET_ENDPOINTS.BALANCE),
	});
}
