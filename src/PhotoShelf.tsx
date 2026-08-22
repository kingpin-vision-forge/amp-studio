"use client";

import { useState, useRef, useEffect } from "react";

export interface ShelfItem {
  num: string;
  title: string;
  meta: string;
  image: string;
  desc?: string;
  location?: string;
  photos?: string[];
}

const GOLD = "#ffc800";
const BG_DARK = "#0f0f0f";
const WHITE = "#f5f0e8";
const MUTED = "#888882";
const BORDER = "#1e1e1e";

const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function PhotoShelf({ items }: { items: ShelfItem[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [coverOpen, setCoverOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  // Open modal handler
  const handleOpenBook = (index: number) => {
    setSelectedIdx(index);
    setActivePhotoIdx(0);
    setTimeout(() => setCoverOpen(true), 50);
  };

  // Close modal handler
  const handleCloseBook = () => {
    setCoverOpen(false);
    setTimeout(() => {
      setSelectedIdx(null);
    }, 400);
  };

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedIdx !== null) {
        handleCloseBook();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIdx]);

  return (
    <div className="w-full relative py-8">
      {/* 3D Shelf Container */}
      <div className="w-full relative" style={{ perspective: "1200px" }}>
        {/* Grid of 3D Photo Books */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10 pb-8">
          {items.map((item, idx) => (
            <Book3DCard
              key={idx}
              item={item}
              onClick={() => handleOpenBook(idx)}
            />
          ))}
        </div>

        {/* Glossy Studio Shelf Line */}
        <div className="w-full h-4 relative mt-2 rounded-full overflow-hidden border-t border-white/10 bg-gradient-to-r from-transparent via-[#1c1c1c] to-transparent shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Meng To Style Interactive Opened Book Showcase Modal */}
      {selectedItem && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 transition-all duration-500 ${
            coverOpen ? "bg-black/90 backdrop-blur-xl opacity-100" : "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
          }`}
        >
          {/* Modal Container */}
          <div className="relative w-full max-w-5xl h-[82vh] max-h-[720px] flex flex-col justify-between p-4 md:p-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center z-20 mb-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 text-[0.65rem] font-mono text-[#ffc800] tracking-widest">
                  ALBUM {selectedItem.num}
                </span>
                <span style={{ ...serif }} className="text-xl text-white font-light">
                  {selectedItem.title}
                </span>
              </div>
              <button
                onClick={handleCloseBook}
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-colors text-lg"
              >
                ✕
              </button>
            </div>

            {/* 3D Opened Book Spread */}
            <div className="flex-1 w-full relative flex items-center justify-center my-auto" style={{ perspective: "1600px" }}>
              <div
                className={`relative w-full max-w-4xl h-[55vh] max-h-[480px] rounded-2xl shadow-2xl transition-all duration-700 ease-out flex overflow-hidden border border-white/10 bg-[#121212] ${
                  coverOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Left Page: Album Info & Details */}
                <div className="w-1/2 h-full p-6 md:p-10 flex flex-col justify-between border-r border-white/10 bg-gradient-to-br from-[#161616] to-[#0e0e0e] relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span style={{ ...mono }} className="text-xs text-[#888882] tracking-widest uppercase">
                        {selectedItem.meta}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#ffc800]" />
                      <span style={{ ...mono }} className="text-xs text-[#888882] tracking-widest uppercase">
                        Bijapur, Karnataka
                      </span>
                    </div>

                    <h3 style={{ ...serif }} className="text-3xl md:text-4xl text-white font-light mb-4 leading-tight">
                      {selectedItem.title} <em style={{ ...script }} className="text-[#ffc800]">Collection</em>
                    </h3>

                    <p className="text-sm text-[#888882] leading-relaxed mb-6 font-sans">
                      {selectedItem.desc ||
                        "Full collection of candid photography captured in natural light across Bijapur and North Karnataka. Preserving timeless emotions and authentic moments."}
                    </p>
                  </div>

                  {/* Thumbnails list */}
                  <div>
                    <div style={{ ...mono }} className="text-[0.65rem] text-[#888882] uppercase tracking-widest mb-3">
                      Gallery Shots ({activePhotoIdx + 1} / 3)
                    </div>
                    <div className="flex gap-2">
                      {[selectedItem.image, selectedItem.image + "&auto=compress", selectedItem.image + "&fit=crop"].map(
                        (imgSrc, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setActivePhotoIdx(pIdx)}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              activePhotoIdx === pIdx ? "border-[#ffc800] scale-105" : "border-white/10 opacity-50 hover:opacity-100"
                            }`}
                          >
                            <img src={imgSrc} alt="Thumbnail" className="w-full h-full object-cover" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Page: Full Photo Preview */}
                <div className="w-1/2 h-full relative bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Caption Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono text-white/80 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                    <span>AMP Studio Original</span>
                    <span className="text-[#ffc800]">{selectedItem.title}</span>
                  </div>
                </div>

                {/* Hinged Cover (Opens to the left) */}
                <div
                  className="absolute inset-y-0 left-0 w-1/2 z-30 transition-transform duration-700 ease-in-out pointer-events-none rounded-l-2xl overflow-hidden border-r border-white/20 shadow-2xl"
                  style={{
                    transformOrigin: "left center",
                    transform: coverOpen ? "rotateY(-150deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img src={selectedItem.image} alt="Cover" className="w-full h-full object-cover filter brightness-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-8 flex flex-col justify-between">
                    <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
                      {"{ "}{selectedItem.num}{" }"} · AMP Studio
                    </span>
                    <div>
                      <h4 style={{ ...serif }} className="text-3xl text-white font-light">
                        {selectedItem.title}
                      </h4>
                      <p style={{ ...mono }} className="text-xs text-white/60 tracking-widest uppercase mt-1">
                        {selectedItem.meta}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Modal Hint */}
            <div className="flex justify-between items-center z-20 text-xs font-mono text-white/40 tracking-widest uppercase pt-2">
              <span>AMP Studio Album Showcase</span>
              <span>Press ESC or click ✕ to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* 3D Photo Book Card Component with Realistic Depth & Glare */
function Book3DCard({ item, onClick }: { item: ShelfItem; onClick: () => void }) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 18;
    const rotateX = -((y - centerY) / centerY) * 14;

    setRotY(rotateY);
    setRotX(rotateX);
    setGlarePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer select-none"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Book Container */}
      <div
        className="w-full aspect-[3/4] relative rounded-xl transition-all duration-300 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isHovered
            ? `translateY(-16px) translateZ(30px) rotateX(${rotX}deg) rotateY(${rotY - 18}deg) scale(1.04)`
            : "translateY(0px) translateZ(0px) rotateX(0deg) rotateY(-12deg) scale(1)",
          boxShadow: isHovered
            ? "-20px 30px 45px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 200, 0, 0.15)"
            : "-10px 15px 25px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Front Cover */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden border border-white/15 bg-[#141414] flex flex-col justify-between p-5"
          style={{
            transform: "translateZ(12px)",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Background Photo */}
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

          {/* Dynamic Glare Reflection */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.35 : 0,
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.6) 0%, transparent 60%)`,
            }}
          />

          {/* Top Metadata */}
          <div className="relative z-10 flex justify-between items-center">
            <span style={{ ...mono }} className="text-[0.65rem] text-[#ffc800] tracking-widest uppercase">
              {"{ "}{item.num}{" }"}
            </span>
            <span style={{ ...mono }} className="text-[0.65rem] text-white/70 tracking-widest uppercase bg-black/50 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
              {item.meta}
            </span>
          </div>

          {/* Bottom Title Badge */}
          <div className="relative z-10">
            <h3 style={{ ...serif }} className="text-2xl text-white font-light tracking-tight group-hover:text-[#ffc800] transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span style={{ ...mono }} className="text-[0.6rem] text-white/60 uppercase tracking-wider">
                Click to explore album →
              </span>
            </div>
          </div>
        </div>

        {/* 3D Spine (Left Edge) */}
        <div
          className="absolute inset-y-0 left-0 w-[24px] bg-[#1a1a1a] border-y border-l border-white/20 flex items-center justify-center rounded-l-md"
          style={{
            transform: "rotateY(-90deg) translateZ(12px)",
            transformOrigin: "left center",
          }}
        >
          <span style={{ ...mono }} className="text-[0.55rem] text-[#ffc800] tracking-widest uppercase rotate-90 whitespace-nowrap">
            {item.title}
          </span>
        </div>

        {/* 3D Page Stack (Right Edge) */}
        <div
          className="absolute inset-y-1 right-0 w-[20px] bg-[#dfd9ce] border-y border-r border-[#b0a99c] rounded-r-sm"
          style={{
            transform: "rotateY(90deg) translateZ(10px)",
            transformOrigin: "right center",
            backgroundImage: "linear-gradient(to right, #ccc 1px, transparent 1px)",
            backgroundSize: "3px 100%",
          }}
        />

        {/* Back Cover */}
        <div
          className="absolute inset-0 bg-[#0c0c0c] rounded-xl border border-white/10"
          style={{ transform: "translateZ(-12px)" }}
        />
      </div>
    </div>
  );
}
