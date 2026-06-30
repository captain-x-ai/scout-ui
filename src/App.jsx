import { useEffect, useRef, useState } from "react";
import { CSS } from "./styles/globalCss";
import { T } from "./i18n/translations";
import { useAuth } from "./context/AuthContext";
import { useSession } from "./context/SessionContext";
import { useAppData } from "./data/useAppData";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { Login } from "./components/Login";
import { Shell } from "./components/Shell";
import { MyPlayers } from "./components/MyPlayers";
import { AddPlayer } from "./components/AddPlayer";
import { Player } from "./components/Player";

export default function App() {
  const [lang, setLang] = useState("en");

  const { isAuthenticated, loading: authLoading, logout, scoutClubs, error: authError } = useAuth();
  const session = useSession();
  const { view, sel, navigate, resetToLogin } = useAppNavigation({ isAuthenticated, authLoading });
  const {
    players, need, loading: dataLoading, error: dataError,
    getPlayerView, loadPlayer, addPlayer, updatePlayer, updateReview,
    uploadClips, regenerateSummary, reload,
  } = useAppData();

  const t = T[lang];
  const ar = lang === "ar";
  const player = sel ? getPlayerView(sel) : null;
  const prevViewRef = useRef(null);

  useEffect(() => {
    if (view === "watchlist" && prevViewRef.current === "player" && session) {
      reload();
    }
    prevViewRef.current = view;
  }, [view, session, reload]);

  useEffect(() => {
    if (view === "player" && sel && session) {
      loadPlayer(sel).catch(() => {});
    }
  }, [view, sel, session, loadPlayer]);

  const onAddPlayer = async (data) => {
    const id = await addPlayer(data);
    navigate({ view: "player", playerId: id });
  };

  const onOpenPlayer = (id) => {
    navigate({ view: "player", playerId: id });
  };

  const onLogout = async () => {
    await logout();
    resetToLogin();
  };

  const onClubChange = () => {
    navigate({ view: "watchlist" }, { replace: true });
  };

  if (authLoading) {
    return (
      <div className="kx" style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <style>{CSS}</style>
        Loading…
      </div>
    );
  }

  return (
    <div className={`kx ${ar ? "lang-ar" : ""}`} dir={ar ? "rtl" : "ltr"}>
      <style>{CSS}</style>
      {view === "login" || !isAuthenticated
        ? <Login t={t} />
        : !session
          ? (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
              <div className="panel" style={{ padding: 32, maxWidth: 420 }}>
                <div style={{ color: "var(--cream)", marginBottom: 12 }}>
                  {scoutClubs.length > 0
                    ? "Could not start a scout session for this club (missing sport setup)."
                    : "No scout club membership found for this account."}
                </div>
                {authError && (
                  <div style={{ color: "var(--signal)", fontSize: 13, marginBottom: 12 }}>{authError}</div>
                )}
                <button className="btn btn-ghost" onClick={onLogout}>Sign out</button>
              </div>
            </div>
          )
          : (
            <Shell t={t} ar={ar} view={view} navigate={navigate}
              onLogout={onLogout}
              onClubChange={onClubChange}>
              {dataError && (
                <div className="panel" style={{ padding: 12, marginBottom: 12, color: "var(--signal)", fontSize: 13 }}>
                  {dataError}
                </div>
              )}
              {view === "watchlist" && (
                <MyPlayers t={t} ar={ar} players={players} need={need} loading={dataLoading}
                  updatePlayer={updatePlayer} onAdd={() => navigate({ view: "addplayer" })} onOpen={onOpenPlayer} />
              )}
              {view === "addplayer" && (
                <AddPlayer t={t} ar={ar} onSave={onAddPlayer} onCancel={() => navigate({ view: "watchlist" })} />
              )}
              {view === "player" && player && (
                <Player t={t} ar={ar} player={player} need={need}
                  updateReview={updateReview} updatePlayer={updatePlayer}
                  uploadClips={uploadClips}
                  regenerateSummary={regenerateSummary}
                  loadPlayer={loadPlayer} />
              )}
            </Shell>
          )}
    </div>
  );
}
