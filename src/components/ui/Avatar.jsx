export function Avatar({ p, size = 40, radius = 11, font = 18 }) {
  return p.photo
    ? <img src={p.photo} alt="" style={{ width: size, height: size, borderRadius: radius, objectFit: "cover", flexShrink: 0 }} />
    : <div style={{ width: size, height: size, borderRadius: radius, background: "var(--green-deep)", display: "grid", placeItems: "center", fontSize: font, flexShrink: 0 }}>{p.flag}</div>;
}
