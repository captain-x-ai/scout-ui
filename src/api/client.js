const TOKEN_KEY = "captainx_access_token";

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

function apiBase() {
  if (typeof window !== "undefined" && window.__ENV__ && "VITE_API_BASE_URL" in window.__ENV__) {
    return window.__ENV__.VITE_API_BASE_URL || "";
  }
  const built = import.meta.env.VITE_API_BASE_URL || "";
  // Dev: use Vite /v1 proxy (relative URLs) instead of cross-origin localhost:8080.
  if (
    typeof window !== "undefined"
    && built
    && (built.includes("localhost") || built.includes("127.0.0.1"))
  ) {
    return "";
  }
  return built;
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
const inFlightGets = new Map();

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
  const method = (options.method || "GET").toUpperCase();
  const dedupeKey = method === "GET" ? path : null;

  if (dedupeKey && inFlightGets.has(dedupeKey)) {
    return inFlightGets.get(dedupeKey);
  }

  const run = async () => {
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
  };

  const promise = run();
  if (dedupeKey) {
    inFlightGets.set(dedupeKey, promise);
    promise.finally(() => {
      if (inFlightGets.get(dedupeKey) === promise) inFlightGets.delete(dedupeKey);
    });
  }
  return promise;
}

export function oauthGoogleStartUrl() {
  return `${apiBase()}/v1/auth/google/start`;
}
