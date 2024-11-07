// app/providers.tsx
"use client"

import { type ThemeProviderProps } from "next-themes/dist/types"
import dynamic from "next/dynamic"

import { ThemeProvider as StaticProvider } from "next-themes"
const DynProvider = dynamic(
  () => import("next-themes").then((e) => e.ThemeProvider),
  {
    ssr: false,
  },
)

export function Providers({ children, ...props }: ThemeProviderProps) {
  const NextThemeProvider =
    process.env.NODE_ENV === "production" ? StaticProvider : DynProvider
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}
