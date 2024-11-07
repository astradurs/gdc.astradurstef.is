import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SanityDocument } from "next-sanity"
import Link from "next/link"
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
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      {events.map((event: GDCEvent) => (
        <Card key={event.slug.current}>
          <CardHeader>
            <h4>{event.title}</h4>
          </CardHeader>
          <CardContent className="grid">
            <span>
              Hvenær: {dtu.fromISODate(event.date).toFormat("dd.MM.yyyy")}
            </span>
            <span>Max pax: {event.limit}</span>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/events/${event.slug.current}`}>Sjá nánar</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
