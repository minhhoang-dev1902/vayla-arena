"use client";

import type { User } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { clearAppAuthStorage } from "@/lib/clear-auth-storage";

export type LinkedWalletOption = {
	address: string;
	label: string;
};

function shortAddr(address: string): string {
	if (address.length <= 14) return address;
	return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function collectLinkedWallets(user: User | null): LinkedWalletOption[] {
	if (!user?.linkedAccounts) return [];
	const out: LinkedWalletOption[] = [];
	for (const account of user.linkedAccounts) {
		if (account.type === "wallet" && "address" in account && account.address) {
			const chain =
				"chainType" in account && account.chainType ? String(account.chainType) : "wallet";
			out.push({
				address: account.address,
				label: `${shortAddr(account.address)} · ${chain}`,
			});
		} else if (account.type === "smart_wallet" && "address" in account && account.address) {
			out.push({
				address: account.address,
				label: `${shortAddr(account.address)} · smart`,
			});
		}
	}
	return out;
}

export function useAuth() {
	const { user, ready, authenticated, getAccessToken, logout: privyLogout } = usePrivy();

	const linkedWallets = useMemo(() => collectLinkedWallets(user), [user]);

	const [activeWalletAddress, setActiveWalletAddressState] = useState<string | null>(null);

	useEffect(() => {
		if (!user?.id || linkedWallets.length === 0) {
			setActiveWalletAddressState(null);
			return;
		}
		const storageKey = `vayla:active_wallet:${user.id}`;
		const stored = localStorage.getItem(storageKey);
		const next =
			stored && linkedWallets.some(w => w.address === stored) ? stored : linkedWallets[0].address;
		setActiveWalletAddressState(next);
		if (next !== stored) localStorage.setItem(storageKey, next);
	}, [user?.id, linkedWallets]);

	const setActiveWalletAddress = useCallback(
		(address: string) => {
			if (!user?.id) return;
			if (!linkedWallets.some(w => w.address === address)) return;
			const storageKey = `vayla:active_wallet:${user.id}`;
			localStorage.setItem(storageKey, address);
			setActiveWalletAddressState(address);
		},
		[user?.id, linkedWallets],
	);

	const logout = useCallback(async () => {
		if (user?.id) {
			localStorage.removeItem(`vayla:active_wallet:${user.id}`);
		}
		await privyLogout();
		clearAppAuthStorage();
	}, [privyLogout, user?.id]);

	const isAuthenticated = authenticated;
	const walletAddress =
		activeWalletAddress ?? linkedWallets[0]?.address ?? user?.wallet?.address ?? null;

	return {
		user,
		ready,
		logout,
		walletAddress,
		linkedWallets,
		setActiveWalletAddress,
		getAccessToken,
		isAuthenticated,
	};
}
