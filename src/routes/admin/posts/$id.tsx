import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

import { PostEditor, emptyPost, type EditorPost } from "@/components/admin/PostEditor";
import { getAdminPost, listTaxonomy } from "@/lib/admin.functions";
import type { PostStatus } from "@/lib/blog-types";

export const Route = createFileRoute("/admin/posts/$id")({
  head: () => ({
    meta: [
      { title: "Edit Article — ThunSpark Studio" },
      { name: "description", content: "Edit, schedule, duplicate or archive a ThunSpark article." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Edit Article — ThunSpark Studio" },
      { property: "og:description", content: "Edit a ThunSpark article." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EditPostPage,
});

function toEditor(row: any): EditorPost {
  return {
    ...emptyPost,
    id: row.id,
    title: row.title ?? "",
    slug: row.slug ?? "",
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    featured_image: row.featured_image ?? "",
    featured_image_alt: row.featured_image_alt ?? "",
    category_id: row.category_id ?? null,
    is_featured: Boolean(row.is_featured),
    status: (row.status ?? "draft") as PostStatus,
    published_at: row.published_at ?? null,
    tags: row.tags ?? [],
    seo_title: row.seo_title ?? "",
    meta_description: row.meta_description ?? "",
    focus_keyword: row.focus_keyword ?? "",
    canonical_url: row.canonical_url ?? "",
    og_title: row.og_title ?? "",
    og_description: row.og_description ?? "",
    og_image: row.og_image ?? "",
    twitter_image: row.twitter_image ?? "",
    schema_type: row.schema_type ?? "Article",
    robots_index: row.robots_index ?? true,
  };
}

function EditPostPage() {
  const { id } = Route.useParams();
  const fetchPost = useServerFn(getAdminPost);
  const fetchTaxonomy = useServerFn(listTaxonomy);

  const postQuery = useQuery({ queryKey: ["admin-post", id], queryFn: () => fetchPost({ data: { id } }) });
  const taxonomyQuery = useQuery({ queryKey: ["admin-taxonomy"], queryFn: () => fetchTaxonomy() });

  if (postQuery.isLoading || taxonomyQuery.isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading article…
      </div>
    );
  }

  if (!postQuery.data) {
    return (
      <div className="rounded-2xl border border-border bg-glass p-10 text-center text-sm text-muted-foreground">
        This article no longer exists.{" "}
        <Link to="/admin" className="text-accent underline">
          Back to articles
        </Link>
      </div>
    );
  }

  return (
    <PostEditor
      key={id}
      initial={toEditor(postQuery.data)}
      categories={taxonomyQuery.data?.categories ?? []}
    />
  );
}
