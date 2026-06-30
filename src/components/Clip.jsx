import { useState } from "react";
import { Check, Sparkles, Pencil, Clock, Crosshair, Zap, Loader2, Trash2 } from "lucide-react";
import { useSession } from "../context/SessionContext";
import { getClipStatus } from "../api/clips.api";
import { recColor } from "../lib/constants";
import { Mascot } from "./ui/Mascot";
import { RecTag } from "./ui/RecTag";
import { ClipPreviewModal } from "./ClipPreviewModal";
import { ConfirmDialog } from "./ui/ConfirmDialog";

const PLAYBACK_READY = new Set(["ai_analyzing", "completed", "ready"]);

function clipProcessingLabel(t, status) {
  if (!status || status === "completed" || status === "ready") return null;
  if (status === "pending_upload") return t.awaitingUpload;
  if (status === "failed") return t.videoFailed;
  if (status === "ai_analyzing") return t.aiAnalyzing;
  return t.videoProcessing;
}

export function Clip({ t, ar, r, onAccept, onConfirm, onDelete }) {
  const session = useSession();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [preview, setPreview] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [cachedMedia, setCachedMedia] = useState(null);
  const [text, setText] = useState(r.human || r.ai);
  const [score, setScore] = useState(r.aiScore ?? r.score ?? 6.5);
  const [rec, setRec] = useState(r.aiRec ?? r.rec ?? "monitor");
  const pending = r.type === "pending";
  const reviewed = !pending;
  const overruled = r.type === "human";
  const mediaReady = !!r.mediaReady;
  const aiDraftReady = !!r.aiDraftReady;
  const reviewReady = !!r.reviewReady;
  const aiAnalyzing = pending && mediaReady && !aiDraftReady;
  const videoProcessing = pending && !mediaReady;
  const awaitingUpload = r.status === "pending_upload";
  const processingLabel = videoProcessing ? clipProcessingLabel(t, r.status) : null;
  const previewClip = cachedMedia ? { ...r, ...cachedMedia } : r;
  const showProcessingBlock = reviewReady || aiAnalyzing || videoProcessing;
  const observationText = r.type === "human" ? r.human : r.ai;

  async function openPreview() {
    if (!mediaReady || mediaLoading) return;
    if (cachedMedia?.videoUrl) {
      setPreview(true);
      return;
    }
    setMediaLoading(true);
    setMediaError(null);
    try {
      const data = await getClipStatus(session, r.id);
      if (!data.video_playback_url) {
        throw new Error("not ready");
      }
      setCachedMedia({
        videoUrl: data.video_playback_url,
        thumbnailUrl: data.thumbnail_url,
      });
      setPreview(true);
    } catch {
      setMediaError(t.videoLoadFailed);
    } finally {
      setMediaLoading(false);
    }
  }

  async function confirmDelete() {
    if (!onDelete || deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (e) {
      setDeleteError(e.message || t.deleteClipFailed);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <ConfirmDialog
        ar={ar}
        open={showDeleteConfirm}
        title={t.deleteClip}
        message={t.deleteClipConfirm}
        confirmLabel={t.deleteClip}
        cancelLabel={t.cancel}
        onConfirm={confirmDelete}
        onCancel={() => { if (!deleting) setShowDeleteConfirm(false); }}
        busy={deleting}
        danger
      />
      {preview && cachedMedia?.videoUrl && (
        <ClipPreviewModal t={t} ar={ar} clip={previewClip} onClose={() => setPreview(false)} />
      )}
      <div className={`panel ${pending ? "" : ""}`} style={{ padding: 18, opacity: pending ? .92 : 1, borderColor: overruled ? "rgba(242,128,46,.4)" : "var(--line2)" }}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 92, flexShrink: 0 }}>
            <div
              role={mediaReady ? "button" : undefined}
              tabIndex={mediaReady ? 0 : undefined}
              title={mediaReady ? t.playClip : processingLabel || undefined}
              onClick={openPreview}
              onKeyDown={(e) => { if (mediaReady && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openPreview(); } }}
              style={{
                aspectRatio: "16/10",
                borderRadius: 10,
                background: "var(--panel2)",
                border: `1px solid ${mediaReady ? "var(--gold)" : "var(--line2)"}`,
                position: "relative",
                overflow: "hidden",
                cursor: mediaReady && !mediaLoading ? "pointer" : "default",
                opacity: mediaLoading ? 0.75 : 1,
              }}
            >
              {cachedMedia?.thumbnailUrl && (
                <img
                  src={cachedMedia.thumbnailUrl}
                  alt=""
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              {mediaLoading ? (
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "rgba(0,0,0,.35)" }}>
                  <Loader2 size={22} color="var(--gold)" className="spin" />
                </div>
              ) : mediaReady ? (
                <div style={{
                  position: "absolute", inset: 0, display: "grid", placeItems: "center",
                  background: cachedMedia?.thumbnailUrl ? "rgba(0,0,0,.28)" : "transparent",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 999,
                    background: "var(--accent)", display: "grid", placeItems: "center",
                    boxShadow: "0 2px 12px rgba(0,0,0,.35)",
                  }}>
                    <svg width="11" height="12" viewBox="0 0 10 11"><path d="M0 0l10 5.5L0 11z" fill="#15093A" /></svg>
                  </div>
                </div>
              ) : (
                <div style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 6, padding: 8, textAlign: "center",
                }}>
                  <Clock size={16} color="var(--muted)" />
                  {processingLabel && (
                    <span style={{ fontSize: 9.5, color: "var(--muted2)", lineHeight: 1.3 }}>{processingLabel}</span>
                  )}
                </div>
              )}
            </div>
            {mediaError && (
              <div style={{ fontSize: 9.5, color: "var(--signal)", marginTop: 4, textAlign: "center", lineHeight: 1.3 }}>{mediaError}</div>
            )}
            {r.date && <div className="mono" style={{ fontSize: 9.5, color: "var(--muted2)", textAlign: "center", marginTop: 6 }}>{r.date}</div>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 9 }}>
              <span className="tag" style={{ color: "var(--cream)", background: "rgba(255,255,255,.06)" }}>{r.tag}</span>
              {pending && reviewReady && (
                <span className="tag" style={{ color: "var(--muted)", background: "rgba(255,255,255,.05)" }}><Clock size={11} />{t.pending}</span>
              )}
              {aiAnalyzing && (
                <span className="tag" style={{ color: "var(--gold)", background: "rgba(140,107,255,.12)" }}><Sparkles size={11} className="spin" />{t.aiAnalyzingTag}</span>
              )}
              {r.type === "ai" && <span className="tag" style={{ color: "var(--gold)", background: "rgba(140,107,255,.14)" }}><Sparkles size={11} />{t.aiAccepted}</span>}
              {r.type === "human" && <span className="tag" style={{ color: "var(--green-bright)", background: "rgba(140,107,255,.14)" }}><Pencil size={11} />{t.scoutEdited}</span>}
              {overruled && <span className="tag" style={{ color: "var(--signal)", background: "var(--signal-bg)" }}><Zap size={11} />{t.overruled}</span>}
              {!pending && <span style={{ marginInlineStart: "auto" }}><RecTag rec={r.rec} t={t} /></span>}
              {!pending && r.score != null && <span className="mono serif" style={{ fontSize: 18, fontWeight: 600, color: "var(--cream)" }}>{r.score.toFixed(1)}</span>}
            </div>

            {r.ident && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--gold)", background: "rgba(140,107,255,.1)", border: "1px solid var(--line)", borderRadius: 8, padding: "4px 9px", marginBottom: 9 }}>
                <Crosshair size={12} /><span style={{ color: "var(--muted)" }}>{t.identLabel}:</span> <span style={{ color: "var(--cream)" }}>{r.ident}</span>
              </div>
            )}

            {showProcessingBlock ? (
              <div style={{
                display: "flex", gap: 10, fontSize: 13, lineHeight: 1.55, marginBottom: r.type === "human" || editing ? 8 : 0,
                padding: aiAnalyzing || videoProcessing ? "10px 12px" : 0,
                borderRadius: aiAnalyzing || videoProcessing ? 9 : 0,
                background: aiAnalyzing ? "rgba(140,107,255,.08)" : videoProcessing ? "rgba(255,255,255,.03)" : "transparent",
                border: aiAnalyzing ? "1px solid var(--line)" : "none",
              }}>
                <div style={{ flexShrink: 0, marginTop: 1 }}><Mascot size={17} /></div>
                <div style={{ minWidth: 0 }}>
                  {reviewReady ? (
                    <span style={{ color: "var(--muted)" }}>
                      <b style={{ color: "var(--accent)", fontWeight: 700 }}>{t.aiDraft}: </b>{r.ai}
                    </span>
                  ) : aiAnalyzing ? (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 3 }}>{t.aiAnalyzing}</div>
                      <div style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.5 }}>{t.aiAnalyzingNote}</div>
                    </>
                  ) : (
                    <span style={{ color: "var(--muted2)", fontStyle: "italic" }}>{processingLabel || t.videoProcessing}</span>
                  )}
                </div>
              </div>
            ) : null}

            {reviewed && !editing && r.type === "ai" && observationText && (
              <div style={{ display: "flex", gap: 10, fontSize: 13, lineHeight: 1.55, color: "var(--muted)" }}>
                <div style={{ flexShrink: 0, marginTop: 1 }}><Mascot size={17} /></div>
                <span>{observationText}</span>
              </div>
            )}

            {r.type === "human" && !editing && observationText && (
              <div style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--cream)", lineHeight: 1.55, padding: "9px 12px", background: "rgba(140,107,255,.07)", borderRadius: 9, borderInlineStart: "2px solid var(--green-bright)" }}>
                <Pencil size={14} color="var(--green-bright)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span><b style={{ color: "var(--green-bright)", fontWeight: 600 }}>{t.humanReview}: </b>{observationText}</span>
              </div>
            )}

            {editing && (
              <div className="pop" style={{ marginTop: 4 }}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
                  style={{ width: "100%", background: "rgba(0,0,0,.25)", border: "1px solid var(--gold)", borderRadius: 10, color: "var(--cream)", padding: "10px 12px", fontSize: 13.5, outline: "none", resize: "vertical", lineHeight: 1.5 }} />
                <div style={{ display: "flex", gap: 18, marginTop: 11, flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.clipScore}</span>
                    <input type="number" min={0} max={10} step={0.1} value={score}
                      onChange={(e) => setScore(e.target.value)} className="mono"
                      style={{ width: 66, background: "rgba(0,0,0,.25)", border: "1px solid var(--line2)", borderRadius: 8, color: "var(--cream)", padding: "6px 9px", fontSize: 13.5, outline: "none", textAlign: "center" }} />
                    <span className="mono" style={{ fontSize: 11.5, color: "var(--muted2)" }}>{t.wasLabel} {r.aiScore != null ? r.aiScore.toFixed(1) : t.unrated}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{t.clipStatus}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["sign", "monitor", "pass"].map((k) => (
                        <button key={k} onClick={() => setRec(k)} className="btn btn-ghost"
                          style={{ padding: "5px 11px", fontSize: 12, borderColor: rec === k ? recColor[k] : "var(--line2)", color: rec === k ? recColor[k] : "var(--muted)" }}>
                          {t[k]}</button>))}
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>{t.wasLabel} {r.aiRec ? t[r.aiRec] : t.unrated}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap" }}>
                  <button className="btn btn-green" onClick={() => {
                    const sc = Math.round(Math.max(0, Math.min(10, parseFloat(score) || 0)) * 10) / 10;
                    onConfirm({ type: "human", human: text.trim(), score: sc, rec });
                    setEditing(false);
                  }}><Check size={15} />{t.save}</button>
                  <button className="btn btn-ghost" onClick={() => { setEditing(false); setText(r.human || r.ai); setScore(r.aiScore ?? r.score ?? 6.5); setRec(r.aiRec ?? r.rec ?? "monitor"); }}>{t.cancel}</button>
                </div>
              </div>
            )}

            {pending && !editing && reviewReady && (
              <div className="no-print" style={{ display: "flex", gap: 9, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button className="btn btn-gold" onClick={() => { setText(r.ai); setScore(r.aiScore ?? r.score ?? 6.5); setRec(r.aiRec ?? r.rec ?? "monitor"); setEditing(true); }}><Pencil size={14} />{t.editc}</button>
                <button className="btn btn-ghost" onClick={onAccept}><Check size={14} />{t.accept}</button>
              </div>
            )}
            {awaitingUpload && !editing && (
              <div className="no-print" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={deleting}
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ color: "var(--pass)", borderColor: "rgba(229,86,107,.35)" }}
                >
                  <Trash2 size={14} />
                  {deleting ? "…" : t.deleteClip}
                </button>
                {deleteError && (
                  <div style={{ fontSize: 12, color: "var(--signal)", marginTop: 8 }}>{deleteError}</div>
                )}
              </div>
            )}
            {pending && reviewReady && <div style={{ fontSize: 11, color: "var(--muted2)", marginTop: 8, fontStyle: "italic" }}>{t.pendingNote}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
