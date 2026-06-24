import { useState } from "react";
import { X, Upload, Trash2, Plus, Crosshair, Check } from "lucide-react";
import { ACTIONS } from "../lib/constants";

const blankRow = () => ({ tag: ACTIONS[0], opp: "", minute: "", date: "", ident: "" });

export function UploadModal({ t, ar, player, onClose, onAdd }) {
  const [rows, setRows] = useState([blankRow()]);
  const set = (i, k, v) => setRows((rs) => rs.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const add = () => setRows((rs) => [...rs, blankRow()]);
  const del = (i) => setRows((rs) => rs.length > 1 ? rs.filter((_, j) => j !== i) : rs);
  const onFiles = (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    setRows((rs) => {
      const base = rs.filter((r) => r.opp || r.minute || r.date || r.ident);
      const added = files.map(() => ({ ...blankRow(), tag: ACTIONS[Math.floor(Math.random() * ACTIONS.length)] }));
      return [...base, ...added];
    });
  };
  return (
    <div className="overlay no-print" onClick={onClose}>
      <div className="panel modal scrolly" style={{ padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>{t.uploadTitle.replace("{name}", ar ? player.nameAr : player.name)}</div>
          <X size={20} color="var(--muted)" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18, lineHeight: 1.5 }}>{t.uploadHint}</div>

        {/* dropzone */}
        <label style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "22px", border: "1.5px dashed var(--line)", borderRadius: 14, cursor: "pointer", marginBottom: 18, background: "rgba(140,107,255,.04)" }}>
          <Upload size={22} color="var(--gold)" />
          <span style={{ fontSize: 13, color: "var(--cream)", fontWeight: 600 }}>{t.chooseFiles}</span>
          <span style={{ fontSize: 11, color: "var(--muted2)" }}>{t.orAddManually}</span>
          <input type="file" accept="video/*" multiple onChange={onFiles} style={{ display: "none" }} />
        </label>

        {/* rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ border: "1px solid var(--line2)", borderRadius: 12, padding: 12, background: "var(--panel2)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                <span className="mono" style={{ fontSize: 11, color: "var(--muted2)" }}>{t.clipN.replace("{n}", i + 1)}</span>
                <button className="btn btn-ghost" style={{ padding: "5px 8px" }} onClick={() => del(i)}><Trash2 size={14} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr .55fr 1fr", gap: 8, marginBottom: 8 }}>
                <select className="sel" value={r.tag} onChange={(e) => set(i, "tag", e.target.value)}>{ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}</select>
                <input className="fld" placeholder={t.clipOpp} value={r.opp} onChange={(e) => set(i, "opp", e.target.value)} style={{ padding: "9px 11px", fontSize: 13 }} />
                <input className="fld" placeholder={t.clipMin} type="number" value={r.minute} onChange={(e) => set(i, "minute", e.target.value)} style={{ padding: "9px 11px", fontSize: 13 }} />
                <input className="fld" type="date" value={r.date} onChange={(e) => set(i, "date", e.target.value)} style={{ padding: "9px 11px", fontSize: 13 }} title={t.clipDate} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Crosshair size={15} color="var(--gold)" style={{ flexShrink: 0 }} />
                <input className="fld" placeholder={t.clipIdent} value={r.ident} onChange={(e) => set(i, "ident", e.target.value)} style={{ padding: "9px 11px", fontSize: 13 }} />
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={add} style={{ marginBottom: 18 }}><Plus size={14} />{t.addRow}</button>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid var(--line2)", paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-gold" onClick={() => onAdd(rows)}><Check size={15} />{t.addToTimeline.replace("{n}", rows.length)}</button>
        </div>
      </div>
    </div>
  );
}
