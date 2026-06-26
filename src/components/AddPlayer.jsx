import { useState } from "react";
import { UserPlus, Check } from "lucide-react";
import { POSITIONS, FLAGS, STAGES } from "../lib/constants";
import { Header } from "./ui/Header";

export function AddPlayer({ t, ar, onSave, onCancel }) {
  const [f, setF] = useState({ name: "", nameAr: "", club: "", pos: "LB", age: 18, valueNum: 1.0, flag: "🇸🇦", stage: "watching", photo: null });
  const [err, setErr] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const onPhoto = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const rd = new FileReader(); rd.onload = () => set("photo", rd.result); rd.readAsDataURL(file);
  };
  const submit = () => {
    if (!f.name.trim()) { setErr(true); return; }
    onSave({
      name: f.name.trim(), nameAr: f.nameAr.trim() || f.name.trim(), club: f.club.trim() || "—",
      pos: f.pos, age: Number(f.age) || 18, flag: f.flag, stage: f.stage, photo: f.photo,
      valueNum: Number(f.valueNum) || 0, value: `€${Number(f.valueNum) || 0}m`
    });
  };
  return (
    <div className="fade" style={{ maxWidth: 620 }}>
      <Header title={t.addPlayer} sub={t.onboard} />
      <div className="panel" style={{ padding: 26 }}>
        {/* photo */}
        {/* <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
          {f.photo
            ? <img src={f.photo} alt="" style={{ width: 76, height: 76, borderRadius: 18, objectFit: "cover" }} />
            : <div style={{ width: 76, height: 76, borderRadius: 18, background: "var(--green-deep)", display: "grid", placeItems: "center", fontSize: 36 }}>{f.flag}</div>}
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            <UserPlus size={15} />{t.fldPhoto}
            <input type="file" accept="image/*" onChange={onPhoto} style={{ display: "none" }} />
          </label>
        </div> */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="fld-label">{t.fldName}</label>
            <input className="fld" value={f.name} onChange={(e) => { set("name", e.target.value); setErr(false); }}
              style={err ? { borderColor: "var(--signal)" } : undefined} placeholder="—" />
            {err && <div style={{ color: "var(--signal)", fontSize: 11.5, marginTop: 6 }}>{t.reqName}</div>}
          </div>
          {/* <div><label className="fld-label">{t.fldNameAr}</label><input className="fld" value={f.nameAr} onChange={(e) => set("nameAr", e.target.value)} dir="rtl" /></div> */}
          <div><label className="fld-label">{t.fldClub}</label><input className="fld" value={f.club} onChange={(e) => set("club", e.target.value)} /></div>
          <div><label className="fld-label">{t.fldPos}</label>
            <select className="sel" style={{ width: "100%" }} value={f.pos} onChange={(e) => set("pos", e.target.value)}>{POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
          <div><label className="fld-label">{t.fldAge}</label><input className="fld" type="number" value={f.age} onChange={(e) => set("age", e.target.value)} /></div>
          <div><label className="fld-label">{t.fldValue}</label><input className="fld" type="number" step="0.1" value={f.valueNum} onChange={(e) => set("valueNum", e.target.value)} /></div>
          <div><label className="fld-label">{t.fldStage}</label>
            <select className="sel" style={{ width: "100%" }} value={f.stage} onChange={(e) => set("stage", e.target.value)}>{STAGES.map((s) => <option key={s} value={s}>{t["st_" + s]}</option>)}</select></div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="fld-label">{t.fldNat}</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FLAGS.map((fl) => <button key={fl} className={`flagpick ${f.flag === fl ? "on" : ""}`} onClick={() => set("flag", fl)}>{fl}</button>)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 26, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" onClick={onCancel}>{t.cancel}</button>
          <button className="btn btn-gold" onClick={submit}><Check size={15} />{t.savePlayer}</button>
        </div>
      </div>
    </div>
  );
}
