import { useState } from "react";
import { CSS } from "./styles/globalCss";
import { T } from "./i18n/translations";
import { usePlayers } from "./data/usePlayers";
import { getOpenNeed } from "./api/needs.api";
import { Login } from "./components/Login";
import { Shell } from "./components/Shell";
import { MyPlayers } from "./components/MyPlayers";
import { AddPlayer } from "./components/AddPlayer";
import { Player } from "./components/Player";
import { Report } from "./components/Report";

export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("login");
  const { players, updateReview, updatePlayer, addPlayer } = usePlayers();
  const [sel, setSel] = useState("p1");
  const t = T[lang];
  const ar = lang === "ar";
  const player = players.find((p) => p.id === sel);
  const need = getOpenNeed();

  // Onboard a new player, then select + navigate to it (nav stays here in App;
  // the data mutation lives in usePlayers).
  const onAddPlayer = (data) => {
    const id = addPlayer(data);
    setSel(id); setView("player");
  };

  return (
    <div className={`kx ${ar ? "lang-ar" : ""}`} dir={ar ? "rtl" : "ltr"}>
      <style>{CSS}</style>
      {view === "login"
        ? <Login t={t} lang={lang} setLang={setLang} onEnter={() => setView("watchlist")} />
        : <Shell t={t} ar={ar} lang={lang} setLang={setLang} view={view} setView={setView} selName={ar ? player?.nameAr : player?.name}>
            {view === "watchlist" && <MyPlayers t={t} ar={ar} players={players} need={need}
              updatePlayer={updatePlayer} onAdd={() => setView("addplayer")} onOpen={(id) => { setSel(id); setView("player"); }} />}
            {view === "addplayer" && <AddPlayer t={t} ar={ar} onSave={onAddPlayer} onCancel={() => setView("watchlist")} />}
            {view === "player" && <Player t={t} ar={ar} player={player} need={need}
              updateReview={updateReview} updatePlayer={updatePlayer}
              goReport={() => setView("report")} />}
            {view === "report" && <Report t={t} ar={ar} player={player} players={players} setSel={setSel} onBack={() => setView("player")} />}
          </Shell>}
    </div>
  );
}
