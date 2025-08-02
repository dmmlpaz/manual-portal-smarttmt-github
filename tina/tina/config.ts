import { defineConfig } from "tinacms";
import {
  UsernamePasswordAuthJSProvider,
  TinaUserCollection,
} from "tinacms-authjs/dist/tinacms";
import { LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";
export default defineConfig({
  contentApiUrlOverride: "/api/tina/gql",
  branch,
  authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content",
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
        ui: {
          filename: {
            // Asegúrate que coincida con la estructura en GitHub
            slugify: (values) => {
              return `src/content/docs/${values?.title?.toLowerCase().replace(/ /g, '-')}`;
            },
          },
          router: ({ document }) => {
            return `/docs/${document._sys.filename}`;
          },
        },
      },
    ],
  },
});
