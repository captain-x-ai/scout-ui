export function ProvBar({ humanLabel, aiLabel, human, ai }) {
  const tot = human + ai || 1;
  const HUMAN = "var(--primary)", AI = "var(--accent-bright)";
  return (
    <div>
      <div style={{ display: "flex", height: 9, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,.06)" }}>
        <div style={{ width: `${(human / tot) * 100}%`, background: HUMAN }} />
        <div style={{ width: `${(ai / tot) * 100}%`, background: AI }} />
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11.5, color: "var(--muted)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: HUMAN, display: "inline-block" }} />{humanLabel}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 2, background: AI, display: "inline-block" }} />{aiLabel}</span>
      </div>
    </div>
  );
}
