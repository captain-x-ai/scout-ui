import { Target, Crosshair, Calendar, Wallet, ArrowRight, Sparkles } from "lucide-react";
import {
  attrLabel, formatNeedDate, needAttrWeights, needBudgetLabel, needSummary,
} from "../lib/needs";
import { Header } from "./ui/Header";

function NeedCriterion({ icon: Icon, label, value, accent }) {
  return (
    <div className="need-criterion">
      <div className="need-criterion-icon" style={{ color: accent }}>
        <Icon size={15} strokeWidth={2.2} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="need-criterion-label">{label}</div>
        <div className="need-criterion-value mono">{value}</div>
      </div>
    </div>
  );
}

function NeedCard({ need, t, ar, locale, onUseNeed }) {
  const summary = needSummary(need, { ar });
  const title = need.title || summary;
  const showSummary = need.title && need.title !== summary;
  const weights = needAttrWeights(need.attrs);

  return (
    <article className="need-card panel">
      <div className="need-card-accent" aria-hidden />
      <div className="need-card-body">
        <div className="need-card-head">
          <div className="need-card-pos mono">{need.pos}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="need-card-title">{title}</h2>
            {showSummary && (
              <p className="need-card-sub">{summary}</p>
            )}
          </div>
          {need.createdAt && (
            <time className="need-card-date" dateTime={need.createdAt}>
              {t.needDefinedOn.replace("{date}", formatNeedDate(need.createdAt, locale))}
            </time>
          )}
        </div>

        <div className="need-criteria-grid">
          <NeedCriterion icon={Crosshair} label={t.fldPos} value={need.pos} accent="var(--gold)" />
          <NeedCriterion icon={Calendar} label={t.needMaxAge} value={ar ? `≤ ${need.maxAge}` : `U${need.maxAge}`} accent="var(--accent-bright)" />
          <NeedCriterion icon={Wallet} label={t.needBudget} value={needBudgetLabel(need, { ar })} accent="var(--green-bright)" />
        </div>

        {weights.length > 0 && (
          <div className="need-priorities">
            <div className="need-section-label">
              <Sparkles size={13} />
              {t.needPriorities}
            </div>
            <div className="need-weight-bars">
              {weights.map((a, i) => (
                <div key={a.key} className="need-weight-row">
                  <div className="need-weight-meta">
                    <span className="need-weight-name">{attrLabel(a.key, t)}</span>
                    <span className="need-weight-pct mono">{a.pct}%</span>
                  </div>
                  <div className="need-weight-track">
                    <div
                      className="need-weight-fill"
                      style={{
                        width: `${a.pct}%`,
                        opacity: 1 - i * 0.08,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {onUseNeed && (
          <div className="need-card-foot">
            <button type="button" className="btn btn-ghost need-use-btn" onClick={() => onUseNeed(need.id)}>
              {t.useForFit}
              <ArrowRight size={15} style={{ transform: ar ? "scaleX(-1)" : "none" }} />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export function ClubNeedsSettings({ t, ar, needs, loading, onUseNeed }) {
  const locale = ar ? "ar" : "en";

  if (loading && needs.length === 0) {
    return (
      <div className="fade" style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>
        {t.loadingPlayers}
      </div>
    );
  }

  return (
    <div className="fade club-needs">
      <Header title={t.clubNeeds} sub={t.clubNeedsSub} />

      {needs.length === 0 ? (
        <div className="panel need-empty">
          <div className="need-empty-icon">
            <Target size={28} strokeWidth={1.8} />
          </div>
          <div className="need-empty-title">{t.noActiveNeeds}</div>
          <p className="need-empty-hint">{t.noActiveNeedsHint}</p>
        </div>
      ) : (
        <>
          <div className="panel need-summary-bar">
            <div className="need-summary-count">
              <span className="mono need-summary-num">{needs.length}</span>
              <span className="need-summary-label">{t.activeNeedsCount}</span>
            </div>
            <p className="need-summary-hint">{t.clubNeedsHint}</p>
          </div>

          <div className="need-grid stagger">
            {needs.map((need) => (
              <NeedCard
                key={need.id}
                need={need}
                t={t}
                ar={ar}
                locale={locale}
                onUseNeed={onUseNeed}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
