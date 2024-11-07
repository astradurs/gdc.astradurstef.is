"use client"

import { Button, Flex, TabNav, Text } from "@radix-ui/themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "./theme-switcher"

export default function Header({
  isAuthenticated,
  authKitUrl,
}: {
  isAuthenticated: boolean
  authKitUrl: string
}) {
  const pathname = usePathname()
  if (!isAuthenticated) {
    return null
  }
  // get where we are in the app next

  const isEvents = pathname === "/"
  const isRestaurants = pathname.startsWith("/restaurants")
  const isStudio = pathname.startsWith("/studio")

  if (isStudio) {
    return null
  }

  const authButton = isAuthenticated ? (
    <Button disabled asChild>
      <Text>Signed in</Text>
    </Button>
  ) : (
    <Button asChild>
      <Link href={authKitUrl}>Sign in</Link>
    </Button>
  )

  return (
    <Flex justify="between">
      <Flex>
        <TabNav.Root>
          <TabNav.Link href="/" active={isEvents}>
            Viðburðir
          </TabNav.Link>
          <TabNav.Link href="/restaurants" active={isRestaurants}>
            Veitingahús
          </TabNav.Link>
          <TabNav.Link href="/studio">Stjórnendur</TabNav.Link>
        </TabNav.Root>
      </Flex>
      <Flex gap="2">
        {authButton}
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
