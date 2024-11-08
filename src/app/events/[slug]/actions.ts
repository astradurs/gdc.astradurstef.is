"use server"
import { revalidatePath } from "next/cache"

export async function removeFromWaitlist(previousState, formData: FormData) {
  const f = "removeFromWaitlist"
  const email = formData.get("email") as string
  const isoDate = formData.get("isoDate") as string
  console.log({ f }, "Removing from waitlist", {
    email,
    isoDate,
  })
  const url = `${process.env.HOST}/api/events/${isoDate}/${email}`
  console.log({ f }, "URL: ", url)
  try {
    const response = await fetch(url, {
      method: "DELETE",
    })
    console.log({ f }, "Respnse: ", response)
  } catch (error) {
    console.error({ f }, error)
    return error
  } finally {
    revalidatePath("/events/[slug]")
  }
}

export async function addToWaitlist(previousState, formData: FormData) {
  const f = "addToWaitlist"
  const email = formData.get("email") as string
  const isoDate = formData.get("isoDate") as string
  console.log({ f }, "Adding to waitlist", {
    email,
    isoDate,
  })
  const url = `${process.env.HOST}/api/events/${isoDate}`
  console.log({ f }, "URL: ", url)
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
    console.log({ f }, "Respnse: ", response)
  } catch (error) {
    console.error({ f }, error)
    return error
  } finally {
    revalidatePath("/events/[slug]")
  }
}
