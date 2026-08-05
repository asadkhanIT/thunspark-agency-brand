import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Search, Sparkles } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal, Section, SectionLabel } from "@/components/ui-primitives";
import { NewsletterForm } from "@/components/blog/NewsletterForm";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    listPublishedPosts({
      data: { search: deps.q, category: deps.category, tag: deps.tag },
    }),
  head: () => ({
    meta: [
      { title: "Blog — Growth & Automation Insights | ThunSpark" },
      {
        name: "description",
        content:
          "Practical playbooks on AI automation, SEO, paid ads and web performance from the ThunSpark team. No fluff, just what actually moves revenue.",
      },
      { property: "og:title", content: "ThunSpark Blog — Growth & Automation Insights" },
      {
        property: "og:description",
        content: "Practical playbooks on AI automation, SEO, paid ads and web performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "alternate", type: "application/rss+xml", href: "/rss.xml" }],
  }),
  errorComponent: () => (
    <Section className="pt-24">
      <p className="text-muted-foreground">We couldn't load the blog right now. Please refresh.</p>
    </Section>
  ),
  component: BlogIndex,
});

function BlogIndex() {
  const { posts, categories, tags } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [term, setTerm] = useState(search.q ?? "");

  const featured = posts.filter((p) => p.is_featured).slice(0, 2);
  const rest = posts.filter((p) => !featured.some((f) => f.id === p.id));

  const setFilter = (patch: Record<string, string | undefined>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) as never });

  return (
    <>
      <Section className="pt-10 sm:pt-14">
        <Reveal>
          <SectionLabel>Insights</SectionLabel>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-5xl">
            Ideas that actually grow <span className="text-accent">your business</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Straight-talking guides on automation, search, ads and building things that convert — written by the
            people doing the work.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFilter({ q: term || undefined });
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search articles"
                className="w-full rounded-full border border-border bg-glass py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent/50"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03]"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <FilterChip active={!search.category} onClick={() => setFilter({ category: undefined })}>
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip
                key={c.id}
                active={search.category === c.slug}
                onClick={() => setFilter({ category: c.slug })}
              >
                {c.name}
              </FilterChip>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <FilterChip
                  key={t.id}
                  active={search.tag === t.slug}
                  onClick={() => setFilter({ tag: search.tag === t.slug ? undefined : t.slug })}
                >
                  #{t.name}
                </FilterChip>
              ))}
            </div>
          )}
        </Reveal>
      </Section>

      {featured.length > 0 && (
        <Section className="pt-0">
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Featured
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featured.map((p) => (
              <Reveal key={p.id}>
                <PostCard post={p} featured />
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      <Section className="pt-0">
        <div className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {search.q || search.category || search.tag ? "Results" : "Recent posts"}
        </div>
        {rest.length === 0 && featured.length === 0 ? (
          <div className="rounded-2xl border border-border bg-glass p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No articles here yet. New pieces are on the way — check back soon.
            </p>
            <Link to="/contact" className="mt-4 inline-block text-sm text-accent hover:underline">
              Or talk to us directly →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Reveal key={p.id}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <Section className="pt-0">
        <NewsletterForm />
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
        active
          ? "border-accent/50 bg-accent/15 text-accent"
          : "border-border bg-glass text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
