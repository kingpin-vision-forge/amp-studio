"use client";

import { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";
import Home from "./Home";

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 3800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Loading screen, fades out after 3.8s */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          opacity: loaded ? 0 : 1,
          pointerEvents: loaded ? "none" : "auto",
          transition: "opacity 1s ease",
        }}
      >
        <LoadingPage />
      </div>

      {/* Home, fades in once loading finishes */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease 0.3s",
        }}
      >
        <Home loaded={loaded} />
      </div>
    </>
  );
}
