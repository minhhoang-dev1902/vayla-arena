import { ViewAreaProvider } from "@/share/components/providers/view-area-provider";
import { LAYOUT_MAX_WIDTH_PX } from "@/share/constants/layout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return (
		<ViewAreaProvider
			style={{ maxWidth: LAYOUT_MAX_WIDTH_PX }}
			className="relative mx-auto min-h-screen w-full  bg-[white]"
		>
			{children}
		</ViewAreaProvider>
	);
}
