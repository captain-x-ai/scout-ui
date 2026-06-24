export function Bar({ label, v }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
      <div style={{ width: 96, fontSize: 12.5, color: "var(--muted)" }}>{label}</div>
      <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,.06)", borderRadius: 6, overflow: "hidden" }}>
        <div style={{ width: `${v}%`, height: "100%", background: "var(--primary)", borderRadius: 6, transition: ".6s" }} />
      </div>
      <div className="mono" style={{ width: 28, textAlign: "end", fontSize: 12, color: "var(--cream)" }}>{v}</div>
    </div>
  );
}
