import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function ClipPreviewModal({ t, clip, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, [clip.videoUrl]);

  return (
    <div className="overlay no-print" onClick={onClose}>
      <div
        className="panel modal"
        style={{ padding: 20, maxWidth: 880, width: "min(92vw, 880px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <div style={{ minWidth: 0 }}>
            <div className="serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.2 }}>{clip.tag}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>
              {t.vs} {clip.opp}{clip.date ? ` · ${clip.date}` : ""}{clip.minute ? ` · ${clip.minute}'` : ""}
            </div>
          </div>
          <button type="button" className="btn btn-ghost" style={{ padding: "6px 8px", flexShrink: 0 }} onClick={onClose} aria-label={t.close}>
            <X size={18} />
          </button>
        </div>

        <div style={{ borderRadius: 12, overflow: "hidden", background: "#000", border: "1px solid var(--line2)" }}>
          <video
            ref={videoRef}
            key={clip.videoUrl}
            src={clip.videoUrl}
            controls
            playsInline
            preload="metadata"
            style={{ display: "block", width: "100%", maxHeight: "min(70vh, 520px)", background: "#000" }}
          />
        </div>

        {clip.ident && (
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 12, lineHeight: 1.5 }}>
            <span style={{ color: "var(--gold)" }}>{t.identLabel}:</span> {clip.ident}
          </div>
        )}
      </div>
    </div>
  );
}
