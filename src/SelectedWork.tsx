"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface WorkGalleryItem {
  num: string;
  title: string;
  category: string;
  meta: string;
  image: string;
  desc: string;
  tags: string[];
  location?: string;
}

const GOLD = "#ffc800";
const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;
const sans = { fontFamily: "DM Sans, sans-serif" } as const;

export default function SelectedWork({
  items,
  onPhotoClick,
}: {
  items: WorkGalleryItem[];
  onPhotoClick?: (item: { image: string; title: string; category?: string; location?: string }) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        const total = cards.length;
        if (!total || !trackRef.current || !triggerRef.current) return;

        trackRef.current.classList.add("coverflow-active");

        const step = () => Math.min(window.innerWidth * 0.36, 470);

        const update = (progress: number) => {
          const currentStep = step();
          cards.forEach((card, idx) => {
            const diff = idx - progress;
            const absDiff = Math.abs(diff);
            gsap.set(card, {
              xPercent: -50,
              yPercent: -50,
              x: diff * currentStep,
              z: -absDiff * 240,
              rotationY: gsap.utils.clamp(-40, 40, diff * -26),
              scale: 1 - Math.min(absDiff * 0.07, 0.24),
              autoAlpha: absDiff > 2.3 ? 0 : 1 - Math.max(0, absDiff - 1) * 0.4,
              zIndex: Math.round(100 - absDiff * 10),
            });
            card.style.setProperty("--active", String(Math.max(0, 1 - absDiff)));
          });

          if (counterRef.current) {
            counterRef.current.textContent = String(
              gsap.utils.clamp(1, total, Math.round(progress) + 1)
            ).padStart(2, "0");
          }
        };

        update(0);
        const state = { p: 0 };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: "+=" + ((total - 1) * 340 + 160),
            pin: true,
            scrub: 0.7,
            snap: {
              snapTo: 1 / (total - 1),
              duration: { min: 0.15, max: 0.45 },
              ease: "power2.out",
            },
            invalidateOnRefresh: true,
          },
        }).to(state, {
          p: total - 1,
          ease: "none",
          onUpdate: () => update(state.p),
        });

        const onResize = () => {
          update(state.p);
        };
        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          tl.scrollTrigger?.kill();
          tl.kill();
          trackRef.current?.classList.remove("coverflow-active");
          cards.forEach((card) => {
            gsap.set(card, { clearProps: "all" });
            card.style.removeProperty("--active");
          });
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [items.length]);

  return (
    <section ref={containerRef} id="work" className="relative w-full overflow-hidden bg-[#070707]">
      <div ref={triggerRef} className="flex min-h-dvh flex-col justify-center py-16 md:py-0">
        {/* Header row with badge, title and live counter */}
        <div className="mb-8 md:mb-12 flex items-end justify-between px-5 sm:px-10 md:px-16 lg:px-24">
          <div>
            <div className="mb-3 md:mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-[#ffc800]" />
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#ffc800]" style={{ ...mono }}>
                Selected Work
              </span>
            </div>
            <h2
              style={{ ...serif }}
              className="text-4xl sm:text-5xl lg:text-6xl font-light uppercase leading-none text-[#f5f0e8] tracking-tight"
            >
              Captured &{" "}
              <span style={{ ...script, color: GOLD }} className="text-5xl sm:text-6xl lg:text-7xl lowercase italic">
                Crafted.
              </span>
            </h2>
            <p className="mt-3 text-xs md:text-sm text-[#888882] max-w-xl leading-relaxed" style={{ ...sans }}>
              Signature heirloom albums, cinematic frames, and candid moments captured with precision across North Karnataka.
            </p>
          </div>

          <p className="hidden font-mono text-sm tracking-[0.3em] text-[#f5f0e8]/40 md:block" style={{ ...mono }}>
            <span ref={counterRef} className="text-[#ffc800] font-semibold">
              01
            </span>{" "}
            / {String(items.length).padStart(2, "0")}
          </p>
        </div>

        {/* Horizontal Coverflow Track */}
        <div
          ref={trackRef}
          className="work-track flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 md:px-0 hide-scrollbar"
        >
          {items.map((item, idx) => (
            <div
              key={item.num}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="work-card group block w-[82vw] shrink-0 snap-center overflow-hidden rounded-2xl bg-[#121212] sm:w-[62vw] md:w-[min(48vw,560px)] cursor-pointer select-none"
              onClick={() => {
                onPhotoClick?.({
                  image: item.image.replace("w=900", "w=1800"),
                  title: item.title,
                  category: item.category,
                  location: item.location || "Bijapur, Karnataka",
                });
              }}
            >
              {/* Media Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                <img
                  src={item.image}
                  alt={`${item.title} photography`}
                  loading="lazy"
                  className="size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                {/* Vignette fade over bottom of image */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent pointer-events-none" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#ffc800]">
                    {"{ " + item.num + " }"}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white/70">
                    {item.meta}
                  </span>
                </div>

                {/* Hover View Pill */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 font-mono text-[9px] tracking-widest uppercase text-[#ffc800] bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#ffc800]/40 flex items-center gap-1.5 shadow-lg shadow-black/50">
                  <span>View Album</span>
                  <span>↗</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="flex items-start justify-between gap-4 p-5 md:p-6 bg-[#121212]">
                <div className="flex-1 min-w-0">
                  <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#ffc800]/80">
                    {item.category}
                  </p>
                  <h3
                    style={{ ...serif }}
                    className="text-2xl md:text-3xl font-light uppercase leading-tight text-[#f5f0e8] group-hover:text-[#ffc800] transition-colors truncate"
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[42ch] font-sans text-xs md:text-sm leading-relaxed text-[#888882]">
                    {item.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-[#ffc800]/15 bg-[#ffc800]/5 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#f5f0e8]/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Corner Arrow Icon */}
                <div className="mt-1 shrink-0 w-10 h-10 rounded-full border border-[#ffc800]/20 bg-[#ffc800]/5 flex items-center justify-center text-[#ffc800] transition-all duration-300 group-hover:border-[#ffc800]/50 group-hover:bg-[#ffc800]/15 group-hover:scale-110">
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
