import { useCallback, useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { fetchOpenNeed } from "../api/needs.api";
import {
  createPlayer,
  getPlayer,
  listPlayers,
  patchPlayerStage,
} from "../api/players.api";
import { uploadClipRows } from "../api/clips.api";
import { acceptReview, regenerateObservation, saveReview } from "../api/reviews.api";

export function useAppData() {
  const session = useSession();
  const [players, setPlayers] = useState([]);
  const [need, setNeed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerDetails, setPlayerDetails] = useState({});

  const reload = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const [plist, openNeed] = await Promise.all([
        listPlayers(session),
        fetchOpenNeed(session).catch(() => null),
      ]);
      setPlayers(plist);
      setNeed(openNeed);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    setPlayerDetails({});
    reload();
  }, [reload]);

  const getPlayerView = useCallback((id) => {
    if (playerDetails[id]) return playerDetails[id];
    return players.find((p) => p.id === id) || null;
  }, [playerDetails, players]);

  const loadPlayer = useCallback(async (id, opts = {}) => {
    if (!session || !id) return null;
    const detail = await getPlayer(session, id, opts);
    setPlayerDetails((d) => ({ ...d, [id]: detail }));
    setPlayers((ps) => ps.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...detail,
        flag: detail.flag || p.flag,
        photoUrl: detail.photoUrl || p.photoUrl,
        reviews: detail.reviews,
      };
    }));
    return detail;
  }, [session]);

  const addPlayer = useCallback(async (form) => {
    if (!session) throw new Error("No session");
    const created = await createPlayer(session, form);
    const detail = await getPlayer(session, created.id);
    setPlayers((ps) => [detail, ...ps]);
    setPlayerDetails((d) => ({ ...d, [detail.id]: detail }));
    return detail.id;
  }, [session]);

  const updatePlayer = useCallback(async (pid, patch) => {
    if (patch.stage && session) {
      await patchPlayerStage(session, pid, patch.stage);
    }
    setPlayers((ps) => ps.map((p) => (p.id !== pid ? p : { ...p, ...patch })));
    setPlayerDetails((d) => {
      const cur = d[pid];
      if (!cur) return d;
      return { ...d, [pid]: { ...cur, ...patch } };
    });
  }, [session]);

  const updateReview = useCallback(async (pid, clipId, patch) => {
    if (!session) return;
    if (patch.type === "ai") {
      await acceptReview(session, clipId, {
        score: patch.score,
        rec: patch.rec,
        conf: patch.conf || "med",
      });
    } else if (patch.type === "human") {
      await saveReview(session, clipId, {
        score: patch.score,
        rec: patch.rec,
        conf: patch.conf || "high",
        human: patch.human,
      });
    }
    const page = playerDetails[pid]?.clipsPagination?.page || 1;
    await loadPlayer(pid, { clipsPage: page });
  }, [session, loadPlayer, playerDetails]);

  const uploadClips = useCallback(async (pid, rows, onProgress, onProcessingStarted) => {
    if (!session) return;
    await uploadClipRows(session, pid, rows, onProgress, { onProcessingStarted });
    await loadPlayer(pid, { clipsPage: 1 });
  }, [session, loadPlayer]);

  const regenObservation = useCallback(async (clipId) => {
    if (!session) return null;
    return regenerateObservation(session, clipId);
  }, [session]);

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
    regenObservation,
  };
}
