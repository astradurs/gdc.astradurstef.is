import { terminateSession } from "@/app/actions/auth/session"

export async function POST(request: Request) {
  const f = "autRouter"
  console.log({ f }, { request })
  const body = await request.json()

  console.log({ f }, { body })

  const method = body.method
  if (method === "sign-out") {
    await terminateSession()
  }
}
