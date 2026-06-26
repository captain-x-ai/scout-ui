import { apiFetch, oauthGoogleStartUrl, setAccessToken } from "./client";

export function startGoogleLogin() {
  window.location.href = oauthGoogleStartUrl();
}

export async function logout() {
  try {
    await apiFetch("/v1/auth/logout", { method: "POST", body: "{}" });
  } finally {
    setAccessToken(null);
  }
}

export async function fetchMe() {
  return apiFetch("/v1/me");
}

export async function setActiveClub(clubId) {
  return apiFetch("/v1/me/active-club", {
    method: "POST",
    body: JSON.stringify({ club_id: clubId }),
  });
}

export function completeOAuthFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("access_token");
  const error = params.get("error");
  if (error) throw new Error(error);
  if (token) {
    setAccessToken(token);
    window.history.replaceState({}, "", "/players");
    return token;
  }
  return null;
}
