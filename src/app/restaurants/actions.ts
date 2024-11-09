"use server"
import { revalidatePath } from "next/cache"

export async function upsertVote(previousState: unknown, formData: FormData) {
  const f = "action.upsertVote"
  console.log({ f }, previousState)
  const vote = formData.get("vote")
  const restaurantid = formData.get("restaurantid")
  const email = formData.get("email")

  if (vote !== "up" && vote !== "down") {
    throw new Error("Invalid vote")
  }
  const voteValue = vote === "up" ? true : false
  try {
    console.log({ f }, "Sending vote to server", {
      email,
      restaurantid,
      vote: voteValue,
    })
    const url = `${process.env.HOST}/api/restaurants/${restaurantid}`
    console.log({ f }, "URL: ", url)
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ email, vote: voteValue }),
    })
    console.log({ f }, "✅")
  } catch (error) {
    console.error({ f }, "❌", error)
    return error
  } finally {
    revalidatePath("/restaurants")
  }
}
