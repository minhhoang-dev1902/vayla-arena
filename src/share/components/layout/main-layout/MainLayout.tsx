import BottomNav from "@/share/components/layout/main-layout/BottomNav";
import Header from "@/share/components/layout/main-layout/Header";
import { BOTTOM_NAV_HEIGHT_PX, HEADER_HEIGHT_PX } from "@/share/constants/layout";

export default function MainLayoutComponent({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-dvh overflow-hidden">
			<Header />
			<main
				className="overflow-y-auto"
				style={{
					marginTop: HEADER_HEIGHT_PX,
					height: `calc(100dvh - ${HEADER_HEIGHT_PX + BOTTOM_NAV_HEIGHT_PX}px)`,
				}}
			>
				{children}
			</main>
			<BottomNav />
		</div>
	);
}
