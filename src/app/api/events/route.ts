import { sanityFetch } from "@/sanity/lib/fetch"
import { eventsQuery } from "@/sanity/lib/queries/events"
import { SanityDocument } from "next-sanity"
import { NextRequest, NextResponse } from "next/server"
import { TErrorResponse } from "../../shared/types/api"
import ApiEvent from "../shared/api-event"
import DateTimeUtils from "../shared/date-time-utils"

interface GDCEvent extends SanityDocument {
  title: string
  date: string
  limit: number
  slug: {
    current: string
  }
}

type TSuccessResponse = NextResponse<{
  futureEvents: Array<GDCEvent>
  pastEvents: Array<GDCEvent>
}>

export async function GET(
  request: NextRequest,
): Promise<TSuccessResponse | TErrorResponse> {
  const f = "listEvents"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()
  const mock_server_time = apiEvent.query("mock_server_time") ?? null
  const dtu = new DateTimeUtils(mock_server_time)

  try {
    console.log({ f }, "Fetching events")
    const events = await sanityFetch<GDCEvent[]>({ query: eventsQuery })
    console.log({ f }, `Fetched ${events.length} events`)

    const today = dtu.local().toISODate()
    console.log({ f }, "Filtering future events", { today })
    const futureEvents = events
      .filter((event) => {
        return event.date >= dtu.local().toISODate()
      })
      .map((event) => {
        return { ...event, registrationStatus: "OPEN" }
      })
    console.log({ f }, `Found ${futureEvents.length} future events`)

    console.log({ f }, "Filtering past events", { today })
    const pastEvents = events
      .filter((event) => {
        return event.date < dtu.local().toISODate()
      })
      .map((event) => {
        return { ...event, registrationStatus: "CLOSED" }
      })
    console.log({ f }, `Found ${pastEvents.length} past events`)

    const response = NextResponse.json(
      { futureEvents, pastEvents },
      { status: 200 },
    )

    console.log({ f }, "✅ Success", response)
    return response
  } catch (error) {
    console.log("error", error)
    const response = NextResponse.json(
      {
        error: {
          message: "Generic error",
          code: "GenericError",
        },
      },
      { status: 500 },
    )
    return response
  }
}
