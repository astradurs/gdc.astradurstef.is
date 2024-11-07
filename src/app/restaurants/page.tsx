import {
  ArrowDownIcon,
  ArrowUpIcon,
  GlobeIcon,
  HomeIcon,
} from "@radix-ui/react-icons"
import { Flex, IconButton, Link, Table, Text } from "@radix-ui/themes"

import { revalidatePath } from "next/cache"
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
    return <Text>Engir veitingastaðir fundnir</Text>
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
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.RowHeaderCell>Heiti</Table.RowHeaderCell>
          <Table.RowHeaderCell>Heimilisfang</Table.RowHeaderCell>
          <Table.RowHeaderCell>Atkvæði</Table.RowHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {restaurants.map((restaurant) => {
          const upvotes = restaurant.votes.filter((vote) => vote.vote === true)
          const downvotes = restaurant.votes.filter(
            (vote) => vote.vote === false,
          )
          const addressString = `${restaurant.address}, ${restaurant.city}, ${restaurant.zip}`

          return (
            <Table.Row key={restaurant.id}>
              <Table.Cell>
                <Flex gap="2" align="center">
                  <Text weight="bold">{restaurant.name}</Text>
                  {restaurant.websiteurl &&
                    restaurant.websiteurl.length > 0 && (
                      <IconButton asChild size="1">
                        <Link href={restaurant.websiteurl}>
                          <GlobeIcon />
                        </Link>
                      </IconButton>
                    )}
                  {restaurant.googlemapsurl &&
                    restaurant.googlemapsurl.length > 0 && (
                      <IconButton asChild size="1">
                        <Link href={restaurant.googlemapsurl}>
                          <HomeIcon />
                        </Link>
                      </IconButton>
                    )}
                </Flex>
              </Table.Cell>
              <Table.Cell>{addressString}</Table.Cell>
              <Table.Cell>
                <Flex gap="2" align="center">
                  <Flex gap="1" align="center">
                    <Text weight="bold" color="green">
                      {upvotes.length}
                    </Text>
                    <Text>/</Text>
                    <Text weight="bold" color="red">
                      {downvotes.length}
                    </Text>
                  </Flex>
                  {showUpvoteDownvote && (
                    <form action={upsertVote}>
                      <input type="hidden" name="email" value={user?.email} />
                      <input
                        type="hidden"
                        name="restaurantid"
                        value={restaurant.id}
                      />
                      <Flex gap="1" align="center">
                        <IconButton
                          size="1"
                          color="green"
                          type="submit"
                          name="vote"
                          value="up"
                        >
                          <ArrowUpIcon />
                        </IconButton>

                        <IconButton
                          size="1"
                          color="red"
                          type="submit"
                          name="vote"
                          value="down"
                        >
                          <ArrowDownIcon />
                        </IconButton>
                      </Flex>
                    </form>
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}
