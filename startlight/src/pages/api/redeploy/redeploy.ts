// src/pages/api/rebuild.ts
import type { APIRoute } from "astro";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import TurndownService from "turndown";

const CONTENT_DIR = path.join(process.cwd(), "src/content/docs/");

// Instancia de turndown para convertir HTML → Markdown
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});


export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    console.log("🔔 Webhook recibido:", payload);

    const data = payload?.post;

    if (data && data?.post_name) {

      const dir = path.join(CONTENT_DIR, data?.post_name);

      // Asegurar carpeta destino
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const title = data?.post_title;
      const html = data.post_content;

      console.log("🔔 Generando archivo para el title:", title);
      console.log("🔔 Generando archivo para el html:", html);

      // Convertir HTML → Markdown
      const markdownContent = turndown.turndown(html);

      // Armar frontmatter y contenido
      const fileContent = `---\n` +
        `title: "${title.replace(/"/g, '\\"')}"\n` +
        `---\n\n` +
        `${markdownContent}\n`;

      // Guardar en archivo
      const filePath = path.join(dir, `${data?.post_name}.md`);
      fs.writeFileSync(filePath, fileContent, "utf-8");
      console.log(`✅ Guardado: ${filePath}`);

      // Ejecutar script de sync y build
      exec("pnpm build", (err, stdout, stderr) => {
        if (err) {
          console.error("❌ Error en build:", err);
          return;
        }
        console.log("✅ Build completado 1 :", stdout);
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200 });

    }

    return new Response(JSON.stringify({ error: 'No llego la data del post' }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Build fallido" + err }), { status: 500 });
  }
};
