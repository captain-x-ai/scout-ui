import { useEffect } from "react";
import { ModalOverlay } from "./ModalOverlay";

export function ConfirmDialog({
  ar,
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
  danger = false,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, busy]);

  if (!open) return null;

  return (
    <ModalOverlay onBackdropClick={busy ? undefined : onCancel} ar={ar}>
      <div
        className="panel modal pop"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        style={{ padding: 24, maxWidth: 420, width: "min(92vw, 420px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div id="confirm-dialog-title" className="serif" style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>
            {title}
          </div>
        )}
        <p id="confirm-dialog-message" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.55, margin: "0 0 22px" }}>
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onConfirm}
            disabled={busy}
            style={danger ? { color: "var(--pass)", borderColor: "rgba(229,86,107,.45)" } : undefined}
          >
            {busy ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}
