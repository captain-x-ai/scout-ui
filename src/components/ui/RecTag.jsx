import { Check, X, Eye } from "lucide-react";
import { recColor } from "../../lib/constants";

export function RecTag({ rec, t }) {
  if (!rec) return null;
  const c = recColor[rec];
  return <span className="tag" style={{ color: c, background: `${c}1f` }}>
    {rec === "sign" ? <Check size={12} /> : rec === "pass" ? <X size={12} /> : <Eye size={12} />}{t[rec]}</span>;
}
