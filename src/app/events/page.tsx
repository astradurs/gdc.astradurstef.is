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

  const firstName = user?.firstName
    ? user.firstName[0].toUpperCase() + user.firstName.slice(1)
    : "Þú"
  const lastName =
    firstName !== "Þú" && user?.lastName
      ? ` ${user.lastName[0].toUpperCase() + user.lastName.slice(1)}`
      : ""

  const fullName = `${firstName}${lastName}`

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
