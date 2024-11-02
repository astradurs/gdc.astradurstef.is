import { Button, Card, Flex, Grid, Heading } from "@radix-ui/themes"
import Link from "next/link"

export default async function NotSignedIn({
  authKitUrl,
}: {
  authKitUrl: string
}) {
  return (
    <Flex justify="center" align="center" minHeight="100%">
      <Card>
        <Grid gap="4">
          <Heading>Þú ert ekki skráð/ur inn</Heading>
          <Button asChild>
            <Link href={authKitUrl}>Skrá inn</Link>
          </Button>
        </Grid>
      </Card>
    </Flex>
  )
}
