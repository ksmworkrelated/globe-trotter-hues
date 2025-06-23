import { useEffect, useState } from "react";

/**
 * MapTransition: Handles fade-in/fade-out and only unmounts children after fade-out.
 * Usage: <MapTransition show={showMap}><LeafletMap ... /></MapTransition>
 */
export function MapTransition({ show, duration = 1600, children }) {
  const [shouldRender, setShouldRender] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 10); // allow mount before fade-in
    } else {
      setVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);

  if (!shouldRender) return null;
  return (
    <div
      style={{
        transition: `opacity ${duration}ms`,
        opacity: visible ? 1 : 0,
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}
