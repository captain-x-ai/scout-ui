export function ArcGauge({ score }) {
  const pct = Math.max(0, Math.min(1, score / 10));
  const R = 56, C = Math.PI * R, off = C * (1 - pct);
  return (
    <div style={{ position: "relative", width: 150, height: 92 }}>
      <svg width="150" height="92" viewBox="0 0 150 92">
        <path d="M19 86 A56 56 0 0 1 131 86" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="9" strokeLinecap="round" />
        <path d="M19 86 A56 56 0 0 1 131 86" fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={off} style={{ transition: "stroke-dashoffset .7s cubic-bezier(.3,.9,.3,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, top: 22, textAlign: "center" }}>
        <div className="serif mono" style={{ fontSize: 38, fontWeight: 600, lineHeight: 1, color: "var(--cream)" }}>{score.toFixed(1)}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>/ 10</div>
      </div>
    </div>
  );
}
