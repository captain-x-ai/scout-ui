import { useState } from "react";
import { Search, FileText, LayoutGrid, Plus, ArrowRight } from "lucide-react";
import { STAGES } from "../lib/constants";
import { computeEval, fitScore } from "../lib/eval";
import { Avatar } from "./ui/Avatar";
import { StatusPill } from "./ui/StatusPill";
import { StageSelect } from "./ui/StageSelect";
import { Header } from "./ui/Header";

export function MyPlayers({ t, ar, players, need, updatePlayer, onAdd, onOpen }) {
  const [q, setQ] = useState("");
  const [fpos, setFpos] = useState("all");
  const [fstage, setFstage] = useState("all");
  const [sort, setSort] = useState("eval");
  const [mode, setMode] = useState("list");
  const positions = [...new Set(players.map((p) => p.pos))];

  const enrich = (p) => ({ ...p, ev: computeEval(p.reviews, 5, false), fit: fitScore(p, need) });
  let rows = players.map(enrich).filter((p) => {
    const name = (ar ? p.nameAr : p.name).toLowerCase();
    return (name.includes(q.toLowerCase()) || p.name.toLowerCase().includes(q.toLowerCase()))
      && (fpos === "all" || p.pos === fpos) && (fstage === "all" || p.stage === fstage);
  });
  const sorters = {
    eval: (a, b) => (b.ev?.score || 0) - (a.ev?.score || 0),
    fit: (a, b) => b.fit - a.fit,
    recent: (a, b) => a.daysAgo - b.daysAgo,
    value: (a, b) => a.valueNum - b.valueNum,
    name: (a, b) => (ar ? a.nameAr : a.name).localeCompare(ar ? b.nameAr : b.name),
  };
  rows = [...rows].sort(sorters[sort]);

  const revLabel = (d) => d === 0 ? t.todayRev : t.lastRev.replace("{d}", d);

  return (
    <div className="fade">
      <Header title={t.watchlist} sub={t.showingAll.replace("{n}", rows.length).replace("{tot}", players.length)} />

      {/* toolbar */}
      <div className="no-print" style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 10, background: "var(--panel)", border: "1px solid var(--line2)", flex: "1 1 200px", maxWidth: 280 }}>
          <Search size={15} color="var(--muted)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search}
            style={{ background: "none", border: "none", outline: "none", color: "var(--cream)", fontSize: 13.5, width: "100%" }} />
        </div>
        <select className="sel" value={fpos} onChange={(e) => setFpos(e.target.value)}>
          <option value="all">{t.allPos}</option>{positions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="sel" value={fstage} onChange={(e) => setFstage(e.target.value)}>
          <option value="all">{t.allStatus}</option>{STAGES.map((s) => <option key={s} value={s}>{t["st_" + s]}</option>)}
        </select>
        <select className="sel" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="eval">{t.sortBy}: {t.sortEval}</option>
          <option value="fit">{t.sortBy}: {t.sortFit}</option>
          <option value="recent">{t.sortBy}: {t.sortRecent}</option>
          <option value="value">{t.sortBy}: {t.sortValue}</option>
          <option value="name">{t.sortBy}: {t.sortName}</option>
        </select>
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--line2)", borderRadius: 10, overflow: "hidden", marginInlineStart: "auto" }}>
          <button className={`btn btn-ghost ${mode === "list" ? "on" : ""}`} style={{ borderRadius: 0, border: "none" }} onClick={() => setMode("list")}><FileText size={14} />{t.listView}</button>
          <button className={`btn btn-ghost ${mode === "pipeline" ? "on" : ""}`} style={{ borderRadius: 0, border: "none" }} onClick={() => setMode("pipeline")}><LayoutGrid size={14} />{t.pipelineView}</button>
        </div>
        <button className="btn btn-gold" onClick={onAdd}><Plus size={15} />{t.addPlayer}</button>
      </div>

      {rows.length === 0 && <div className="panel" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>{t.noMatch}</div>}

      {/* LIST */}
      {mode === "list" && rows.length > 0 && (
        <div className="panel stagger" style={{ overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.1fr 1.1fr .6fr .9fr 1.3fr .7fr", padding: "13px 20px", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted2)", borderBottom: "1px solid var(--line2)" }}>
            <div>{ar ? "اللاعب" : "Player"}</div><div>{t.stage}</div><div>{t.pos}</div><div>{t.val}</div><div>{t.eval}</div><div></div>
          </div>
          {rows.map((p) => (
            <div key={p.id} className="hover-row" style={{ display: "grid", gridTemplateColumns: "2.1fr 1.1fr .6fr .9fr 1.3fr .7fr", padding: "14px 20px", alignItems: "center", borderBottom: "1px solid var(--line2)", cursor: "pointer" }} onClick={() => onOpen(p.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar p={p} size={40} radius={11} font={18} />
                <div><div style={{ fontWeight: 600, fontSize: 14.5 }}>{ar ? p.nameAr : p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted2)" }}>{p.club} · {p.daysAgo === 0 ? t.todayRev : revLabel(p.daysAgo)}</div></div>
              </div>
              <div><StatusPill stage={p.stage} t={t} /></div>
              <div className="mono" style={{ color: "var(--gold)", fontSize: 13 }}>{p.pos}</div>
              <div className="mono" style={{ fontSize: 13 }}>{p.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="mono serif" style={{ fontSize: 20, fontWeight: 600, color: "var(--cream)" }}>{p.ev ? p.ev.score.toFixed(1) : "—"}</span>
                <div style={{ width: 64, height: 6, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${p.ev ? p.ev.score * 10 : 0}%`, height: "100%", background: "var(--primary)" }} /></div>
              </div>
              <ArrowRight size={17} color="var(--muted)" style={{ justifySelf: "end", transform: ar ? "scaleX(-1)" : "none" }} />
            </div>))}
        </div>
      )}

      {/* PIPELINE */}
      {mode === "pipeline" && rows.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="stagger">
          {STAGES.map((s) => {
            const col = rows.filter((p) => p.stage === s);
            return (
              <div key={s} className="kanban-col">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, padding: "2px 4px" }}>
                  <StatusPill stage={s} t={t} />
                  <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{col.length}</span>
                </div>
                {col.map((p) => (
                  <div key={p.id} className="kcard" onClick={() => onOpen(p.id)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                      <Avatar p={p} size={32} radius={9} font={15} />
                      <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ar ? p.nameAr : p.name}</div>
                        <div style={{ fontSize: 10.5, color: "var(--muted2)" }}>{p.pos} · {p.value}</div></div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <span className="mono serif" style={{ fontSize: 17, fontWeight: 600 }}>{p.ev ? p.ev.score.toFixed(1) : "—"}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--green-bright)" }}>{p.fit}% {t.fit}</span>
                    </div>
                    <StageSelect mini stage={p.stage} t={t} onChange={(v) => updatePlayer(p.id, { stage: v })} />
                  </div>
                ))}
              </div>);
          })}
        </div>
      )}
    </div>
  );
}
