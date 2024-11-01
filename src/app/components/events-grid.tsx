import { Button, Card, Grid, Link, Text } from "@radix-ui/themes"
import { SanityDocument } from "next-sanity"

interface GDCEvent extends SanityDocument {
  title: string
  date: string
  limit: number
  slug: {
    current: string
  }
}

export default async function EventsGrid({ events }: { events: GDCEvent[] }) {
  return (
    <Grid columns={{ sm: "4" }} gap="2">
      {events.map((event: GDCEvent) => (
        <Card key={event.slug.current}>
          <Grid gap="2">
            <Grid>
              <Text weight="medium" size="4">
                {event.title}
              </Text>
              <Text size="2" color="gray">
                Hvenær: {new Date(event.date).toISOString().slice(0, 10)}
              </Text>
              <Text size="2" color="gray">
                Max pax: {event.limit}
              </Text>
            </Grid>

            <Button asChild>
              <Link href={`/events/${event.slug.current}`}>Sjá nánar</Link>
            </Button>
          </Grid>
        </Card>
      ))}
    </Grid>
  )
}
