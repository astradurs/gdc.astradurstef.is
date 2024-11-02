import ApiEvent from "@/app/api/shared/api-event"
import { prisma } from "@/db/prisma-client"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
  request: NextRequest,
  {
    params: paramsPromise,
  }: { params: Promise<{ slug: string; email: string }> },
) {
  const f = "removeFromWaitlist"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()

  console.log({ f }, "Removing from waitlist")
  try {
    const params = await paramsPromise
    console.log({ f }, "Params: ", params)

    console.log({ f }, "Deleting from waitlist", {
      slug: params.slug,
      email: params.email,
    })
    await prisma.gdcwaitlist.delete({
      where: {
        isodate_email: {
          isodate: params.slug,
          email: params.email,
        },
      },
    })

    const response = NextResponse.json(null, { status: 200 })
    console.log({ f }, "✅ Success", response)

    return response
  } catch (e) {
    console.log({ f }, "Error in DELETE /api/events/[slug]/[email]", e)
    const response = NextResponse.json(
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
