import { useRef, useState } from "react";
import { X, Upload, Crosshair, Check, Film, Trash2, Replace } from "lucide-react";
import { ACTIONS } from "../lib/constants";
import { ModalOverlay } from "./ui/ModalOverlay";

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const blankClip = () => ({
  tag: ACTIONS[0],
  date: new Date().toISOString().slice(0, 10),
  ident: "",
  file: null,
});

export function UploadModal({ t, ar, player, onClose, onAdd, locked, closable, busy, statusMsg }) {
  const [clip, setClip] = useState(blankClip);
  const fileInputRef = useRef(null);
  const set = (k, v) => setClip((s) => ({ ...s, [k]: v }));

  const onFile = (e) => {
    if (locked) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setClip((s) => ({ ...s, file }));
    e.target.value = "";
  };

  const clearFile = () => {
    if (locked) return;
    setClip((s) => ({ ...s, file: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = () => {
    if (!clip.file || locked) return;
    onAdd([clip]);
  };

  const handleClose = () => {
    if (!closable) return;
    onClose();
  };

  const hasFile = !!clip.file;
  const fieldsDisabled = locked || !hasFile;

  return (
    <ModalOverlay onBackdropClick={closable ? handleClose : undefined} ar={ar}>
      <div className="panel modal scrolly" style={{ padding: 24, maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600 }}>
            {t.uploadTitle.replace("{name}", ar ? player.nameAr : player.name)}
          </div>
          <X
            size={20}
            color="var(--muted)"
            style={{ cursor: closable ? "pointer" : "default", opacity: closable ? 1 : 0.4 }}
            onClick={handleClose}
          />
        </div>
        <div style={{ fontSize: 12.5, color: locked ? "var(--gold)" : "var(--muted)", marginBottom: 18, lineHeight: 1.5 }}>
          {statusMsg || t.uploadHintOne || t.uploadHint}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={onFile}
          style={{ display: "none" }}
          disabled={locked}
        />

        {!hasFile ? (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              padding: "28px 22px",
              border: "1.5px dashed var(--gold)",
              borderRadius: 14,
              cursor: locked ? "default" : "pointer",
              marginBottom: 18,
              background: "rgba(140,107,255,.06)",
              opacity: locked ? 0.6 : 1,
              pointerEvents: locked ? "none" : "auto",
            }}
            onClick={() => !locked && fileInputRef.current?.click()}
          >
            <Upload size={28} color="var(--gold)" />
            <span style={{ fontSize: 14, color: "var(--cream)", fontWeight: 600 }}>
              {t.chooseFile || t.chooseFiles}
            </span>
            <span style={{ fontSize: 11.5, color: "var(--muted2)" }}>{t.oneClipOnly || "One video clip per upload"}</span>
          </label>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              marginBottom: 18,
              borderRadius: 12,
              border: "1px solid var(--gold)",
              background: "rgba(140,107,255,.12)",
              opacity: locked ? 0.85 : 1,
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10, background: "var(--green-deep)",
              display: "grid", placeItems: "center", flexShrink: 0,
            }}>
              <Film size={22} color="var(--gold)" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, color: "var(--gold)", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 3 }}>
                {t.clipAttached || "Video attached"}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--cream)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {clip.file.name}
              </div>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted2)", marginTop: 2 }}>
                {formatFileSize(clip.file.size)}
              </div>
            </div>
            {!locked && (
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button type="button" className="btn btn-ghost" style={{ padding: "6px 9px" }} title={t.replaceFile || "Replace"}
                  onClick={() => fileInputRef.current?.click()}>
                  <Replace size={15} />
                </button>
                <button type="button" className="btn btn-ghost" style={{ padding: "6px 9px" }} title={t.removeFile || "Remove"}
                  onClick={clearFile}>
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{
          border: "1px solid var(--line2)", borderRadius: 12, padding: 14, background: "var(--panel2)", marginBottom: 16,
          opacity: hasFile ? (locked ? 0.75 : 1) : 0.55,
          pointerEvents: fieldsDisabled ? "none" : "auto",
        }}>
          <div style={{ fontSize: 11, color: "var(--muted2)", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10 }}>
            {t.clipDetails || "Clip details"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 8, marginBottom: 8 }}>
            <select className="sel" value={clip.tag} onChange={(e) => set("tag", e.target.value)} disabled={fieldsDisabled}>
              {ACTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <input className="fld" type="date" value={clip.date} onChange={(e) => set("date", e.target.value)}
              style={{ padding: "9px 11px", fontSize: 13 }} title={t.clipDate} disabled={fieldsDisabled} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Crosshair size={15} color="var(--gold)" style={{ flexShrink: 0 }} />
            <input className="fld" placeholder={t.clipIdent} value={clip.ident} onChange={(e) => set("ident", e.target.value)}
              style={{ padding: "9px 11px", fontSize: 13 }} disabled={fieldsDisabled} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid var(--line2)", paddingTop: 16 }}>
          <button className="btn btn-ghost" onClick={handleClose} disabled={!closable}>
            {locked && closable ? t.close : t.cancel}
          </button>
          {!locked && (
            <button className="btn btn-gold" onClick={submit} disabled={busy || !hasFile}>
              <Check size={15} />
              {busy ? "…" : (t.addOneClip || t.addToTimeline.replace("{n}", 1))}
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
