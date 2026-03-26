/** Keys this app sets for API auth (Privy also uses its own keys; full logout uses Privy SDK). */
export function clearAppAuthStorage(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
	localStorage.removeItem("privy:token");
}
