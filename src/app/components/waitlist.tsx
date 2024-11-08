import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import _ from "lodash"
import {
  CreateNewWaitListEntryButton,
  RemoveFromWaitlistButton,
} from "./waitlist-buttons"

type TWaitlistEntry = {
  user: {
    firstname: string
    lastname: string
  }
  email: string
  isodate: string
  createtime: string
}
export default async function Waitlist({
  email,
  isoDate,
  registrationStatus,
  registrationStart,
  waitlist,
}: {
  email: string
  isoDate: string
  registrationStatus: string
  registrationStart: string
  waitlist: Array<TWaitlistEntry>
}) {
  const sortedByDate = _.sortBy(waitlist, (row) => row.createtime)

  const isRegistered = sortedByDate.some(
    (row: {
      user: {
        firstname: string
        lastname: string
      }
      email: string
      isodate: string
    }) => row.email === email,
  )

  const emptyWaitlist = sortedByDate.length === 0
  return (
    <div className="flex flex-col">
      <CreateNewWaitListEntryButton
        isoDate={isoDate}
        email={email}
        isRegistered={isRegistered}
        registrationStatus={registrationStatus}
        registrationStart={registrationStart}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nafn</TableHead>
            <TableHead className="w-[100px]">Sæti</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emptyWaitlist ? (
            <TableRow>
              <TableCell>Enginn hefur skráð sig</TableCell>
            </TableRow>
          ) : (
            sortedByDate.map(
              (
                row: {
                  user: { firstname: string; lastname: string }
                  email: string
                  isodate: string
                },
                index,
              ) => {
                return (
                  <TableRow key={row.isodate + "#" + row.email}>
                    <TableCell>
                      <div className="flex items-center">
                        {row.user.firstname} {row.user.lastname}
                      </div>
                    </TableCell>
                    <TableCell className="grid grid-cols-2 items-center gap-2">
                      <span>{index + 1}</span>
                      {row.email === email && (
                        <RemoveFromWaitlistButton
                          email={email}
                          isoDate={isoDate}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                )
              },
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
