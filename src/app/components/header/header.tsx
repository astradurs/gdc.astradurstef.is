"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeSwitcher } from "../theme-switcher"
import { DesktopNav, MobileNav } from "./navigation-menu"

export default function Header({
  isAuthenticated,
  authKitUrl,
}: {
  isAuthenticated: boolean
  authKitUrl: string
}) {
  const pathname = usePathname()
  const isStudio = pathname.startsWith("/studio")
  if (isStudio) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }
  // get where we are in the app next
  const authButton = isAuthenticated ? (
    <Button variant="outline" disabled>
      Innskráður
    </Button>
  ) : (
    <Button asChild>
      <Link href={authKitUrl}>Innskrá</Link>
    </Button>
  )

  return (
    <div className="flex justify-between">
      <div className="hidden md:block">
        <DesktopNav />
      </div>
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="flex gap-2">
        {authButton}
        <ThemeSwitcher />
      </div>
    </div>
  )
}
