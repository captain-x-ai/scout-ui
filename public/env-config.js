// Local dev: Vite serves this file; values come from .env via import.meta.env in client.js.
// Production Docker image overwrites this file at container start from VITE_API_BASE_URL.
window.__ENV__ = window.__ENV__ || {};
