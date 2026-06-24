import { useState } from "react";
import { getPlayers, createPlayer } from "../api/players.api";

/* Owns the players collection and its mutations. This is the single seam where
   the Players API will later plug in (load + persist) — App and the screens
   consume it through this hook and never touch the data source directly. */
export function usePlayers() {
  const [players, setPlayers] = useState(getPlayers);

  const updateReview = (pid, rid, patch) =>
    setPlayers((ps) => ps.map((p) => p.id !== pid ? p : {
      ...p, reviews: p.reviews.map((r) => r.id !== rid ? r : { ...r, ...patch }) }));

  const updatePlayer = (pid, patch) =>
    setPlayers((ps) => ps.map((p) => p.id !== pid ? p : { ...p, ...patch }));

  // Returns the new player's id so the caller can select + navigate to it.
  const addPlayer = (data) => {
    const np = createPlayer(data);
    setPlayers((ps) => [np, ...ps]);
    return np.id;
  };

  return { players, updateReview, updatePlayer, addPlayer };
}
