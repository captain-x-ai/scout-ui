import { STAGES } from "../../lib/constants";

export function StageSelect({ stage, onChange, t, mini }) {
  return (
    <select className={`sel ${mini ? "sel-mini" : ""}`} value={stage} onClick={(e) => e.stopPropagation()}
      onChange={(e) => { e.stopPropagation(); onChange(e.target.value); }}>
      {STAGES.map((s) => <option key={s} value={s}>{t["st_" + s]}</option>)}
    </select>
  );
}
