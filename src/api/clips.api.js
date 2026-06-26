import { apiFetch } from "./client";
import { actionTagKey } from "./mappers";

function clubPath(session) {
  return `/v1/clubs/${session.clubId}`;
}

/** Resolve video MIME type for GCS signed PUT (must match backend signature). */
export function normalizeVideoContentType(file) {
  if (file.type && file.type.startsWith("video/")) return file.type;
  const name = (file.name || "").toLowerCase();
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mkv")) return "video/x-matroska";
  return "video/mp4";
}

export async function createClip(session, playerId, row) {
  const file = row.file;
  if (!file) throw new Error("Each clip row must have a video file");

  const contentType = normalizeVideoContentType(file);
  const body = {
    opponent_name: row.opp || "—",
    match_date: row.date || new Date().toISOString().slice(0, 10),
    action_tag_key: actionTagKey(row.tag),
    minute: row.minute ? Number(row.minute) : null,
    ident_text: row.ident || "",
    filename: file.name,
    content_type: contentType,
  };

  return apiFetch(`${clubPath(session)}/sports/${session.sportId}/players/${playerId}/clip`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PUT bytes to a GCS V4 signed URL.
 * Content-Type must exactly match the value used when the URL was signed.
 */
export async function uploadToPresignedUrl(uploadUrl, file, signedHeaders = {}) {
  const contentType = signedHeaders["Content-Type"]
    || signedHeaders["content-type"];
  if (!contentType) {
    throw new Error("Missing Content-Type in signed upload headers");
  }

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ""}`);
  }
}

export async function markUploadComplete(session, clipId) {
  return apiFetch(`${clubPath(session)}/clips/${clipId}/upload-complete`, {
    method: "POST",
    body: "{}",
  });
}

export async function getClipStatus(session, clipId) {
  return apiFetch(`${clubPath(session)}/clips/${clipId}`);
}

/** Batch-fetch signed thumbnail/video URLs for timeline clips (after fast player load). */
export async function batchClipMedia(session, clipIds) {
  if (!clipIds?.length) return [];
  const data = await apiFetch(`${clubPath(session)}/clips/media`, {
    method: "POST",
    body: JSON.stringify({ clip_ids: clipIds }),
  });
  return data.items || [];
}

function mergeClipMedia(reviews, items) {
  const byId = Object.fromEntries((items || []).map((i) => [i.clip_id, i]));
  return reviews.map((r) => {
    const m = byId[r.id];
    if (!m) return r;
    return {
      ...r,
      thumbnailUrl: m.thumbnail_url || r.thumbnailUrl,
      videoUrl: m.video_playback_url || r.videoUrl,
    };
  });
}

export { mergeClipMedia };

const READY_STATUSES = new Set(["completed"]);

export async function pollClipUntilReady(session, clipId, { intervalMs = 3000, maxAttempts = 60 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    const status = await getClipStatus(session, clipId);
    if (status.status === "failed") {
      throw new Error(status.processing_error || "Clip processing failed");
    }
    if (READY_STATUSES.has(status.status)) return status;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Timed out waiting for clip processing");
}

export async function uploadClipRows(session, playerId, rows, onProgress, { onProcessingStarted } = {}) {
  const results = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.file) continue;
    onProgress?.(i + 1, rows.length, "creating");
    const created = await createClip(session, playerId, row);
    onProgress?.(i + 1, rows.length, "uploading");
    await uploadToPresignedUrl(created.upload_url, row.file, created.upload_headers);
    onProgress?.(i + 1, rows.length, "completing");
    await markUploadComplete(session, created.clip_id);
    onProgress?.(i + 1, rows.length, "processing");
    onProcessingStarted?.(created.clip_id);
    await pollClipUntilReady(session, created.clip_id);
    results.push(created.clip_id);
  }
  return results;
}
