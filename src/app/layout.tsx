import { Container, Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { AuthKitProvider } from "@workos-inc/authkit-nextjs"
import type { Metadata } from "next"
import Header from "./components/header"
import "./globals.css"
import { ClientProviders } from "./providers"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
                  <Header />
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
