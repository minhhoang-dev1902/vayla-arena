"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

// TODO: remove — temporary hardcoded token for development
if (typeof window !== "undefined") {
	localStorage.setItem(
		"access_token",
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkMjE2OTAwLTZlMmItNDgyMi1hYmM1LWRiZWE4NjU2MGMzNiIsImVtYWlsIjoiYWRtaW5AdmF5bGEuaW8iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NzQ0OTkzMzUsImV4cCI6MTc3NDUwMDIzNX0.T_Vzu-v1VER62zFRFDCStzWQP7VY4Y_D_gm8sqcRF9k",
	);
}

const PUBLIC_ROUTES = ["/welcome", "/login", "/sign-up", "/connect-wallet"];

function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { ready, isAuthenticated } = useAuth();

	const isPublic = isPublicRoute(pathname);

	useEffect(() => {
		if (!ready || isPublic) return;

		if (!isAuthenticated) {
			router.replace("/welcome");
		}
	}, [ready, isPublic, isAuthenticated, router]);

	if (isPublic) return <>{children}</>;

	if (!ready) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Loader2 className="size-8 animate-spin text-[#1ce8d7]" />
			</div>
		);
	}

	if (!isAuthenticated) return null;

	return <>{children}</>;
}
