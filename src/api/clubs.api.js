import { apiFetch } from "./client";

/** Clubs where the current user has scout/coach/admin membership. */
export async function listMyClubs() {
  const data = await apiFetch("/v1/clubs");
  return data.items || [];
}
