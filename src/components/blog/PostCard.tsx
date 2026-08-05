import { Link } from "@tanstack/react-router";
import { Clock, ArrowUpRight } from "lucide-react";
import type { PostSummary } from "@/lib/blog-types";
import { formatDate } from "@/lib/slug";

export function PostCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.07]"
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
        {post.featured_image ? (
          <img
            src={post.featured_image}
            alt={post.featured_image_alt ?? post.title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
        )}
        {post.category && (
          <span className="absolute left-3 top-3 rounded-full border border-border bg-[#0f1115]/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-accent backdrop-blur">
            {post.category.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className={`font-display font-semibold leading-snug ${featured ? "text-xl" : "text-base"}`}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
          <span>{formatDate(post.published_at)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.reading_time} min
          </span>
          <ArrowUpRight className="ml-auto h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}
