export function Spark({ data }) {
  if (!data || data.length < 2) return null;
  const w = 220, h = 54, pad = 6;
  const min = Math.min(...data) - .3, max = Math.max(...data) + .3;
  const x = (i) => pad + (i * (w - pad * 2)) / (data.length - 1);
  const y = (v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinejoin="round" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 4 : 2.5}
        fill={i === data.length - 1 ? "var(--gold-bright)" : "var(--green-bright)"} />)}
    </svg>
  );
}
