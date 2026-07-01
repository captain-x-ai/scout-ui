import { needSummary } from "../lib/needs";

export function NeedSwitcher({ t, ar, needs, selectedNeedId, onChange }) {
  if (!needs.length) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
      <span style={{ fontSize: 11, color: "var(--muted2)", letterSpacing: 1, textTransform: "uppercase" }}>
        {t.viewBy}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <button
          type="button"
          className={`btn btn-ghost ${!selectedNeedId ? "on" : ""}`}
          style={{ fontSize: 12.5, padding: "7px 12px" }}
          onClick={() => onChange(null)}
        >
          {t.allPlayers}
        </button>
        {needs.map((need) => (
          <button
            key={need.id}
            type="button"
            className={`btn btn-ghost ${selectedNeedId === need.id ? "on" : ""}`}
            style={{ fontSize: 12.5, padding: "7px 12px", maxWidth: 280 }}
            title={need.title || needSummary(need, { ar })}
            onClick={() => onChange(need.id)}
          >
            {need.title || needSummary(need, { ar })}
          </button>
        ))}
      </div>
    </div>
  );
}
