import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";

const SessionContext = createContext(null);

const SCOUT_ROLES = new Set(["scout", "coach", "club_admin"]);

function pickSession(memberships, user) {
  if (!memberships?.length) return null;

  let membership = memberships.find((m) => m.club_id === user?.club_id && SCOUT_ROLES.has(m.role));
  if (!membership) {
    membership = memberships.find((m) => SCOUT_ROLES.has(m.role));
  }
  if (!membership) return null;

  const sports = membership.sports || [];
  const football = sports.find((s) => s.sport_key === "football");
  const sport = football || sports[0];
  if (!sport) return null;

  return {
    clubId: membership.club_id,
    clubName: membership.club_name,
    sportId: sport.id,
    sportKey: sport.sport_key,
    sports,
    role: membership.role,
  };
}

export function SessionProvider({ children }) {
  const { user, memberships } = useAuth();

  const session = useMemo(() => pickSession(memberships, user), [memberships, user]);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
