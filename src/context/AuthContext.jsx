import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { completeOAuthFromUrl, fetchMe, logout as apiLogout, setActiveClub, startGoogleLogin } from "../api/auth.api";
import { getAccessToken, setAccessToken } from "../api/client";

const SCOUT_ROLES = new Set(["scout", "coach", "club_admin"]);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchingClub, setSwitchingClub] = useState(false);
  const [error, setError] = useState(null);

  const loadMe = useCallback(async () => {
    const data = await fetchMe();
    setUser(data.user);
    setMemberships(data.memberships || []);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (window.location.pathname === "/auth/callback" || window.location.search.includes("access_token=")) {
          completeOAuthFromUrl();
        }
        if (!getAccessToken()) {
          setLoading(false);
          return;
        }
        await loadMe();
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load session");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadMe]);

  const login = useCallback(() => startGoogleLogin(), []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
    setMemberships([]);
  }, []);

  const scoutClubs = useMemo(
    () => (memberships || []).filter((m) => SCOUT_ROLES.has(m.role)),
    [memberships],
  );

  const switchClub = useCallback(async (clubId) => {
    if (!clubId || user?.club_id === clubId) return;
    setSwitchingClub(true);
    setError(null);
    try {
      const data = await setActiveClub(clubId);
      if (data.access_token) setAccessToken(data.access_token);
      await loadMe();
    } catch (e) {
      setError(e.message || "Failed to switch club");
      throw e;
    } finally {
      setSwitchingClub(false);
    }
  }, [user?.club_id, loadMe]);

  const value = useMemo(() => ({
    user,
    memberships,
    scoutClubs,
    loading,
    switchingClub,
    error,
    isAuthenticated: !!user && !!getAccessToken(),
    login,
    logout,
    reload: loadMe,
    switchClub,
  }), [user, memberships, scoutClubs, loading, switchingClub, error, login, logout, loadMe, switchClub]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
