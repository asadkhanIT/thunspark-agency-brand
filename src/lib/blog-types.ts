export type PostStatus = "draft" | "published" | "scheduled" | "archived";

export type PostAuthor = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  title: string | null;
};

export type PostCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type PostTag = { id: string; name: string; slug: string };

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  reading_time: number;
  is_featured: boolean;
  published_at: string | null;
  category: PostCategory | null;
  author: PostAuthor | null;
};

export type PostDetail = PostSummary & {
  content: string;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_image: string | null;
  schema_type: string;
  robots_index: boolean;
  updated_at: string;
  tags: PostTag[];
};

export type AdminPostRow = {
  id: string;
  title: string;
  slug: string;
  status: PostStatus;
  is_featured: boolean;
  reading_time: number;
  view_count: number;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  category_id: string | null;
  featured_image: string | null;
};

export type MediaItem = {
  id: string;
  file_path: string;
  url: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
};

export const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  published: "Published",
  scheduled: "Scheduled",
  archived: "Archived",
};
