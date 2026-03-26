import Image from "next/image";
import logoWithText from "@/assets/images/logo-with-text.png";
import { HEADER_HEIGHT_PX, LAYOUT_MAX_WIDTH_PX } from "@/share/constants/layout";

function Header() {
	return (
		<header
			style={{ height: HEADER_HEIGHT_PX, maxWidth: LAYOUT_MAX_WIDTH_PX }}
			className="fixed top-0 left-1/2 z-40 flex w-full -translate-x-1/2 items-center justify-between border-b border-white/10 bg-[black] px-4 py-1"
		>
			<Image alt="Vayla" width={140} src={logoWithText} className="object-contain" />
			{/* <Sheet>
				<SheetTrigger className="p-2 cursor-pointer text-card-foreground">
					<Menu className="size-5 text-white" />
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Are you absolutely sure?</SheetTitle>
						<SheetDescription>This action cannot be undone.</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet> */}
		</header>
	);
}

export default Header;
