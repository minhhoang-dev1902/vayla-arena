"use client";

import { PrivyProvider as PrivySDKProvider, usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useRef } from "react";
import { privyLoginService } from "@/features/auth/services/auth.service";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

function PrivyTokenSync({ children }: { children: React.ReactNode }) {
	const { ready, authenticated, getAccessToken } = usePrivy();
	const syncing = useRef(false);

	const syncBackendAuth = useCallback(async () => {
		if (syncing.current) return;
		syncing.current = true;

		try {
			const privyToken = await getAccessToken();
			if (!privyToken) return;

			localStorage.setItem("privy:token", privyToken);

			if (localStorage.getItem("access_token")) return;

			const response = await privyLoginService({ accessToken: privyToken });
			localStorage.setItem("access_token", response.accessToken);
			localStorage.setItem("refresh_token", response.refreshToken);
		} catch {
			// Backend login failed — keep privy:token for retry
		} finally {
			syncing.current = false;
		}
	}, [getAccessToken]);

	useEffect(() => {
		if (!ready) return;

		if (authenticated) {
			syncBackendAuth();
		} else {
			localStorage.removeItem("privy:token");
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
		}
	}, [ready, authenticated, syncBackendAuth]);

	return <>{children}</>;
}

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
	return (
		<PrivySDKProvider
			appId={PRIVY_APP_ID}
			config={{
				loginMethods: ["wallet", "email"],
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
				appearance: {
					theme: "dark",
					logo: undefined,
					accentColor: "#1ce8d7",
					walletList: [
						"metamask",
						"coinbase_wallet",
						"wallet_connect",
						"detected_ethereum_wallets",
					],
				},
			}}
		>
			<PrivyTokenSync>{children}</PrivyTokenSync>
		</PrivySDKProvider>
	);
}
