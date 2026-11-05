import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';

// Callouts de Obsidian: "> [!note] Título" (+ - para plegables, se ignoran) → <div class="callout callout-note">
const CALLOUT_RE = /^\[!(\w+)\][+-]?[ \t]*([^\n]*)\n?/;
const walk = (node) => {
  for (const c of node.children ?? []) {
    if (c.type === 'blockquote') {
      const p = c.children?.[0];
      const t = p?.type === 'paragraph' ? p.children?.[0] : null;
      const m = t?.type === 'text' ? t.value.match(CALLOUT_RE) : null;
      if (m) {
        const type = m[1].toLowerCase();
        const title = m[2].trim() || type[0].toUpperCase() + type.slice(1);
        t.value = t.value.slice(m[0].length);
        if (!t.value) p.children.shift();
        if (!p.children.length) c.children.shift();
        c.children.unshift({ type: 'paragraph', data: { hName: 'p', hProperties: { className: ['callout-title'] } }, children: [{ type: 'text', value: title }] });
        c.data = { hName: 'div', hProperties: { className: ['callout', `callout-${type}`] } };
      }
    }
    walk(c);
  }
};
const remarkCallouts = () => (tree) => walk(tree);

let processor;
const get = async () => (processor ??= await createMarkdownProcessor({ syntaxHighlight: 'shiki', shikiConfig: { theme: 'github-dark' }, gfm: true, remarkPlugins: [remarkCallouts] }));

// Sintaxis de Obsidian → Markdown estándar. Las cabeceras Date/Difficulty/OS/Tags del cuerpo se
// sacan del texto (la página ya muestra esos datos) y las etiquetas se devuelven aparte.
export async function renderMarkdown(raw) {
  raw = raw
    .replace(/!\[\[([^\]]+)\]\]/g, (_, f) => `![${f.replace(/\.[a-z]+$/i, '')}](/writeups/images/${encodeURIComponent(f)})`)
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/^(\s*```)(\w+)/gm, (_, a, l) => a + l.toLowerCase());
  const tags = (raw.match(/^\*\*Tags:\*\*\s*(.*)$/m)?.[1] ?? '').split(/\s+/).filter((t) => t.startsWith('#')).map((t) => t.slice(1));
  raw = raw.replace(/^\s*\*\*(Date|Difficulty|OS|Tags):\*\*.*$/gm, '').replace(/^\s*---\s*$/m, '').trimStart();
  const { code } = await (await get()).render(raw);
  return { html: code.replace(/<img /g, '<img loading="lazy" decoding="async" '), tags };
}

export const renderWriteup = async (file) => renderMarkdown(await readFile(join(process.cwd(), 'public', file), 'utf8'));
