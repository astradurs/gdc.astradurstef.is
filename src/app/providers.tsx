// app/providers.tsx
"use client"

import dynamic from "next/dynamic"

import { Theme } from "@radix-ui/themes"
import { ThemeProvider as StaticProvider } from "next-themes"

const DynProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  },
)

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const NextThemeProvider =
    process.env.NODE_ENV === "production" ? StaticProvider : DynProvider
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark">
      <Theme>{children}</Theme>
    </NextThemeProvider>
  )
}
