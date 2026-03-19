import { apiService } from "@/lib/api";
import { AUTH_ENDPOINTS } from "../constants/auth.endpoints";

export type AuthRole = "fan" | "artist";

// ─── Login ───────────────────────────────────────────────────────────

export interface LoginRequestPayload {
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

export const loginService = (payload: LoginRequestPayload): Promise<LoginResponse> =>
	apiService.post({
		url: AUTH_ENDPOINTS.LOGIN,
		payload: payload as Record<string, unknown>,
	});

// ─── Register ────────────────────────────────────────────────────────

export interface RegisterRequestPayload {
	name: string;
	email: string;
	role: AuthRole;
	password: string;
	userIdentity: string;
}

export interface RegisterResponse {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		role: string;
		email: string;
		status: string;
		createdAt: string;
		userIdentity: string;
		vaylaBalance: string;
		walletAddress: string;
		emailVerified: boolean;
	};
}

export const registerService = (payload: RegisterRequestPayload): Promise<RegisterResponse> =>
	apiService.post({
		url: AUTH_ENDPOINTS.REGISTER,
		payload: payload as Record<string, unknown>,
	});
