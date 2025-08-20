import fs from "fs";
import path from "path";
import TurndownService from "turndown";

//const urlDomain = import.meta.env.WP_DOMAIN


const CONTENT_DIR = path.join(process.cwd(), "src/content/docs/rit");

// Instancia de turndown para convertir HTML → Markdown
const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
});


export const getPages = async (slug: string) => {
    const response = await fetch(`http://localhost:8080/wp-json/wp/v2/pages?slug=rit`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    // Asegurar carpeta destino
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }

    data.forEach((post: any) => {
        const title = post.title.rendered;
        const html = post.content.rendered;

        // Convertir HTML → Markdown
        const markdownContent = turndown.turndown(html);

        // Armar frontmatter + contenido

        const fileContent = `---\n` +
        `title: "${title.replace(/"/g, '\\"')}"\n` +
        `---\n\n` +
        `${markdownContent}\n`;

        // Guardar en archivo
        const filePath = path.join(CONTENT_DIR, `${post.slug}.md`);
        fs.writeFileSync(filePath, fileContent, "utf-8");
        console.log(`✅ Guardado: ${filePath}`);
    });
}

getPages("").catch((err) => {
    console.error("❌ Error:", err);
});
