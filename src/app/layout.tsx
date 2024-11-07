import { AuthKitProvider } from "@workos-inc/authkit-nextjs"
import type { Metadata } from "next"
import { getAuthorizationUrl, getUser } from "./auth"
import Header from "./components/header/header"
import "./globals.css"
import { Providers } from "./providers"

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
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthKitProvider>
            <main className="h-screen w-full p-2.5">
              <div className="mx-auto min-h-full max-w-5xl">
                <Header
                  isAuthenticated={isAuthenticated}
                  authKitUrl={authKitUrl}
                />
                {children}
              </div>
            </main>
          </AuthKitProvider>
        </Providers>
      </body>
    </html>
  )
}
