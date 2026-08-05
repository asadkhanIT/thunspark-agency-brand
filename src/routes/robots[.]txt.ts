import { createFileRoute } from "@tanstack/react-router";

function origin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = origin(request);
        const body = [
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "",
          `Sitemap: ${base}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
