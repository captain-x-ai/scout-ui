import { apiFetch } from "./client";
import { mapScoutingNeed } from "./mappers";

export async function fetchScoutingNeeds(session) {
  const data = await apiFetch(
    `/v1/clubs/${session.clubId}/sports/${session.sportId}/scouting-needs`,
  );
  return (data.items || []).map(mapScoutingNeed).filter(Boolean);
}

/** @deprecated Use fetchScoutingNeeds; kept for backward compat. */
export async function fetchOpenNeed(session) {
  const data = await apiFetch(
    `/v1/clubs/${session.clubId}/sports/${session.sportId}/scouting-needs/active`,
  );
  return mapScoutingNeed(data.need);
}
