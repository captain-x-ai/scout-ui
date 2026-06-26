/** @typedef {{ view: string, playerId?: string | null }} AppRoute */

const VIEW_ALIASES = {
  watchlist: "watchlist",
  addplayer: "addplayer",
  player: "player",
  report: "report",
};

/**
 * Parse the pathname into an in-app route.
 * @param {string} pathname
 * @returns {AppRoute}
 */
export function parsePath(pathname) {
  const parts = pathname.split("/").filter(Boolean);

  if (parts.length === 0 || parts[0] === "auth") {
    return { view: "watchlist" };
  }

  if (parts[0] !== "players") {
    return { view: "watchlist" };
  }

  if (parts.length === 1) {
    return { view: "watchlist" };
  }

  if (parts[1] === "new") {
    return { view: "addplayer" };
  }

  const playerId = parts[1];
  if (parts.length === 2) {
    return { view: "player", playerId };
  }

  if (parts.length === 3 && parts[2] === "dossier") {
    return { view: "report", playerId };
  }

  return { view: "watchlist" };
}

/**
 * @param {AppRoute} route
 * @returns {string}
 */
export function buildPath(route) {
  const view = VIEW_ALIASES[route.view] ? route.view : "watchlist";

  switch (view) {
    case "addplayer":
      return "/players/new";
    case "player":
      return route.playerId ? `/players/${route.playerId}` : "/players";
    case "report":
      return route.playerId ? `/players/${route.playerId}/dossier` : "/players";
    default:
      return "/players";
  }
}

export function isPostAuthLandingPath(pathname) {
  return pathname === "/"
    || pathname === "/auth/callback"
    || pathname.startsWith("/auth/");
}
