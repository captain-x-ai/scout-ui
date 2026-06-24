/* ============================== AI SUMMARY SERVICE ==============================
   FUTURE API BOUNDARY. Today the summary is the static {en, ar} text carried on
   the player fixture; later this becomes a generated call to the AI summary
   service. Components read it through getSummary so the call site is already the
   seam. */
export function getSummary(player) {
  return player.summary || null; // future: generate from the player's reviews
}
