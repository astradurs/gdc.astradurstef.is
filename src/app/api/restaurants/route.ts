import { prisma } from "@/db/prisma-client"
import { NextRequest, NextResponse } from "next/server"
import ApiEvent from "../shared/api-event"

export async function GET(request: NextRequest) {
  const f = "listRestaurants"
  const apiEvent = new ApiEvent(request)
  apiEvent.logPrettyString()
  try {
    console.log({ f }, "Fetching restaurants")
    const restaurants = await prisma.restaurants.findMany({
      include: {
        votes: true,
      },
    })

    if (restaurants.length === 0) {
      console.log({ f }, "No restaurants found")
      const response = NextResponse.json(
        { error: "No restaurants found" },
        { status: 200 },
      )
      return response
    }

    console.log({ f }, `Fetched ${restaurants.length} restaurants`)
    console.log({ f }, "Sample restaurant", restaurants[0])

    const waitlistsByRestaurantIsoDate = await prisma.gdcwaitlist.groupBy({
      by: ["restaurantid", "isodate"],
    })

    const restaurantsWithWaitlists = restaurants.map((restaurant) => {
      const waitlists = waitlistsByRestaurantIsoDate.filter(
        (waitlist) => waitlist.restaurantid === restaurant.id,
      )

      return {
        ...restaurant,
        waitlists,
      }
    })

    const response = NextResponse.json(restaurantsWithWaitlists, {
      status: 200,
    })

    console.log({ f }, "✅ Success", response)
    return response
  } catch (error) {
    console.error({ f }, "❌", error)
    const response = NextResponse.json(
      {
        error: {
          message: "Generic error",
          code: "GenericError",
        },
      },
      { status: 500 },
    )
    console.log({ f }, "❌", response)
    return response
  }
}

function createIdFromName(name: string) {
  const uniqueIcelandicCharacters = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    ý: "y",
    þ: "th",
    æ: "ae",
    ö: "o",
  }

  // Replace all whitespace characters with a dash
  let effectiveName = name.replaceAll(new RegExp(" ", "g"), "-")
  for (const [key, value] of Object.entries(uniqueIcelandicCharacters)) {
    effectiveName = effectiveName.replaceAll(new RegExp(key, "g"), value)
  }

  return effectiveName.replace(/ /g, "-").toLowerCase()
}

export async function POST(request: NextRequest) {
  try {
    const { name, address, city, zip, websiteurl, googlemapsurl } =
      await request.json()

    const id = createIdFromName(name)

    await prisma.restaurants.create({
      data: {
        id,
        name: name.toString(),
        address,
        city,
        zip: zip.toString(),
        websiteurl,
        googlemapsurl,
      },
    })

    return NextResponse.json(null, { status: 200 })
  } catch (error) {
    console.log("ERROR", error)
    return NextResponse.json(error, { status: 500 })
  }
}
