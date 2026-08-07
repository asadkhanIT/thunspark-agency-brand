import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";

const MAX_BYTES = 10 * 1024 * 1024;

/** Uploads an image from the user's device to the media bucket and returns a public URL. */
export async function uploadMedia(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
  if (file.size > MAX_BYTES) throw new Error("Image is larger than 10MB.");

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${new Date().getFullYear()}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);
  return `/api/public/media/${path}`;
}
