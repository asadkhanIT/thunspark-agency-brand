import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Briefcase, Link2, List } from "lucide-react";
import { getPostBySlug } from "@/lib/blog.functions";
import type { PostDetail, PostSummary } from "@/lib/blog-types";
import { formatDate, withHeadingIds } from "@/lib/slug";
import { PostCard } from "@/components/blog/PostCard";
import { NewsletterForm } from "@/components/blog/NewsletterForm";
import { Reveal, Section } from "@/components/ui-primitives";

type LoaderData = {
  post: PostDetail;
  related: PostSummary[];
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const result = await getPostBySlug({ data: { slug: params.slug } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const data = loaderData as LoaderData | undefined;
    const post = data?.post;
    if (!post) return {};
    const title = post.seo_title || `${post.title} | ThunSpark`;
    const description = post.meta_description || post.excerpt || "";
    const image = post.og_image || post.featured_image;
    const twitterImage = post.twitter_image || image;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: post.og_title || post.title },
        { property: "og:description", content: post.og_description || description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.robots_index ? [] : [{ name: "robots", content: "noindex, nofollow" }]),
        ...(image?.startsWith("https://") ? [{ property: "og:image", content: image }] : []),
        ...(twitterImage?.startsWith("https://") ? [{ name: "twitter:image", content: twitterImage }] : []),
      ],
      links: post.canonical_url ? [{ rel: "canonical", href: post.canonical_url }] : [],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": post.schema_type || "Article",
            headline: post.title,
            description,
            datePublished: post.published_at,
            dateModified: post.updated_at,
            author: { "@type": "Person", name: post.author?.display_name ?? "ThunSpark" },
            publisher: { "@type": "Organization", name: "ThunSpark" },
            ...(image ? { image } : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
              { "@type": "ListItem", position: 3, name: post.title },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Section className="pt-24 text-center">
      <h1 className="font-display text-2xl font-semibold">Article not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-sm text-accent hover:underline">
        Back to the blog
      </Link>
    </Section>
  ),
  errorComponent: () => (
    <Section className="pt-24 text-center">
      <p className="text-muted-foreground">We couldn't load this article. Please refresh.</p>
    </Section>
  ),
  component: ArticlePage,
});

function ArticlePage() {
  const { post, related, prev, next } = Route.useLoaderData() as LoaderData;
  const { html, toc } = withHeadingIds(post.content ?? "");

  const share = (network: "x" | "linkedin") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const target =
      network === "x"
        ? `https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Section className="pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground">
            Blog
          </Link>
          {post.category && (
            <>
              <span>/</span>
              <Link
                to="/blog"
                search={{ category: post.category.slug }}
                className="hover:text-foreground"
              >
                {post.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="truncate text-foreground/70">{post.title}</span>
        </nav>

        <Reveal className="mt-5">
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-[1.12] sm:text-4xl md:text-[2.75rem]">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">{post.excerpt}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt={post.author.display_name} className="h-7 w-7 rounded-full object-cover" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-[11px] font-semibold text-accent">
                  {(post.author?.display_name ?? "T").charAt(0).toUpperCase()}
                </span>
              )}
              <span className="text-foreground">{post.author?.display_name ?? "ThunSpark"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {post.reading_time} min read
            </span>
            <span className="ml-auto flex items-center gap-2">
              <ShareButton label="Share on X" onClick={() => share("x")}>
                <Share2 className="h-3.5 w-3.5" />
              </ShareButton>
              <ShareButton label="Share on LinkedIn" onClick={() => share("linkedin")}>
                <Briefcase className="h-3.5 w-3.5" />
              </ShareButton>
              <ShareButton
                label="Copy link"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
              >
                <Link2 className="h-3.5 w-3.5" />
              </ShareButton>
            </span>
          </div>
        </Reveal>

        {post.featured_image && (
          <Reveal delay={0.05} className="mt-6">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt ?? post.title}
              className="aspect-[16/8] w-full rounded-2xl border border-border object-cover"
            />
          </Reveal>
        )}
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
          <article className="prose-thunspark min-w-0" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              {toc.length > 0 && (
                <div className="rounded-2xl border border-border bg-glass p-4">
                  <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    <List className="h-3.5 w-3.5 text-accent" /> On this page
                  </p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {toc.map((h) => (
                      <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                        <a href={`#${h.id}`} className="text-muted-foreground transition-colors hover:text-accent">
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {post.tags.length > 0 && (
                <div className="rounded-2xl border border-border bg-glass p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <Link
                        key={t.id}
                        to="/blog"
                        search={{ tag: t.slug }}
                        className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-accent/40 hover:text-accent"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {post.author?.bio && (
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-glass p-5 sm:flex-row sm:items-center">
            {post.author.avatar_url && (
              <img src={post.author.avatar_url} alt={post.author.display_name} className="h-12 w-12 rounded-full object-cover" />
            )}
            <div>
              <p className="font-display text-sm font-semibold">
                {post.author.display_name}
                {post.author.title && <span className="text-muted-foreground"> · {post.author.title}</span>}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{post.author.bio}</p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {prev && <NavCard direction="prev" title={prev.title} slug={prev.slug} />}
          {next && <NavCard direction="next" title={next.title} slug={next.slug} />}
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="pt-0">
          <div className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Related reading</div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </Section>
      )}

      <Section className="pt-0">
        <NewsletterForm source="article" />
      </Section>
    </>
  );
}

function ShareButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-full border border-border bg-glass text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
    >
      {children}
    </button>
  );
}

function NavCard({ direction, title, slug }: { direction: "prev" | "next"; title: string; slug: string }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug }}
      className={`group rounded-2xl border border-border bg-glass p-4 transition-colors hover:border-accent/30 ${
        direction === "next" ? "sm:text-right" : ""
      }`}
    >
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:justify-start">
        {direction === "prev" ? <ArrowLeft className="h-3 w-3" /> : null}
        {direction === "prev" ? "Previous" : "Next"}
        {direction === "next" ? <ArrowRight className="h-3 w-3" /> : null}
      </span>
      <p className="mt-1.5 font-display text-sm font-semibold transition-colors group-hover:text-accent">{title}</p>
    </Link>
  );
}
