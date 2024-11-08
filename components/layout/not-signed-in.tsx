import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default async function NotSignedIn({
  authKitUrl,
}: {
  authKitUrl: string
}) {
  return (
    <Card className="mx-auto grid gap-4 max-w-md">
      <CardHeader>
        <h2>Þú ert ekki skráð/ur inn</h2>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={authKitUrl}>Skrá inn</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
