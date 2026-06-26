import { ArrowRight, Printer, ShieldCheck } from "lucide-react";
import { LOGO_EN } from "../assets/logos";
import { computeEval, matchTime, recForScore } from "../lib/eval";
import { getSummary } from "../api/summaries.api";
import { ArcGauge } from "./ui/ArcGauge";
import { RecTag } from "./ui/RecTag";
import { ProvBar } from "./ui/ProvBar";
import { Bar } from "./ui/Bar";

export function Report({ t, ar, player, players, dossier, dossierLoading, setSel, onBack }) {
  const dp = dossier?.player;
  const displayName = dp ? (ar ? dp.nameAr : dp.name) : (ar ? player.nameAr : player.name);
  const displayClub = dp?.club ?? player.club;
  const displayPos = dp?.pos ?? player.pos;
  const displayAge = dp?.age ?? player.age;
  const displayValue = dp?.value ?? player.value;
  const attrs = dp?.attrs ?? player.attrs ?? {};

  const ev = dossier?.evaluation
    ? {
      score: dossier.evaluation.score,
      humanCount: dossier.evaluation.human_count,
      aiCount: dossier.evaluation.ai_count,
    }
    : computeEval(player.reviews || [], 5, false);

  const key = dossier?.keyClips?.length
    ? dossier.keyClips
    : (player.reviews || []).filter((r) => r.type === "human").sort((a, b) => matchTime(b) - matchTime(a)).slice(0, 3);

  const rec = ev ? recForScore(ev.score) : "monitor";
  const s = getSummary(player);
  const summary = s ? (ar ? s.ar : s.en) : null;
  const asOf = dossier?.generatedAt
    ? new Date(dossier.generatedAt).toLocaleDateString(ar ? "ar-SA" : "en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "04 Jun 2026";

  if (dossierLoading) {
    return (
      <div className="fade" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        Loading dossier…
      </div>
    );
  }

  return (
    <div className="fade">
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={onBack}><ArrowRight size={15} style={{ transform: ar ? "none" : "scaleX(-1)" }} />{t.backToPlayer}</button>
          <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.selectPlayer}</span>
          <select className="sel" value={player.id} onChange={(e) => setSel(e.target.value)}>
            {players.map((p) => <option key={p.id} value={p.id}>{ar ? p.nameAr : p.name} · {p.pos}</option>)}
          </select>
        </div>
        <button className="btn btn-gold" onClick={() => window.print()}><Printer size={15} />{t.print}</button>
      </div>
      <div className="panel" style={{ padding: 0, overflow: "hidden", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ padding: "26px 30px", background: "var(--primary)", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--accent)" }}>
          <div className="geo" style={{ opacity: .3 }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--accent-bright)", letterSpacing: 2, textTransform: "uppercase" }}>{t.dossierFor}</div>
              <div className="serif" style={{ fontSize: 32, fontWeight: 800, marginTop: 4 }}>{displayName}</div>
              <div style={{ color: "rgba(244,242,251,.7)", fontSize: 13, marginTop: 5 }}>{displayClub} · {displayPos} · {t.age} {displayAge} · {displayValue}</div>
            </div>
            <div style={{ textAlign: ar ? "left" : "right" }}>
              <img src={LOGO_EN} alt="CaptainX" style={{ height: 30, width: "auto", display: "inline-block", marginBottom: 6 }} />
              <div style={{ fontSize: 10.5, color: "var(--accent-bright)", fontWeight: 700 }}>{t.product}</div>
              <div style={{ fontSize: 10.5, color: "rgba(244,242,251,.65)", marginTop: 4 }}>{t.preparedBy} {t.scoutName}</div>
              <div style={{ fontSize: 10.5, color: "rgba(244,242,251,.65)" }}>{t.asOf} {asOf}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: 30 }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--line2)" }}>
            {ev && <ArcGauge score={ev.score} />}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{t.verdict}</div>
              <div style={{ marginBottom: 12 }}><RecTag rec={rec} t={t} /></div>
              {ev && <ProvBar humanLabel={`${ev.humanCount} ${t.scoutEdited}`} aiLabel={`${ev.aiCount} ${t.aiAccepted}`} human={ev.humanCount} ai={ev.aiCount} />}
            </div>
          </div>

          {summary && (
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{t.aiSummary}</div>
              <div style={{ fontSize: 13.5, color: "var(--cream)", lineHeight: 1.65 }}>{summary}</div>
            </div>
          )}

          <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{t.attrs}</div>
          <div style={{ marginBottom: 26 }}>
            {Object.entries(attrs).map(([k, v]) => <Bar key={k} label={t[k]} v={v} />)}
          </div>

          <div style={{ fontSize: 11, color: "var(--gold)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>{t.keyClips}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
            {key.map((r) => (
              <div key={r.id} style={{ padding: "12px 14px", background: "rgba(140,107,255,.06)", borderRadius: 10, borderInlineStart: "2px solid var(--green-bright)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--cream)" }}>{r.tag} · {t.vs} {r.opp} {r.minute}'</span>
                  <span className="mono serif" style={{ fontSize: 15, fontWeight: 600 }}>{r.score?.toFixed(1)}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>{r.human}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 11, padding: "14px 16px", background: "rgba(140,107,255,.08)", border: "1px solid var(--line)", borderRadius: 12 }}>
            <ShieldCheck size={20} color="var(--gold-bright)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 12.5, color: "var(--cream)", lineHeight: 1.55 }}>{t.knowledge}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
