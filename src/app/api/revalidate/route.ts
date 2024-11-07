import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import ApiEvent from "../shared/api-event"

export async function GET(request: NextRequest) {
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()

  const path = request.nextUrl.searchParams.get("path")

  if (path) {
    revalidatePath(path)
    return NextResponse.json({ revalidated: true, now: Date.now() })
  }

  return NextResponse.json({
    revalidated: false,
    now: Date.now(),
    message: "Missing path to revalidate",
  })
}
