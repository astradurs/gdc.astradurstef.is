import { prisma } from "@/db/prisma-client"
import { NextRequest, NextResponse } from "next/server"
import ApiEvent from "../../shared/api-event"

type TVote = {
  email: string
  vote: boolean
}
export async function POST(
  request: NextRequest,
  { params: paramsPromise }: { params: Promise<{ restaurantId: string }> },
) {
  const f = "upsertVote"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()

  console.log({ f }, "Upserting vote")
  try {
    const { email, vote } = (await request.json()) as TVote
    const params = await paramsPromise

    if (!email || vote === undefined) {
      throw new Error("Missing required fields")
    }

    await prisma.votes.upsert({
      where: {
        email_restaurantid: {
          email,
          restaurantid: params.restaurantId,
        },
      },
      update: {
        vote,
      },
      create: {
        email,
        restaurantid: params.restaurantId,
        vote,
      },
    })

    const response = NextResponse.json(null, { status: 200 })
    console.log({ f }, "✅ Success", response)

    return response
  } catch (e) {
    console.error(
      { f },
      "Error in POST /api/restaurants/[restaurantId]/vote",
      e,
    )
    const response = NextResponse.json(
      {
        error: {
          message: "Generic error",
          code: "GenericError",
        },
      },
      { status: 500 },
    )

    console.error({ f }, "❌ Error", response)
    return response
  }
}
