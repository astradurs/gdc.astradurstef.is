"use server"
import { revalidatePath } from "next/cache"

export async function removeFromWaitlist({
  email,
  isoDate,
}: {
  email: string
  isoDate: string
}) {
  const f = "removeFromWaitlist"
  console.log({ f }, "Removing from waitlist", {
    email,
    isoDate,
  })
  const url = `${process.env.HOST}/api/events/${isoDate}/${email}`
  console.log({ f }, "URL: ", url)
  const response = await fetch(url, {
    method: "DELETE",
  })
  console.log({ f }, "Respnse: ", response)
  revalidatePath("/events/[slug]")
}

export async function addToWaitlist({
  email,
  isoDate,
}: {
  email: string
  isoDate: string
}) {
  const f = "addToWaitlist"
  console.log({ f }, "Adding to waitlist", {
    email,
    isoDate,
  })
  const url = `${process.env.HOST}/api/events/${isoDate}`
  console.log({ f }, "URL: ", url)
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
  console.log({ f }, "Respnse: ", response)
  revalidatePath("/events/[slug]")
}
