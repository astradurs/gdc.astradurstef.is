import { NextResponse } from "next/server"

export type TErrorResponse = NextResponse<{
  error: {
    message: string
    code: string
  }
}>
