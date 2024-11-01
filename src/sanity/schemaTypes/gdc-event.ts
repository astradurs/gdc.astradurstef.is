import { defineField, defineType } from "sanity"

export default defineType({
  name: "gdcevent",
  title: "GDC Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
    }),
    defineField({
      name: "registration_start",
      title: "Registration Start",
      type: "datetime",
    }),
    defineField({
      name: "registration_end",
      title: "Registration End",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "document",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "address",
          title: "Address",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "limit",
      title: "Limit",
      type: "number",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "date",
      },
    }),
  ],
})
