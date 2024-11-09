import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { getCookieOptions } from "./cookie"
import {
  WORKOS_CLIENT_ID,
  WORKOS_COOKIE_DOMAIN,
  WORKOS_COOKIE_NAME,
} from "./env-variables"
import { encryptSession, terminateSession } from "./session"
import { workos } from "./workos"

export async function handleAuth(
  request: NextRequest,
  options: { returnPathname?: string } = {},
) {
  const code = request.nextUrl.searchParams.get("code")
  const state = request.nextUrl.searchParams.get("state")
  let returnPathname =
    state && state !== "null" ? JSON.parse(atob(state)).returnPathname : null

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { accessToken, refreshToken, user, impersonator } =
        await workos.userManagement.authenticateWithCode({
          clientId: WORKOS_CLIENT_ID,
          code,
        })

      const url = request.nextUrl.clone()

      // Cleanup params
      url.searchParams.delete("code")
      url.searchParams.delete("state")

      // Redirect to the requested path and store the session
      returnPathname = returnPathname ?? options.returnPathname
      // Extract the search params if they are present
      if (returnPathname.includes("?")) {
        const newUrl = new URL(returnPathname, process.env.HOST as string)
        url.pathname = newUrl.pathname

        for (const [key, value] of newUrl.searchParams) {
          url.searchParams.append(key, value)
        }
      } else {
        url.pathname = returnPathname
      }
      // Fall back to standard Response if NextResponse is not available.
      // This is to support Next.js 13.
      const response = NextResponse?.redirect
        ? NextResponse.redirect(url)
        : new Response(null, {
            status: 302,
            headers: {
              Location: url.toString(),
            },
          })
      // The refreshToken should never be accesible publicly, hence why we encrypt it in the cookie session
      // Alternatively you could persist the refresh token in a backend database
      const session = await encryptSession({
        accessToken,
        refreshToken,
        user,
        impersonator,
      })
      const cookieName = WORKOS_COOKIE_NAME || "wos-session"
      const nextCookies = await cookies()

      nextCookies.set(cookieName, session, getCookieOptions(request.url))

      return response
    } catch (error) {
      const errorRes = {
        error: error instanceof Error ? error.message : String(error),
      }

      console.error(errorRes)

      return errorResponse()
    }
  }
  return errorResponse()
}

function errorResponse() {
  const errorBody = {
    error: {
      message: "Something went wrong",
      description:
        "Couldn't sign in. If you are not sure what happened, please contact your organization admin.",
    },
  }

  // Use NextResponse if available, fallback to standard Response
  // This is to support Next.js 13.
  return NextResponse?.json
    ? NextResponse.json(errorBody, { status: 500 })
    : new Response(JSON.stringify(errorBody), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
}

export async function signOut() {
  const cookie: { name: string; domain?: string } = {
    name: WORKOS_COOKIE_NAME || "wos-session",
  }
  if (WORKOS_COOKIE_DOMAIN) cookie.domain = WORKOS_COOKIE_DOMAIN

  const nextCookies = await cookies()
  nextCookies.delete(cookie)
  await terminateSession()
}