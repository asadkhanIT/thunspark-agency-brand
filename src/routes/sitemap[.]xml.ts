import { createFileRoute } from "@tanstack/react-router";

function origin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const { createPublicClient } = await import("@/lib/blog.server");
        const supabase = createPublicClient();

        const [{ data: posts }, { data: categories }] = await Promise.all([
          supabase
            .from("posts")
            .select("slug, updated_at, published_at")
            .eq("status", "published")
            .not("published_at", "is", null)
            .lte("published_at", new Date().toISOString())
            .order("published_at", { ascending: false }),
          supabase.from("categories").select("slug"),
        ]);

        const staticPaths = ["/", "/services", "/case-studies", "/about", "/contact", "/blog"];

        const urls: string[] = [
          ...staticPaths.map((p) => `<url><loc>${base}${p}</loc></url>`),
          ...(categories ?? []).map(
            (c: any) => `<url><loc>${base}/blog?category=${esc(c.slug)}</loc></url>`,
          ),
          ...(posts ?? []).map(
            (p: any) =>
              `<url><loc>${base}/blog/${esc(p.slug)}</loc><lastmod>${new Date(
                p.updated_at,
              ).toISOString()}</lastmod></url>`,
          ),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
          "\n",
        )}\n</urlset>`;

        return new Response(xml, {
          headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
