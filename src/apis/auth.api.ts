import { apiService } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────

export interface LoginPayload {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

export interface RegisterPayload {
	name: string;
	email: string;
	password: string;
}

export interface RefreshTokenPayload {
	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
}

// ─── API Executors ──────────────────────────────────────────────────

export const loginApi = (payload: LoginPayload): Promise<LoginResponse> =>
	apiService.post({ url: "/auth/login", payload: payload as Record<string, unknown> });

export const registerApi = (payload: RegisterPayload): Promise<LoginResponse> =>
	apiService.post({
		url: "/auth/register",
		payload: payload as Record<string, unknown>,
	});

export const refreshTokenApi = (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> =>
	apiService.post({
		url: "/auth/refresh",
		payload: payload as Record<string, unknown>,
	});

export const logoutApi = (): Promise<void> => apiService.post({ url: "/auth/logout" });
