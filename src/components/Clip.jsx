import { useState } from "react";
import { Check, Sparkles, Pencil, Clock, Crosshair, Zap } from "lucide-react";
import { recColor } from "../lib/constants";
import { Mascot } from "./ui/Mascot";
import { RecTag } from "./ui/RecTag";

export function Clip({ t, ar, r, onAccept, onConfirm, onRegen, busy }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(r.human || r.ai);
  const [score, setScore] = useState(r.score != null ? r.score : 6.5);
  const [rec, setRec] = useState(r.rec || "monitor");
  const pending = r.type === "pending";
  const overruled = r.type === "human" && r.editDelta >= 2;

  return (
    <div className={`panel ${pending ? "" : ""}`} style={{ padding: 18, opacity: pending ? .92 : 1, borderColor: overruled ? "rgba(242,128,46,.4)" : "var(--line2)" }}>
      <div style={{ display: "flex", gap: 14 }}>
        {/* thumb */}
        <div style={{ width: 92, flexShrink: 0 }}>
          <div style={{ aspectRatio: "16/10", borderRadius: 10, background: "var(--panel2)", border: "1px solid var(--line2)", display: "grid", placeItems: "center", position: "relative" }}>
            <div style={{ width: 26, height: 26, borderRadius: 999, background: "var(--accent)", display: "grid", placeItems: "center" }}>
              <svg width="10" height="11" viewBox="0 0 10 11"><path d="M0 0l10 5.5L0 11z" fill="#15093A" /></svg></div>
            <span className="mono" style={{ position: "absolute", bottom: 5, insetInlineEnd: 6, fontSize: 9.5, color: "var(--cream)", background: "rgba(0,0,0,.5)", padding: "1px 5px", borderRadius: 4 }}>{r.minute}'</span>
          </div>
          <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 6, textAlign: "center" }}>{t.vs} {r.opp}</div>
          {r.date && <div className="mono" style={{ fontSize: 9.5, color: "var(--muted2)", textAlign: "center", marginTop: 2 }}>{r.date}</div>}
        </div>
        {/* body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 9 }}>
            <span className="tag" style={{ color: "var(--cream)", background: "rgba(255,255,255,.06)" }}>{r.tag}</span>
            {pending && <span className="tag" style={{ color: "var(--muted)", background: "rgba(255,255,255,.05)" }}><Clock size={11} />{t.pending}</span>}
            {r.type === "ai" && <span className="tag" style={{ color: "var(--gold)", background: "rgba(140,107,255,.14)" }}><Sparkles size={11} />{t.aiAccepted}</span>}
            {r.type === "human" && <span className="tag" style={{ color: "var(--green-bright)", background: "rgba(140,107,255,.14)" }}><Pencil size={11} />{t.scoutEdited}</span>}
            {overruled && <span className="tag" style={{ color: "var(--signal)", background: "var(--signal-bg)" }}><Zap size={11} />{t.overruled}</span>}
            {!pending && <span style={{ marginInlineStart: "auto" }}><RecTag rec={r.rec} t={t} /></span>}
            {!pending && r.score != null && <span className="mono serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--cream)" }}>{r.score.toFixed(1)}</span>}
          </div>

          {/* identification descriptor — how the player was located in this clip */}
          {r.ident && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--gold)", background: "rgba(140,107,255,.1)", border: "1px solid var(--line)", borderRadius: 8, padding: "4px 9px", marginBottom: 9 }}>
              <Crosshair size={12} /><span style={{ color: "var(--muted)" }}>{t.identLabel}:</span> <span style={{ color: "var(--cream)" }}>{r.ident}</span>
            </div>
          )}

          {/* AI draft line */}
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: r.type === "human" || editing ? 8 : 0, lineHeight: 1.55 }}>
            <Mascot size={17} />
            <span><b style={{ color: "var(--accent)", fontWeight: 700 }}>{t.aiDraft}: </b>{r.ai}</span>
          </div>

          {/* human review line */}
          {r.type === "human" && !editing && (
            <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--cream)", lineHeight: 1.55, padding: "9px 12px", background: "rgba(140,107,255,.07)", borderRadius: 9, borderInlineStart: "2px solid var(--green-bright)" }}>
              <Pencil size={14} color="var(--green-bright)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span><b style={{ color: "var(--green-bright)", fontWeight: 600 }}>{t.humanReview}: </b>{r.human}</span>
            </div>
          )}

          {/* editor */}
          {editing && (
            <div className="pop" style={{ marginTop: 4 }}>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
                style={{ width: "100%", background: "rgba(0,0,0,.25)", border: "1px solid var(--gold)", borderRadius: 10, color: "var(--cream)", padding: "10px 12px", fontSize: 13.5, outline: "none", resize: "vertical", lineHeight: 1.5 }} />
              {/* score + status — the scout owns these, not just the AI text */}
              <div style={{ display: "flex", gap: 18, marginTop: 11, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.clipScore}</span>
                  <input type="number" min={0} max={10} step={0.1} value={score}
                    onChange={(e) => setScore(e.target.value)} className="mono"
                    style={{ width: 66, background: "rgba(0,0,0,.25)", border: "1px solid var(--line2)", borderRadius: 8, color: "var(--cream)", padding: "6px 9px", fontSize: 13.5, outline: "none", textAlign: "center" }} />
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--muted2)" }}>{t.wasLabel} {r.score != null ? r.score.toFixed(1) : t.unrated}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.clipStatus}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["sign", "monitor", "pass"].map((k) => (
                      <button key={k} onClick={() => setRec(k)} className="btn btn-ghost"
                        style={{ padding: "5px 11px", fontSize: 12, borderColor: rec === k ? recColor[k] : "var(--line2)", color: rec === k ? recColor[k] : "var(--muted)" }}>
                        {t[k]}</button>))}
                  </div>
                  <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>{t.wasLabel} {r.rec ? t[r.rec] : t.unrated}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap" }}>
                <button className="btn btn-green" onClick={() => {
                  const delta = text.trim() === (r.ai || "").trim() ? 0 : 2;
                  const sc = Math.round(Math.max(0, Math.min(10, parseFloat(score) || 0)) * 10) / 10;
                  onConfirm({ type: "human", human: text.trim(), editDelta: delta, score: sc, rec, conf: "high" });
                  setEditing(false);
                }}><Check size={15} />{t.save}</button>
                <button className="btn btn-ghost" onClick={onRegen} disabled={busy}>
                  <Sparkles size={14} className={busy ? "spin" : ""} />{busy ? t.regening : t.regen}</button>
                <button className="btn btn-ghost" onClick={() => { setEditing(false); setText(r.human || r.ai); setScore(r.score != null ? r.score : 6.5); setRec(r.rec || "monitor"); }}>{t.cancel}</button>
              </div>
            </div>
          )}

          {/* action row for pending */}
          {pending && !editing && (
            <div className="no-print" style={{ display: "flex", gap: 9, marginTop: 12 }}>
              <button className="btn btn-gold" onClick={() => { setText(r.ai); setScore(r.score != null ? r.score : 6.5); setRec(r.rec || "monitor"); setEditing(true); }}><Pencil size={14} />{t.editc}</button>
              <button className="btn btn-ghost" onClick={onAccept}><Check size={14} />{t.accept}</button>
            </div>
          )}
          {pending && <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 8, fontStyle: "italic" }}>{t.pendingNote}</div>}
        </div>
      </div>
    </div>
  );
}
