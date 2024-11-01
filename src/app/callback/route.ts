// Create a Route Handler `app/callback/route.js`
import { WorkOS } from "@workos-inc/node"
import { NextRequest, NextResponse } from "next/server"
// Javascript Object Signing and Encryption (JOSE)
// https://www.npmjs.com/package/jose
import { SignJWT } from "jose"

// Get secret
const WORKOS_COOKIE_PASSWORD = process.env.WORKOS_COOKIE_PASSWORD as string
const secret = new Uint8Array(Buffer.from(WORKOS_COOKIE_PASSWORD, "base64"))

const workos = new WorkOS(process.env.WORKOS_API_KEY)
const clientId = process.env.WORKOS_CLIENT_ID as string

export async function GET(req: NextRequest) {
  // The authorization code returned by AuthKit
  const code = req.nextUrl.searchParams.get("code") as string
  const state = req.nextUrl.searchParams.get("state") as string

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId,
  })

  // Use the information in `user` for further business logic.

  // Cleanup params and redirect to homepage
  const url = req.nextUrl.clone()
  console.log(url)
  url.searchParams.delete("code")
  url.searchParams.delete("state")
  if (state.includes("pathname=")) {
    const match = state.match(/pathname=(.*)/)
    const pathname = match ? match[1] : "/"
    url.pathname = pathname
  } else {
    url.pathname = "/"
  }

  const response = NextResponse.redirect(url)

  // Create a JWT with the user's information
  const token = await new SignJWT({
    // Here you might lookup and retrieve user details from your database
    user,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("4 weeks")
    .sign(secret)

  // Store in a cookie
  response.cookies.set({
    name: "token",
    value: token,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  })

  return response
}
