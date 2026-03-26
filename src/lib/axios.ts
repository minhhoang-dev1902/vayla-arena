import axios, {
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
	isAxiosError,
} from "axios";
import { clearAppAuthStorage } from "@/lib/clear-auth-storage";
import { fetchPrivyAccessTokenForApi } from "@/lib/privy-access-token";
import type { ApiError, ApiResponse } from "@/types/api";

/** Khớp `AUTH_ENDPOINTS.PRIVY_LOGIN` — tránh gắn Bearer cho endpoint login (curl không dùng Authorization). */
const PRIVY_LOGIN_URL_SEGMENT = "/auth/privy/login";
const AUTH_REFRESH_URL_SEGMENT = "/auth/refresh";

declare module "axios" {
	interface InternalAxiosRequestConfig {
		toResponse?: (data: unknown) => unknown;
		toRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
		/** Đã retry sau refresh — tránh lặp vô hạn. */
		_retryAfterRefresh?: boolean;
	}
}

function readStoredToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("access_token");
}

function readRefreshToken(): string | null {
	if (typeof window === "undefined") return null;
	return localStorage.getItem("refresh_token");
}

function shouldSkipAuthHeader(url: string): boolean {
	return url.includes(PRIVY_LOGIN_URL_SEGMENT) || url.includes(AUTH_REFRESH_URL_SEGMENT);
}

function isNoRefreshRetryUrl(url: string): boolean {
	return (
		url.includes(AUTH_REFRESH_URL_SEGMENT) ||
		url.includes("/auth/login") ||
		url.includes("/auth/register") ||
		url.includes(PRIVY_LOGIN_URL_SEGMENT)
	);
}

function getApiErrorFields(data: unknown): { code?: string; message?: string } | null {
	if (!data || typeof data !== "object") return null;
	const o = data as Record<string, unknown>;
	const err = o.error;
	if (err && typeof err === "object") {
		const e = err as Record<string, unknown>;
		return {
			code: typeof e.code === "string" ? e.code : undefined,
			message: typeof e.message === "string" ? e.message : undefined,
		};
	}
	if (typeof o.message === "string") {
		return { message: o.message };
	}
	return null;
}

function isAuthTokenExpiredBody(data: unknown): boolean {
	if (!data || typeof data !== "object") return false;
	const o = data as Record<string, unknown>;
	if (o.success !== false) return false;
	const e = getApiErrorFields(data);
	if (!e) return false;
	return (
		e.code === "AUTH_TOKEN_EXPIRED" &&
		(e.message === "Access token expired" ||
			(typeof e.message === "string" && e.message.includes("Access token expired")))
	);
}

/** Refresh hết hạn hoặc thiếu/sai Authorization → xóa credential local. */
function shouldClearCredentialsBody(data: unknown): boolean {
	const e = getApiErrorFields(data);
	if (!e) return false;
	if (e.code === "AUTH_REFRESH_TOKEN_EXPIRED") return true;
	const msg = e.message ?? "";
	if (msg === "Missing or invalid authorization header") return true;
	return msg.includes("Missing or invalid authorization header");
}

function parseRefreshResponseBody(
	data: unknown,
): { accessToken: string; refreshToken?: string } | null {
	if (!data || typeof data !== "object") return null;
	const o = data as Record<string, unknown>;
	const inner = (o.data ?? o) as Record<string, unknown>;
	const accessToken = inner.accessToken;
	if (typeof accessToken !== "string" || !accessToken) return null;
	const refreshToken = inner.refreshToken;
	return {
		accessToken,
		refreshToken: typeof refreshToken === "string" ? refreshToken : undefined,
	};
}

function toApiError(error: AxiosError): ApiError {
	const status = error.response?.status ?? 0;
	const raw = error.response?.data as Record<string, unknown> | undefined;
	const nested = raw?.error as Record<string, unknown> | undefined;
	const msg =
		(typeof nested?.message === "string" && nested.message) ||
		(typeof raw?.message === "string" && raw.message) ||
		error.message ||
		"An unexpected error occurred";
	return {
		status,
		message: msg,
		errors: raw?.errors as Record<string, string[]> | undefined,
	};
}

/** Client không qua interceptors — tránh vòng refresh / Bearer hết hạn. */
async function callRefreshTokenApi(
	refreshToken: string,
): Promise<{ accessToken: string; refreshToken?: string }> {
	const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
	const client = axios.create({
		baseURL,
		timeout: 30_000,
		headers: { "Content-Type": "application/json" },
	});
	const { data } = await client.post<unknown>("/auth/refresh", { refreshToken });
	const parsed = parseRefreshResponseBody(data);
	if (!parsed) throw new Error("Invalid refresh response");
	return parsed;
}

let refreshPromise: Promise<string> | null = null;

type PendingRetry = {
	resolve: (token: string) => void;
	reject: (err: unknown) => void;
};

let pendingRetries: PendingRetry[] = [];

function subscribePending(resolve: (token: string) => void, reject: (err: unknown) => void) {
	pendingRetries.push({ resolve, reject });
}

function flushPendingSuccess(token: string) {
	for (const p of pendingRetries) {
		p.resolve(token);
	}
	pendingRetries = [];
}

function flushPendingError(err: unknown) {
	const wrapped = isAxiosError(err) ? toApiError(err) : err;
	for (const p of pendingRetries) {
		p.reject(wrapped);
	}
	pendingRetries = [];
}

async function refreshAccessTokenOnce(): Promise<string> {
	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		const rt = readRefreshToken();
		if (!rt) throw new Error("No refresh token");
		const tokens = await callRefreshTokenApi(rt);
		localStorage.setItem("access_token", tokens.accessToken);
		if (tokens.refreshToken) {
			localStorage.setItem("refresh_token", tokens.refreshToken);
		}
		return tokens.accessToken;
	})();

	try {
		return await refreshPromise;
	} finally {
		refreshPromise = null;
	}
}

const axiosInstance = axios.create({
	timeout: 30_000,
	headers: { "Content-Type": "application/json" },
	baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
});

axiosInstance.interceptors.request.use(async config => {
	if (typeof window !== "undefined") {
		const url = config.url ?? "";
		const skipAuth = shouldSkipAuthHeader(url);

		if (!skipAuth) {
			let token = readStoredToken();
			if (!token) {
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
	async (error: AxiosError) => {
		const original = error.config as InternalAxiosRequestConfig | undefined;
		const status = error.response?.status;

		if (
			typeof window !== "undefined" &&
			status === 401 &&
			original &&
			!original._retryAfterRefresh &&
			!isNoRefreshRetryUrl(original.url ?? "") &&
			isAuthTokenExpiredBody(error.response?.data)
		) {
			original._retryAfterRefresh = true;

			if (refreshPromise) {
				return new Promise<AxiosResponse>((resolve, reject) => {
					subscribePending(token => {
						original.headers.Authorization = `Bearer ${token}`;
						resolve(axiosInstance(original));
					}, reject);
				});
			}

			try {
				const newAccess = await refreshAccessTokenOnce();
				flushPendingSuccess(newAccess);
				original.headers.Authorization = `Bearer ${newAccess}`;
				return axiosInstance(original);
			} catch (refreshErr) {
				flushPendingError(refreshErr);
				clearAppAuthStorage();
				if (isAxiosError(refreshErr)) {
					return Promise.reject(toApiError(refreshErr));
				}
				return Promise.reject(toApiError(error));
			}
		}

		if (typeof window !== "undefined" && shouldClearCredentialsBody(error.response?.data)) {
			clearAppAuthStorage();
		}

		return Promise.reject(toApiError(error));
	},
);

export { axiosInstance };
