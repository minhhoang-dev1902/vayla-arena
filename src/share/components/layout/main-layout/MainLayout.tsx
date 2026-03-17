import BottomNav from "@/share/components/layout/main-layout/BottomNav";
import Header from "@/share/components/layout/main-layout/Header";

export default function MainLayoutComponent({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="pt-14 pb-16">{children}</main>
			<BottomNav />
		</div>
	);
}
