/* ============================== REVIEWS / FOOTAGE SERVICE ==============================
   FUTURE API BOUNDARY. Reviews currently travel nested inside each player (see
   players.api). This module owns the two review-related operations that already
   reach out / shape data: drafting an AI observation, and turning uploaded clip
   rows into pending reviews. */

// Live call to the LLM service to (re)draft a single clip observation.
// Returns the drafted text, or null on failure (caller keeps the existing draft).
// NOTE: request is intentionally unchanged from the pre-refactor app.
export async function draftObservation({ player, review }) {
  const prompt = `You are a professional football scout's assistant. Write ONE concise, specific scouting observation (max 32 words, neutral tone) for this tagged match event. Output ONLY the observation, no preamble.\nPlayer: ${player.name}, ${player.pos}, age ${player.age}\nEvent: "${review.tag}" vs ${review.opp}, minute ${review.minute}.`;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
    const data = await res.json();
    return data.content.filter((c) => c.type === "text").map((c) => c.text).join(" ").trim();
  } catch (e) { return null; /* keep existing draft on failure */ }
}

// Turn uploaded clip rows into new "pending" reviews for a player
// (was the body of Player.addClips).
export function buildClipReviews(player, rows) {
  const base = player.reviews.reduce((m, r) => Math.max(m, r.order), 0);
  const today = new Date().toISOString().slice(0, 10);
  return rows.map((row, i) => ({
    id: "u" + Date.now() + i, order: base + i + 1, type: "pending",
    score: null, rec: null, conf: null,
    minute: row.minute || 0, opp: row.opp || "—", tag: row.tag || "Clip",
    date: row.date || today, ident: row.ident || "",
    ai: `${player.name} involved in ${(row.tag || "a moment").toLowerCase()} vs ${row.opp || "the opponent"} around the ${row.minute || "?"}' mark.`,
    human: null, editDelta: 0,
  }));
}
