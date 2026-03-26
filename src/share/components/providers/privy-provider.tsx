"use client";

import {
	getIdentityToken,
	PrivyProvider as PrivySDKProvider,
	usePrivy,
} from "@privy-io/react-auth";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { privyLoginService } from "@/features/auth/services/auth.service";
import { clearAppAuthStorage } from "@/lib/clear-auth-storage";
import { setPrivyAccessTokenGetter } from "@/lib/privy-access-token";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";

function PrivyTokenSync({ children }: { children: React.ReactNode }) {
	const { ready, authenticated, getAccessToken } = usePrivy();
	const syncing = useRef(false);

	/**
	 * Sau Privy authenticate: POST /auth/privy/login với privy_access_token + identity_token,
	 * rồi lưu accessToken / refreshToken do Vayla trả về.
	 */
	const syncVaylaSessionAfterPrivyAuth = useCallback(async () => {
		if (syncing.current) return;
		syncing.current = true;

		try {
			const privyAccessToken = await getAccessToken();
			const identityToken = await getIdentityToken();
			if (!privyAccessToken || !identityToken) {
				clearAppAuthStorage();
				return;
			}

			if (localStorage.getItem("access_token")) {
				return;
			}

			const data = await privyLoginService({
				identityToken,
				accessToken: privyAccessToken,
			});

			localStorage.setItem("access_token", data.accessToken);
			localStorage.setItem("refresh_token", data.refreshToken);
		} catch {
			clearAppAuthStorage();
		} finally {
			syncing.current = false;
		}
	}, [getAccessToken]);

	/*
	 * Đăng ký getter trước mọi useEffect của con (vd. React Query). Nếu chỉ dùng useEffect,
	 * request đầu tiên chạy khi getter vẫn null → không có Authorization → 401.
	 */
	useLayoutEffect(() => {
		if (!ready) {
			setPrivyAccessTokenGetter(null);
			return;
		}
		if (authenticated) {
			setPrivyAccessTokenGetter(() => getAccessToken().then(t => t ?? undefined));
		} else {
			setPrivyAccessTokenGetter(null);
		}
	}, [ready, authenticated, getAccessToken]);

	useEffect(() => {
		if (!ready || !authenticated) {
			if (!authenticated && ready) {
				clearAppAuthStorage();
			}
			return;
		}
		syncVaylaSessionAfterPrivyAuth();
	}, [ready, authenticated, syncVaylaSessionAfterPrivyAuth]);

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
