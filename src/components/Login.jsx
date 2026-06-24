import { Globe, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { LOGO_FULL } from "../assets/logos";
import { FakeField } from "./ui/FakeField";

export function Login({ t, lang, setLang, onEnter }) {
  return (
    <div className="fade" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 24 }}>
      <div className="geo" />
      <button className="btn btn-ghost no-print" onClick={() => setLang(lang === "en" ? "ar" : "en")}
        style={{ position: "absolute", top: 22, insetInlineEnd: 22 }}><Globe size={15} />{lang === "en" ? "العربية" : "English"}</button>
      <div className="panel pop" style={{ width: "100%", maxWidth: 440, padding: "40px 38px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <img src={LOGO_FULL} alt="CaptainX" style={{ width: "92%", height: "auto", display: "block", margin: "0 auto 12px" }} />
        <div style={{ color: "var(--accent)", fontSize: 14, marginBottom: 26, fontWeight: 700, letterSpacing: 1 }}>{t.product}</div>
        <div style={{ textAlign: "start", marginBottom: 18 }}>
          <FakeField label={t.scoutName} icon={<Users size={15} />} />
          <div style={{ height: 12 }} />
          <FakeField label="••••••••••" icon={<ShieldCheck size={15} />} />
        </div>
        <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center", padding: 13 }} onClick={onEnter}>
          {t.signin}<ArrowRight size={16} style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
        </button>
        <div style={{ marginTop: 18, fontSize: 11, color: "var(--muted2)", letterSpacing: .5 }}>
          {t.role} · {t.scoutName}
        </div>
      </div>
    </div>
  );
}
