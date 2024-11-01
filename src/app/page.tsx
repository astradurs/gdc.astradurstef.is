import {
  getSignInUrl,
  getSignUpUrl,
  withAuth,
} from "@workos-inc/authkit-nextjs"
import Link from "next/link"
import Events from "./events/page"

export default async function Home() {
  // Retrieves the user from the session or returns `null` if no user is signed in
  const { user } = await withAuth()

  // Get the URL to redirect the user to AuthKit to sign in
  const signInUrl = await getSignInUrl()

  // Get the URL to redirect the user to AuthKit to sign up
  const signUpUrl = await getSignUpUrl()

  /**
   * If a signed-in user is mandatory, you can use the `ensureSignedIn`
   * configuration option. If logged out, the below will immediately redirect
   * the user to AuthKit. After signing in, the user will automatically
   * be redirected back to this page.
   * */
  // const { user } = await withAuth({ ensureSignedIn: true });

  if (!user) {
    return (
      <>
        <Link href={signInUrl}>Sign in</Link>;
        <Link href={signUpUrl}>Sign up</Link>;
      </>
    )
  }
  return <Events />
}
