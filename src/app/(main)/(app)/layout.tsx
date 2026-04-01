import MainLayoutComponent from "@/share/components/layout/main-layout/MainLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <MainLayoutComponent>{children}</MainLayoutComponent>;
}
