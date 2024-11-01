"use client"

import { Flex, TabNav } from "@radix-ui/themes"
import { ThemeSwitcher } from "./theme-switcher"

export default function Header() {
  // get where we are in the app next
  const path = window.location.pathname

  const isEvents = path === "/"
  const isRestaurants = path === "/restaurants"

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
          <TabNav.Link href="/studio" active={isRestaurants}>
            Stjórnendur
          </TabNav.Link>
        </TabNav.Root>
      </Flex>
      <ThemeSwitcher />
    </Flex>
  )
}
