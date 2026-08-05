export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(html: string): number {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export type HeadingItem = { id: string; text: string; level: number };

/** Adds stable ids to h2/h3 headings and returns the table of contents. */
export function withHeadingIds(html: string): { html: string; toc: HeadingItem[] } {
  const toc: HeadingItem[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_m, lvl: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      let id = slugify(text) || `section-${toc.length + 1}`;
      while (used.has(id)) id = `${id}-${toc.length + 1}`;
      used.add(id);
      toc.push({ id, text, level: Number(lvl) });
      return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
    },
  );
  return { html: out, toc };
}
