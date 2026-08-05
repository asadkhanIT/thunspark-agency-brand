import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Publishable-key client for public (anon) reads during SSR. */
export function createPublicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const POST_SUMMARY_COLUMNS =
  "id, title, slug, excerpt, featured_image, featured_image_alt, reading_time, is_featured, published_at, category:categories(id, name, slug), author:profiles(id, display_name, avatar_url, bio, title)";

export const POST_DETAIL_COLUMNS = `${POST_SUMMARY_COLUMNS}, content, seo_title, meta_description, focus_keyword, canonical_url, og_title, og_description, og_image, twitter_image, schema_type, robots_index, updated_at, post_tags(tags(id, name, slug))`;

export const PUBLISHED_FILTER = (q: any) =>
  q.eq("status", "published").not("published_at", "is", null).lte("published_at", new Date().toISOString());
