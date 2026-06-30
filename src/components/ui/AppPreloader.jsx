/** Full-screen boot loader (auth + initial data). Not for inline/video use. */
export function AppPreloader({ message }) {
  return (
    <div className="app-preloader app-preloader-full" role="status" aria-live="polite" aria-busy="true">
      <div className="app-preloader-glow" aria-hidden />
      <img
        src="/preloader.gif"
        alt=""
        className="app-preloader-gif"
        decoding="async"
      />
      {message ? <p className="app-preloader-msg">{message}</p> : null}
    </div>
  );
}
