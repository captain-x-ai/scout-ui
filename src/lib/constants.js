/* ============================== SHARED CONSTANTS ============================== */

// Pipeline stages a player can be in.
export const STAGES = ["watching", "shortlisted", "recommended", "decided"];

export const stageColor = {
  watching: "var(--muted)", shortlisted: "var(--accent-bright)",
  recommended: "var(--primary)", decided: "var(--good)",
};

// Recommendation → brand colour.
export const recColor = { sign: "var(--good)", monitor: "var(--warn)", pass: "var(--pass)" };

// Add-player form options.
export const POSITIONS = ["GK", "LB", "CB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];
export const FLAGS = ["🇸🇦", "🇧🇷", "🇦🇷", "🇲🇦", "🇵🇹", "🇪🇸", "🇫🇷", "🇳🇬", "🇸🇳", "🌍"];

// Tag options offered when uploading clips.
export const ACTIONS = ["Progressive carry", "1v1 defending", "Recovery sprint", "Aerial duel", "Line-breaking pass", "Overlapping run", "Pressing trigger", "Set-piece delivery", "Switch of play", "Finishing", "Other"];
