import { apiFetch } from "./client";
import { mapScoutingNeed } from "./mappers";

export async function fetchOpenNeed(session) {
  const data = await apiFetch(
    `/v1/clubs/${session.clubId}/sports/${session.sportId}/scouting-needs/active`,
  );
  return mapScoutingNeed(data.need);
}
