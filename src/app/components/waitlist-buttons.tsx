"use client"

import { TrashIcon } from "@radix-ui/react-icons"
import { Button, IconButton } from "@radix-ui/themes"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const create = async (e: React.SyntheticEvent) => {
    setIsCreating(true)
    e.preventDefault()
    await fetch(`/api/waitlist/${isoDate}`, {
      method: "POST",
      body: JSON.stringify({ email }),
    })

    router.refresh()
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
    <Button type="button" onClick={create} loading={isCreating}>
      Skrá mig
    </Button>
  )
}

export function RemoveFromWaitlistButton({
  isoDate,
  email,
}: {
  isoDate: string
  email: string
}) {
  const router = useRouter()
  const [isRemoving, setIsRemoving] = useState(false)

  const remove = async (e: React.SyntheticEvent) => {
    setIsRemoving(true)
    e.preventDefault()
    await fetch(`/api/waitlist/${isoDate}/${email}`, {
      method: "DELETE",
    })

    router.refresh()
  }

  return (
    <IconButton
      type="button"
      loading={isRemoving}
      onClick={remove}
      color="red"
      size="1"
    >
      <TrashIcon height="16px" width="16px" />
    </IconButton>
  )
}
