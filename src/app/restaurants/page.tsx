import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GlobeIcon, HomeIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { ArrowBigDownIcon, ArrowBigUpIcon } from "lucide-react"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { getUser } from "../auth"

type TVote = {
  email: string
  restaurantid: string
  vote: boolean
}

type TRestaurant = {
  id: string
  name: string
  address: string
  city: string
  zip: string
  googlemapsurl: string | null
  websiteurl: string | null
  votes: Array<TVote>
}

export default async function Restaurants() {
  const { user } = await getUser()

  const showUpvoteDownvote = user !== null && user?.email !== undefined

  const data = await fetch(`${process.env.HOST}/api/restaurants`, {
    method: "GET",
  }).then((res) => res.json())

  if (data.error !== undefined) {
    throw new Error("No restaurants found")
  }

  const restaurants = data as Array<TRestaurant>

  if (restaurants.length === 0) {
    return <span>Engir veitingastaðir fundnir</span>
  }

  const upsertVote = async (formData: FormData) => {
    "use server"
    console.log("upsertVote", formData)
    const vote = formData.get("vote")
    const restaurantid = formData.get("restaurantid")
    const email = formData.get("email")

    if (vote !== "up" && vote !== "down") {
      throw new Error("Invalid vote")
    }
    const voteValue = vote === "up" ? true : false
    await fetch(`${process.env.HOST}/api/restaurants/${restaurantid}`, {
      method: "POST",
      body: JSON.stringify({ email, vote: voteValue }),
    })
    revalidatePath("/restaurants")
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="grid grid-cols-5">
          <TableHead className="flex items-end col-span-2">Heiti</TableHead>
          <TableHead className="flex items-end col-span-2">
            Heimilisfang
          </TableHead>
          <TableHead className="flex items-end col-span-1">Atkvæði</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {restaurants.map((restaurant) => {
          const upvotes = restaurant.votes.filter((vote) => vote.vote === true)
          const downvotes = restaurant.votes.filter(
            (vote) => vote.vote === false,
          )
          const addressString = `${restaurant.address}, ${restaurant.city}, ${restaurant.zip}`

          return (
            <TableRow key={restaurant.id} className="grid grid-cols-5">
              <TableCell className="flex gap-2 items-center col-span-2">
                <span className="font-bold">{restaurant.name}</span>
                {restaurant.websiteurl && restaurant.websiteurl.length > 0 && (
                  <Button asChild size="icon" variant="outline">
                    <Link href={restaurant.websiteurl}>
                      <GlobeIcon />
                    </Link>
                  </Button>
                )}
              </TableCell>
              <TableCell className="flex gap-2 items-center col-span-2">
                <span className="truncate shrink">{addressString}</span>
                {restaurant.googlemapsurl &&
                  restaurant.googlemapsurl.length > 0 && (
                    <Button asChild size="icon" variant="outline">
                      <Link href={restaurant.googlemapsurl}>
                        <HomeIcon />
                      </Link>
                    </Button>
                  )}
              </TableCell>
              <TableCell className="flex gap-4 items-center col-span-1">
                {showUpvoteDownvote ? (
                  <form action={upsertVote}>
                    <input type="hidden" name="email" value={user?.email} />
                    <input
                      type="hidden"
                      name="restaurantid"
                      value={restaurant.id}
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex gap-1 items-center text-green-600 hover:text-green-800"
                        type="submit"
                        name="vote"
                        value="up"
                      >
                        <span className="font-semibold">{upvotes.length}</span>
                        <ArrowBigUpIcon scale={50} />
                      </button>

                      <button
                        className="flex gap-1 items-center text-red-600 hover:text-red-800"
                        type="submit"
                        name="vote"
                        value="down"
                      >
                        <ArrowBigDownIcon />
                        <span className="font-semibold">
                          {downvotes.length}
                        </span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-green-600">
                      {upvotes.length}
                    </span>
                    <span>/</span>
                    <span className="font-bold text-red-600">
                      {downvotes.length}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
