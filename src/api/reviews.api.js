import { apiFetch } from "./client";
import { getClipStatus } from "./clips.api";

export async function acceptReview(session, clipId, { score, rec, conf }) {
  return apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/review`, {
    method: "PATCH",
    body: JSON.stringify({
      action: "accept",
      score,
      recommendation: rec,
      confidence: conf,
    }),
  });
}

export async function saveReview(session, clipId, { score, rec, conf, human }) {
  return apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/review`, {
    method: "PATCH",
    body: JSON.stringify({
      action: "save",
      score,
      recommendation: rec,
      confidence: conf,
      human_observation: human,
    }),
  });
}

export async function regenerateObservation(session, clipId) {
  await apiFetch(`/v1/clubs/${session.clubId}/clips/${clipId}/regenerate-ai`, {
    method: "POST",
    body: "{}",
  });

  const previous = await getClipStatus(session, clipId);
  const prevText = previous.ai_observation || "";

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 2500));
    const status = await getClipStatus(session, clipId);
    const text = status.ai_observation || "";
    if (text && text !== prevText) return text;
  }
  return null;
}
