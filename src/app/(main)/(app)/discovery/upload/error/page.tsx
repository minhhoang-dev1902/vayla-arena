import Link from "next/link";
import { Button } from "@/share/components/ui/button";

export default function UploadErrorPage() {
	return (
		<div className="h-full overflow-hidden px-4 py-4">
			<div className="relative flex h-full flex-col rounded-md  px-6 py-14">
				<div className="mt-8 flex flex-col items-center">
					<div className="flex size-24 items-center justify-center rounded-full bg-[#f4e9e9]">
						<div className="flex size-14 items-center justify-center rounded-full bg-[#f34747] text-5xl font-black text-white shadow-[0_10px_20px_rgba(243,71,71,0.28)]">
							!
						</div>
					</div>

					<h1 className="mt-10 text-center text-3xl font-extrabold leading-tight text-[#1b2436]">
						Transaction Failed
					</h1>
					<p className="mt-2 text-center text-xl font-semibold text-[#068f8d]">
						No VAYLA was used.
					</p>
					<p className="mt-7  text-center text-sm leading-6 text-muted-foreground">
						Your digital assets remain secure in your wallet. The network was unable to process this
						request at the moment.
					</p>
				</div>

				<div className="absolute bottom-7 left-1/2 grid w-[calc(100%-3rem)] max-w-[320px] -translate-x-1/2 grid-cols-2 gap-3">
					<Button
						asChild
						variant="outline"
						className="h-12 rounded-2xl border border-[#12b8af] bg-transparent text-base font-semibold text-[#0ea19a]"
					>
						<Link href="/discovery/upload">Close</Link>
					</Button>
					<Button
						asChild
						className="h-12 rounded-2xl bg-[linear-gradient(90deg,#27d1c7_0%,#0db8ac_100%)] text-base font-semibold text-white"
					>
						<Link href="/discovery/upload/processing?result=success">Try Again</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
