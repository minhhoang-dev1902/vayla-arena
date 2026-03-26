"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAppMutation } from "@/hooks/use-app-mutation";
import type { ApiError } from "@/types/api";
import { withdrawService } from "../api/wallet.service";
import { WALLET_ENDPOINTS } from "../endpoints/wallet.endpoints";
import type { WithdrawPayload, WithdrawResponse } from "../types/wallet.types";

interface UseWithdrawOptions {
	onError?: (error: ApiError) => void;
	onSuccess?: (data: WithdrawResponse) => void;
}

export function useWithdraw(options?: UseWithdrawOptions) {
	const queryClient = useQueryClient();

	const mutation = useAppMutation<WithdrawResponse, WithdrawPayload>({
		mutationFn: payload => withdrawService(payload),
		onError: error => {
			options?.onError?.(error);
		},
		onSuccess: data => {
			queryClient.invalidateQueries({ queryKey: [WALLET_ENDPOINTS.BALANCE] });
			options?.onSuccess?.(data);
		},
	});

	return {
		...mutation,
		withdraw: mutation.mutateAsync,
	};
}
