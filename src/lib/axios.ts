import axios, { type AxiosError, type AxiosResponse } from "axios";
import type { ApiError, ApiResponse } from "@/types/api";

declare module "axios" {
	interface InternalAxiosRequestConfig {
		toResponse?: (data: unknown) => unknown;
		toRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
	}
}

function getToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("privy:token") ?? localStorage.getItem("access_token");
}

const axiosInstance = axios.create({
	timeout: 30_000,
	headers: { "Content-Type": "application/json" },
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
});

axiosInstance.interceptors.request.use(config => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
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

		if (status === 401 && typeof window !== "undefined") {
			localStorage.removeItem("access_token");
			localStorage.removeItem("privy:token");
		}

		const apiError: ApiError = {
			status: status ?? 0,
			errors: error.response?.data?.errors,
			message: error.response?.data?.message ?? error.message ?? "An unexpected error occurred",
		};

		return Promise.reject(apiError);
	},
);

export { axiosInstance };
