import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default async function NotSignedIn({
  authKitUrl,
}: {
  authKitUrl: string
}) {
  return (
    <div className="flex justify-center items-center min-h-full">
      <Card className="grid gap-4">
        <CardHeader>
          <h2>Þú ert ekki skráð/ur inn</h2>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={authKitUrl}>Skrá inn</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
