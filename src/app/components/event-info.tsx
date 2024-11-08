import { AspectRatio } from "@/components/ui/aspect-ratio"
import { urlFor } from "@/sanity/lib/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { SanityDocument } from "@sanity/client"
import { MoveUpRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const components: PortableTextComponents = {
  block: ({ children }) => {
    return <span>{children}</span>
  },
  marks: {
    b: ({ children }) => <span className="font-semibold">{children}</span>,
  },
}

export default function EventInfo({ event }: { event: SanityDocument }) {
  const f = "EventInfo"
  console.log(f, event)
  const eventDate = new Date(event.date)
  const eventDateFormatted = eventDate.toLocaleDateString("is-IS", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const timeFormatted = eventDate.toLocaleTimeString("is-IS", {
    hour: "numeric",
    minute: "numeric",
  })

  const locationQuery = event.location.address.split(" ").join("+")

  return (
    <div className="flex flex-col justify-between gap-4">
      {event?.image ? (
        <AspectRatio ratio={16 / 8}>
          <Image
            // I need to have it not grow to fully 800 on small screens
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            priority={true}
            src={urlFor(event.image).url()}
            alt={event?.image?.alt}
            width={800}
            height={700}
          />
        </AspectRatio>
      ) : null}
      <div className="grid gap-2">
        <PortableText value={event.body} components={components} />
      </div>
      <div className="grid sm:grid-cols-2 items-start">
        <div className="flex flex-col">
          <span className="font-bold text-md">HVAR?!</span>
          <Link
            href={`https://maps.google.com/?q=${locationQuery}`}
            className="flex flex-col group hover:text-foreground/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex gap-1 items-center">
              <span className="font-semi text-md">{event.location.title}</span>
              <MoveUpRightIcon className="w-6 h-6 group-hover:scale-110" />
            </div>
            <span className="text-sm">{event.location.address}</span>
          </Link>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-md">HVENÆR?!</span>
          <span className="font-bold">
            {eventDateFormatted} kl {timeFormatted}
          </span>
        </div>
      </div>
    </div>
  )
}
