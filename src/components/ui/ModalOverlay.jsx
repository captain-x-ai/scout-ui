import { useEffect } from "react";
import { createPortal } from "react-dom";

/** Full-screen backdrop; portals to body so position:fixed centering is reliable. */
export function ModalOverlay({ children, onBackdropClick, ar = false }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return createPortal(
    <div
      className={`overlay no-print${ar ? " lang-ar" : ""}`}
      dir={ar ? "rtl" : "ltr"}
      onClick={onBackdropClick}
      role="presentation"
    >
      {children}
    </div>,
    document.body,
  );
}
