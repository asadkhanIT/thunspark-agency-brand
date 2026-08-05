import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { PostDetail, PostSummary, PostCategory, PostTag } from "./blog-types";

const listInput = z
  .object({
    search: z.string().max(120).optional(),
    category: z.string().max(120).optional(),
    tag: z.string().max(120).optional(),
    limit: z.number().int().min(1).max(50).optional(),
  })
  .optional();

function shape(row: any): PostSummary {
  return {
    ...row,
    category: row.category ?? null,
    author: row.author ?? null,
  } as PostSummary;
}

export const listPublishedPosts = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listInput.parse(input ?? {}))
  .handler(async ({ data }) => {
    const { createPublicClient, POST_SUMMARY_COLUMNS } = await import("./blog.server");
    const supabase = createPublicClient();
    let query = supabase
      .from("posts")
      .select(POST_SUMMARY_COLUMNS)
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(data?.limit ?? 48);

    if (data?.search) query = query.or(`title.ilike.%${data.search}%,excerpt.ilike.%${data.search}%`);
    if (data?.category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", data.category).maybeSingle();
      query = query.eq("category_id", cat?.id ?? "00000000-0000-0000-0000-000000000000");
    }
    if (data?.tag) {
      const { data: tag } = await supabase.from("tags").select("id").eq("slug", data.tag).maybeSingle();
      const { data: links } = await supabase.from("post_tags").select("post_id").eq("tag_id", tag?.id ?? "");
      query = query.in("id", (links ?? []).map((l: any) => l.post_id));
    }

    const [{ data: posts }, { data: categories }, { data: tags }] = await Promise.all([
      query,
      supabase.from("categories").select("id, name, slug, description").order("name"),
      supabase.from("tags").select("id, name, slug").order("name"),
    ]);

    return {
      posts: (posts ?? []).map(shape),
      categories: (categories ?? []) as PostCategory[],
      tags: (tags ?? []) as PostTag[],
    };
  });

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { createPublicClient, POST_DETAIL_COLUMNS, POST_SUMMARY_COLUMNS } = await import("./blog.server");
    const supabase = createPublicClient();
    const now = new Date().toISOString();

    const { data: row } = await supabase
      .from("posts")
      .select(POST_DETAIL_COLUMNS)
      .eq("slug", data.slug)
      .eq("status", "published")
      .not("published_at", "is", null)
      .lte("published_at", now)
      .maybeSingle();

    if (!row) return null;

    const post = {
      ...shape(row),
      ...(row as any),
      tags: ((row as any).post_tags ?? []).map((pt: any) => pt.tags).filter(Boolean),
    } as PostDetail;

    const [{ data: related }, { data: prev }, { data: next }] = await Promise.all([
      supabase
        .from("posts")
        .select(POST_SUMMARY_COLUMNS)
        .eq("status", "published")
        .lte("published_at", now)
        .neq("id", post.id)
        .eq("category_id", (row as any).category_id ?? post.category?.id ?? "")
        .order("published_at", { ascending: false })
        .limit(3),
      supabase
        .from("posts")
        .select("title, slug")
        .eq("status", "published")
        .lt("published_at", post.published_at ?? now)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("posts")
        .select("title, slug")
        .eq("status", "published")
        .gt("published_at", post.published_at ?? now)
        .lte("published_at", now)
        .order("published_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    return {
      post,
      related: (related ?? []).map(shape),
      prev: (prev ?? null) as { title: string; slug: string } | null,
      next: (next ?? null) as { title: string; slug: string } | null,
    };
  });

export const submitContactLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        full_name: z.string().trim().min(1).max(100),
        company: z.string().trim().max(120).optional().or(z.literal("")),
        email: z.string().trim().email().max(255),
        website: z.string().trim().max(255).optional().or(z.literal("")),
        message: z.string().trim().min(1).max(4000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./blog.server");
    const supabase = createPublicClient();
    const { error } = await supabase.from("contact_leads").insert({
      full_name: data.full_name,
      company: data.company || null,
      email: data.email,
      website: data.website || null,
      message: data.message,
    });
    if (error) throw new Error("Could not send your message. Please try again.");
    return { ok: true };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().trim().email().max(255), source: z.string().max(60).optional() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { createPublicClient } = await import("./blog.server");
    const supabase = createPublicClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: data.email.toLowerCase(), source: data.source ?? "blog" });
    if (error && !error.message.includes("duplicate")) throw new Error("Could not subscribe. Please try again.");
    return { ok: true };
  });
