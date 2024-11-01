// app/components/ThemeSwitcher.tsx
"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { IconButton } from "@radix-ui/themes"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icon = theme === "dark" ? <MoonIcon /> : <SunIcon />

  return (
    <IconButton
      variant="surface"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {icon}
    </IconButton>
  )
}
