import { Container, Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { AuthKitProvider } from "@workos-inc/authkit-nextjs"
import type { Metadata } from "next"
import { getAuthorizationUrl, getUser } from "./auth"
import Header from "./components/header"
import "./globals.css"
import { ClientProviders } from "./providers"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated } = await getUser()
  let authKitUrl = ""
  if (isAuthenticated) {
    console.log("User is authenticated")
  } else {
    console.log("User is not authenticated")
    authKitUrl = getAuthorizationUrl("/")
  }
  return (
    <html
      lang="en"
      suppressHydrationWarning={process.env.NODE_ENV === "production"}
    >
      <body>
        <ClientProviders>
          <AuthKitProvider>
            <Container>
              <Flex height="100%" direction="column" justify="between">
                <main>
                  <Header
                    isAuthenticated={isAuthenticated}
                    authKitUrl={authKitUrl}
                  />
                  {children}
                </main>
              </Flex>
            </Container>
          </AuthKitProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
