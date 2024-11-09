// This example uses Next.js with React Server Components.
import { WorkOS, type User } from "@workos-inc/node"
import { cookies } from "next/headers"

// Javascript Object Signing and Encryption (JOSE)
// https://www.npmjs.com/package/jose
import { prisma } from "@/db/prisma-client"
import { jwtVerify } from "jose"

const workos = new WorkOS(process.env.WORKOS_API_KEY)
const clientId = process.env.WORKOS_CLIENT_ID || ""
const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI || ""
export function getAuthorizationUrl(pathname?: string) {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Specify that we'd like AuthKit to handle the authentication flow
    provider: "authkit",
    state: `pathname=${pathname}`,
    // The callback endpoint that WorkOS will redirect to after a user authenticates
    redirectUri: redirectUri,
    clientId,
  })

  return authorizationUrl
}

export function getJwtSecretKey() {
  const secret = process.env.WORKOS_COOKIE_PASSWORD

  if (!secret) {
    throw new Error("WORKOS_COOKIE_PASSWORD is not set")
  }

  return new Uint8Array(Buffer.from(secret, "base64"))
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey(), {
      maxTokenAge: "720 hours",
    })
    return payload
  } catch (error) {
    console.log("Error verifying JWT token", error)
    return null
  }
}

export type TUser = {
  email: string
  firstname: string | null
  lastname: string | null
}

// Verify the JWT and return the user
export async function getUser(): Promise<{
  isAuthenticated: boolean
  user?: TUser | null
}> {
  const ck = await cookies()
  const token = ck.get("token")?.value

  if (token) {
    const verifiedToken = await verifyJwtToken(token)
    if (verifiedToken) {
      const authUser = verifiedToken.user as User | null
      if (authUser === null) {
        return { isAuthenticated: false }
      }
      const dbUser = await prisma.user.findUnique({
        where: {
          email: authUser.email,
        },
      })
      return {
        isAuthenticated: true,
        user: dbUser,
      }
    }
  }

  return { isAuthenticated: false }
}

/* 
  Because RSC allows running code on the server, you can
  call `getUser()` directly within a server component:

  function SignInButton() {
    const { isAuthenticated } = getUser();
    return <button>{isAuthenticated ? "Sign Out" : "Sign In"}</button>;
  }
*/
