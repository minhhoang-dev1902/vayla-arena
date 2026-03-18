import Link from "next/link";
import { Button } from "@/share/components/ui/button";

export default function DiscoveryUploadPage() {
	return (
		<div className="flex flex-col gap-6 px-4 py-8">
			<h1 className="text-xl font-bold text-card-foreground">Upload Your Music</h1>
			<p className="text-sm text-muted-foreground">
				Total cost: 1 VAYLA + Network Fee. Music under 1 min, YouTube URL required.
			</p>
			<div className="flex gap-3">
				<Button asChild variant="outline" className="flex-1">
					<Link href="/discovery">Cancel</Link>
				</Button>
				<Button asChild className="flex-1">
					<Link href="/discovery/upload/form">Continue</Link>
				</Button>
			</div>
		</div>
	);
}
