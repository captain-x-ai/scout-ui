import { useCallback, useEffect, useRef, useState } from "react";
import { buildPath, isPostAuthLandingPath, parsePath } from "../lib/routes";

export function useAppNavigation({ isAuthenticated, authLoading }) {
  const [view, setView] = useState("login");
  const [sel, setSel] = useState(null);
  const syncedRef = useRef(false);

  const applyRoute = useCallback((route) => {
    setView(route.view);
    setSel(route.playerId ?? null);
  }, []);

  const navigate = useCallback((route, { replace = false } = {}) => {
    const path = buildPath(route);
    const state = { ...route };
    if (replace) {
      window.history.replaceState(state, "", path);
    } else {
      window.history.pushState(state, "", path);
    }
    applyRoute(route);
  }, [applyRoute]);

  useEffect(() => {
    const onPopState = () => {
      applyRoute(parsePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [applyRoute]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      syncedRef.current = false;
      setView("login");
      setSel(null);
      if (window.location.pathname !== "/") {
        window.history.replaceState(null, "", "/");
      }
      return;
    }

    if (syncedRef.current) return;
    syncedRef.current = true;

    const pathname = window.location.pathname;
    if (isPostAuthLandingPath(pathname)) {
      navigate({ view: "watchlist" }, { replace: true });
      return;
    }

    applyRoute(parsePath(pathname));
  }, [authLoading, isAuthenticated, navigate, applyRoute]);

  const resetToLogin = useCallback(() => {
    syncedRef.current = false;
    setView("login");
    setSel(null);
    window.history.replaceState(null, "", "/");
  }, []);

  return { view, sel, setSel, navigate, resetToLogin };
}
