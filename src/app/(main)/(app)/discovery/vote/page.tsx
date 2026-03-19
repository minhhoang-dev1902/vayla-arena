import Link from "next/link";
import { Button } from "@/share/components/ui/button";

export default function DiscoveryVotePage() {
	return (
		<div className="flex flex-col gap-6 px-4 py-8">
			<h1 className="text-xl font-bold text-card-foreground">Rank Your Top 3</h1>
			<p className="text-sm text-muted-foreground">
				Reorder your picks and confirm your discovery vote. Cost: 0.1 VAYLA + Network Fee.
			</p>
			<div className="flex gap-3">
				<Button asChild variant="outline" className="flex-1">
					<Link href="/discovery">Cancel</Link>
				</Button>
				<Button asChild className="flex-1">
					<Link href="/discovery/vote/confirm">Save New Order</Link>
				</Button>
			</div>
		</div>
	);
}
