import { useState, useMemo, useEffect } from "react";
import { Upload, Crosshair, Eye, EyeOff, Clock, ShieldCheck, TrendingUp, Zap, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { computeEval, overruleRate, fitScore, recForScore } from "../lib/eval";
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

export function Player({ t, ar, player, need, updateReview, updatePlayer, uploadClips, regenObservation, loadPlayer, goReport }) {
  const [win, setWin] = useState(5);
  const [humanOnly, setHumanOnly] = useState(false);
  const [busy, setBusy] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadLocked, setUploadLocked] = useState(false);
  const [uploadCanClose, setUploadCanClose] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [clipsPage, setClipsPage] = useState(1);
  const [clipsLoading, setClipsLoading] = useState(false);

  useEffect(() => {
    setClipsPage(1);
  }, [player.id]);

  useEffect(() => {
    if (!player?.id || clipsPage === (player.clipsPagination?.page || 1)) return;
    let cancelled = false;
    setClipsLoading(true);
    loadPlayer(player.id, { clipsPage })
      .catch(() => {})
      .finally(() => { if (!cancelled) setClipsLoading(false); });
    return () => { cancelled = true; };
  }, [clipsPage, player.id, loadPlayer]);

  const pag = player.clipsPagination || { page: 1, pageSize: 10, total: 0, totalPages: 0 };
  const timeline = player.reviews || [];

  useEffect(() => {
    const analyzing = timeline.some((r) => r.type === "pending" && r.mediaReady && !r.reviewReady);
    if (!analyzing) return undefined;
    const id = setInterval(() => {
      loadPlayer(player.id, { clipsPage: pag.page }).catch(() => {});
    }, 5000);
    return () => clearInterval(id);
  }, [timeline, player.id, pag.page, loadPlayer]);

  const ev = useMemo(() => {
    if (player.evaluation) {
      return {
        score: player.evaluation.score,
        confidence: player.evaluation.confidence,
        humanCount: player.evaluation.human_count,
        aiCount: player.evaluation.ai_count,
        n: player.evaluation.n,
        trend: player.evaluation.trend || [],
      };
    }
    return computeEval(player.reviews || [], win, humanOnly);
  }, [player.evaluation, player.reviews, win, humanOnly]);

  const orate = player.overruleRate != null ? player.overruleRate : overruleRate(player.reviews || []);
  const confLabel = ev ? (ev.confidence >= 70 ? t.confHigh : ev.confidence >= 45 ? t.confMed : t.confLow) : "—";
  const fit = player.fitScore != null ? player.fitScore : fitScore(player, need);
  const summary = getSummary(player);

  async function regen(r) {
    setBusy(r.id);
    try {
      await regenObservation(r.id);
      await loadPlayer(player.id, { clipsPage: pag.page });
    } finally {
      setBusy(null);
    }
  }

  function closeUploadModal() {
    if (uploadLocked && !uploadCanClose) return;
    setShowUpload(false);
    setUploadLocked(false);
    setUploadCanClose(false);
  }

  async function addClips(rows) {
    setUploadLocked(true);
    setUploadBusy(true);
    setUploadCanClose(false);
    setUploadMsg(t.uploadHint);
    try {
      await uploadClips(player.id, rows, (cur, total, phase) => {
        setUploadMsg(`${phase}… ${cur}/${total}`);
      }, async () => {
        setUploadCanClose(true);
        setClipsPage(1);
        await loadPlayer(player.id, { clipsPage: 1 });
      });
      setShowUpload(false);
    } catch (e) {
      setUploadMsg(e.message || "Upload failed");
      setUploadLocked(false);
      setUploadCanClose(true);
    } finally {
      setUploadBusy(false);
      setUploadLocked(false);
      setUploadCanClose(false);
    }
  }

  async function onAccept(r) {
    await updateReview(player.id, r.id, {
      type: "ai", score: r.score ?? 6.5, rec: r.rec ?? "monitor", conf: r.conf ?? "low",
    });
  }

  async function onConfirm(r, patch) {
    await updateReview(player.id, r.id, patch);
  }

  return (
    <div className="fade">
      {showUpload && (
        <UploadModal t={t} ar={ar} player={player} locked={uploadLocked} closable={uploadCanClose || !uploadLocked}
          busy={uploadBusy} statusMsg={uploadMsg}
          onClose={closeUploadModal} onAdd={addClips} />
      )}
      <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.backWatch} <span style={{ color: "var(--gold)" }}>/ {ar ? player.nameAr : player.name}</span></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={goReport}><FileText size={15} />{t.dossierFor || "Dossier"}</button>
          <button className="btn btn-ghost" onClick={() => setShowUpload(true)}><Upload size={15} />{t.uploadClips}</button>
        </div>
      </div>

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
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line2)" }}>
              <Clock size={14} color="var(--muted)" /><span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.window}:</span>
              {[3, 5, 8].map((n) => (
                <button key={n} className={`btn btn-ghost ${win === n ? "on" : ""}`} style={{ padding: "5px 12px", fontSize: 12.5 }} onClick={() => setWin(n)}>{n}</button>))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--muted2)", lineHeight: 1.5, display: "flex", gap: 7 }}>
              <ShieldCheck size={14} color="var(--gold)" style={{ flexShrink: 0, marginTop: 1 }} />{t.howCalc}</div>
          </> : <div style={{ color: "var(--muted)", padding: 20, textAlign: "center" }}>—</div>}
        </div>

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

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12.5, letterSpacing: 1.2, textTransform: "uppercase", color: "var(--gold)" }}>{t.timeline}</div>
          {pag.total > 0 && (
            <div style={{ fontSize: 11.5, color: "var(--muted2)", marginTop: 4 }}>
              {t.clipsTotal.replace("{n}", pag.total)}
            </div>
          )}
        </div>
        <button className="btn btn-ghost no-print" style={{ padding: "7px 12px", fontSize: 12.5 }} onClick={() => setShowUpload(true)}><Upload size={14} />{t.uploadClips}</button>
      </div>
      {timeline.length === 0 && !clipsLoading ? (
        <div className="panel" style={{ padding: 44, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 18, display: "grid", placeItems: "center", background: "rgba(104,63,234,.12)", border: "1px solid var(--line)" }}>
            <Mascot size={36} /></div>
          <div className="serif" style={{ fontSize: 20, fontWeight: 800 }}>{t.noClipsYet}</div>
          <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, marginBottom: 18, maxWidth: 360, marginInline: "auto", lineHeight: 1.5 }}>{t.noClipsSub}</div>
          <button className="btn btn-gold no-print" style={{ margin: "0 auto" }} onClick={() => setShowUpload(true)}><Upload size={15} />{t.uploadClips}</button>
        </div>
      ) : (
        <>
          <div className="stagger" style={{ display: "flex", flexDirection: "column", gap: 12, opacity: clipsLoading ? 0.55 : 1, transition: "opacity .2s" }}>
            {timeline.map((r) => <Clip key={r.id} t={t} ar={ar} r={r} busy={busy === r.id}
              onRegen={() => regen(r)}
              onAccept={() => onAccept(r)}
              onConfirm={(patch) => onConfirm(r, patch)} />)}
          </div>
          {pag.totalPages > 1 && (
            <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--line2)" }}>
              <button className="btn btn-ghost" style={{ padding: "7px 12px" }}
                disabled={clipsLoading || pag.page <= 1}
                onClick={() => setClipsPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft size={16} />{t.prevPage}
              </button>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)" }}>
                {t.pageOf.replace("{page}", pag.page).replace("{total}", pag.totalPages)}
              </span>
              <button className="btn btn-ghost" style={{ padding: "7px 12px" }}
                disabled={clipsLoading || pag.page >= pag.totalPages}
                onClick={() => setClipsPage((p) => p + 1)}>
                {t.nextPage}<ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
