import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="pt-14 pb-16">{children}</main>
			<BottomNav />
		</div>
	);
}