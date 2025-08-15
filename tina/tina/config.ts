import { defineConfig } from "tinacms";
import { TinaUserCollection } from "tinacms-authjs/dist/tinacms";
import { LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";
export default defineConfig({
  branch,
  authProvider:  new LocalAuthProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    host: true
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      TinaUserCollection,
      {
        name: "docs",
        label: "Content",
        path: "content/docs",
        ui: {
          // @ts-ignore
          defaultItem: {
            layout: "layout",
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  }
});
