"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { MenuIcon } from "lucide-react"

export function DesktopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/events" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Viðburðir
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/restaurants" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Veitingastaðir
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/studio" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Stjórnendur
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function MobileNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <MenuIcon size={24} />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="grid gap-2 p-4">
            <NavigationMenuLink
              className="hover:text-foreground/90 hover:underline"
              href="/events"
            >
              Viðburðir
            </NavigationMenuLink>
            <NavigationMenuLink
              className="hover:text-foreground/90 hover:underline"
              href="/restaurants"
            >
              Veitingastaðir
            </NavigationMenuLink>
            <NavigationMenuLink
              className="hover:text-foreground/90 hover:underline"
              href="/studio"
            >
              Stjórnendur
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
