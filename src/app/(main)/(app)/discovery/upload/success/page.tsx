import Link from "next/link";
import { Button } from "@/share/components/ui/button";

export default function UploadSuccessPage() {
	return (
		<div className="h-full overflow-hidden px-4 pt-20 pb-4">
			<div className="flex h-full flex-col rounded-md px-6">
				<div className="flex flex-1 flex-col items-center">
					<div className="flex size-24 items-center justify-center rounded-full">
						<div className="flex size-14 items-center justify-center rounded-full border-4 border-[#17b9af] text-4xl font-black text-[#17b9af]">
							✓
						</div>
					</div>

					<h1 className="mt-8 text-center text-3xl font-extrabold leading-tight text-[#184f4d]">
						Upload Submitted Successfully
					</h1>
					<p className="mt-6 text-center text-xl leading-relaxed text-[#0d9893]">
						Your track has been recorded on-chain.
					</p>
				</div>

				<div className="flex flex-col gap-4 pb-2">
					<Button
						asChild
						className="h-12 rounded-2xl bg-[linear-gradient(90deg,#33d8d1_0%,#109b96_100%)] text-lg font-semibold text-white shadow-lg"
					>
						<Link href="/discovery">View My Upload</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						className="h-12 rounded-2xl border bg-transparent text-lg font-semibold text-[#099d97]"
					>
						<Link href="/discovery">Close</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
