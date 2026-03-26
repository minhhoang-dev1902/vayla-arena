"use client";

import { useRouter } from "next/navigation";
import { useAppMutation } from "@/hooks/use-app-mutation";
import type { ApiError } from "@/types/api";
import {
	type LoginRequestPayload,
	type LoginResponse,
	loginService,
} from "../services/auth.service";

interface UseLoginOptions {
	onError?: (error: ApiError) => void;
	onSuccess?: (data: LoginResponse) => void;
}

export function useLogin(options?: UseLoginOptions) {
	const router = useRouter();

	const mutation = useAppMutation<LoginResponse, LoginRequestPayload>({
		mutationFn: payload => loginService(payload),
		onError: error => {
			options?.onError?.(error);
		},
		onSuccess: data => {
			localStorage.setItem("access_token", data.accessToken);
			localStorage.setItem("refresh_token", data.refreshToken);
			options?.onSuccess?.(data);
			router.replace("/");
		},
	});

	return {
		...mutation,
		login: mutation.mutateAsync,
	};
}
