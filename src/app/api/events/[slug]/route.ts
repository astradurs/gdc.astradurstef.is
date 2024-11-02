import { prisma } from "@/db/prisma-client"
import { sanityFetch } from "@/sanity/lib/fetch"
import { eventQuery } from "@/sanity/lib/queries/events"
import { SanityDocument } from "next-sanity"
import { NextRequest, NextResponse } from "next/server"
import { TErrorResponse } from "../../../shared/types/api"
import ApiEvent from "../../shared/api-event"
import DateTimeUtils from "../../shared/date-time-utils"

interface GDCEvent extends SanityDocument {
  title: string
  date: string
  limit: number
  slug: {
    current: string
  }
  registration_start: string
  registration_end: string
}

type TSuccessResponse = NextResponse<GDCEvent> | NextResponse<null>

export async function GET(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ slug: string }> },
): Promise<TSuccessResponse | TErrorResponse> {
  const f = "getEventBySlug"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()

  const params = await paramsPromise
  console.log({ f }, "Params: ", params)
  const { slug } = params

  const mock_server_time = apiEvent.query("mock_server_time") ?? null
  const dtu = new DateTimeUtils(mock_server_time)

  try {
    const event: GDCEvent = await sanityFetch({
      query: eventQuery,
      params: { slug },
    })

    if (event === null) {
      console.log({ f }, "No event found", { slug })
      const body = null

      const response = NextResponse.json(body, { status: 404 })
      console.log({ f }, "✅ Sucess", response)
      return response
    }

    console.log({ f }, "Event found", { slug, event })

    const today = dtu.local().toISO()

    const eventDate = dtu.fromISODate(event.date).toISO()
    const registrationStart = dtu.fromISODate(event.registration_start).toISO()
    const registrationEnd = dtu.fromISODate(event.registration_end).toISO()

    console.log({ f }, "Dates", {
      today,
      eventDate,
      registrationStart,
      registrationEnd,
    })

    const isOpen =
      eventDate > today && registrationStart < today && registrationEnd > today
    if (isOpen) {
      console.log({ f }, "Event is open", { slug })
      event.registrationStatus = "OPEN"
    } else {
      console.log({ f }, "Event is closed", { slug })
      event.registrationStatus = "CLOSED"
    }

    console.log({ f }, "Fetching waitlist", { slug })
    const waitlist = await prisma.gdcwaitlist.findMany({
      where: {
        isodate: slug,
      },
      include: {
        user: true,
      },
    })

    if (waitlist.length === 0) {
      console.log("No waitlist entries", { slug })
    } else {
      console.log("Waitlist entries found", { slug, waitlist })
    }

    const body = {
      ...event,
      waitlist,
    }

    console.log("Event found", { slug, event, waitlist })

    const response = NextResponse.json(body, { status: 200 })
    console.log({ f }, "✅ Success", response)
    return response
  } catch (e) {
    console.log("Error in GET /api/events/[slug]", e)
    const response: TErrorResponse = NextResponse.json(
      {
        error: {
          message: "Generic error",
          code: "GenericError",
        },
      },
      { status: 500 },
    )

    console.log({ f }, "❌ Error", response)
    return response
  }
}

type TAddToWaitlistBody = {
  email: string
}

export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ slug: string }> },
): Promise<TSuccessResponse | TErrorResponse> {
  const f = "addToWaitlist"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()

  const params = await paramsPromise
  console.log({ f }, "Params: ", params)
  const { slug } = params

  const mock_server_time = apiEvent.query("mock_server_time") ?? null
  const dtu = new DateTimeUtils(mock_server_time)
  const today = dtu.local().toISO()
  try {
    const body = (await request.json()) as TAddToWaitlistBody

    const email = body.email

    if (!email) {
      console.log({ f }, "Missing required fields")
      const response: TErrorResponse = NextResponse.json(
        {
          error: {
            message: "Missing required fields",
            code: "MissingRequiredFields",
          },
        },
        { status: 400 },
      )

      console.log({ f }, "❌ Error", response)
      return response
    }

    const event: GDCEvent = await sanityFetch({
      query: eventQuery,
      params: { slug },
    })

    if (event === null) {
      console.log({ f }, "No event found", { slug })
      const response = NextResponse.json(null, { status: 404 })
      console.log({ f }, "❌ Error", response)
      return response
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (user === null) {
      console.log({ f }, "User not found", { email })
      const response: TErrorResponse = NextResponse.json(
        {
          error: {
            message: "User not found",
            code: "UserNotFound",
          },
        },
        { status: 404 },
      )

      console.log({ f }, "❌ Error", response)
      return response
    }

    await prisma.gdcwaitlist.create({
      data: {
        isodate: slug,
        user: {
          connect: {
            email,
          },
        },
        createtime: today,
      },
    })

    const response = NextResponse.json(null, { status: 200 })
    console.log({ f }, "✅ Success", response)

    return response
  } catch (e) {
    console.log({ f }, "Error creating a new waitlist entry", e)
    const response: TErrorResponse = NextResponse.json(
      {
        error: {
          message: "Generic error",
          code: "GenericError",
        },
      },
      { status: 500 },
    )

    console.log({ f }, "❌ Error", response)
    return response
  }
}
