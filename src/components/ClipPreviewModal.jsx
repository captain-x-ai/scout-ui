import { useEffect, useRef, useState } from "react";
import { X, Crosshair, Calendar, Loader2 } from "lucide-react";
import { RecTag } from "./ui/RecTag";
import { ModalOverlay } from "./ui/ModalOverlay";

export function ClipPreviewModal({ t, ar, clip, onClose }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(true);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setReady(false);
    setBuffering(true);
    videoRef.current?.play().catch(() => {});
  }, [clip.videoUrl]);

  const showScore = clip.type !== "pending" && clip.score != null;

  return (
    <ModalOverlay onBackdropClick={onClose} ar={ar} variant="cinema">
      <div
        className="video-hero-dialog pop"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={clip.tag}
      >
        <div className="video-hero-stage">
          <div className="video-hero-glow" aria-hidden />

          {!ready && clip.thumbnailUrl && (
            <img
              src={clip.thumbnailUrl}
              alt=""
              className="video-hero-poster"
            />
          )}

          {(buffering || !ready) && (
            <div className="video-hero-loader">
              <Loader2 size={28} color="var(--accent-bright)" className="spin" />
            </div>
          )}

          <video
            ref={videoRef}
            key={clip.videoUrl}
            className={`video-hero-player${ready ? " is-ready" : ""}`}
            src={clip.videoUrl}
            poster={clip.thumbnailUrl || undefined}
            controls
            playsInline
            preload="auto"
            onLoadedData={() => {
              setReady(true);
              setBuffering(false);
            }}
            onWaiting={() => setBuffering(true)}
            onPlaying={() => setBuffering(false)}
            onCanPlay={() => setBuffering(false)}
          />

          <div className="video-hero-vignette" aria-hidden />

          <button
            type="button"
            className="video-hero-close"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>

          <div className="video-hero-caption">
            <div className="video-hero-caption-top">
              <span className="tag video-hero-tag">{clip.tag}</span>
              {showScore && (
                <span className="mono video-hero-score">{clip.score.toFixed(1)}</span>
              )}
              {clip.type !== "pending" && clip.rec && (
                <RecTag rec={clip.rec} t={t} />
              )}
            </div>
            {clip.date && (
              <div className="video-hero-date">
                <Calendar size={13} />
                <span className="mono">{clip.date}</span>
              </div>
            )}
          </div>
        </div>

        <div className="video-hero-footer">
          {clip.ident && (
            <div className="video-hero-ident">
              <Crosshair size={15} color="var(--accent)" />
              <span className="video-hero-ident-label">{t.identLabel}</span>
              <span>{clip.ident}</span>
            </div>
          )}
          <button type="button" className="btn btn-ghost video-hero-dismiss" onClick={onClose}>
            {t.close}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
