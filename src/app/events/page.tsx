import EventsGrid from "@/app/components/events-grid"
import { Box, Flex, Section, Text } from "@radix-ui/themes"

export default async function Events() {
  const data = await fetch(`${process.env.HOST}/api/events`, {
    method: "GET",
  }).then((res) => res.json())

  if (data.error !== undefined) {
    return <Text>No events found</Text>
  }

  const { futureEvents, pastEvents } = data

  return (
    <Box>
      {futureEvents.length > 0 && (
        <Section>
          <Flex gap="4" direction="column">
            <Text>Næstu viðburðir</Text>
            <EventsGrid events={futureEvents} />
          </Flex>
        </Section>
      )}
      {pastEvents.length > 0 && (
        <Section>
          <Flex gap="4" direction="column">
            <Text>Liðnir viðburðir</Text>
            <EventsGrid events={pastEvents} />
          </Flex>
        </Section>
      )}
    </Box>
  )
}
