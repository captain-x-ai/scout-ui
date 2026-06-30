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

/** Run before React mount so OAuth redirect tokens are not lost. */
export function consumeOAuthTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error) {
    params.delete("error");
    const rest = params.toString();
    const path = window.location.pathname.startsWith("/auth/") ? "/auth/error" : window.location.pathname;
    window.history.replaceState({}, "", rest ? `${path}?${rest}&error=${error}` : `${path}?error=${error}`);
    return null;
  }

  const token = params.get("access_token");
  if (!token) return null;

  setAccessToken(token);
  params.delete("access_token");
  const rest = params.toString();
  const path = window.location.pathname === "/" || window.location.pathname.startsWith("/auth/")
    ? "/players"
    : window.location.pathname;
  window.history.replaceState({}, "", rest ? `${path}?${rest}` : path);
  return token;
}

export function completeOAuthFromUrl() {
  return consumeOAuthTokenFromUrl();
}
