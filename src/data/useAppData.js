import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSession } from "../context/SessionContext";
import { fetchOpenNeed } from "../api/needs.api";
import {
  createPlayer,
  getPlayer,
  listPlayers,
  patchPlayerStage,
} from "../api/players.api";
import { uploadClipRows, deletePendingClip } from "../api/clips.api";
import { acceptReview, saveReview, regeneratePlayerSummary, pollPlayerSummaryUntilUpdated } from "../api/reviews.api";

function sessionKey(session) {
  return session ? `${session.clubId}:${session.sportId}` : null;
}

export function useAppData() {
  const session = useSession();
  const key = sessionKey(session);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const [players, setPlayers] = useState([]);
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerDetails, setPlayerDetails] = useState({});

  const reload = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;
    setLoading(true);
    setError(null);
    try {
      const [plist, openNeed] = await Promise.all([
        listPlayers(s),
        fetchOpenNeed(s).catch(() => null),
      ]);
      setPlayers(plist);
      setNeed(openNeed);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [key]);

  useLayoutEffect(() => {
    if (!key) {
      setPlayers([]);
      setNeed(null);
      setPlayerDetails({});
      setLoading(false);
      return;
    }

    let cancelled = false;
    setPlayerDetails({});
    setLoading(true);
    setError(null);

    const s = sessionRef.current;
    Promise.all([
      listPlayers(s),
      fetchOpenNeed(s).catch(() => null),
    ])
      .then(([plist, openNeed]) => {
        if (cancelled) return;
        setPlayers(plist);
        setNeed(openNeed);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Failed to load data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [key]);

  const getPlayerView = useCallback((id) => {
    if (playerDetails[id]) return playerDetails[id];
    return players.find((p) => p.id === id) || null;
  }, [playerDetails, players]);

  const loadPlayer = useCallback(async (id, opts = {}) => {
    const s = sessionRef.current;
    if (!s || !id) return null;
    const detail = await getPlayer(s, id, opts);
    setPlayerDetails((d) => ({ ...d, [id]: detail }));
    setPlayers((ps) => ps.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...detail,
        flag: detail.flag || p.flag,
        photoUrl: detail.photoUrl || p.photoUrl,
        reviews: detail.reviews,
        playerStats: detail.playerStats ?? p.playerStats,
        summary: detail.summary ?? p.summary,
        evalScore: detail.evalScore ?? p.evalScore,
      };
    }));
    return detail;
  }, [key]);

  const addPlayer = useCallback(async (form) => {
    const s = sessionRef.current;
    if (!s) throw new Error("No session");
    const created = await createPlayer(s, form);
    const detail = await getPlayer(s, created.id);
    setPlayers((ps) => [detail, ...ps]);
    setPlayerDetails((d) => ({ ...d, [detail.id]: detail }));
    return detail.id;
  }, [key]);

  const updatePlayer = useCallback(async (pid, patch) => {
    const s = sessionRef.current;
    if (patch.stage && s) {
      await patchPlayerStage(s, pid, patch.stage);
    }
    setPlayers((ps) => ps.map((p) => (p.id !== pid ? p : { ...p, ...patch })));
    setPlayerDetails((d) => {
      const cur = d[pid];
      if (!cur) return d;
      return { ...d, [pid]: { ...cur, ...patch } };
    });
  }, [key]);

  const updateReview = useCallback(async (pid, clipId, patch) => {
    const s = sessionRef.current;
    if (!s) return;
    if (patch.type === "ai") {
      await acceptReview(s, clipId);
    } else if (patch.type === "human") {
      await saveReview(s, clipId, {
        score: patch.score,
        rec: patch.rec,
        human: patch.human,
      });
    }
    const page = playerDetails[pid]?.clipsPagination?.page || 1;
    await loadPlayer(pid, { clipsPage: page });
  }, [loadPlayer, playerDetails]);

  const uploadClips = useCallback(async (pid, rows, onProgress, onProcessingStarted) => {
    const s = sessionRef.current;
    if (!s) return;
    await uploadClipRows(s, pid, rows, onProgress, { onProcessingStarted });
    await loadPlayer(pid, { clipsPage: 1 });
  }, [loadPlayer]);

  const deleteClip = useCallback(async (pid, clipId) => {
    const s = sessionRef.current;
    if (!s) return;
    await deletePendingClip(s, clipId);
    const page = playerDetails[pid]?.clipsPagination?.page || 1;
    await loadPlayer(pid, { clipsPage: page });
  }, [loadPlayer, playerDetails]);

  const regenerateSummary = useCallback(async (playerId, opts = {}) => {
    const s = sessionRef.current;
    if (!s) return null;
    const cur = playerDetails[playerId] || players.find((p) => p.id === playerId);
    const prevText = cur?.summary?.en || cur?.playerStats?.aiSummary || "";
    await regeneratePlayerSummary(s, playerId);
    const detail = await pollPlayerSummaryUntilUpdated(s, playerId, prevText, opts);
    if (detail) {
      setPlayerDetails((d) => ({ ...d, [playerId]: { ...(d[playerId] || {}), ...detail } }));
      setPlayers((ps) => ps.map((p) => (p.id !== playerId ? p : {
        ...p,
        summary: detail.summary,
        playerStats: detail.playerStats ?? p.playerStats,
      })));
      return detail;
    }
    return loadPlayer(playerId, opts);
  }, [key, loadPlayer, playerDetails, players]);

  return {
    players,
    need,
    loading,
    error,
    reload,
    getPlayerView,
    loadPlayer,
    addPlayer,
    updatePlayer,
    updateReview,
    uploadClips,
    deleteClip,
    regenerateSummary,
  };
}
