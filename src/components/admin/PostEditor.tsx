import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Save,
  Send,
  CalendarClock,
  EyeOff,
  Archive,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { RichTextEditor } from "./RichTextEditor";
import { savePost, updatePostStatus, duplicatePost } from "@/lib/admin.functions";
import { slugify } from "@/lib/slug";
import type { PostStatus } from "@/lib/blog-types";

type Category = { id: string; name: string; slug: string };

export type EditorPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  category_id: string | null;
  is_featured: boolean;
  status: PostStatus;
  published_at: string | null;
  tags: string[];
  seo_title: string;
  meta_description: string;
  focus_keyword: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_image: string;
  schema_type: string;
  robots_index: boolean;
};

export const emptyPost: EditorPost = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  featured_image_alt: "",
  category_id: null,
  is_featured: false,
  status: "draft",
  published_at: null,
  tags: [],
  seo_title: "",
  meta_description: "",
  focus_keyword: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_image: "",
  schema_type: "Article",
  robots_index: true,
};

const inputClass =
  "w-full rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-accent/50";
const labelClass = "mb-1.5 block text-xs uppercase tracking-[0.14em] text-muted-foreground";

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostEditor({
  initial,
  categories,
}: {
  initial: EditorPost;
  categories: Category[];
}) {
  const navigate = useNavigate();
  const save = useServerFn(savePost);
  const setStatus = useServerFn(updatePostStatus);
  const duplicate = useServerFn(duplicatePost);

  const [post, setPost] = useState<EditorPost>(initial);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [tagText, setTagText] = useState(initial.tags.join(", "));
  const [schedule, setSchedule] = useState(toLocalInput(initial.published_at));
  const [busy, setBusy] = useState<string | null>(null);

  const set = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) =>
    setPost((p) => ({ ...p, [key]: value }));

  const previewSlug = useMemo(() => slugify(post.slug || post.title), [post.slug, post.title]);

  const payload = (status: PostStatus, publishedAt?: string | null) => ({
    ...(post.id ? { id: post.id } : {}),
    title: post.title.trim(),
    slug: previewSlug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: post.featured_image,
    featured_image_alt: post.featured_image_alt,
    category_id: post.category_id,
    is_featured: post.is_featured,
    status,
    published_at: publishedAt !== undefined ? publishedAt : post.published_at,
    tags: tagText.split(",").map((t) => t.trim()).filter(Boolean),
    seo_title: post.seo_title,
    meta_description: post.meta_description,
    focus_keyword: post.focus_keyword,
    canonical_url: post.canonical_url,
    og_title: post.og_title,
    og_description: post.og_description,
    og_image: post.og_image,
    twitter_image: post.twitter_image,
    schema_type: post.schema_type || "Article",
    robots_index: post.robots_index,
  });

  async function persist(status: PostStatus, publishedAt?: string | null, key = "save") {
    if (!post.title.trim()) {
      toast.error("Add a title before saving.");
      return null;
    }
    setBusy(key);
    try {
      const result = await save({ data: payload(status, publishedAt) });
      setPost((p) => ({
        ...p,
        id: result.id,
        slug: result.slug,
        status: result.status as PostStatus,
        published_at: publishedAt !== undefined ? publishedAt : p.published_at,
      }));
      setSlugTouched(true);
      if (!post.id) navigate({ to: "/admin/posts/$id", params: { id: result.id } });
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save the post.");
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function changeStatus(status: PostStatus, publishedAt?: string | null, key = status) {
    if (!post.id) {
      const saved = await persist(status, publishedAt, key);
      if (saved) toast.success(`Post ${status === "published" ? "published" : `saved as ${status}`}.`);
      return;
    }
    setBusy(key);
    try {
      await setStatus({ data: { id: post.id, status, published_at: publishedAt ?? null } });
      setPost((p) => ({
        ...p,
        status,
        published_at: status === "draft" ? null : (publishedAt ?? p.published_at),
      }));
      toast.success(
        status === "published"
          ? "Post published."
          : status === "scheduled"
            ? "Post scheduled."
            : status === "archived"
              ? "Post archived."
              : "Post moved back to draft.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update the status.");
    } finally {
      setBusy(null);
    }
  }

  async function onDuplicate() {
    if (!post.id) return;
    setBusy("duplicate");
    try {
      const { id } = await duplicate({ data: { id: post.id } });
      toast.success("Duplicated as a new draft.");
      navigate({ to: "/admin/posts/$id", params: { id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not duplicate the post.");
    } finally {
      setBusy(null);
    }
  }

  const Busy = ({ k }: { k: string }) =>
    busy === k ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl">
          <input
            value={post.title}
            onChange={(e) => {
              const title = e.target.value;
              setPost((p) => ({ ...p, title, slug: slugTouched ? p.slug : slugify(title) }));
            }}
            placeholder="Article title"
            className="w-full bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/60"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="shrink-0">/blog/</span>
            <input
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
              onBlur={() => set("slug", slugify(post.slug))}
              placeholder="auto-generated-slug"
              className="min-w-[200px] flex-1 rounded-lg border border-border bg-white/[0.03] px-2 py-1 text-foreground outline-none focus:border-accent/50"
            />
            <button
              type="button"
              onClick={() => {
                setSlugTouched(false);
                set("slug", slugify(post.title));
              }}
              className="rounded-lg border border-border px-2 py-1 transition-colors hover:text-foreground"
            >
              Regenerate
            </button>
          </div>
          <textarea
            value={post.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="Short excerpt used on cards and in search results"
            className={`${inputClass} mt-3 resize-none`}
          />
        </div>

        <RichTextEditor value={post.content} onChange={(html) => set("content", html)} />

        <div className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl">
          <h2 className="text-sm font-semibold">SEO & sharing</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>SEO title</label>
              <input value={post.seo_title} onChange={(e) => set("seo_title", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Focus keyword</label>
              <input value={post.focus_keyword} onChange={(e) => set("focus_keyword", e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Meta description</label>
              <textarea
                value={post.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>OG title</label>
              <input value={post.og_title} onChange={(e) => set("og_title", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>OG image URL</label>
              <input value={post.og_image} onChange={(e) => set("og_image", e.target.value)} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>OG description</label>
              <textarea
                value={post.og_description}
                onChange={(e) => set("og_description", e.target.value)}
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Twitter image URL</label>
              <input value={post.twitter_image} onChange={(e) => set("twitter_image", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Canonical URL</label>
              <input value={post.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Schema type</label>
              <input value={post.schema_type} onChange={(e) => set("schema_type", e.target.value)} className={inputClass} />
            </div>
            <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={post.robots_index}
                onChange={(e) => set("robots_index", e.target.checked)}
                className="h-4 w-4 accent-[#ffed69]"
              />
              Allow search engines to index
            </label>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Status</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {post.status}
            </span>
          </div>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => persist(post.status === "published" ? "published" : post.status, undefined, "save").then((r) => r && toast.success("Changes saved."))}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/[0.04] px-3 py-2 text-sm font-medium transition-colors hover:border-accent/40 disabled:opacity-60"
            >
              <Busy k="save" />
              <Save className="h-4 w-4" /> Save changes
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => persist("draft", null, "draft").then((r) => r && toast.success("Saved as draft."))}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-accent/40 disabled:opacity-60"
            >
              <Busy k="draft" />
              Save as draft
            </button>
            {post.status !== "published" ? (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => (post.id ? changeStatus("published", new Date().toISOString(), "published") : persist("published", new Date().toISOString(), "published").then((r) => r && toast.success("Post published.")))}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                <Busy k="published" />
                <Send className="h-4 w-4" /> Publish now
              </button>
            ) : (
              <button
                type="button"
                disabled={busy !== null}
                onClick={() => changeStatus("draft", null, "unpublish")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-accent/40 disabled:opacity-60"
              >
                <Busy k="unpublish" />
                <EyeOff className="h-4 w-4" /> Unpublish
              </button>
            )}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <label className={labelClass}>Schedule publish</label>
            <input
              type="datetime-local"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              className={inputClass}
            />
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => {
                if (!schedule) return toast.error("Pick a date and time first.");
                const iso = new Date(schedule).toISOString();
                if (new Date(iso) <= new Date()) return toast.error("Choose a future date to schedule.");
                changeStatus("scheduled", iso, "scheduled");
              }}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm transition-colors hover:border-accent/40 disabled:opacity-60"
            >
              <Busy k="scheduled" />
              <CalendarClock className="h-4 w-4" /> Schedule
            </button>
          </div>

          <div className="mt-4 grid gap-2 border-t border-border pt-3">
            <button
              type="button"
              disabled={busy !== null || !post.id}
              onClick={() => changeStatus("archived", undefined, "archived")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              <Busy k="archived" />
              <Archive className="h-4 w-4" /> Archive
            </button>
            <button
              type="button"
              disabled={busy !== null || !post.id}
              onClick={onDuplicate}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              <Busy k="duplicate" />
              <Copy className="h-4 w-4" /> Duplicate
            </button>
            {post.status === "published" && previewSlug ? (
              <a
                href={`/blog/${previewSlug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" /> View live
              </a>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl">
          <h2 className="text-sm font-semibold">Organisation</h2>
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={post.category_id ?? ""}
                onChange={(e) => set("category_id", e.target.value || null)}
                className={inputClass}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input value={tagText} onChange={(e) => setTagText(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Featured image URL</label>
              <input value={post.featured_image} onChange={(e) => set("featured_image", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Featured image alt text</label>
              <input value={post.featured_image_alt} onChange={(e) => set("featured_image_alt", e.target.value)} className={inputClass} />
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={post.is_featured}
                onChange={(e) => set("is_featured", e.target.checked)}
                className="h-4 w-4 accent-[#ffed69]"
              />
              Feature on the blog homepage
            </label>
          </div>
        </div>
      </aside>
    </div>
  );
}
