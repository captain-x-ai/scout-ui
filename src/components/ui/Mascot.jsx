/* CaptainX mini-robot mascot — used subtly to mark AI-driven moments */
export function Mascot({ size = 22, glow = "var(--accent-bright)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ flexShrink: 0 }}>
      <rect x="6" y="3" width="9" height="14" rx="4" fill="#0E0730" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      <rect x="33" y="3" width="9" height="14" rx="4" fill="#0E0730" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
      <rect x="9" y="5" width="30" height="30" rx="11" fill="#0E0730" stroke={glow} strokeWidth="1.4" />
      <rect x="13" y="10" width="22" height="18" rx="8" fill="#160A3D" stroke={glow} strokeWidth="1.6" />
      <circle cx="19.5" cy="18" r="2.1" fill={glow} />
      <circle cx="28.5" cy="18" r="2.1" fill={glow} />
      <path d="M19 23q5 4 10 0" stroke={glow} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
