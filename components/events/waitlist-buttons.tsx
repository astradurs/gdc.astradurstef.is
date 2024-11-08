"use client"

import { Button } from "@/components/ui/button"
import { TrashIcon } from "@radix-ui/react-icons"

import { Loader2Icon } from "lucide-react"
import { useActionState } from "react"
import {
  addToWaitlist,
  removeFromWaitlist,
} from "../../src/app/events/[slug]/actions"

export function CreateNewWaitListEntryButton({
  isoDate,
  email,
  isRegistered,
  registrationStatus,
  registrationStart,
}: {
  isoDate: string
  email: string
  isRegistered: boolean
  registrationStatus: string
  registrationStart: string
}) {
  const [error, action, isPending] = useActionState(addToWaitlist, null)
  if (error) {
    console.error("Error adding to waitlist", error)
  }
  if (isRegistered) {
    return (
      <Button disabled variant="outline">
        Þú ert skráður
      </Button>
    )
  }

  if (registrationStatus === "CLOSED") {
    const regStartDate = new Date(registrationStart)
    const month = regStartDate.getMonth() + 1
    const day = regStartDate.getDate()
    const hour = regStartDate.getHours()
    const minute = regStartDate.getMinutes()

    const monthString = month < 10 ? `0${month}` : month
    const dayString = day < 10 ? `0${day}` : day
    const hourString = hour < 10 ? `0${hour}` : hour
    const minuteString = minute < 10 ? `0${minute}` : minute

    const dateString = `${monthString}/${dayString} kl ${hourString}:${minuteString}`
    return (
      <Button disabled variant="outline">
        Skráning opnar {dateString}
      </Button>
    )
  }

  return (
    <form action={action} className="flex w-full">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="isoDate" value={isoDate} />
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <span>Skrá mig</span>
        )}
      </Button>
    </form>
  )
}

export function RemoveFromWaitlistButton({
  isoDate,
  email,
}: {
  isoDate: string
  email: string
}) {
  const [error, action, isPending] = useActionState(removeFromWaitlist, null)
  if (error) {
    console.error("Error removing from waitlist", error)
  }

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="isoDate" value={isoDate} />
      <Button
        type="submit"
        variant="destructive"
        size="icon"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <TrashIcon height="16px" width="16px" />
        )}
      </Button>
    </form>
  )
}
