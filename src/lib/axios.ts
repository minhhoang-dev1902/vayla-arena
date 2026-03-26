import axios, { type AxiosError, type AxiosResponse } from "axios";
import { fetchPrivyAccessTokenForApi } from "@/lib/privy-access-token";
import type { ApiError, ApiResponse } from "@/types/api";

/** Khớp `AUTH_ENDPOINTS.PRIVY_LOGIN` — tránh gắn Bearer cho endpoint login (curl không dùng Authorization). */
const PRIVY_LOGIN_URL_SEGMENT = "/auth/privy/login";

declare module "axios" {
	interface InternalAxiosRequestConfig {
		toResponse?: (data: unknown) => unknown;
		toRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
	}
}

function readStoredToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("access_token");
}

const axiosInstance = axios.create({
	timeout: 30_000,
	headers: { "Content-Type": "application/json" },
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
});

axiosInstance.interceptors.request.use(async config => {
	if (typeof window !== "undefined") {
		const url = config.url ?? "";
		const skipAuth = url.includes(PRIVY_LOGIN_URL_SEGMENT);

		if (!skipAuth) {
			let token = readStoredToken();
			if (!token) {
				/* Chưa có JWT Vayla trong storage: fallback JWT Privy (getter), không persist ở đây. */
				token = await fetchPrivyAccessTokenForApi();
			}
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
	}

	if (config.toRequest) {
		return config.toRequest(config);
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response: AxiosResponse<ApiResponse<unknown>>) => {
		const transformed = response.config.toResponse
			? response.config.toResponse(response.data?.data ?? response.data)
			: (response.data?.data ?? response.data);

		return { ...response, data: transformed };
	},
	(error: AxiosError<ApiError>) => {
		const status = error.response?.status;

		const apiError: ApiError = {
			status: status ?? 0,
			errors: error.response?.data?.errors,
			message: error.response?.data?.message ?? error.message ?? "An unexpected error occurred",
		};

		return Promise.reject(apiError);
	},
);

export { axiosInstance };
