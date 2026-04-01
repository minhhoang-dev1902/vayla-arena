"use client";

import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";
import type { ApiError } from "@/types/api";

export function useAppMutation<
	TData = unknown,
	TVariables = void,
	TError = ApiError,
	TContext = unknown,
>(
	options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
	return useMutation<TData, TError, TVariables, TContext>(options);
}
