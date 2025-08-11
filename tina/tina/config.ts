import { defineConfig } from "tinacms";
import { UsernamePasswordAuthJSProvider, TinaUserCollection } from "tinacms-authjs/dist/tinacms";
import { LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";
const isLocal = true//process.env.TINA_PUBLIC_IS_LOCAL === "true";
export default defineConfig({
  contentApiUrlOverride: "/api/tina/gql",
  branch,
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  build: {
    outputFolder: "admin",
    publicFolder: "public",
    host: true
  },
  server: {
    host: '0.0.0.0',  // Acepta conexiones de cualquier IP
    port: 4001
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
  },
  webhooks: {
    contentUpdates: [
      {
        url: process.env.WEBHOOK_URL || "http://host.docker.internal:8080",
        events: ["create", "update", "delete"]
      }
    ]
  }
});
