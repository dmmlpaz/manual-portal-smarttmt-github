import { defineConfig } from "astro/config";
import starlight from "@astro/starlight";

// 👇 la config correcta va aquí
export default defineConfig({
  integrations: [starlight()],
  server: {
    host: true,              // acepta conexiones externas
    allowedHosts: ["*"],     // permite cualquier host (ngrok, etc)
  },
  vite: {
    server: {
      allowedHosts: ["*"],   // fallback por si Vite en dev lo pide
    },
  },
});
