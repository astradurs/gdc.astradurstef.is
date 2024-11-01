import EventsGrid from "@/app/components/events-grid"
import { Box, Flex, Grid, Heading, Text } from "@radix-ui/themes"
import { redirect } from "next/navigation"
import { getAuthorizationUrl, getUser } from "../auth"

export default async function Events() {
  const { user, isAuthenticated } = await getUser()
  if (isAuthenticated) {
    console.log("User is authenticated")
  } else {
    console.log("User is not authenticated")
    const authKitUrl = getAuthorizationUrl("/")
    console.log("Redirecting to AuthKit URL", authKitUrl)

    return redirect(authKitUrl)
  }

  const data = await fetch(`${process.env.HOST}/api/events`, {
    method: "GET",
  }).then((res) => res.json())

  if (data.error !== undefined) {
    return <Text>No events found</Text>
  }

  const { futureEvents, pastEvents } = data

  let fullName = "Þú"
  if (user !== null && user !== undefined) {
    if (user.firstname !== null) {
      fullName = user.firstname
      if (user.lastname !== null) {
        fullName = `${fullName} ${user.lastname}`
      }
    }
  }

  return (
    <Box>
      <Grid gap="4">
        <Flex justify="center">
          <Heading>Hæ {fullName}!</Heading>
        </Flex>
        {futureEvents.length > 0 && (
          <Flex gap="4" direction="column">
            <Text>Næstu viðburðir</Text>
            <EventsGrid events={futureEvents} />
          </Flex>
        )}
        {pastEvents.length > 0 && (
          <Flex gap="4" direction="column">
            <Text>Liðnir viðburðir</Text>
            <EventsGrid events={pastEvents} />
          </Flex>
        )}
      </Grid>
    </Box>
  )
}
