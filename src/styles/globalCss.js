/* ============================== DESIGN SYSTEM ============================== */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fustat:wght@400;500;600;700;800&family=Noto+Kufi+Arabic:wght@400;500;600;700;800&display=swap');

:root{
  /* CaptainX core */
  --primary:#683FEA; --primary-bright:#8C6BFF; --navy:#100459;
  --accent:#8C6BFF; --accent-bright:#A98CFF;     /* CaptainX for Scouts accent — brand light purple (in-family) */
  /* surfaces (derived from navy) */
  --bg:#070218; --panel:#120932; --panel2:#190F43; --elevated:#221553;
  --line:rgba(140,107,255,.20); --line2:rgba(255,255,255,.07);
  --cream:#F4F2FB; --muted:#9D96C8; --muted2:#6B639C;
  /* semantic */
  --good:#2FCB7E; --warn:#E8A13A; --pass:#E5566B;
  --signal:#F2802E; --signal-bg:rgba(242,128,46,.13);
  /* legacy aliases → mapped to brand so existing markup stays consistent */
  --green:var(--primary); --green-bright:var(--primary-bright); --green-deep:#1B1049;
  --gold:var(--accent); --gold-bright:var(--accent-bright);
}
*{box-sizing:border-box}
.kx{font-family:'Fustat',system-ui,sans-serif;background:
  radial-gradient(1000px 680px at 88% -12%, rgba(104,63,234,.28), transparent 60%),
  radial-gradient(760px 560px at -8% 112%, rgba(140,107,255,.12), transparent 55%),
  var(--bg);
  color:var(--cream);min-height:100vh;-webkit-font-smoothing:antialiased;letter-spacing:0}
.kx.lang-ar{font-family:'Noto Kufi Arabic',sans-serif}
/* display + data both ride on Fustat per brand; .serif = display weight, .mono = tabular figures */
.serif{font-family:'Fustat',sans-serif;font-weight:800;letter-spacing:.01em}
.mono{font-family:'Fustat',sans-serif;font-variant-numeric:tabular-nums;font-feature-settings:"tnum"}
.kx.lang-ar .serif{font-family:'Noto Kufi Arabic',sans-serif;font-weight:800}
.kx.lang-ar .mono{font-family:'Noto Kufi Arabic',sans-serif}

/* brand texture (subtle alpha-ribbon grid) */
.geo{position:absolute;inset:0;opacity:.5;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='14' fill='none' stroke='%238C6BFF' stroke-width='.5' opacity='.16'/%3E%3C/svg%3E");
  background-size:64px 64px}

.btn{font-family:inherit;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:8px;
  border-radius:10px;font-weight:700;font-size:13.5px;transition:.18s;letter-spacing:.2px}
.btn-gold{background:var(--accent);color:#15093A;padding:11px 18px}
.btn-gold:hover{background:var(--accent-bright);transform:translateY(-1px)}
.btn-green{background:var(--primary);color:#f3eeff;padding:10px 16px}
.btn-green:hover{background:var(--primary-bright)}
.btn-ghost{background:transparent;color:var(--muted);border:1px solid var(--line);padding:9px 14px}
.btn-ghost:hover{color:var(--cream);border-color:var(--accent)}
.btn-ghost.on{color:#15093A;background:var(--accent);border-color:var(--accent)}

.panel{background:var(--panel);
  border:1px solid var(--line2);border-radius:16px}
.tag{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;
  padding:4px 9px;border-radius:999px;display:inline-flex;align-items:center;gap:5px}
.hover-row{transition:.15s}
.hover-row:hover{background:rgba(140,107,255,.08)}
.fade{animation:fade .5s ease both}
@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.pop{animation:pop .45s cubic-bezier(.2,.9,.3,1.3) both}
@keyframes pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.stagger>*{animation:fade .5s ease both}
.stagger>*:nth-child(1){animation-delay:.04s}.stagger>*:nth-child(2){animation-delay:.10s}
.stagger>*:nth-child(3){animation-delay:.16s}.stagger>*:nth-child(4){animation-delay:.22s}
.stagger>*:nth-child(5){animation-delay:.28s}.stagger>*:nth-child(6){animation-delay:.34s}
input,select,textarea{font-family:inherit}
.sel{background:var(--panel2);color:var(--cream);border:1px solid var(--line2);border-radius:10px;
  padding:9px 12px;font-size:13px;font-weight:600;outline:none;cursor:pointer;appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239D96C8' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 11px center;padding-inline-end:30px}
.kx.lang-ar .sel{background-position:left 11px center;padding-inline-end:12px;padding-inline-start:30px}
.sel:hover{border-color:var(--accent)}
.sel-mini{padding:5px 9px;font-size:11.5px;border-radius:8px;background-position:right 8px center;padding-inline-end:24px}
.kx.lang-ar .sel-mini{background-position:left 8px center;padding-inline-end:9px;padding-inline-start:24px}
.kanban-col{background:var(--panel);border:1px solid var(--line2);border-radius:14px;padding:12px;min-width:0}
.kcard{background:var(--panel2);border:1px solid var(--line2);border-radius:11px;padding:12px;cursor:pointer;transition:.15s;margin-bottom:10px}
.kcard:hover{border-color:var(--accent);transform:translateY(-2px)}
.fld{width:100%;background:var(--panel2);color:var(--cream);border:1px solid var(--line2);border-radius:10px;
  padding:11px 13px;font-size:14px;outline:none;transition:.15s}
.fld:focus{border-color:var(--accent)}
.fld-label{font-size:11.5px;letter-spacing:.5px;text-transform:uppercase;color:var(--muted);margin-bottom:7px;display:block}
.overlay{position:fixed;inset:0;background:rgba(7,2,24,.72);backdrop-filter:blur(4px);z-index:50;
  overflow-y:auto;-webkit-overflow-scrolling:touch;padding:24px;
  display:flex;align-items:flex-start;justify-content:center;
  color:var(--cream);font-family:'Fustat',system-ui,sans-serif;
  animation:overlayIn .25s ease both}
.overlay-cinema{background:rgba(4,1,14,.88);backdrop-filter:blur(14px) saturate(1.2);
  align-items:center;padding:20px}
.overlay-cinema::before{content:"";position:fixed;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 80% 60% at 50% 40%, rgba(104,63,234,.18), transparent 70%)}
.overlay.lang-ar{font-family:'Noto Kufi Arabic',sans-serif}
.overlay.lang-ar .serif{font-family:'Noto Kufi Arabic',sans-serif;font-weight:800}
.overlay.lang-ar .mono{font-family:'Noto Kufi Arabic',sans-serif}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
.modal{width:100%;max-width:620px;max-height:calc(100vh - 48px);overflow:auto;margin:auto;flex-shrink:0}
.flagpick{width:42px;height:42px;border-radius:11px;border:1px solid var(--line2);background:var(--panel2);
  font-size:20px;cursor:pointer;transition:.15s}
.flagpick:hover{border-color:var(--gold)}
.flagpick.on{border-color:var(--gold);background:rgba(140,107,255,.16)}
.scrolly::-webkit-scrollbar{width:8px;height:8px}
.scrolly::-webkit-scrollbar-thumb{background:rgba(140,107,255,.2);border-radius:8px}
.nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:11px;
  cursor:pointer;color:var(--muted);font-weight:600;font-size:14px;transition:.15s}
.nav-item:hover{color:var(--cream);background:rgba(255,255,255,.03)}
.nav-item.active{color:var(--accent-bright);background:rgba(104,63,234,.16)}
.kx.lang-ar .nav-item.active{background:rgba(104,63,234,.16)}
.spin{animation:sp 1s linear infinite}@keyframes sp{to{transform:rotate(360deg)}}
@keyframes uploadPulse{from{width:22%;opacity:.65}to{width:48%;opacity:1}}

/* Hero video dialog */
.video-hero-dialog{width:min(94vw,960px);margin:auto;flex-shrink:0;position:relative;z-index:1}
.video-hero-stage{position:relative;border-radius:20px;overflow:hidden;
  background:#000;border:1px solid rgba(140,107,255,.35);
  box-shadow:0 0 0 1px rgba(255,255,255,.04),0 24px 80px rgba(0,0,0,.55),0 0 120px rgba(104,63,234,.22);
  aspect-ratio:16/9;max-height:min(78vh,720px)}
.video-hero-glow{position:absolute;inset:-40% -20%;pointer-events:none;z-index:0;
  background:radial-gradient(ellipse at 50% 100%, rgba(140,107,255,.35), transparent 55%)}
.video-hero-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;
  filter:saturate(1.05) brightness(.92)}
.video-hero-loader{position:absolute;inset:0;z-index:3;display:grid;place-items:center;
  background:rgba(0,0,0,.35);backdrop-filter:blur(2px)}
.video-hero-player{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:2;
  opacity:0;transition:opacity .35s ease;background:#000}
.video-hero-player.is-ready{opacity:1}
.video-hero-vignette{position:absolute;inset:0;z-index:3;pointer-events:none;
  background:linear-gradient(to top, rgba(7,2,24,.85) 0%, rgba(7,2,24,.25) 28%, transparent 52%)}
.video-hero-close{position:absolute;top:14px;inset-inline-end:14px;z-index:5;
  width:40px;height:40px;border-radius:999px;border:1px solid rgba(255,255,255,.14);
  background:rgba(7,2,24,.55);color:var(--cream);cursor:pointer;display:grid;place-items:center;
  backdrop-filter:blur(8px);transition:transform .18s,background .18s,border-color .18s}
.video-hero-close:hover{transform:scale(1.06);background:rgba(104,63,234,.45);border-color:rgba(140,107,255,.5)}
.video-hero-caption{position:absolute;inset-inline:0;bottom:0;z-index:4;padding:20px 22px 18px;
  pointer-events:none}
.video-hero-caption-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.video-hero-tag{color:var(--cream)!important;background:rgba(255,255,255,.1)!important;
  border:1px solid rgba(255,255,255,.12)}
.video-hero-score{font-size:22px;font-weight:700;color:var(--cream);line-height:1}
.video-hero-date{display:inline-flex;align-items:center;gap:7px;font-size:12px;color:rgba(244,242,251,.75)}
.video-hero-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;
  margin-top:14px;padding:0 4px;flex-wrap:wrap}
.video-hero-ident{display:flex;align-items:center;gap:8px;flex:1;min-width:0;font-size:13px;
  color:var(--muted);line-height:1.45}
.video-hero-ident-label{color:var(--accent);font-weight:700;font-size:11px;letter-spacing:.5px;text-transform:uppercase}
.video-hero-dismiss{flex-shrink:0;padding:9px 16px}

.app-preloader{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;
  padding:24px;text-align:center}
.app-preloader-full{position:fixed;inset:0;z-index:100;min-height:100vh;width:100%}
.app-preloader-glow{position:absolute;width:min(360px,78vw);height:min(360px,78vw);border-radius:999px;
  background:radial-gradient(circle, rgba(104,63,234,.32), transparent 68%);pointer-events:none;
  animation:preloaderGlow 2.4s ease-in-out infinite alternate}
.app-preloader{position:relative}
.app-preloader-gif{position:relative;z-index:1;display:block;width:min(280px,62vw);height:auto;
  object-fit:contain;filter:drop-shadow(0 16px 40px rgba(104,63,234,.4))}
.app-preloader-msg{position:relative;z-index:1;margin:0;font-size:14px;font-weight:600;
  color:var(--muted);letter-spacing:.2px}
@keyframes preloaderGlow{from{opacity:.55;transform:scale(.92)}to{opacity:1;transform:scale(1.05)}}
@media(max-width:640px){
  .video-hero-stage{border-radius:14px;max-height:56vh}
  .video-hero-caption{padding:14px 14px 12px}
  .video-hero-close{top:10px;inset-inline-end:10px;width:36px;height:36px}
}
@media print{.no-print{display:none!important}.kx{background:#fff!important;color:#111!important}}
`;
