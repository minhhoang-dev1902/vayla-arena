"use client";

import {
	type QueryKey,
	type UseQueryOptions,
	type UseQueryResult,
	useQuery,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { ApiError } from "@/types/api";

type UseAppQueryOptions<TData = unknown, TError = ApiError> = Omit<
	UseQueryOptions<TData, TError, TData, QueryKey>,
	"queryKey" | "queryFn"
> & {
	queryKey: QueryKey;
	queryFn: () => Promise<TData>;
	onSuccess?: (data: TData) => void;
	onError?: (error: TError) => void;
};

export function useAppQuery<TData = unknown, TError = ApiError>(
	options: UseAppQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> {
	const { onSuccess, onError, ...queryOptions } = options;

	const result = useQuery<TData, TError, TData, QueryKey>(queryOptions);

	const onSuccessRef = useRef(onSuccess);
	onSuccessRef.current = onSuccess;
	const onErrorRef = useRef(onError);
	onErrorRef.current = onError;

	useEffect(() => {
		if (result.isSuccess && result.data !== undefined) {
			onSuccessRef.current?.(result.data);
		}
	}, [result.isSuccess, result.data]);

	useEffect(() => {
		if (result.isError && result.error) {
			onErrorRef.current?.(result.error);
		}
	}, [result.isError, result.error]);

	return result;
}
