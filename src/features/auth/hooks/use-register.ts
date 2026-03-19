"use client";

import { useAppMutation } from "@/hooks/use-app-mutation";
import type { ApiError } from "@/types/api";
import {
	type AuthRole,
	type RegisterRequestPayload,
	type RegisterResponse,
	registerService,
} from "../services/auth.service";

interface UseRegisterOptions {
	onError?: (error: ApiError) => void;
	onSuccess?: (data: RegisterResponse) => void;
}

interface RegisterFormPayload {
	email: string;
	name?: string;
	role?: AuthRole;
	password: string;
}

function deriveNameFromEmail(email: string) {
	const localPart = email.split("@")[0] ?? "";
	const normalized = localPart.replace(/[._-]+/g, " ").trim();
	return normalized.length > 0 ? normalized : "VAYLA User";
}

function createUserIdentity() {
	const suffix = Math.floor(1000 + Math.random() * 9000);
	return `#VY-${suffix}`;
}

export function useRegister(options?: UseRegisterOptions) {
	const mutation = useAppMutation<RegisterResponse, RegisterFormPayload>({
		onError: error => {
			options?.onError?.(error);
		},
		onSuccess: data => {
			options?.onSuccess?.(data);
		},
		mutationFn: async values => {
			const payload: RegisterRequestPayload = {
				email: values.email,
				password: values.password,
				role: values.role ?? "fan",
				userIdentity: createUserIdentity(),
				name: values.name ?? deriveNameFromEmail(values.email),
			};

			return registerService(payload);
		},
	});

	return {
		...mutation,
		register: mutation.mutateAsync,
	};
}
