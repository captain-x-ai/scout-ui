export function Header({ title, sub }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div className="serif" style={{ fontSize: 30, fontWeight: 600, letterSpacing: .3 }}>{title}</div>
      {sub && <div style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
