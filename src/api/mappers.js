const FLAG_BY_CODE = {
  SA: "🇸🇦", BR: "🇧🇷", AR: "🇦🇷", MA: "🇲🇦", PT: "🇵🇹",
  ES: "🇪🇸", FR: "🇫🇷", NG: "🇳🇬", SN: "🇸🇳",
};

const CODE_BY_FLAG = Object.fromEntries(
  Object.entries(FLAG_BY_CODE).map(([code, flag]) => [flag, code]),
);

// Football action tag labels → API keys (matches sport_catalog default_config).
const ACTION_KEY_BY_LABEL = {
  "Progressive carry": "progressive_carry",
  "1v1 defending": "1v1_defending",
  "Recovery sprint": "recovery_sprint",
  "Aerial duel": "aerial_duel",
  "Line-breaking pass": "line_breaking_pass",
  "Overlapping run": "overlapping_run",
  "Pressing trigger": "pressing_trigger",
  "Set-piece delivery": "set_piece_delivery",
  "Switch of play": "switch_of_play",
  "Finishing": "finishing",
  "Other": "progressive_carry",
};

export function actionTagKey(label) {
  return ACTION_KEY_BY_LABEL[label] || label.toLowerCase().replace(/\s+/g, "_");
}

export function flagFromCode(code) {
  if (!code) return "🌍";
  return FLAG_BY_CODE[code.toUpperCase()] || "🌍";
}

export function codeFromFlag(flag) {
  return CODE_BY_FLAG[flag] || "";
}

function marketValueNum(mv) {
  if (!mv) return 0;
  if (typeof mv.amount === "number") return mv.amount;
  return 0;
}

function marketValueDisplay(mv) {
  if (!mv) return "€0m";
  return mv.display || `€${marketValueNum(mv)}m`;
}

/** Map API ClipReview → UI review row used by Clip / eval helpers. */
export function mapReviewFromClip(clip, order) {
  const review = clip.review || {};
  const ai = review.ai || {};
  const scout = review.scout || {};
  const effective = review.effective || {};

  const reviewSource = review.review_source ?? null;
  let type = "pending";
  if (reviewSource === "ai") type = "ai";
  else if (reviewSource === "human") type = "human";

  const aiText = ai.review || "";
  const humanText = scout.review ?? null;
  const aiScore = ai.score ?? null;
  const aiRec = ai.verdict ?? null;

  const score = type === "pending" ? aiScore : (effective.score ?? aiScore);
  const rec = type === "pending" ? aiRec : (effective.verdict ?? aiRec);

  let editDelta = 0;
  if (type === "human") {
    const textChanged = humanText && aiText && humanText.trim() !== aiText.trim();
    const scoreChanged = scout.score != null && aiScore != null
      && Math.abs(scout.score - aiScore) >= 2;
    editDelta = textChanged || scoreChanged ? 2 : 1;
  }

  return {
    id: clip.clip_id,
    order: order ?? 0,
    createdAt: clip.created_at || "",
    type,
    reviewSource,
    reviewStatus: review.review_status || "pending",
    aiGenStatus: review.ai_generation_status || "pending",
    score,
    rec,
    aiScore,
    aiRec,
    minute: clip.minute ?? 0,
    opp: clip.opponent_name || "—",
    tag: clip.action_tag_label || clip.action_tag_key || "Clip",
    date: clip.match_date || "",
    ident: clip.ident_text || "",
    ai: aiText,
    human: humanText,
    editDelta,
    status: clip.status,
    mediaReady: !!clip.media_ready,
    aiDraftReady: !!clip.ai_draft_ready,
    reviewReady: !!clip.review_ready,
    scoutReviewed: !!clip.scout_reviewed,
    thumbnailUrl: clip.thumbnail_url,
    videoUrl: clip.video_playback_url,
  };
}

function mapPlayerSummary(stats) {
  if (!stats) return null;
  const text = stats.ai_summary ?? stats.aiSummary;
  if (!text) return null;
  return { en: text, ar: text };
}

export function mapPlayerStats(raw) {
  if (!raw) return null;
  const score3 = raw.score_3 ?? raw.score3 ?? null;
  const score5 = raw.score_5 ?? raw.score5 ?? null;
  const score8 = raw.score_8 ?? raw.score8 ?? null;
  if (score3 == null && score5 == null && score8 == null) return null;
  return {
    score3,
    score5,
    score8,
    updatedAt: raw.updated_at ?? raw.updatedAt ?? null,
    aiSummary: raw.ai_summary ?? raw.aiSummary ?? null,
  };
}

export function mapPlayerListItem(item) {
  return {
    id: item.id,
    name: item.name,
    nameAr: item.name_ar || item.name,
    club: item.external_club_name || "—",
    flag: flagFromCode(item.nationality_code),
    pos: item.position_key,
    age: item.age,
    value: marketValueDisplay(item.market_value),
    valueNum: marketValueNum(item.market_value),
    stage: item.stage,
    daysAgo: item.days_ago ?? 999,
    evalScore: item.eval_score,
    fitScore: item.fit_score,
    photoUrl: item.photo_url,
    attrs: item.attributes || {},
    reviews: [],
    summary: mapPlayerSummary(item.player_stats),
    playerStats: mapPlayerStats(item.player_stats),
  };
}

export function mapPlayerDetail(data) {
  const p = data.player || {};
  const clips = data.clips || [];
  const pag = data.clips_pagination || {};
  const reviews = clips.map((c, i) => mapReviewFromClip(c, clips.length - i));

  return {
    id: p.id,
    name: p.name,
    nameAr: p.name_ar || p.name,
    club: p.external_club_name || "—",
    flag: flagFromCode(p.nationality_code),
    pos: p.position_key,
    age: p.age,
    value: marketValueDisplay(p.market_value),
    valueNum: marketValueNum(p.market_value),
    stage: p.stage,
    daysAgo: p.last_reviewed_at ? daysAgoFromIso(p.last_reviewed_at) : 999,
    attrs: p.attributes || {},
    reviews,
    clipsPagination: {
      page: pag.page || 1,
      pageSize: pag.page_size || 10,
      total: pag.total || clips.length,
      totalPages: pag.total_pages || (clips.length ? 1 : 0),
    },
    summary: mapPlayerSummary(data.player_stats),
    playerStats: mapPlayerStats(data.player_stats),
    evalScore: p.eval_score,
    fitScore: data.fit_score,
    overruleRate: data.overrule_rate,
    evaluation: data.evaluation,
    photoUrl: p.photo_url,
  };
}

function daysAgoFromIso(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 999;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

export function mapScoutingNeed(need) {
  if (!need) return null;
  const attrs = (need.weighted_attributes || []).map((a) => ({
    key: a.key,
    weight: a.weight,
  }));
  return {
    id: need.id,
    pos: need.position_key,
    maxAge: need.max_age,
    maxValue: need.max_value_amount,
    maxValueCurrency: need.max_value_currency || "EUR",
    title: need.title,
    createdAt: need.created_at || null,
    attrs,
  };
}

export function mapCreatePlayerPayload(form) {
  return {
    name: form.name,
    name_ar: form.nameAr || form.name,
    external_club_name: form.club === "—" ? "" : form.club,
    position_key: form.pos,
    age: Number(form.age) || 18,
    email: form.email,
    market_value_amount: Number(form.valueNum) || 0,
    market_value_currency: "EUR",
    nationality_code: codeFromFlag(form.flag),
    stage: form.stage || "watching",
  };
}
