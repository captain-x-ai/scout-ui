import { Users, Globe, LogOut } from "lucide-react";
import { LOGO_EN } from "../assets/logos";
import { Mascot } from "./ui/Mascot";

export function Shell({ t, ar, lang, setLang, view, setView, selName, children }) {
  const nav = [
    { k: "watchlist", icon: Users, label: t.watchlist },
  ];
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside className="no-print" style={{ width: 232, borderInlineEnd: "1px solid var(--line2)", padding: 18, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "2px 4px 20px" }}>
          <img src={LOGO_EN} alt="CaptainX" style={{ width: "100%", height: "auto", display: "block" }} />
          <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, letterSpacing: .8, marginTop: 8, paddingInlineStart: 2 }}>{t.product}</div>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((n) => (
            <div key={n.k} className={`nav-item ${view === n.k || (view === "player" && n.k === "watchlist") ? "active" : ""}`} onClick={() => setView(n.k)}>
              <n.icon size={18} />
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, minWidth: 0 }}>
                <span>{n.label}</span>
                {n.sub && <span style={{ fontSize: 10.5, color: "var(--muted2)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.sub}</span>}
              </div>
            </div>))}
        </nav>
        <div style={{ marginTop: "auto" }}>
          {/* subtle mascot moment */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 10px", marginBottom: 10, borderRadius: 11, background: "rgba(104,63,234,.10)", border: "1px solid var(--line)" }}>
            <Mascot size={26} />
            <span style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.35 }}>{t.mascotHint}</span>
          </div>
          {/* <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }}
            onClick={() => setLang(lang === "en" ? "ar" : "en")}><Globe size={15} />{lang === "en" ? "العربية" : "English"}</button> */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 11, background: "rgba(255,255,255,.03)" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--green-deep)", display: "grid", placeItems: "center", color: "var(--accent-bright)", fontWeight: 700 }}>{ar ? "ط" : "T"}</div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{t.scoutName}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.role}</div></div>
            <LogOut size={16} color="var(--muted2)" style={{ cursor: "pointer" }} />
          </div>
        </div>
      </aside>
      <main className="scrolly" style={{ flex: 1, padding: "30px 36px", overflowX: "hidden" }}>{children}</main>
    </div>
  );
}
