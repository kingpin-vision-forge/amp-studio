"use client";

import { useEffect } from "react";

export interface PhotoModalItem {
  image: string;
  title: string;
  category?: string;
  location?: string;
}

interface PhotoModalProps {
  photo: PhotoModalItem | null;
  onClose: () => void;
}

const serif = { fontFamily: "Italiana, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (photo) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 transition-opacity duration-300"
      style={{
        background: "rgba(0, 0, 0, 0.94)",
        backdropFilter: "blur(18px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between py-3 px-2 text-xs text-white/70">
          <div className="flex items-center gap-3">
            <span
              style={{ ...mono }}
              className="px-2.5 py-1 rounded bg-white/10 text-[#ffc800] tracking-widest text-[0.65rem] uppercase"
            >
              AMP Studio
            </span>
            <span style={{ ...mono }} className="text-[0.7rem] text-white/50 tracking-wider uppercase hidden sm:inline">
              {photo.location || "Bijapur, Karnataka"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
            aria-label="Close photo view"
          >
            <span style={{ ...mono }} className="text-[0.65rem] uppercase tracking-wider text-white/60 group-hover:text-white">
              Close [ESC]
            </span>
            <span className="text-base leading-none">✕</span>
          </button>
        </div>

        <div className="relative w-full max-h-[78vh] flex items-center justify-center rounded-2xl overflow-hidden border border-white/15 bg-[#0a0a0a] shadow-2xl">
          <img
            src={photo.image}
            alt={photo.title}
            className="max-h-[78vh] w-auto max-w-full object-contain rounded-xl select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-2 pointer-events-none">
            <div>
              <h3 style={{ ...serif }} className="text-2xl md:text-3xl text-white font-light drop-shadow-md">
                {photo.title}
              </h3>
              {photo.category && (
                <div style={{ ...mono }} className="text-[0.65rem] text-[#ffc800] uppercase tracking-widest mt-0.5">
                  {photo.category}
                </div>
              )}
            </div>
            <div style={{ ...mono }} className="text-[0.65rem] text-white/60 tracking-widest uppercase">
              High Resolution Photographic Archive
            </div>
          </div>
        </div>

        <div className="w-full text-center mt-3">
          <span style={{ ...mono }} className="text-[0.65rem] text-white/40 uppercase tracking-widest">
            Click outside or press ESC to return to page
          </span>
        </div>
      </div>
    </div>
  );
}
