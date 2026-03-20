"use client";

export default function UploadProcessingPage() {
	return (
		<div className="h-full overflow-hidden px-4 py-4">
			<div className="relative flex h-full flex-col items-center rounded-md px-6 py-14">
				<div className="mt-12 flex size-36 items-center justify-center rounded-full border-4 border-[#11bdb1] bg-[#d7f2ef] shadow-[0_0_0_10px_rgba(17,189,177,0.08),0_20px_45px_rgba(22,164,156,0.15)]">
					<span className="text-6xl font-semibold text-[#11bdb1]">V</span>
				</div>

				<p className="mt-9 text-xs font-semibold uppercase tracking-[0.35em] text-[#67bdb8]">
					WALLET GATE...
				</p>
				<h1 className="mt-4 text-center text-3xl font-extrabold leading-tight text-[#1a1f2a]">
					Confirming on-chain...
				</h1>

				<div className="absolute bottom-8 left-1/2 w-[calc(100%-3rem)] max-w-[300px] -translate-x-1/2">
					<div className="h-1.5 w-full overflow-hidden rounded-full bg-[#c9d9df]">
						<div className="h-full w-2/3 rounded-full bg-[#1abdb2]" />
					</div>
					<p className="mt-5 text-center text-sm text-[#83919a]">
						<span className="mr-2 inline-block size-2 rounded-full bg-[#1abdb2]" />
						Securing transaction
					</p>
				</div>
			</div>
		</div>
	);
}
