const TOKEN_KEY = "captainx_access_token";

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

function apiBase() {
  const runtime = typeof window !== "undefined" && window.__ENV__?.VITE_API_BASE_URL;
  if (runtime) return runtime;
  return import.meta.env.VITE_API_BASE_URL || "";
}

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message || code || "API error");
    this.status = status;
    this.code = code;
  }
}

async function parseError(res) {
  try {
    const data = await res.json();
    const err = data?.error;
    throw new ApiError(res.status, err?.code, err?.message);
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(res.status, "http_error", res.statusText);
  }
}

let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${apiBase()}/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
      .then(async (res) => {
        if (!res.ok) throw new ApiError(res.status, "auth_expired", "Session expired");
        const data = await res.json();
        if (data.access_token) setAccessToken(data.access_token);
        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiFetch(path, options = {}, retried = false) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${apiBase()}${path}`, {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  });

  if (res.status === 401 && !retried && !path.startsWith("/v1/auth/")) {
    try {
      await refreshAccessToken();
      return apiFetch(path, options, true);
    } catch {
      setAccessToken(null);
      throw new ApiError(401, "auth_expired", "Session expired");
    }
  }

  if (!res.ok) await parseError(res);
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return res;
}

export function oauthGoogleStartUrl() {
  return `${apiBase()}/v1/auth/google/start`;
}
