import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react";


function Header() {
    return (
        <header className="fixed top-0 left-1/2 z-40 flex h-14 w-full max-w-xl -translate-x-1/2 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <p className="text-lg font-bold">VAYLA Arena</p>
            <Sheet>
                <SheetTrigger className="p-2 cursor-pointer">
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