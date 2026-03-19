import { apiService } from "@/lib/api";

// ─── Types ──────────────────────────────────────────────────────────

export interface User {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
	createdAt: string;
}

export interface GetUserListParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface UserListResponse {
	items: User[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateUserPayload {
	name: string;
	email: string;
}

export interface UpdateUserPayload {
	name?: string;
	email?: string;
}

// ─── API Executors ──────────────────────────────────────────────────

export const getUserListApi = (params: GetUserListParams): Promise<UserListResponse> =>
	apiService.get({ url: "/users", params: params as Record<string, unknown> });

export const getUserDetailApi = (id: string): Promise<User> =>
	apiService.get({ url: `/users/${id}` });

export const createUserApi = (payload: CreateUserPayload): Promise<User> =>
	apiService.post({ url: "/users", payload: payload as Record<string, unknown> });

export const updateUserApi = (id: string, payload: UpdateUserPayload): Promise<User> =>
	apiService.put({
		url: `/users/${id}`,
		payload: payload as Record<string, unknown>,
	});

export const deleteUserApi = (id: string): Promise<void> =>
	apiService.delete({ url: `/users/${id}` });
