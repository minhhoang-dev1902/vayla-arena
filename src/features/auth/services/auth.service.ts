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

// ─── Privy → Vayla session ─────────────────────────────────────────────

/** `identityToken` = `identity_token`. `accessToken` = `privy_access_token` (SDK: `getAccessToken()`). */
export interface PrivyLoginPayload {
	identityToken: string;
	accessToken: string;
}

export interface PrivyLoginVaylaUser {
	id: string;
	userIdentity: string;
	email: string;
	displayName: string;
	avatarUrl: string | null;
	role: string;
	status: string;
	walletAddress: string;
	walletStatus: string;
	emailVerified: boolean;
	vaylaBalance: string;
	authSource: string;
	isNewUser: boolean;
	createdAt: string;
}

export interface PrivyLoginResponse {
	user: PrivyLoginVaylaUser;
	accessToken: string;
	refreshToken: string;
}

export const privyLoginService = (payload: PrivyLoginPayload): Promise<PrivyLoginResponse> =>
	apiService.post({
		url: AUTH_ENDPOINTS.PRIVY_LOGIN,
		payload: payload as Record<string, unknown>,
	});
