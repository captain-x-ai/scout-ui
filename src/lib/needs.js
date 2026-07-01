/** Human-readable scouting need summary for labels and settings. */
export function needSummary(need, { ar = false } = {}) {
  if (!need) return "";
  const budget = needBudgetLabel(need, { ar });
  const age = ar ? `تحت ${need.maxAge}` : `U${need.maxAge}`;
  return `${need.pos} · ${age} · ${budget}`;
}

export function needBudgetLabel(need, { ar = false } = {}) {
  if (!need) return "";
  const valueM = need.maxValue >= 1_000_000
    ? `${(need.maxValue / 1_000_000).toFixed(need.maxValue % 1_000_000 === 0 ? 0 : 1)}m`
    : need.maxValue >= 1
      ? `${need.maxValue.toFixed(need.maxValue % 1 === 0 ? 0 : 1)}m`
      : `${Math.round(need.maxValue * 1000)}k`;
  const currency = need.maxValueCurrency === "EUR" ? "€" : `${need.maxValueCurrency} `;
  return ar ? `أقل من ${currency}${valueM}` : `under ${currency}${valueM}`;
}

/** Attribute weights sorted highest-first with percentage share. */
export function needAttrWeights(attrs) {
  if (!attrs?.length) return [];
  const total = attrs.reduce((s, a) => s + a.weight, 0) || 1;
  return [...attrs]
    .map((a) => ({ ...a, pct: Math.round((a.weight / total) * 100) }))
    .sort((a, b) => b.pct - a.pct);
}

export function attrLabel(key, t) {
  if (!key) return "";
  return t?.[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatNeedDate(iso, locale = "en") {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const NEED_FILTER_KEY = "scout:needFilter";

export function loadNeedFilter(clubId, sportId) {
  try {
    const raw = localStorage.getItem(`${NEED_FILTER_KEY}:${clubId}:${sportId}`);
    return raw || null;
  } catch {
    return null;
  }
}

export function saveNeedFilter(clubId, sportId, needId) {
  try {
    const key = `${NEED_FILTER_KEY}:${clubId}:${sportId}`;
    if (!needId) localStorage.removeItem(key);
    else localStorage.setItem(key, needId);
  } catch {
    /* ignore */
  }
}
