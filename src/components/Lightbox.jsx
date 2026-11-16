import React, { useEffect } from "react";

export default function Lightbox({ src, onClose }) {
  useEffect(() => {
    if (!src) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [src, onClose]);
  if (!src) return null;
  return (
    <div className="lightbox" onClick={onClose} role="dialog">
      <img src={src} alt="" />
      <button className="lb-x" aria-label="close">×</button>
    </div>
  );
}
