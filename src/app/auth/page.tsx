import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkOS } from "@workos-inc/node"

// This example uses Next.js with React Server Components.
// Because this page is an RSC, the code stays on the server, which allows
// us to use the WorkOS Node SDK without exposing our API key to the client.
//
// If your application is a single page app (SPA), you will need to:
// - create a form that can POST to an endpoint in your backend
// - call the `getAuthorizationURL` method in that endpoint
// - redirect the user to the returned URL

const workos = new WorkOS(process.env.WORKOS_API_KEY)

export default async function Auth() {
  return (
    <Tabs defaultValue="google-oauth" className="w-[220px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="google-oauth">Google</TabsTrigger>
        <TabsTrigger value="sso">SSO</TabsTrigger>
      </TabsList>
      <SignInWithGoogleOAuth />
    </Tabs>
  )
}

async function SignInWithGoogleOAuth() {
  const googleOAuthUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID as string,
    provider: "GoogleOAuth",
    redirectUri: process.env.NEXT_PUBLIC_WORKOS_GOOGLE_REDIRECT_URI as string,
  })

  return (
    <TabsContent value="google-oauth">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">Google OAuth</CardTitle>
        </CardHeader>

        <CardFooter>
          <Button asChild className="w-full">
            <a href={googleOAuthUrl}>Continue with Google</a>
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}
