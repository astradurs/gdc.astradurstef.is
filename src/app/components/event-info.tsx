import { urlFor } from "@/sanity/lib/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import { AspectRatio, Box, Grid, Link, Text } from "@radix-ui/themes"
import { SanityDocument } from "@sanity/client"
import Image from "next/image"

const components: PortableTextComponents = {
  block: ({ children }) => {
    return <Text>{children}</Text>
  },
  marks: {
    b: ({ children }) => <Text className="font-semibold">{children}</Text>,
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

  const locationQuery =
    event.location.title.split(" ").join("+") +
    "+" +
    event.location.address.split(" ").join("+")

  return (
    <Grid gap="4">
      {event?.image ? (
        <Box>
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
        </Box>
      ) : null}
      <Grid gap="2">
        <PortableText value={event.body} components={components} />
      </Grid>
      <Grid className="grid">
        <Text weight="bold" size="4">
          HVAR?!
        </Text>
        <Link
          href={`https://maps.google.com/?q=${locationQuery}`}
          className="grid group"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text weight="medium" size="4">
            {event.location.title}
          </Text>
          <Text size="2">{event.location.address}</Text>
        </Link>
      </Grid>
      <div className="grid">
        <Text weight="bold" size="4">
          HVENÆR?!
        </Text>

        <Text size="4">
          {eventDateFormatted} kl {timeFormatted}
        </Text>
      </div>
    </Grid>
  )
}
