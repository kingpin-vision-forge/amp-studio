"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { albumPhotos, type GalleryAlbum } from "./galleryData";

const GOLD = "#ffc800";
const serif = { fontFamily: "Italiana, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function AlbumModal({
  album,
  onClose,
}: {
  album: GalleryAlbum | null;
  onClose: () => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const swipeStartX = useRef<number | null>(null);
  const swiped = useRef(false);

  const photos = useMemo(() => (album ? albumPhotos(album) : []), [album]);
  const total = photos.length;

  // Reset the lightbox whenever a different album opens
  useEffect(() => {
    setActive(null);
  }, [album]);

  // Scroll lock + focus handling while open
  useEffect(() => {
    if (!album) return;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      opener?.focus?.({ preventScroll: true });
    };
  }, [album]);

  // Keyboard: Esc steps back (lightbox -> grid -> closed), arrows move through photos
  useEffect(() => {
    if (!album) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active !== null) setActive(null);
        else onClose();
      } else if (active !== null && e.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % total));
      } else if (active !== null && e.key === "ArrowLeft") {
        setActive((i) => (i === null ? i : (i - 1 + total) % total));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [album, active, total, onClose]);

  if (!album) return null;

  const alt = `${album.title} photography by AMP Studio, Bijapur`;
  const step = (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + total) % total));

  // Map each shoot's photos to their index in the flat list for the lightbox
  let offset = 0;
  const shoots = album.shoots.map((shoot) => {
    const start = offset;
    offset += shoot.photos.length;
    return { ...shoot, start };
  });

  const current = active !== null ? photos[active] : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} album`}
      className="album-enter fixed inset-0 z-[99998] flex flex-col bg-[#070707]/[0.97] backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-10 md:px-16">
        <div className="min-w-0">
          <p style={{ ...mono }} className="text-[10px] uppercase tracking-[0.22em] text-[#ffc800]">
            Album · {total} photos
          </p>
          <h2
            style={{ ...serif }}
            className="truncate text-3xl font-light uppercase leading-tight text-[#f5f0e8] md:text-4xl"
          >
            {album.title}
          </h2>
        </div>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="group flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffc800]"
          aria-label="Close album"
        >
          <span style={{ ...mono }} className="hidden text-[0.65rem] uppercase tracking-wider text-white/60 group-hover:text-white sm:inline">
            Close [ESC]
          </span>
          <span className="text-base leading-none">✕</span>
        </button>
      </div>

      {/* Photo grid */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-5 pb-16 pt-8 sm:px-10 md:px-16">
        {shoots.map((shoot) => (
          <section key={shoot.name || "all"} className="mb-12 last:mb-0">
            {shoot.name && (
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px w-8 bg-[#ffc800]" />
                <h3 style={{ ...mono }} className="text-[10px] uppercase tracking-[0.22em] text-[#ffc800]">
                  {shoot.name} · {shoot.photos.length} photos
                </h3>
              </div>
            )}
            <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3">
              {shoot.photos.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setActive(shoot.start + i)}
                  className="group block w-full cursor-zoom-in overflow-hidden rounded-lg bg-[#121212] break-inside-avoid focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffc800]"
                  aria-label={`Open photo ${shoot.start + i + 1} of ${total}`}
                >
                  <img
                    src={photo.src}
                    width={photo.w}
                    height={photo.h}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {current && active !== null && (
        <div
          className="album-enter fixed inset-0 z-[99999] flex flex-col bg-black/95"
          onClick={() => {
            if (swiped.current) swiped.current = false;
            else setActive(null);
          }}
          onPointerDown={(e) => {
            swipeStartX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            if (swipeStartX.current === null) return;
            const dx = e.clientX - swipeStartX.current;
            swipeStartX.current = null;
            if (e.pointerType !== "mouse" && Math.abs(dx) > 50) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1);
            }
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-10" onClick={(e) => e.stopPropagation()}>
            <span style={{ ...mono }} className="text-[0.7rem] uppercase tracking-widest text-white/60">
              <span style={{ color: GOLD }}>{String(active + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
            </span>
            <button
              onClick={() => setActive(null)}
              className="group flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-white transition-colors hover:bg-white/15"
              aria-label="Back to album"
            >
              <span style={{ ...mono }} className="text-[0.65rem] uppercase tracking-wider text-white/60 group-hover:text-white">
                Back
              </span>
              <span className="text-base leading-none">✕</span>
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-20">
            <img
              key={current.src}
              src={current.src}
              width={current.w}
              height={current.h}
              alt={alt}
              className="album-photo-fade max-h-full w-auto max-w-full select-none rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
              draggable={false}
            />
            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white transition-colors hover:border-[#ffc800]/60 hover:text-[#ffc800] sm:flex md:left-6"
                  aria-label="Previous photo"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl text-white transition-colors hover:border-[#ffc800]/60 hover:text-[#ffc800] sm:flex md:right-6"
                  aria-label="Next photo"
                >
                  →
                </button>
              </>
            )}
          </div>
          <p style={{ ...mono }} className="pb-4 text-center text-[0.6rem] uppercase tracking-widest text-white/35 sm:hidden">
            Swipe to browse · tap outside to go back
          </p>
        </div>
      )}
    </div>
  );
}
