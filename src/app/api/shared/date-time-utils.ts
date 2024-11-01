import { DateTime } from "luxon"

export default class DateTimeUtils {
  serverTime: string | null
  zone: string

  constructor(serverTime: string | null = null) {
    const f = "DateTimeUtils.constructor"
    const zone = "Atlantic/Reykjavik"

    if (serverTime !== null) {
      console.log({ f }, "❗ 🕑", "Mocking server UTC time to be: ", {
        serverTime,
      })
    }
    console.log({ f }, "🕑", "The configured time zone is: ", {
      zone,
    })

    this.serverTime = serverTime
    this.zone = zone
  }

  /**
   * Get the current datetime OR the mocked datetime specified by the serverTime parameter.
   * In both cases using the fsp's configured time zone.
   * Note that you cannot pass any arguments to this method, as opposed to Luxon's .local() method.
   * See docs for Luxon's .local() method here:
   * https://moment.github.io/luxon/api-docs/index.html#datetimelocal
   * If you need to construct a datetime with a specific month, day, etc., simply use Luxon's .local() method.
   * This method only exists to allow us to mock the current datetime for the app.
   *
   * @returns {DateTime<true>} A DateTime object that represents the current datetime OR the mocked datetime.
   */
  local() {
    const f = "local"

    let dt

    if (this.serverTime === null) {
      dt = DateTime.local({ zone: this.zone })
    } else {
      // Note that DateTime.fromISO(this.serverTime) doesn't set the zone so it's ambiguous what for example
      // DateTime.fromISO("2024-09-10T12:37Z") means, because which time zone are we referring to?
      // Note that even if the string you pass to fromISO has a trailing Z, it's ignored, the zone
      // is _never_ set by this method.

      // serverTime string is to be interpreted as UTC, so we set the zone to UTC.
      const _dt = DateTime.fromISO(this.serverTime, { zone: "UTC" })
      // However, when we read the date or time we want to take into account the correct zone for the fsp,
      // so we set the zone to the fsp configured zone.
      dt = _dt.setZone(this.zone)
    }

    // By having this check here we narrow the type of this function to DateTime<true> which is
    // more pleasant to work with.
    if (!dt.isValid) {
      console.log({ f }, "Invalid datetime:", dt.invalidReason)
      throw new Error(`The datetime is invalid: ${dt.invalidReason}`)
    }

    return dt
  }

  fromISODate(isoDate: string) {
    const f = "fromISODate"

    const dt = DateTime.fromISO(isoDate, { zone: this.zone })

    if (!dt.isValid) {
      console.log({ f }, "Invalid datetime:", dt.invalidReason)
      throw new Error(`The datetime is invalid: ${dt.invalidReason}`)
    }

    return dt
  }
}
