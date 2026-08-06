import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

import { PostEditor, emptyPost } from "@/components/admin/PostEditor";
import { listTaxonomy } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/posts/new")({
  head: () => ({
    meta: [
      { title: "New Article — ThunSpark Studio" },
      { name: "description", content: "Write and publish a new ThunSpark article." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "New Article — ThunSpark Studio" },
      { property: "og:description", content: "Write and publish a new ThunSpark article." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewPostPage,
});

function NewPostPage() {
  const fetchTaxonomy = useServerFn(listTaxonomy);
  const { data, isLoading } = useQuery({ queryKey: ["admin-taxonomy"], queryFn: () => fetchTaxonomy() });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Preparing editor…
      </div>
    );
  }

  return <PostEditor initial={emptyPost} categories={data?.categories ?? []} />;
}
