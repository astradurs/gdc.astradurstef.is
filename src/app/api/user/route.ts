import { prisma } from "@/db/prisma-client"
import { NextRequest, NextResponse } from "next/server"
import ApiEvent from "../shared/api-event"
import DateTimeUtils from "../shared/date-time-utils"

type TCreateUserBody = {
  id: string
  data: {
    email: string
    last_name?: string
    created_at: "2024-11-05T19:05:16.592Z"
    first_name?: string
  }
  event: "user.created" | "user.updated"
}

export async function POST(request: NextRequest) {
  const f = "user/post"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()
  const mock_server_time = apiEvent.query("mock_server_time") ?? null
  const dtu = new DateTimeUtils(mock_server_time)
  const body = (await request.json()) as TCreateUserBody
  try {
    let result
    const event = body.event
    const { email, first_name, last_name } = body.data
    if (event === "user.created") {
      result = await createUser({
        email,
        firstName: first_name,
        lastName: last_name,
        dtu,
      })
    }

    if (event === "user.updated") {
      result = await updateUser({
        email,
        firstName: first_name,
        lastName: last_name,
        dtu,
      })
    }

    if (result === undefined) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Invalid event",
        },
        {
          status: 400,
        },
      )
      console.error({ f }, "❌", response)
      return response
    }

    if (result.success) {
      const response = NextResponse.json(
        {
          success: true,
        },
        {
          status: 200,
        },
      )
      console.log({ f }, "✅", response)
      return response
    } else {
      const response = NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        {
          status: 500,
        },
      )
      console.error({ f }, "❌", response)
      return response
    }
  } catch (error) {
    console.error({ f }, "❌", error)
    const response = NextResponse.json(
      { error },
      {
        status: 500,
      },
    )
    console.log({ f }, "❌", response)
    return response
  }
}

async function updateUser({
  email,
  firstName,
  lastName,
  dtu,
}: {
  email: string
  firstName: string | undefined
  lastName: string | undefined
  dtu: DateTimeUtils
}) {
  const f = "updateUser"
  const nowDt = dtu.local()
  const nowISO = nowDt.toISO()
  console.log({ f }, { email, firstName, lastName, nowISO })

  try {
    prisma.user.update({
      where: {
        email,
      },
      data: {
        firstname: firstName ?? null,
        lastname: lastName ?? null,
        updatetime: nowISO,
      },
    })
    return {
      success: true,
    }
  } catch (error) {
    console.error({ f }, "❌", error)
    return {
      success: false,
      error,
    }
  }
}

async function createUser({
  email,
  firstName,
  lastName,
  dtu,
}: {
  email: string
  firstName: string | undefined
  lastName: string | undefined
  dtu: DateTimeUtils
}) {
  const f = "createUser"
  const nowDt = dtu.local()
  const nowISO = nowDt.toISO()
  console.log({ f }, { email, firstName, lastName, nowISO })

  try {
    prisma.user.create({
      data: {
        email,
        firstname: firstName ?? null,
        lastname: lastName ?? null,
        createtime: nowISO,
        updatetime: nowISO,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error({ f }, "❌", error)
    return {
      success: false,
      error,
    }
  }
}
