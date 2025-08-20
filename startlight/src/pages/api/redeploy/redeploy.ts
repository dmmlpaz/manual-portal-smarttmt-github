// src/pages/api/rebuild.ts
import type { APIRoute } from "astro";
import { exec } from "child_process";

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log("🔔 Webhook recibido:", payload);

    // Ejecutar script de sync y build
    exec("pnpm tsx src/lib/wp-pages.ts && pnpm build", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Error en build:", err);
        return;
      }
      console.log("✅ Build completado 1 :", stdout);
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Build fallido"+err }), { status: 500 });
  }
};
