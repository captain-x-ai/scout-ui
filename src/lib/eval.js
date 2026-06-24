/* ============================== EVAL LOGIC ============================== */
// Recency is driven by MATCH DATE (when the football happened), never by upload order.
export function matchTime(r) {
  const d = r.date ? Date.parse(r.date) : NaN;
  return Number.isNaN(d) ? r.order : d; // fallback to order only if a clip has no date
}
export function computeEval(reviews, windowN, humanOnly) {
  let pool = reviews.filter((r) => r.type !== "pending" && r.score != null);
  if (humanOnly) pool = pool.filter((r) => r.type === "human");
  pool = [...pool].sort((a, b) => matchTime(b) - matchTime(a)).slice(0, windowN); // newest match first
  if (!pool.length) return null;
  let num = 0, den = 0;
  pool.forEach((r, i) => {
    const recency = Math.pow(0.85, i); // i=0 is the most recently PLAYED match
    const engagement = r.type === "human" ? 1.0 : 0.6;
    const w = recency * engagement;
    num += r.score * w; den += w;
  });
  const humanCount = pool.filter((r) => r.type === "human").length;
  const aiCount = pool.length - humanCount;
  const sampleFactor = Math.min(pool.length / windowN, 1);
  const humanShare = humanCount / pool.length;
  const confidence = Math.round((0.55 * sampleFactor + 0.45 * humanShare) * 100);
  const trend = [...pool].reverse().map((r) => r.score); // oldest→newest match for the sparkline
  const latest = pool[0]?.date || null;
  return { score: num / den, humanCount, aiCount, n: pool.length, confidence, trend, latest };
}
export function overruleRate(reviews) {
  const human = reviews.filter((r) => r.type === "human");
  if (!human.length) return 0;
  const over = human.filter((r) => r.editDelta >= 2).length;
  return Math.round((over / human.length) * 100);
}
export function fitScore(player, need) {
  let s = 0;
  need.attrs.forEach((a) => { s += (player.attrs[a.key] || 0) * a.weight; });
  s = s / need.attrs.reduce((t, a) => t + a.weight, 0); // 0-100 attribute fit
  if (player.pos !== need.pos) s -= 35;
  if (player.age > need.maxAge) s -= 25;
  if (player.valueNum > need.maxValue) s -= 18;
  return Math.max(0, Math.min(100, Math.round(s)));
}

// Map an evaluation score to a recommendation. Single home for the thresholds
// that were previously copy-pasted in Player (hero) and Report.
export function recForScore(score) {
  return score >= 7.3 ? "sign" : score >= 6.3 ? "monitor" : "pass";
}
