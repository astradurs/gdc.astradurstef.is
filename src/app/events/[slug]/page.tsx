import { getAuthorizationUrl, getUser } from "@/app/auth"
import EventInfo from "@/app/components/event-info"
import Waitlist from "@/app/components/waitlist"
import { Grid, Heading } from "@radix-ui/themes"
import { redirect } from "next/navigation"

export default async function Event({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const p = await params

  const { user, isAuthenticated } = await getUser()
  if (isAuthenticated && user !== null) {
    console.log("User is authenticated")
  } else {
    console.log("User is not authenticated")
    const authKitUrl = getAuthorizationUrl(`/events/${p.slug}`)
    return redirect(authKitUrl)
  }

  const event = await fetch(`${process.env.HOST}/api/events/${p.slug}`, {
    method: "GET",
    cache: "no-store",
  }).then((res) => res.json())

  if (event.error !== undefined) {
    return <Heading as="h2">No event found </Heading>
  }

  if (user === undefined) {
    return <Heading as="h2">No user found</Heading>
  }

  return (
    <Grid gap="4">
      <Heading as="h2">{event.title}</Heading>
      <Grid columns={{ sm: "2" }} gap="4">
        <EventInfo event={event} />
        <Waitlist
          email={user.email}
          isoDate={p.slug}
          registrationStatus={event.registrationStatus}
          registrationStart={event.registration_start}
          waitlist={event.waitlist}
        />
      </Grid>
    </Grid>
  )
}
