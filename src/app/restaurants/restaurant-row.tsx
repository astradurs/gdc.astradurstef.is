"use client"

import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  GlobeIcon,
  HomeIcon,
  Loader2Icon,
} from "lucide-react"

import clsx from "clsx"
import Link from "next/link"
import { useActionState } from "react"
import { TUser } from "../auth"
import { upsertVote } from "./actions"

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

export function RestaurantRow({
  restaurant,
  user,
}: {
  restaurant: TRestaurant
  user: TUser | null
}) {
  const [error, action, isPending] = useActionState(upsertVote, null)
  if (error) {
    console.error("Error upserting vote", error)
  }
  const showUpvoteDownvote = user !== null && user?.email !== undefined

  const userVote = restaurant.votes.find((vote) => vote.email === user?.email)
  const upvotes = restaurant.votes.filter((vote) => vote.vote === true)
  const downvotes = restaurant.votes.filter((vote) => vote.vote === false)
  const addressString = `${restaurant.address}, ${restaurant.city}, ${restaurant.zip}`

  const userVoteString =
    userVote === undefined ? "none" : userVote?.vote ? "up" : "down"
  return (
    <TableRow key={restaurant.id} className="relative grid grid-cols-5">
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
        <span className="truncate shrink max-w-[100px] sm:max-w-[200px]">
          {addressString}
        </span>
        {restaurant.googlemapsurl && restaurant.googlemapsurl.length > 0 && (
          <Button asChild size="icon" variant="outline">
            <Link href={restaurant.googlemapsurl}>
              <HomeIcon />
            </Link>
          </Button>
        )}
      </TableCell>
      <TableCell className="flex gap-4 items-center col-span-1">
        {showUpvoteDownvote ? (
          <form action={action}>
            <input type="hidden" name="email" value={user?.email} />
            <input type="hidden" name="restaurantid" value={restaurant.id} />
            <div className="flex flex-col sm:flex-row gap-2">
              <VoteButton
                voteType="up"
                totalVotes={upvotes.length}
                disabled={userVoteString === "up" || isPending}
              />
              <VoteButton
                voteType="down"
                totalVotes={downvotes.length}
                disabled={userVoteString === "down" || isPending}
              />
              {isPending && <Loader2Icon className="animate-spin" />}
            </div>
          </form>
        ) : (
          <div className="flex gap-1 items-center">
            <span className="font-bold text-green-600">{upvotes.length}</span>
            <span>/</span>
            <span className="font-bold text-red-600">{downvotes.length}</span>
          </div>
        )}
      </TableCell>
    </TableRow>
  )
}

function VoteButton({
  voteType,
  disabled,
  totalVotes,
}: {
  voteType: "up" | "down"
  disabled: boolean
  totalVotes: number
}) {
  const inner =
    voteType === "up" ? (
      <UpvoteButtoInner totalVotes={totalVotes} />
    ) : (
      <DownvoteButtonInner totalVotes={totalVotes} />
    )
  return (
    <button
      className="group flex flex-col sm:flex-row gap-1 items-center"
      type="submit"
      name="vote"
      value={voteType}
      disabled={disabled}
    >
      {inner}
    </button>
  )
}

function UpvoteButtoInner({ totalVotes }: { totalVotes: number }) {
  const baseClassName = "text-green-600"
  const textClassName = clsx(baseClassName, "font-semibold")
  const iconClassName = clsx(
    baseClassName,
    "group-hover:text-green-800",
    "group-disabled:text-green-800/50",
  )
  return (
    <>
      <span className={textClassName}>{totalVotes}</span>
      <ArrowBigUpIcon className={iconClassName} />
    </>
  )
}

function DownvoteButtonInner({ totalVotes }: { totalVotes: number }) {
  const baseClassName = "text-red-600"
  const textClassName = clsx(baseClassName, "font-semibold")
  const iconClassName = clsx(
    baseClassName,
    "group-hover:text-red-800",
    "group-disabled:text-red-800/50",
  )
  return (
    <>
      <ArrowBigDownIcon className={iconClassName} />
      <span className={textClassName}>{totalVotes}</span>
    </>
  )
}
