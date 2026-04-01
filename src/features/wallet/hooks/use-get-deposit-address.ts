"use client";

import { useAppQuery } from "@/hooks/use-app-query";
import { getDepositAddressService } from "../api/wallet.service";
import { WALLET_ENDPOINTS } from "../endpoints/wallet.endpoints";
import type { NetworkType } from "../types/wallet.types";

export function useGetDepositAddress(network: NetworkType) {
	return useAppQuery({
		queryKey: [WALLET_ENDPOINTS.DEPOSIT_ADDRESS, network],
		queryFn: () => getDepositAddressService(network),
	});
}
