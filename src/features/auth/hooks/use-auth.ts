"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useMemo } from "react";

export function useAuth() {
	const { user, ready, authenticated, getAccessToken, logout: privyLogout } = usePrivy();

	const logout = useCallback(async () => {
		await privyLogout();
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("privy:token");
	}, [privyLogout]);

	const hasBackendToken = useMemo(() => {
		if (typeof window === "undefined") return false;
		return Boolean(localStorage.getItem("access_token"));
	}, []);

	const isAuthenticated = authenticated || hasBackendToken;
	const walletAddress = user?.wallet?.address ?? null;

	return {
		user,
		ready,
		logout,
		walletAddress,
		getAccessToken,
		hasBackendToken,
		isAuthenticated,
	};
}
