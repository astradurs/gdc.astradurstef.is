import { Button, Card, Grid, Link, Text } from "@radix-ui/themes"
import { SanityDocument } from "next-sanity"
import DateTimeUtils from "../api/shared/date-time-utils"

interface GDCEvent extends SanityDocument {
  title: string
  date: string
  limit: number
  slug: {
    current: string
  }
}

export default async function EventsGrid({ events }: { events: GDCEvent[] }) {
  const dtu = new DateTimeUtils()
  return (
    <Grid columns={{ sm: "4" }} gap="2">
      {events.map((event: GDCEvent) => (
        <Card key={event.slug.current}>
          <Grid gap="2" minHeight="100%" align="end">
            <Text weight="medium" size="4">
              {event.title}
            </Text>
            <Grid>
              <Text size="2" color="gray">
                Hvenær: {dtu.fromISODate(event.date).toFormat("dd.MM.yyyy")}
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
