import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { POSITIONS, FLAGS, STAGES } from "../lib/constants";
import { listMyClubs } from "../api/clubs.api";
import { Header } from "./ui/Header";

export function AddPlayer({ t, ar, onSave, onCancel }) {
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [f, setF] = useState({
    name: "", nameAr: "", email: "", club: "", pos: "LB", age: 18,
    valueNum: 1.0, flag: "🇸🇦", stage: "watching", photo: null,
  });
  const [err, setErr] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await listMyClubs();
        if (cancelled) return;
        setClubs(items);
        if (items.length > 0) {
          setF((s) => ({ ...s, club: s.club || items[0].club_name }));
        }
      } catch {
        if (!cancelled) setClubs([]);
      } finally {
        if (!cancelled) setClubsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const submit = async () => {
    if (!f.name.trim() || !f.email.trim()) { setErr(true); return; }
    setSaving(true);
    try {
      await onSave({
        name: f.name.trim(), nameAr: f.nameAr.trim() || f.name.trim(), email: f.email.trim(),
        club: f.club.trim() || "—",
        pos: f.pos, age: Number(f.age) || 18, flag: f.flag, stage: f.stage, photo: f.photo,
        valueNum: Number(f.valueNum) || 0, value: `€${Number(f.valueNum) || 0}m`,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fade" style={{ maxWidth: 620 }}>
      <Header title={t.addPlayer} sub={t.onboard} />
      <div className="panel" style={{ padding: 26 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="fld-label">{t.fldName}</label>
            <input className="fld" value={f.name} onChange={(e) => { set("name", e.target.value); setErr(false); }}
              style={err && !f.name.trim() ? { borderColor: "var(--signal)" } : undefined} placeholder="—" />
            {err && !f.name.trim() && <div style={{ color: "var(--signal)", fontSize: 11.5, marginTop: 6 }}>{t.reqName}</div>}
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="fld-label">{t.fldEmail || "Email"}</label>
            <input className="fld" type="email" value={f.email} onChange={(e) => { set("email", e.target.value); setErr(false); }}
              style={err && !f.email.trim() ? { borderColor: "var(--signal)" } : undefined} placeholder="player@example.com" />
          </div>
          <div>
            <label className="fld-label">{t.fldClub}</label>
            {clubsLoading ? (
              <div className="fld" style={{ padding: "9px 11px", fontSize: 13, color: "var(--muted)" }}>…</div>
            ) : clubs.length > 0 ? (
              <select className="sel" style={{ width: "100%" }} value={f.club} onChange={(e) => set("club", e.target.value)}>
                {clubs.map((c) => (
                  <option key={c.club_id} value={c.club_name}>{c.club_name}</option>
                ))}
              </select>
            ) : (
              <input className="fld" value={f.club} onChange={(e) => set("club", e.target.value)} placeholder="—" />
            )}
          </div>
          <div>
            <label className="fld-label">{t.fldPos}</label>
            <select className="sel" style={{ width: "100%" }} value={f.pos} onChange={(e) => set("pos", e.target.value)}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><label className="fld-label">{t.fldAge}</label><input className="fld" type="number" value={f.age} onChange={(e) => set("age", e.target.value)} /></div>
          <div><label className="fld-label">{t.fldValue}</label><input className="fld" type="number" step="0.1" value={f.valueNum} onChange={(e) => set("valueNum", e.target.value)} /></div>
          <div><label className="fld-label">{t.fldStage}</label>
            <select className="sel" style={{ width: "100%" }} value={f.stage} onChange={(e) => set("stage", e.target.value)}>
              {STAGES.map((s) => <option key={s} value={s}>{t["st_" + s]}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="fld-label">{t.fldNat}</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FLAGS.map((fl) => <button key={fl} type="button" className={`flagpick ${f.flag === fl ? "on" : ""}`} onClick={() => set("flag", fl)}>{fl}</button>)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 26, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-gold" onClick={submit} disabled={saving}><Check size={15} />{saving ? "…" : t.savePlayer}</button>
        </div>
      </div>
    </div>
  );
}
