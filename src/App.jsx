import { useEffect, useState } from "react";
import { CSS } from "./styles/globalCss";
import { T } from "./i18n/translations";
import { useAuth } from "./context/AuthContext";
import { useSession } from "./context/SessionContext";
import { useAppData } from "./data/useAppData";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { getDossier } from "./api/players.api";
import { Login } from "./components/Login";
import { Shell } from "./components/Shell";
import { MyPlayers } from "./components/MyPlayers";
import { AddPlayer } from "./components/AddPlayer";
import { Player } from "./components/Player";
import { Report } from "./components/Report";

function detectLang() {
  const stored = localStorage.getItem("captainx_lang");
  if (stored === "ar" || stored === "en") return stored;
  return (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
}

export default function App() {
  const [lang, setLang] = useState(detectLang);
  const [dossier, setDossier] = useState(null);
  const [dossierLoading, setDossierLoading] = useState(false);

  const { isAuthenticated, loading: authLoading, logout } = useAuth();
  const session = useSession();
  const { view, sel, navigate, resetToLogin } = useAppNavigation({ isAuthenticated, authLoading });
  const {
    players, need, loading: dataLoading, error: dataError,
    getPlayerView, loadPlayer, addPlayer, updatePlayer, updateReview,
    uploadClips, regenObservation,
  } = useAppData();

  const t = T[lang];
  const ar = lang === "ar";
  const player = sel ? getPlayerView(sel) : null;

  useEffect(() => {
    if ((view === "player" || view === "report") && sel && session) {
      loadPlayer(sel).catch(() => {});
    }
  }, [view, sel, session, loadPlayer]);

  useEffect(() => {
    if (view !== "report" || !sel || !session) return;
    setDossierLoading(true);
    getDossier(session, sel)
      .then(setDossier)
      .catch(() => setDossier(null))
      .finally(() => setDossierLoading(false));
  }, [view, sel, session]);

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
    setDossier(null);
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
        ? <Login t={t} lang={lang} setLang={(l) => { localStorage.setItem("captainx_lang", l); setLang(l); }} />
        : !session
          ? (
            <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
              <div className="panel" style={{ padding: 32, maxWidth: 420 }}>
                <div style={{ color: "var(--cream)", marginBottom: 12 }}>No scout club membership found for this account.</div>
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
                  uploadClips={uploadClips} regenObservation={regenObservation}
                  loadPlayer={loadPlayer}
                  goReport={() => navigate({ view: "report", playerId: sel })} />
              )}
              {view === "report" && player && (
                <Report t={t} ar={ar} player={player} players={players} dossier={dossier}
                  dossierLoading={dossierLoading} setSel={(id) => navigate({ view: "player", playerId: id })}
                  onBack={() => navigate({ view: "player", playerId: sel })} />
              )}
            </Shell>
          )}
    </div>
  );
}
