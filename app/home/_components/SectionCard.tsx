import { Button } from "@/components/ui/button"
import Image from "next/image"

export type SectionCardProps = {
  label: string
  imageSrc: string
  imageAlt: string
  title: string
  buttonText: string
  action: () => void
}

export function SectionCard({
  label,
  imageSrc,
  imageAlt,
  title,
  buttonText,
  action,
}: SectionCardProps) {
  return (
    <article className="px-1 flex w-full flex-col overflow-hidden rounded-xl border-[#4285F4] bg-white shadow-md border-t-2 border-l-2 border-r-6 border-b-6">
      <p className=" px-2 pt-4 text-base font-semibold text-black text-xl">[{label}]</p>
      <div className="relative mt-4 aspect-[5/2] w-full overflow-hidden px-4">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="rounded-lg object-cover"
          sizes="(max-width: 384px) 100vw, 384px"
        />
      </div>
      <h2 className="px-10 py-4 text-center text-xl font-bold leading-snug text-black">
        {title}
      </h2>
      <div className="px-10 pb-6">
        <Button
          onClick={action}
          className="flex w-full items-center justify-center rounded-lg bg-[#FFD700]  py-6 text-black transition-opacity hover:opacity-90 text-sm"
        >
          {buttonText}
        </Button>
      </div>
    </article>
  )
}
