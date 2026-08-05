import { createFileRoute } from "@tanstack/react-router";

function origin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function cdata(value: string): string {
  return `<![CDATA[${value.replace(/\]\]>/g, "]]&gt;")}]]>`;
}

export const Route = createFileRoute("/rss[.]xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const { createPublicClient } = await import("@/lib/blog.server");
        const supabase = createPublicClient();

        const { data: posts } = await supabase
          .from("posts")
          .select("title, slug, excerpt, published_at")
          .eq("status", "published")
          .not("published_at", "is", null)
          .lte("published_at", new Date().toISOString())
          .order("published_at", { ascending: false })
          .limit(30);

        const items = (posts ?? [])
          .map(
            (p: any) => `    <item>
      <title>${cdata(p.title)}</title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <description>${cdata(p.excerpt ?? "")}</description>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
    </item>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ThunSpark Insights</title>
    <link>${base}/blog</link>
    <description>Growth, automation and marketing insights from the ThunSpark team.</description>
    <language>en</language>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

        return new Response(xml, {
          headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
