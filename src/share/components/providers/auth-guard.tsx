"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

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
			router.replace("/connect-wallet");
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
