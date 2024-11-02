import { Flex, Grid, Table, Text } from "@radix-ui/themes"
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
  if (waitlist.length === 0) {
    return (
      <Grid>
        <CreateNewWaitListEntryButton
          isoDate={isoDate}
          email={email}
          isRegistered={false}
          registrationStatus={registrationStatus}
          registrationStart={registrationStart}
        />
        <Text>Enginn á biðlista</Text>
      </Grid>
    )
  }
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

  return (
    <Grid>
      <CreateNewWaitListEntryButton
        isoDate={isoDate}
        email={email}
        isRegistered={isRegistered}
        registrationStatus={registrationStatus}
        registrationStart={registrationStart}
      />
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Nafn</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Sæti</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedByDate.map(
            (
              row: {
                user: { firstname: string; lastname: string }
                email: string
                isodate: string
              },
              index,
            ) => {
              return (
                <Table.Row key={row.isodate + "#" + row.email}>
                  <Table.Cell>
                    <Flex align="center">
                      {row.user.firstname} {row.user.lastname}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" justify="between">
                      <Text>{index + 1}</Text>
                      {row.email === email && (
                        <RemoveFromWaitlistButton
                          email={email}
                          isoDate={isoDate}
                        />
                      )}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              )
            },
          )}
        </Table.Body>
      </Table.Root>
    </Grid>
  )
}
