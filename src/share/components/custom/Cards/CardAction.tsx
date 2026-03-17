import type { StaticImageData } from "next/image";
import Image from "next/image";
import { Button } from "@/share/components/ui/button";

export type CardActionProps = {
	title: string;
	category: string;
	buttonTitle: string;
	buttonAction: () => void;
	image: string | StaticImageData;
};

export default function CardAction({
	title,
	image,
	category,
	buttonTitle,
	buttonAction,
}: CardActionProps) {
	return (
		<article className="overflow-hidden rounded-xl bg-card shadow-lg">
			<div className="flex flex-col gap-4 p-4">
				<div className="flex flex-col gap-2">
					<span className="text-xs font-medium uppercase tracking-wide text-primary">
						[{category}]
					</span>
					<h3 className="text-lg font-bold leading-snug text-card-foreground">{title}</h3>
				</div>

				<div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
					<Image
						fill
						alt=""
						src={image}
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 400px"
					/>
				</div>

				<Button
					type="button"
					onClick={buttonAction}
					className="w-full rounded-sm py-6 font-bold uppercase tracking-wide"
				>
					{buttonTitle}
				</Button>
			</div>
		</article>
	);
}
