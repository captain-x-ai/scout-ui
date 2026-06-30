import { apiFetch } from "./client";
import { getClipStatus } from "./clips.api";
import { getPlayer } from "./players.api";

export async function acceptReview(session, clipId) {
  return apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/review`, {
    method: "PATCH",
    body: JSON.stringify({ action: "accept" }),
  });
}

export async function saveReview(session, clipId, { score, rec, human }) {
  return apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/review`, {
    method: "PATCH",
    body: JSON.stringify({
      action: "save",
      human_review: human,
      human_score: score,
      human_verdict: rec,
    }),
  });
}

function aiDraftText(clip) {
  return clip?.review?.ai?.review || "";
}

export async function regenerateObservation(session, clipId) {
  await apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/regenerate-ai-draft`, {
    method: "POST",
    body: "{}",
  });

  const previous = await getClipStatus(session, clipId);
  const prevText = aiDraftText(previous);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2500));
    const status = await getClipStatus(session, clipId);
    const text = aiDraftText(status);
    if (text && text !== prevText) return text;
  }
  return null;
}

export async function regeneratePlayerSummary(session, playerId) {
  return apiFetch(
    `/v1/clubs/${session.clubId}/sports/${session.sportId}/players/${playerId}/regenerate-summary`,
    { method: "POST", body: "{}" },
  );
}

function summaryText(player) {
  return player?.summary?.en || player?.playerStats?.aiSummary || "";
}

export async function pollPlayerSummaryUntilUpdated(session, playerId, prevText, opts = {}) {
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const detail = await getPlayer(session, playerId, {
      clipsPage: opts.clipsPage,
      clipsPageSize: opts.clipsPageSize,
    });
    const text = summaryText(detail);
    if (text && text !== prevText) return detail;
  }
  return null;
}
