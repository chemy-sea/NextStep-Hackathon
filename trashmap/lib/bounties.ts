import { supabase } from "./supabase";
import { WasteCategory, SeverityLevel } from "./types";

/** Row shape of the `public.bounties` table (demo mode: poster_id nullable, no auth). */
export interface BountyRow {
  id: string;
  poster_id: string | null;
  title: string;
  description: string | null;
  category: WasteCategory;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  location_accuracy: number | null;
  photo_url: string;
  status: "open" | "claimed" | "pending_verification" | "verified" | "disputed";
  points: number;
  karma: number;
  created_at: string;
}

export interface NewBountyInput {
  title: string;
  description: string | null;
  category: WasteCategory;
  severity: SeverityLevel;
  latitude: number;
  longitude: number;
  locationAccuracy: number | null;
  points: number;
  karma: number;
}

const PHOTO_BUCKET = "litter-photos";

/**
 * Uploads a captured photo (data URL) to the `litter-photos` bucket and
 * returns its public URL. Throws with the underlying Supabase error message
 * on failure — callers should surface this to the user, not swallow it.
 */
export async function uploadBountyPhoto(dataUrl: string): Promise<string> {
  const blob = await dataUrlToBlob(dataUrl);
  const fileName = `${crypto.randomUUID()}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Photo upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(PHOTO_BUCKET)
    .getPublicUrl(fileName);

  if (!publicUrlData?.publicUrl) {
    throw new Error("Photo upload succeeded but no public URL was returned.");
  }

  return publicUrlData.publicUrl;
}

/**
 * Inserts a new bounty row. Throws with the underlying Supabase/Postgres
 * error message on failure.
 */
export async function insertBounty(
  input: NewBountyInput,
  photoUrl: string
): Promise<BountyRow> {
  const { data, error } = await supabase
    .from("bounties")
    .insert({
      poster_id: null,
      title: input.title,
      description: input.description,
      category: input.category,
      severity: input.severity,
      latitude: input.latitude,
      longitude: input.longitude,
      location_accuracy: input.locationAccuracy,
      photo_url: photoUrl,
      status: "open",
      points: input.points,
      karma: input.karma,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save bounty: ${error.message}`);
  }

  return data as BountyRow;
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
