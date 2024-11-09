import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { getUser } from "../auth"
import { RestaurantRow } from "./restaurant-row"

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
  const data = await fetch(`${process.env.HOST}/api/restaurants`, {
    method: "GET",
    cache: "no-store",
  }).then((res) => res.json())

  if (data.error !== undefined) {
    throw new Error("No restaurants found")
  }

  const restaurants = data as Array<TRestaurant>

  if (restaurants.length === 0) {
    return <span>Engir veitingastaðir fundnir</span>
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
        {restaurants.map((restaurant) => (
          <RestaurantRow
            key={restaurant.id}
            restaurant={restaurant}
            user={user ?? null}
          />
        ))}
      </TableBody>
    </Table>
  )
}
