/* ============================== PLAYERS SERVICE ==============================
   FUTURE API BOUNDARY. Today getPlayers() composes the static fixtures into the
   exact player objects the app used before this refactor; later it becomes a
   call to the Players API. Keep it synchronous until that swap. */
import { seed, META, DATES } from "./_fixtures";

// Roster + per-player metadata (stage/daysAgo) + reviews (with match dates) merged
// into one view model — identical shape to the pre-refactor App initializer.
export const getPlayers = () =>
  seed().map((p) => ({
    ...META[p.id], ...p,
    reviews: p.reviews.map((rv) => ({ date: DATES[rv.id], ...rv })),
  }));

// Build the object for a newly onboarded player (was App.addPlayer's `np` literal).
export const createPlayer = (data) => {
  const id = "np" + Date.now();
  return {
    id, stage: "watching", daysAgo: 0, reviews: [],
    attrs: { pace: 50, passing: 50, positioning: 50, duels: 50, finishing: 50, workrate: 50 },
    nameAr: data.name, flag: "🌍", photo: null, valueNum: 0, value: "€0m", ...data,
  };
};
