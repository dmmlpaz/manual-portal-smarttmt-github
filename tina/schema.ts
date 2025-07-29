// tina/schema.ts
import { defineSchema, defineConfig } from "tinacms";

export default defineSchema({
  collections: [
    {
      label: "Blog Posts",
      name: "post",
      path: "content/posts",
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
        },
        {
          type: "rich-text",
          label: "Body",
          name: "body",
        },
      ],
    },
  ],
});