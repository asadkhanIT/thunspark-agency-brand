import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const statusEnum = z.enum(["draft", "published", "scheduled", "archived"]);

const postInput = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(120).optional().or(z.literal("")),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  content: z.string().max(400000).optional().or(z.literal("")),
  featured_image: z.string().trim().max(600).optional().or(z.literal("")),
  featured_image_alt: z.string().trim().max(240).optional().or(z.literal("")),
  category_id: z.string().uuid().nullable().optional(),
  is_featured: z.boolean().optional(),
  status: statusEnum.optional(),
  published_at: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  seo_title: z.string().trim().max(180).optional().or(z.literal("")),
  meta_description: z.string().trim().max(320).optional().or(z.literal("")),
  focus_keyword: z.string().trim().max(120).optional().or(z.literal("")),
  canonical_url: z.string().trim().max(600).optional().or(z.literal("")),
  og_title: z.string().trim().max(180).optional().or(z.literal("")),
  og_description: z.string().trim().max(320).optional().or(z.literal("")),
  og_image: z.string().trim().max(600).optional().or(z.literal("")),
  twitter_image: z.string().trim().max(600).optional().or(z.literal("")),
  schema_type: z.string().trim().max(60).optional().or(z.literal("")),
  robots_index: z.boolean().optional(),
});

export type PostInput = z.infer<typeof postInput>;

async function assertAdmin(supabase: any) {
  const { data, error } = await supabase.rpc("is_admin");
  if (error || !data) throw new Error("Forbidden: admin access required");
}

async function uniqueSlug(supabase: any, base: string, ignoreId?: string) {
  let candidate = base || "post";
  for (let i = 0; i < 40; i++) {
    let q = supabase.from("posts").select("id").eq("slug", candidate).limit(1);
    if (ignoreId) q = q.neq("id", ignoreId);
    const { data } = await q;
    if (!data || data.length === 0) return candidate;
    candidate = `${base}-${i + 2}`;
  }
  return `${base}-${Date.now()}`;
}

/** Confirms the signed-in user is an admin (used by the admin gate). */
export const checkAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("is_admin");
    return { isAdmin: Boolean(data), userId: context.userId };
  });

export const listAdminPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        search: z.string().max(120).optional(),
        status: statusEnum.optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    let query = context.supabase
      .from("posts")
      .select(
        "id, title, slug, status, is_featured, reading_time, view_count, published_at, updated_at, created_at, category_id, featured_image",
      )
      .order("updated_at", { ascending: false })
      .limit(200);
    if (data.status) query = query.eq("status", data.status);
    if (data.search) query = query.ilike("title", `%${data.search}%`);
    const [{ data: posts, error }, { data: categories }] = await Promise.all([
      query,
      context.supabase.from("categories").select("id, name, slug").order("name"),
    ]);
    if (error) throw new Error(error.message);
    return { posts: posts ?? [], categories: categories ?? [] };
  });

export const getAdminPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { data: post, error } = await context.supabase
      .from("posts")
      .select("*, post_tags(tags(id, name, slug))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return null;
    const tags = ((post as any).post_tags ?? []).map((pt: any) => pt.tags?.name).filter(Boolean);
    return { ...(post as any), tags } as any;
  });

export const listTaxonomy = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase);
    const [{ data: categories }, { data: tags }] = await Promise.all([
      context.supabase.from("categories").select("id, name, slug").order("name"),
      context.supabase.from("tags").select("id, name, slug").order("name"),
    ]);
    return { categories: categories ?? [], tags: tags ?? [] };
  });

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => postInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { slugify, readingTime } = await import("./slug");

    const status = data.status ?? "draft";
    const baseSlug = slugify(data.slug || data.title);
    const slug = await uniqueSlug(context.supabase, baseSlug, data.id);

    let published_at = data.published_at ?? null;
    if (status === "published" && !published_at) published_at = new Date().toISOString();
    if (status === "draft" || status === "archived") published_at = data.published_at ?? published_at;

    const row = {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content || "",
      featured_image: data.featured_image || null,
      featured_image_alt: data.featured_image_alt || null,
      category_id: data.category_id ?? null,
      is_featured: data.is_featured ?? false,
      status,
      published_at,
      reading_time: readingTime(data.content || ""),
      seo_title: data.seo_title || null,
      meta_description: data.meta_description || null,
      focus_keyword: data.focus_keyword || null,
      canonical_url: data.canonical_url || null,
      og_title: data.og_title || null,
      og_description: data.og_description || null,
      og_image: data.og_image || null,
      twitter_image: data.twitter_image || null,
      schema_type: data.schema_type || "Article",
      robots_index: data.robots_index ?? true,
      author_id: context.userId,
    };

    let postId = data.id;
    if (postId) {
      const { error } = await context.supabase.from("posts").update(row).eq("id", postId);
      if (error) throw new Error(error.message);
    } else {
      const { data: created, error } = await context.supabase
        .from("posts")
        .insert(row)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      postId = created.id;
    }

    // Sync tags
    if (data.tags) {
      const names = Array.from(new Set(data.tags.map((t) => t.trim()).filter(Boolean)));
      const tagIds: string[] = [];
      for (const name of names) {
        const tagSlug = slugify(name);
        const { data: existing } = await context.supabase
          .from("tags")
          .select("id")
          .eq("slug", tagSlug)
          .maybeSingle();
        if (existing) {
          tagIds.push(existing.id);
        } else {
          const { data: created } = await context.supabase
            .from("tags")
            .insert({ name, slug: tagSlug })
            .select("id")
            .single();
          if (created) tagIds.push(created.id);
        }
      }
      await context.supabase.from("post_tags").delete().eq("post_id", postId!);
      if (tagIds.length) {
        await context.supabase
          .from("post_tags")
          .insert(tagIds.map((tag_id) => ({ post_id: postId!, tag_id })));
      }
    }

    return { id: postId!, slug, status };
  });

export const updatePostStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: statusEnum,
        published_at: z.string().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const patch: { status: typeof data.status; published_at?: string | null } = { status: data.status };
    if (data.status === "published") patch.published_at = data.published_at ?? new Date().toISOString();
    if (data.status === "scheduled") {
      if (!data.published_at) throw new Error("A future publish date is required to schedule a post.");
      patch.published_at = data.published_at;
    }
    if (data.status === "draft") patch.published_at = null;
    const { error } = await context.supabase.from("posts").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true, status: data.status };
  });

export const duplicatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    const { slugify } = await import("./slug");
    const { data: source, error } = await context.supabase
      .from("posts")
      .select("*, post_tags(tag_id)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!source) throw new Error("Post not found");

    const src = source as any;
    const title = `${src.title} (Copy)`;
    const slug = await uniqueSlug(context.supabase, slugify(title));
    const { post_tags, id: _id, created_at: _c, updated_at: _u, ...rest } = src;
    const { data: created, error: insertError } = await context.supabase
      .from("posts")
      .insert({
        ...rest,
        title,
        slug,
        status: "draft",
        published_at: null,
        view_count: 0,
        is_featured: false,
        author_id: context.userId,
      })
      .select("id")
      .single();
    if (insertError) throw new Error(insertError.message);

    const tagIds = (post_tags ?? []).map((t: any) => t.tag_id).filter(Boolean);
    if (tagIds.length) {
      await context.supabase
        .from("post_tags")
        .insert(tagIds.map((tag_id: string) => ({ post_id: created.id, tag_id })));
    }
    return { id: created.id as string };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase);
    await context.supabase.from("post_tags").delete().eq("post_id", data.id);
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
