import { apiFetch } from "./client";
import {
  mapCreatePlayerPayload,
  mapDossier,
  mapPlayerDetail,
  mapPlayerListItem,
} from "./mappers";

function sportPath(session) {
  return `/v1/clubs/${session.clubId}/sports/${session.sportId}`;
}

export async function listPlayers(session, params = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.position) qs.set("position", params.position);
  if (params.stage) qs.set("stage", params.stage);
  if (params.sort) qs.set("sort", params.sort);
  const q = qs.toString();
  const data = await apiFetch(`${sportPath(session)}/players${q ? `?${q}` : ""}`);
  return (data.items || []).map(mapPlayerListItem);
}

export async function getPlayer(session, playerId, params = {}) {
  const qs = new URLSearchParams();
  if (params.evalWindow) qs.set("eval_window", String(params.evalWindow));
  if (params.humanOnly) qs.set("human_only", "true");
  if (params.clipsPage) qs.set("clips_page", String(params.clipsPage));
  if (params.clipsPageSize) qs.set("clips_page_size", String(params.clipsPageSize));
  const q = qs.toString();
  const data = await apiFetch(`${sportPath(session)}/players/${playerId}${q ? `?${q}` : ""}`);
  return mapPlayerDetail(data);
}

export async function createPlayer(session, form) {
  const body = mapCreatePlayerPayload(form);
  const data = await apiFetch(`${sportPath(session)}/players`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const p = data.player || {};
  return mapPlayerListItem({
    id: p.id,
    name: p.name,
    name_ar: p.name_ar,
    external_club_name: p.external_club_name,
    position_key: p.position_key,
    age: p.age,
    market_value: p.market_value,
    stage: p.stage,
    nationality_code: p.nationality_code,
    attributes: p.attributes,
    days_ago: 0,
  });
}

export async function patchPlayerStage(session, playerId, stage) {
  const data = await apiFetch(`${sportPath(session)}/players/${playerId}`, {
    method: "PATCH",
    body: JSON.stringify({ stage }),
  });
  return data.player;
}

export async function getDossier(session, playerId) {
  const data = await apiFetch(`${sportPath(session)}/players/${playerId}/dossier`);
  return mapDossier(data);
}
