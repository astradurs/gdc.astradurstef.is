import { User, WorkOS } from "@workos-inc/node"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// This is a Next.js Route Handler.
//
// If your application is a single page app (SPA) with a separate backend you will need to:
// - create a backend endpoint to handle the request
// - adapt the code below in your endpoint
//
// Please also note that for the sake of simplicity, we directly return the user here in the query string.
// In a real application, you would probably store the user in a token (JWT)
// and store that token in your DB or use cookies.

const workos = new WorkOS(process.env.WORKOS_API_KEY)

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      provider: string
    }>
  },
) {
  const f = "authProviderCallback"
  const code = new URL(request.url).searchParams.get("code") || ""
  const p = await params
  const provider = p.provider

  console.log(
    { f },
    {
      code,
      provider,
    },
  )

  let redirectUrl
  try {
    if (provider === "google-oauth") {
      console.log("provider is google-oauth")
      redirectUrl = await handleGoogleOAuthCallback(code)
      console.log({ f }, "Got a redirect url", redirectUrl)
    }

    if (redirectUrl) {
      console.log({ f }, "✅", redirectUrl)
      const response = NextResponse.redirect(redirectUrl)
      return response
    }
  } catch (error) {
    console.log({ f }, "❌", error)
    const response = NextResponse.json({ error }, { status: 400 })
    console.log({ f }, "❌", response)
    return response
  }
  const errorResponse = NextResponse.json(
    { error: "Invalid provider" },
    { status: 400 },
  )
  console.log({ f }, "❌", errorResponse)
  return errorResponse
}

interface Impersonator {
  email: string
  reason: string | null
}

interface Session {
  accessToken: string
  refreshToken: string
  user: User
  impersonator?: Impersonator
}

async function encryptSession(session: Session) {
  const ironSessionProvider = workos.userManagement.ironSessionProvider
  const encryptedSession = await ironSessionProvider.sealData(session, {
    password: process.env.WORKOS_COOKIE_PASSWORD as string,
    ttl: 60 * 60 * 24 * 7, // 1 week
  })

  return encryptedSession
}

async function handleGoogleOAuthCallback(code: string) {
  const f = "handleGoogleOAuthCallback"
  console.log({ f }, "code", code)
  const authResponse = await workos.userManagement.authenticateWithCode({
    clientId: process.env.WORKOS_CLIENT_ID || "",
    code,
  })

  console.log({ f }, "authResponse", authResponse)
  const session: Session = {
    accessToken: authResponse.accessToken,
    refreshToken: authResponse.refreshToken,
    user: authResponse.user,
    impersonator: authResponse.impersonator,
  }
  const encryptedSession = await encryptSession(session)
  const ck = await cookies()
  ck.set("token", encryptedSession, {
    httpOnly: true,
    secure: true,
  })

  const redirectUrl = process.env.HOST as string
  console.log({ f }, "redirectUrl", redirectUrl)
  return redirectUrl
}
