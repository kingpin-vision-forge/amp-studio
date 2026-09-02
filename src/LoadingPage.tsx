"use client";

const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function LoadingPage() {
  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-6 md:p-12 select-none"
      style={{ background: "#000000" }}
    >
      {/* Viewfinder Camera Brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none" />

      {/* Viewfinder Top Bar Metadata */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ffc800] animate-ping" />
          <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-[0.2em] uppercase">
            REC · AMP STUDIO
          </span>
        </div>
        <div style={{ ...mono }} className="text-xs text-white/40 tracking-[0.2em] uppercase hidden md:block">
          BIJAPUR, KARNATAKA · 16.8247° N, 75.7154° E
        </div>
        <div style={{ ...mono }} className="text-xs text-white/50 tracking-[0.2em] uppercase">
          ISO 100 · f/1.4 · 1/1000s
        </div>
      </div>

      {/* Center Cinematic Camera Showcase */}
      <div className="relative z-10 my-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full max-w-6xl mx-auto">
        {/* Left: Brand Animated GIF Logo (Seamless on #000000) */}
        <div className="w-48 md:w-72 flex-shrink-0 relative group">
          <img
            src="/amp-studio-logo.gif"
            alt="AMP Studio Logo"
            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Center Vertical Divider Line */}
        <div className="hidden md:block w-px h-44 bg-gradient-to-b from-transparent via-[#ffc800]/40 to-transparent" />

        {/* Right: Typography Showcase with Clean Word Spacing */}
        <div className="flex flex-col justify-center text-center md:text-left">
          {/* 3 Years Legacy Pill */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
            <span
              style={{ ...mono }}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[1rem] tracking-[1.25em] uppercase text-[#ffc800]"
            >
              <span className="w-1.5 h-1.5" />
              3 YEARS OF EXCELLENCE
            </span>
          </div>

          <div
            style={{ ...serif }}
            className="text-xl md:text-2xl font-medium text-white tracking-widest uppercase leading-tight"
          >
            CAPTURING
          </div>

          {/* Line 1: THE */}
          <div
            style={{ ...serif }}
            className="text-4xl md:text-6xl font-light text-white tracking-widest uppercase leading-tight"
          >
            THE
          </div>

          {/* Line 2: ESSENCE in Gold Script */}
          <div
            style={{ ...serif }}
            className="text-6xl md:text-8xl text-[#ffc800] -mt-2 -mb-2 font-normal leading-none"
          >
            ESSENCE
          </div>

          {/* Line 3: of PHOTOGRAPHY with Generous Spacing */}
          <div className="flex items-baseline justify-center md:justify-start gap-4 md:gap-6 mt-1">
            <span
              style={{ ...script }}
              className="text-2xl md:text-4xl text-white/70 italic font-light mr-2 md:mr-4"
            >
              of
            </span>
            <span
              style={{ ...serif }}
              className="text-3xl md:text-5xl font-light text-white tracking-[0.18em] uppercase"
            >
              PHOTOGRAPHY
            </span>
          </div>
          <span
              style={{ ...serif }}
              className="text-xl md:text-2xl font-light text-white tracking-[0.18em] uppercase"
            >
              in BIJAPUR
            </span>
        </div>
      </div>

      {/* Bottom Metadata Footer */}
      <div className="relative z-10 w-full flex justify-between items-center text-[0.65rem] font-mono text-white/30 tracking-[0.2em] uppercase">
        <span className="text-[#ffc800]/70">BIJAPUR · 3 YEARS CELEBRATION</span>
        <span>READY FOR SHUTTER RELEASE</span>
      </div>
    </div>
  );
}
