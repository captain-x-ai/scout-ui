import { stageColor } from "../../lib/constants";

export function StatusPill({ stage, t }) {
  const c = stageColor[stage] || "var(--muted)";
  return <span className="tag" style={{ color: c, background: `${c}1f` }}>
    <i style={{ width: 6, height: 6, borderRadius: 999, background: c, display: "inline-block" }} />{t["st_" + stage]}</span>;
}
