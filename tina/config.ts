import { defineConfig, LocalAuthProvider } from "tinacms";
import { CustomAuthProvider } from "./CustomAuthProvider";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

  const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'false'

export default defineConfig({
  client: {
    // 👇 Esto evita que Tina use el modo Cloud
    skip: true,
  },
  authProvider:new LocalAuthProvider(),
  branch,
  // Get this from tina.io
  //clientId: '3c2cad96-ed11-4ba4-a244-cc64ef8d4641',
  // Get this from tina.io
  //token:'f9b47611f69baa28dd27632140efa7474cc34487',
  contentApiUrlOverride: "/api/tina/gql",
  //contentApiUrlOverride: "http://localhost:4001/tina", // URL del servidor Node
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {

    tina: {
      mediaRoot: "uploads",
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
          },
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
