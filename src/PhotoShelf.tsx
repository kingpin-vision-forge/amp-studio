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

export default function PhotoShelf({
  items,
  onPhotoClick,
}: {
  items: ShelfItem[];
  onPhotoClick?: (item: { image: string; title: string; category?: string; location?: string }) => void;
}) {
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

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scrollSlider = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = 320;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Duplicate items to ensure a seamless infinite sliding track
  const carouselItems = [...items, ...items];

  return (
    <div className="w-full relative py-6 select-none">
      {/* Top Controls Bar: Badge + Navigation Arrows */}
      {/* 3D Sliding Shelf Container */}
      <div
        className="w-full relative overflow-hidden pause-on-hover pt-10 pb-6"
        style={{ perspective: "1200px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Horizontal Scroll / Sliding Track */}
        <div
          ref={sliderRef}
          className="w-full overflow-x-auto hide-scrollbar scroll-smooth pt-8 pb-10"
        >
          <div
            className="animate-slide-shelf gap-8 md:gap-10 px-6 py-2"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {carouselItems.map((item, idx) => (
              <div
                key={`${item.num}-${idx}`}
                className="w-[240px] sm:w-[270px] md:w-[290px] flex-shrink-0 pt-3 pb-2"
              >
                <Book3DCard
                  item={item}
                  onClick={() => handleOpenBook(idx % items.length)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Left & Right Vignette Fade Gradients */}
        <div className="absolute top-0 bottom-6 left-0 w-16 md:w-28 bg-gradient-to-r from-[#0b0b0b] to-transparent pointer-events-none z-10" />

        {/* Glossy Studio Shelf Line */}
        <div className="w-full h-3.5 relative mt-2 rounded-full overflow-hidden border-t border-white/15 bg-gradient-to-r from-transparent via-[#222222] to-transparent shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
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

                {/* Right Page: Full Photo Preview (Click to view full photo separately) */}
                <div
                  className="w-1/2 h-full relative bg-black flex items-center justify-center overflow-hidden cursor-pointer group/photo"
                  onClick={() => {
                    onPhotoClick?.({
                      image: selectedItem.image.replace("w=900", "w=1800"),
                      title: selectedItem.title,
                      category: `Collection · ${selectedItem.meta}`,
                      location: "Bijapur, Karnataka",
                    });
                  }}
                  title="Click to view photo separately"
                >
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Caption Badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs font-mono text-white/80 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg border border-white/10">
                    <span className="flex items-center gap-1.5">
                      <span>AMP Studio Original</span>
                      <span className="text-[0.6rem] text-[#ffc800] tracking-widest uppercase ml-1 opacity-70">
                        [Click to enlarge]
                      </span>
                    </span>
                    <span className="text-[#ffc800]">{selectedItem.title}</span>
                  </div>
                </div>

                {/* Clean Book Spine Joint Accent */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/10 z-20 pointer-events-none" />
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
            ? `translateY(-10px) translateZ(20px) rotateX(${rotX * 0.7}deg) rotateY(${rotY * 0.7 - 6}deg) scale(1.02)`
            : "translateY(0px) translateZ(0px) rotateX(0deg) rotateY(-5deg) scale(1)",
          boxShadow: isHovered
            ? "-14px 20px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 200, 0, 0.15)"
            : "-6px 10px 18px rgba(0, 0, 0, 0.6)",
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
          className="absolute inset-y-0 left-0 w-[18px] bg-[#1a1a1a] border-y border-l border-white/20 flex items-center justify-center rounded-l-sm overflow-hidden"
          style={{
            transform: "rotateY(-90deg) translateZ(9px)",
            transformOrigin: "left center",
          }}
        >
          <div className="w-1 h-8 rounded-full bg-[#ffc800]/40" />
        </div>

        {/* 3D Page Stack (Right Edge) */}
        <div
          className="absolute inset-y-1 right-0 w-[16px] bg-[#dfd9ce] border-y border-r border-[#b0a99c] rounded-r-sm"
          style={{
            transform: "rotateY(90deg) translateZ(8px)",
            transformOrigin: "right center",
            backgroundImage: "linear-gradient(to right, #ccc 1px, transparent 1px)",
            backgroundSize: "3px 100%",
          }}
        />

        {/* Solid Clean Back Cover */}
        <div
          className="absolute inset-0 bg-[#101010] rounded-xl border border-white/10"
          style={{
            transform: "translateZ(-10px)",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
}
