import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, Trash2, Pencil, Loader2, Send, EyeOff, Archive } from "lucide-react";

import { listAdminPosts, duplicatePost, deletePost, updatePostStatus } from "@/lib/admin.functions";
import { STATUS_LABELS, type PostStatus } from "@/lib/blog-types";
import { formatDate } from "@/lib/slug";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Articles — ThunSpark Studio" },
      { name: "description", content: "Create, edit, schedule and archive ThunSpark blog articles." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Articles — ThunSpark Studio" },
      { property: "og:description", content: "Manage ThunSpark blog articles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPostsPage,
});

const FILTERS: Array<{ label: string; value: PostStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Drafts", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Archived", value: "archived" },
];

function AdminPostsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchPosts = useServerFn(listAdminPosts);
  const duplicate = useServerFn(duplicatePost);
  const remove = useServerFn(deletePost);
  const setStatus = useServerFn(updatePostStatus);

  const [status, setStatusFilter] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts", status, search],
    queryFn: () =>
      fetchPosts({
        data: { ...(status === "all" ? {} : { status }), ...(search ? { search } : {}) },
      }),
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] });

  async function action(id: string, fn: () => Promise<unknown>, message: string) {
    setBusyId(id);
    try {
      await fn();
      toast.success(message);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Articles</h1>
          <p className="text-xs text-muted-foreground">Draft, publish, schedule and archive your posts.</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search titles…"
          className="w-full max-w-xs rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-accent/50"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              status === f.value
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-glass backdrop-blur-xl">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading articles…
          </div>
        ) : (data?.posts ?? []).length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No articles yet.{" "}
            <Link to="/admin/posts/new" className="text-accent underline">
              Write your first one
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {(data?.posts ?? []).map((p: any) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/admin/posts/$id", params: { id: p.id } })}
                    className="truncate text-left text-sm font-medium hover:text-accent"
                  >
                    {p.title}
                  </button>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    /blog/{p.slug} · {STATUS_LABELS[p.status as PostStatus]} ·{" "}
                    {p.published_at ? formatDate(p.published_at) : `updated ${formatDate(p.updated_at)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.status !== "published" ? (
                    <IconBtn
                      label="Publish"
                      busy={busyId === p.id}
                      onClick={() =>
                        action(
                          p.id,
                          () => setStatus({ data: { id: p.id, status: "published", published_at: new Date().toISOString() } }),
                          "Published.",
                        )
                      }
                    >
                      <Send className="h-4 w-4" />
                    </IconBtn>
                  ) : (
                    <IconBtn
                      label="Unpublish"
                      busy={busyId === p.id}
                      onClick={() => action(p.id, () => setStatus({ data: { id: p.id, status: "draft" } }), "Moved to draft.")}
                    >
                      <EyeOff className="h-4 w-4" />
                    </IconBtn>
                  )}
                  {p.status !== "archived" ? (
                    <IconBtn
                      label="Archive"
                      busy={busyId === p.id}
                      onClick={() => action(p.id, () => setStatus({ data: { id: p.id, status: "archived" } }), "Archived.")}
                    >
                      <Archive className="h-4 w-4" />
                    </IconBtn>
                  ) : null}
                  <IconBtn
                    label="Duplicate"
                    busy={busyId === p.id}
                    onClick={() => action(p.id, () => duplicate({ data: { id: p.id } }), "Duplicated as draft.")}
                  >
                    <Copy className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="Edit" onClick={() => navigate({ to: "/admin/posts/$id", params: { id: p.id } })}>
                    <Pencil className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn
                    label="Delete"
                    busy={busyId === p.id}
                    onClick={() => {
                      if (!window.confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
                      action(p.id, () => remove({ data: { id: p.id } }), "Post deleted.");
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconBtn>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  busy,
  children,
}: {
  label: string;
  onClick: () => void;
  busy?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={busy}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground disabled:opacity-50"
    >
      {children}
    </button>
  );
}
