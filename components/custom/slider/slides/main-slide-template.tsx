import { Button } from "@/components/ui/button"
import Image from "next/image"
interface MainSlideTemplateProps {
    image: string
    imageAlt: string
    title: string
    subtitle: string
    content: React.ReactNode
    buttonText: string
    action?: () => void
}

function MainSlideTemplate(props: MainSlideTemplateProps) {
    const { image, imageAlt, title, subtitle, content, buttonText, action } = props
    return (
        <div className="relative h-full w-full">
            <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
            />
            <div
                className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/75"
                aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center px-4 pt-[25%] pb-20">
                <div className="w-full max-w-[340px]">
                    <p className="mb-1 text-center text-2xl font-bold leading-tight text-amber-400">
                        {title}
                    </p>
                    <h2 className="mt-6 text-center text-2xl font-semibold italic leading-snug text-white">
                        {subtitle}
                    </h2>
                    <div className="mt-20">
                        {content}
                    </div>
                </div>
                <div className="mt-auto w-full max-w-[300px]">
                    <Button
                        variant="default"
                        className="flex w-full items-center justify-center rounded-sm bg-[#0000ff] px-5 py-3.5"
                        onClick={() => action?.()}
                    >
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MainSlideTemplate