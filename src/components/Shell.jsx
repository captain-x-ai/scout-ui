import { Users, LogOut, Building2, Check } from "lucide-react";
import { LOGO_EN } from "../assets/logos";
import { Mascot } from "./ui/Mascot";
import { useAuth } from "../context/AuthContext";

export function Shell({ t, ar, view, navigate, onLogout, onClubChange, children }) {
  const { user, scoutClubs, switchClub, switchingClub } = useAuth();
  const activeClubId = user?.club_id;
  const displayName = user?.name || t.scoutName;
  const initial = (displayName.trim()[0] || "S").toUpperCase();

  const nav = [
    { k: "watchlist", icon: Users, label: t.watchlist },
  ];

  const onSelectClub = async (clubId) => {
    if (clubId === activeClubId || switchingClub) return;
    try {
      await switchClub(clubId);
      onClubChange?.();
    } catch {
      /* error surfaced via AuthContext */
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="no-print" style={{ width: 232, borderInlineEnd: "1px solid var(--line2)", padding: 18, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "2px 4px 20px" }}>
          <img src={LOGO_EN} alt="CaptainX" style={{ width: "100%", height: "auto", display: "block" }} />
          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, letterSpacing: .8, marginTop: 8, paddingInlineStart: 2 }}>{t.product}</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((n) => (
            <div key={n.k} className={`nav-item ${view === n.k || (view === "player" && n.k === "watchlist") || (view === "report" && n.k === "watchlist") ? "active" : ""}`} onClick={() => navigate({ view: "watchlist" })}>
              <n.icon size={18} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
                <span>{n.label}</span>
              </div>
            </div>
          ))}
        </nav>
        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 10px", marginBottom: 10, borderRadius: 11, background: "rgba(104,63,234,.10)", border: "1px solid var(--line)" }}>
            <Mascot size={26} />
            <span style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.35 }}>{t.mascotHint}</span>
          </div>

          {scoutClubs.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "var(--muted2)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, paddingInlineStart: 4 }}>
                {t.myClubs || "My clubs"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {scoutClubs.map((club) => {
                  const active = club.club_id === activeClubId;
                  return (
                    <button
                      key={club.club_id}
                      type="button"
                      className={`btn btn-ghost ${active ? "on" : ""}`}
                      disabled={switchingClub}
                      onClick={() => onSelectClub(club.club_id)}
                      style={{
                        width: "100%",
                        justifyContent: "flex-start",
                        padding: "8px 10px",
                        fontSize: 12.5,
                        borderColor: active ? "var(--gold)" : "var(--line2)",
                        opacity: switchingClub && !active ? 0.6 : 1,
                      }}
                    >
                      <Building2 size={14} style={{ flexShrink: 0, color: active ? "var(--gold)" : "var(--muted)" }} />
                      <span style={{ flex: 1, textAlign: "start", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {club.club_name}
                      </span>
                      {active && <Check size={14} color="var(--gold)" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--green-deep)", display: "grid", placeItems: "center", color: "var(--accent-bright)", fontWeight: 700, fontSize: 14 }}>
              {initial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.role || t.role}
              </div>
            </div>
            <LogOut size={16} color="var(--muted2)" style={{ cursor: "pointer", flexShrink: 0 }} onClick={onLogout} />
          </div>
        </div>
      </aside>
      <main className="scrolly" style={{ flex: 1, padding: "30px 36px", overflowX: "hidden" }}>{children}</main>
    </div>
  );
}
