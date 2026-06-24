export function FakeField({ label, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 11,
      background: "rgba(255,255,255,.03)", border: "1px solid var(--line2)", color: "var(--muted)" }}>
      {icon}<span style={{ fontSize: 14 }}>{label}</span></div>
  );
}
