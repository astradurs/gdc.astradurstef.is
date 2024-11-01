import { groq } from "next-sanity"

export const eventsQuery = groq`*[_type == "gdcevent"]{
  _id, title, body, slug, date, location, limit
} | order(date asc)`

export const eventsByIsoDateQuery = groq`*[_type == "gdcevent" && date >= $lowestDate && date <= $highestDate]{
  _id, title, body, slug, date, location, limit
} | order(date asc)`

export const eventQuery = groq`*[_type == "gdcevent" && slug.current == $slug][0]{ 
  title, slug, body, date, location, limit, image, registration_start, registration_end
}`
