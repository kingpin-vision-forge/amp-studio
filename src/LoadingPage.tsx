"use client";

import imgLogo from "./imports/logo.png";

export default function LoadingPage() {
  return (
    <div
      className="relative w-full h-screen overflow-hidden flex items-center"
      style={{
        background: "linear-gradient(123deg, rgb(11,11,11) 37.5%, rgb(2,4,23) 100%)",
      }}
    >
      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Logo */}
      <div
        className="animate-fade-up relative z-10 flex-shrink-0"
        style={{
          animationDelay: "0.1s",
          marginLeft: "clamp(3rem, 15vw, 20rem)",
          width: "clamp(200px, 22vw, 380px)",
        }}
      >
        <img
          src={imgLogo.src}
          alt="AMP Studio: Wedding & Event Photographer in Bijapur, Karnataka"
          className="w-full h-auto object-contain"
          style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.7))" }}
        />
      </div>

      {/* Divider line */}
      <div
        className="animate-fade-in relative z-10 self-stretch flex-shrink-0 mx-8 lg:mx-12"
        style={{ animationDelay: "0.5s" }}
      >
        <div
          className="h-full w-px opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent 10%, rgba(255,200,0,0.6) 40%, rgba(255,200,0,0.6) 60%, transparent 90%)",
          }}
        />
      </div>

      {/* Text block */}
      <div className="relative z-10 flex flex-col justify-center" style={{ fontFamily: "Italiana, serif" }}>
        {/* Line 1 */}
        <div
          className="animate-fade-up flex items-baseline gap-3"
          style={{ animationDelay: "0.45s" }}
        >
          <span
            className="text-white uppercase tracking-widest"
            style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)", lineHeight: 1.1 }}
          >
            THE
          </span>
          <span
            className="uppercase font-bold"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 6rem)",
              lineHeight: 1,
              color: "#ffc800",
              textShadow: "0 0 40px rgba(255,200,0,0.35)",
            }}
          >
            ESSENCE
          </span>
        </div>

        {/* Line 2 */}
        <div
          className="animate-fade-up flex items-baseline gap-3"
          style={{ animationDelay: "0.7s" }}
        >
          <span
            className="text-white italic"
            style={{
              fontFamily: "Italianno, serif",
              fontSize: "clamp(1.8rem, 4vw, 4rem)",
              lineHeight: 1.1,
            }}
          >
            of
          </span>
          <span
            className="text-white uppercase"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5.5rem)", lineHeight: 1.05 }}
          >
            PHOTOGRAPHY
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="animate-fade-in mt-8 overflow-hidden"
          style={{ animationDelay: "0.9s", maxWidth: "clamp(200px, 36vw, 580px)" }}
        >
          <div className="h-px w-full bg-white/10 relative">
            <div
              className="absolute inset-y-0 left-0 animate-progress animate-glow"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,200,0,0.15) 0%, #ffc800 60%, #fff6c0 100%)",
                animationDelay: "1s, 3.8s",
              }}
            />
          </div>
          <p
            className="animate-fade-in mt-3 text-white/30 uppercase tracking-[0.25em] text-xs"
            style={{ animationDelay: "1.4s", fontFamily: "Italiana, serif" }}
          >
            Loading gallery…
          </p>
        </div>
      </div>
    </div>
  );
}
