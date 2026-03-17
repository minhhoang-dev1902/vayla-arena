import { Menu } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/share/components/ui/sheet";
import { LAYOUT_MAX_WIDTH_PX } from "@/share/constants/layout";

function Header() {
	return (
		<header
			style={{ maxWidth: LAYOUT_MAX_WIDTH_PX }}
			className="fixed top-0 left-1/2 z-40 flex h-14 w-full -translate-x-1/2 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur supports-backdrop-filter:bg-card/80"
		>
			<p className="text-lg font-bold text-card-foreground">VAYLA Arena</p>
			<Sheet>
				<SheetTrigger
					className="p-2 cursor-pointer text-card-foreground"
					// suppressHydrationWarning
				>
					<Menu className="size-4" />
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Are you absolutely sure?</SheetTitle>
						<SheetDescription>This action cannot be undone.</SheetDescription>
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</header>
	);
}

export default Header;
