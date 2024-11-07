import EventsGrid from "@/app/components/events-grid"
import { getAuthorizationUrl, getUser } from "../auth"
import NotSignedIn from "../components/not-signed-in"

export default async function Events() {
  const { user, isAuthenticated } = await getUser()
  if (isAuthenticated) {
    console.log("User is authenticated")
  } else {
    console.log("User is not authenticated")
    const authKitUrl = getAuthorizationUrl("/")
    return <NotSignedIn authKitUrl={authKitUrl} />
  }

  const data = await fetch(`${process.env.HOST}/api/events`, {
    method: "GET",
  }).then((res) => res.json())

  if (data.error !== undefined) {
    return <span>No events found</span>
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
    <div className="grid gap-4">
      <div className="flex justify-center">
        <h2>Hæ {fullName}!</h2>
      </div>
      {futureEvents.length > 0 && (
        <div className="flex gap-4 flex-col">
          <h3>Næstu viðburðir</h3>
          <EventsGrid events={futureEvents} />
        </div>
      )}
      {pastEvents.length > 0 && (
        <div className="flex gap-4 flex-col">
          <h3>Liðnir viðburðir</h3>
          <EventsGrid events={pastEvents} />
        </div>
      )}
    </div>
  )
}
