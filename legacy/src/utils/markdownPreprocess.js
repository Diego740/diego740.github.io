const OBSIDIAN_IMAGE_RE = /!\[\[([^\]]+)\]\]/g;
const OBSIDIAN_LINK_RE = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;

export function preprocessObsidianMarkdown(raw) {
  return raw
    .replace(OBSIDIAN_IMAGE_RE, (_, filename) => `![${filename}](/writeups/images/${filename})`)
    .replace(OBSIDIAN_LINK_RE, (_, text) => text);
}
