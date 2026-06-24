import { useState, useMemo } from "react";
import { Upload, Crosshair, Eye, EyeOff, Clock, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { computeEval, overruleRate, fitScore, matchTime, recForScore } from "../lib/eval";
import { draftObservation, buildClipReviews } from "../api/reviews.api";
import { getSummary } from "../api/summaries.api";
import { Avatar } from "./ui/Avatar";
import { Mascot } from "./ui/Mascot";
import { StatusPill } from "./ui/StatusPill";
import { StageSelect } from "./ui/StageSelect";
import { RecTag } from "./ui/RecTag";
import { ArcGauge } from "./ui/ArcGauge";
import { Spark } from "./ui/Spark";
import { ProvBar } from "./ui/ProvBar";
import { Clip } from "./Clip";
import { UploadModal } from "./UploadModal";

export function Player({ t, ar, player, need, updateReview, updatePlayer, goReport }) {
  const [win, setWin] = useState(5);
  const [humanOnly, setHumanOnly] = useState(false);
  const [busy, setBusy] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const ev = useMemo(() => computeEval(player.reviews, win, humanOnly), [player.reviews, win, humanOnly]);
  const orate = overruleRate(player.reviews);
  const confLabel = ev ? (ev.confidence >= 70 ? t.confHigh : ev.confidence >= 45 ? t.confMed : t.confLow) : "—";
  const ordered = [...player.reviews].sort((a, b) => matchTime(b) - matchTime(a));
  const fit = fitScore(player, need);
  const summary = getSummary(player);

  async function regen(r) {
    setBusy(r.id);
    const txt = await draftObservation({ player, review: r });
    if (txt) updateReview(player.id, r.id, { ai: txt });
    setBusy(null);
  }

  function addClips(rows) {
    const newReviews = buildClipReviews(player, rows);
    updatePlayer(player.id, { reviews: [...player.reviews, ...newReviews], daysAgo: 0 });
    setShowUpload(false);
  }

  return (
    <div className="fade">
      {showUpload && <UploadModal t={t} ar={ar} player={player} onClose={() => setShowUpload(false)} onAdd={addClips} />}
      {/* breadcrumb + actions */}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.backWatch} <span style={{ color: "var(--gold)" }}>/ {ar ? player.nameAr : player.name}</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => setShowUpload(true)}><Upload size={15} />{t.uploadClips}</button>
        </div>
      </div>

      {/* hero */}
      <div className="panel" style={{ padding: 24, marginBottom: 18, display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div className="geo" style={{ opacity: .25 }} />
        <div style={{ position: "relative", zIndex: 1 }}><Avatar p={player} size={84} radius={20} font={40} /></div>
        <div style={{ flex: 1, minWidth: 200, position: "relative", zIndex: 1 }}>
          <div className="serif" style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.1 }}>{ar ? player.nameAr : player.name}</div>
          <div style={{ color: "var(--muted)", marginTop: 6, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
            <span>{player.club}</span>
            <span><b style={{ color: "var(--gold)" }}>{player.pos}</b></span>
            <span>{t.age} {player.age}</span>
            <span>{t.val} {player.value}</span>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap" }}>
            <StatusPill stage={player.stage} t={t} />
            <span className="tag" style={{ color: "var(--green-bright)", background: "rgba(140,107,255,.14)" }}><Crosshair size={12} />{t.fit} {fit}%</span>
            {ev && <RecTag rec={recForScore(ev.score)} t={t} />}
            <div className="no-print" style={{ marginInlineStart: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{t.stage}</span>
              <StageSelect mini stage={player.stage} t={t} onChange={(v) => updatePlayer(player.id, { stage: v })} />
            </div>
          </div>
        </div>
      </div>

      {/* AI SUMMARY — static raw text for now; will be replaced by a generated call later */}
      {summary && (
        <div className="panel" style={{ padding: 22, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
            <Mascot size={20} />
            <div style={{ fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold)" }}>{t.aiSummary}</div>
          </div>
          <div style={{ fontSize: 14, color: "var(--cream)", lineHeight: 1.7 }}>{ar ? summary.ar : summary.en}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted2)", marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={13} color="var(--gold)" style={{ flexShrink: 0 }} />{t.summaryNote}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 18, marginBottom: 18 }} className="grid-collapse">
        {/* EVAL CARD */}
        <div className="panel" style={{ padding: 22 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold)" }}>{t.evalTitle}</div>
            <button className={`btn btn-ghost ${humanOnly ? "on" : ""}`} style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => setHumanOnly((v) => !v)}>
              {humanOnly ? <Eye size={13} /> : <EyeOff size={13} />}{t.humanOnly}</button>
          </div>
          {ev ? <>
            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <ArcGauge score={ev.score} />
              <div style={{ flex: 1, minWidth: 150 }}>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>
                  {t.fromReviews.replace("{n}", ev.n)}</div>
                <ProvBar humanLabel={`${ev.humanCount} ${t.scoutEdited}`} aiLabel={`${ev.aiCount} ${t.aiAccepted}`} human={ev.humanCount} ai={ev.aiCount} />
                <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.conf}</span>
                  <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${ev.confidence}%`, height: "100%", background: ev.confidence >= 70 ? "var(--good)" : ev.confidence >= 45 ? "var(--gold)" : "var(--signal)", transition: ".5s" }} /></div>
                  <span className="mono" style={{ fontSize: 12, color: "var(--cream)" }}>{confLabel}</span>
                </div>
              </div>
            </div>
            {/* window control */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line2)" }}>
              <Clock size={14} color="var(--muted)" /><span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.window}:</span>
              {[3, 5, 8].map((n) => (
                <button key={n} className={`btn btn-ghost ${win === n ? "on" : ""}`} style={{ padding: "5px 12px", fontSize: 12.5 }} onClick={() => setWin(n)}>{n}</button>))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--muted2)", lineHeight: 1.5, display: "flex", gap: 7 }}>
              <ShieldCheck size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />{t.howCalc}</div>
          </> : <div style={{ color: "var(--muted)", padding: 20, textAlign: "center" }}>—</div>}
        </div>

        {/* TREND + DISAGREEMENT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 12.5, letterSpacing: 1, textTransform: "uppercase", color: "var(--gold)", marginBottom: 4 }}>{t.formTrend}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <TrendingUp size={15} color="var(--green-bright)" /></div>
            {ev && <Spark data={ev.trend} />}
          </div>
          <div className="panel" style={{ padding: 20, borderColor: "var(--signal)", background: "var(--signal-bg)" }}>
            <div style={{ display: "flex", gap: 11 }}>
              <Zap size={20} color="var(--signal)" style={{ flexShrink: 0 }} />
              <div>
                <div className="mono serif" style={{ fontSize: 26, fontWeight: 600, color: "var(--signal)", lineHeight: 1 }}>{orate}%</div>
                <div style={{ fontSize: 12.5, color: "var(--cream)", marginTop: 6, lineHeight: 1.5 }}>{t.overruleRate.replace("{p}", orate)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold)" }}>{t.timeline}</div>
        <button className="btn btn-ghost no-print" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => setShowUpload(true)}><Upload size={14} />{t.uploadClips}</button>
      </div>
      {ordered.length === 0 ? (
        <div className="panel" style={{ padding: 44, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 18, display: "grid", placeItems: "center", background: "rgba(104,63,234,.12)", border: "1px solid var(--line)" }}>
            <Mascot size={36} /></div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 800 }}>{t.noClipsYet}</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, marginBottom: 18, maxWidth: 360, marginInline: "auto", lineHeight: 1.5 }}>{t.noClipsSub}</div>
          <button className="btn btn-gold no-print" style={{ margin: "0 auto" }} onClick={() => setShowUpload(true)}><Upload size={15} />{t.uploadClips}</button>
        </div>
      ) : (
        <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ordered.map((r) => <Clip key={r.id} t={t} ar={ar} r={r} busy={busy === r.id}
            onRegen={() => regen(r)}
            onAccept={() => updateReview(player.id, r.id, { type: "ai", score: r.score ?? 6.5, rec: r.rec ?? "monitor", conf: r.conf ?? "low" })}
            onConfirm={(patch) => updateReview(player.id, r.id, patch)} />)}
        </div>
      )}
    </div>
  );
}
