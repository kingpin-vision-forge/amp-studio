"use client";

import { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";
import Home from "./Home";

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [shutterState, setShutterState] = useState<"loading" | "closing" | "closed" | "opening" | "done">("loading");

  useEffect(() => {
    // 1. Play loading page for 3.0 seconds
    const t1 = setTimeout(() => {
      setShutterState("closing");
    }, 3000);

    // 2. At 3.3s (when shutter blades meet in center): activate Home underneath
    const t2 = setTimeout(() => {
      setShutterState("closed");
      setLoaded(true);
    }, 3300);

    // 3. At 3.4s: Shutter blades slide open, revealing Home page
    const t3 = setTimeout(() => {
      setShutterState("opening");
    }, 3400);

    // 4. At 4.2s: Retract shutter completely
    const t4 = setTimeout(() => {
      setShutterState("done");
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <>
      {/* Loading Page (Unmounts after shutter transition) */}
      {shutterState !== "done" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            opacity: shutterState === "opening" || shutterState === "closed" ? 0 : 1,
            pointerEvents: loaded ? "none" : "auto",
            transition: "opacity 0.3s ease",
          }}
        >
          <LoadingPage />
        </div>
      )}

      {/* Camera Shutter Blades Transition */}
      {shutterState !== "done" && (
        <>
          {/* Top Shutter Blade */}
          <div
            className="fixed top-0 left-0 right-0 h-1/2 z-[110] bg-[#000000] border-b border-[#222222] shadow-2xl pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{
              transform:
                shutterState === "closing" || shutterState === "closed"
                  ? "translateY(0%)"
                  : "translateY(-100%)",
            }}
          />
          {/* Bottom Shutter Blade */}
          <div
            className="fixed bottom-0 left-0 right-0 h-1/2 z-[110] bg-[#000000] border-t border-[#222222] shadow-2xl pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
            style={{
              transform:
                shutterState === "closing" || shutterState === "closed"
                  ? "translateY(0%)"
                  : "translateY(100%)",
            }}
          />
        </>
      )}

      {/* Home Page */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <Home loaded={loaded} />
      </div>
    </>
  );
}
