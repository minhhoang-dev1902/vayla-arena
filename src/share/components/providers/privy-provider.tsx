"use client";

import { PrivyProvider as PrivySDKProvider, usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

function PrivyTokenSync({ children }: { children: React.ReactNode }) {
	const { ready, authenticated, getAccessToken } = usePrivy();

	useEffect(() => {
		if (!ready) return;

		if (authenticated) {
			getAccessToken().then(token => {
				if (token) {
					localStorage.setItem("privy:token", token);
				}
			});
		} else {
			localStorage.removeItem("privy:token");
		}
	}, [ready, authenticated, getAccessToken]);

	return <>{children}</>;
}

export function PrivyAuthProvider({ children }: { children: React.ReactNode }) {
	return (
		<PrivySDKProvider
			appId={PRIVY_APP_ID}
			config={{
				appearance: {
					logo: undefined,
					walletList: [
						"metamask",
						"coinbase_wallet",
						"wallet_connect",
						"detected_ethereum_wallets",
					],
					theme: "dark",
					accentColor: "#1ce8d7",
				},
				loginMethods: ["wallet", "email"],
				embeddedWallets: {
					ethereum: {
						createOnLogin: "users-without-wallets",
					},
				},
			}}
		>
			<PrivyTokenSync>{children}</PrivyTokenSync>
		</PrivySDKProvider>
	);
}
