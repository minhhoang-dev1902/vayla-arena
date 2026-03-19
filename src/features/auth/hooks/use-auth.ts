"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useCallback } from "react";

export function useAuth() {
	const { ready, authenticated, user, logout: privyLogout, getAccessToken } = usePrivy();

	const logout = useCallback(async () => {
		await privyLogout();
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
	}, [privyLogout]);

	const walletAddress = user?.wallet?.address ?? null;

	return {
		ready,
		authenticated,
		user,
		walletAddress,
		logout,
		getAccessToken,
	};
}
