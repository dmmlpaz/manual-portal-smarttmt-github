import { UsernamePasswordAuthJSProvider } from 'tinacms-authjs/dist/tinacms'
import { LocalAuthProvider, defineConfig } from 'tinacms'

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
authProvider: isLocal
    ? new LocalAuthProvider()
    : new UsernamePasswordAuthJSProvider(),
  contentApiUrlOverride: "/api/tina/gql",
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
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "src/content/docs",
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
          }
        ],
      },

    ],

  },

  cmsCallback: (cms) => {
    // Deshabilitar la creación de archivos .gitkeep.md
    cms.flags.set('tina-admin', {
      useGitKeep: false
    });
    return cms;
  },

});
