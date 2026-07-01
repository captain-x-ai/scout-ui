import { useEffect, useRef, useState, useCallback } from "react";
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
import { ClubNeedsSettings } from "./components/ClubNeedsSettings";
import { Player } from "./components/Player";

export default function App() {
  const [lang, setLang] = useState("en");

  const { isAuthenticated, loading: authLoading, logout, scoutClubs, error: authError } = useAuth();
  const session = useSession();
  const { view, sel, navigate, resetToLogin } = useAppNavigation({ isAuthenticated, authLoading });
  const {
    players, needs, selectedNeedId, selectedNeed, setSelectedNeedId,
    loading: dataLoading, error: dataError,
    getPlayerView, loadPlayer, addPlayer, updatePlayer, updateReview,
    uploadClips, deleteClip, regenerateSummary, reload,
  } = useAppData();

  const t = T[lang];
  const ar = lang === "ar";
  const player = sel ? getPlayerView(sel) : null;
  const bootLatch = useRef(false);
  const [initialDataReady, setInitialDataReady] = useState(false);

  const showBootLoader = !bootLatch.current && (
    authLoading || (isAuthenticated && session && !initialDataReady)
  );

  useEffect(() => {
    if (!showBootLoader) {
      document.getElementById("initial-splash")?.remove();
    }
  }, [showBootLoader]);

  useEffect(() => {
    if (!isAuthenticated) bootLatch.current = false;
  }, [isAuthenticated]);

  useEffect(() => {
    if (!session) {
      setInitialDataReady(false);
      return;
    }
    if (!dataLoading) setInitialDataReady(true);
  }, [session, dataLoading]);

  useEffect(() => {
    if (!bootLatch.current && !authLoading && isAuthenticated && session && initialDataReady) {
      bootLatch.current = true;
    }
    if (!bootLatch.current && !authLoading && !isAuthenticated) {
      bootLatch.current = true;
    }
  }, [authLoading, isAuthenticated, session, initialDataReady]);

  const onSidebarNav = useCallback((targetView) => {
    reload();
    navigate({ view: targetView });
  }, [reload, navigate]);

  const onUseNeed = useCallback((needId) => {
    setSelectedNeedId(needId);
    navigate({ view: "watchlist" });
  }, [setSelectedNeedId, navigate]);

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

  useEffect(() => {
    if (view === "player" && sel && session) {
      loadPlayer(sel).catch(() => {});
    }
  }, [view, sel, session, loadPlayer, selectedNeedId]);

  if (showBootLoader) {
    return (
      <div className={`kx ${ar ? "lang-ar" : ""}`} dir={ar ? "rtl" : "ltr"} aria-hidden>
        <style>{CSS}</style>
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
            <Shell t={t} ar={ar} view={view} onSidebarNav={onSidebarNav}
              onLogout={onLogout}
              onClubChange={onClubChange}>
              {dataError && (
                <div className="panel" style={{ padding: 12, marginBottom: 12, color: "var(--signal)", fontSize: 13 }}>
                  {dataError}
                </div>
              )}
              {view === "watchlist" && (
                <MyPlayers t={t} ar={ar} players={players} needs={needs}
                  selectedNeedId={selectedNeedId} setSelectedNeedId={setSelectedNeedId}
                  selectedNeed={selectedNeed} loading={dataLoading}
                  updatePlayer={updatePlayer} onAdd={() => navigate({ view: "addplayer" })} onOpen={onOpenPlayer} />
              )}
              {view === "settings" && (
                <ClubNeedsSettings t={t} ar={ar} needs={needs} loading={dataLoading} onUseNeed={onUseNeed} />
              )}
              {view === "addplayer" && (
                <AddPlayer t={t} ar={ar} onSave={onAddPlayer} onCancel={() => navigate({ view: "watchlist" })} />
              )}
              {view === "player" && player && (
                <Player t={t} ar={ar} player={player} selectedNeed={selectedNeed}
                  updateReview={updateReview} updatePlayer={updatePlayer}
                  uploadClips={uploadClips}
                  deleteClip={deleteClip}
                  regenerateSummary={regenerateSummary}
                  loadPlayer={loadPlayer} />
              )}
            </Shell>
          )}
    </div>
  );
}
