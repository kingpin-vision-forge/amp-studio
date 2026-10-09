"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GOLD = "#ffc800";
const BG = "#0b0b0b";
const BG_DARK = "#0f0f0f";
const WHITE = "#f5f0e8";
const MUTED = "#888882";
const BORDER = "#1e1e1e";
const TOTAL_FRAMES = 108;

const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;
const sans = { fontFamily: "DM Sans, sans-serif" } as const;

export default function FoundersPage() {
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [currentFrameNum, setCurrentFrameNum] = useState(1);

  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const ringRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const rafRef = useRef<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef<number>(0);

  // Preload 108 frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    const checkComplete = () => {
      count++;
      if (count === TOTAL_FRAMES) {
        setFramesLoaded(true);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/amp-rahul-pics/frame-${String(i).padStart(3, "0")}.jpg`;
      img.onload = checkComplete;
      img.onerror = checkComplete;
      imgs.push(img);
    }
    frameImagesRef.current = imgs;
  }, []);

  // Draw canvas helper
  const drawCanvasFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = frameImagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width * dpr;
    const h = rect.height * dpr;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

    if (imgAspect > canvasAspect) {
      sWidth = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sWidth) / 2;
    } else {
      sHeight = img.naturalWidth / canvasAspect;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, w, h);
  };

  // Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // Pinned frame sequence scrub
      ScrollTrigger.create({
        trigger: "#founders-sequence",
        start: "top top",
        end: "+=3200",
        pin: true,
        scrub: 0.1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const rawFrame = self.progress * (TOTAL_FRAMES - 1);
          const frameIdx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(rawFrame))
          );
          if (lastFrameRef.current !== frameIdx) {
            lastFrameRef.current = frameIdx;
            setCurrentFrameNum(frameIdx + 1);
            drawCanvasFrame(frameIdx);
          }
        },
      });

      // Scrubbed typography reveals
      gsap.fromTo(
        ".gsap-reveal-fade",
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: "#founders-sequence",
            start: "top top",
            end: "+=1200",
            scrub: 0.5,
          },
          opacity: 1,
          y: 0,
          stagger: 0.1,
        }
      );
    }, mainRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(reqId);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  // Initial canvas render & resize redraw
  useEffect(() => {
    if (framesLoaded) {
      drawCanvasFrame(0);
      ScrollTrigger.refresh();
    }
  }, [framesLoaded]);

  useEffect(() => {
    const handleResize = () => {
      drawCanvasFrame(lastFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cursor followers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      setDot({ x, y });
      ringRef.current.tx = x;
      ringRef.current.ty = y;
    };
    window.addEventListener("mousemove", onMove);

    function tick() {
      const r = ringRef.current;
      r.x += (r.tx - r.x) * 0.12;
      r.y += (r.ty - r.y) * 0.12;
      setRing({ x: r.x, y: r.y });
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const ringSize = hovered ? 56 : 36;

  return (
    <div
      ref={mainRef}
      className="no-cursor overflow-x-hidden hide-scrollbar"
      style={{ ...sans, background: BG, color: WHITE, minHeight: "100vh" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: WHITE,
          transform: `translate(${dot.x - 4}px, ${dot.y - 4}px)`,
          mixBlendMode: "difference",
        }}
      />
      <div
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          width: ringSize,
          height: ringSize,
          border: `1px solid rgba(245,240,232,0.3)`,
          transform: `translate(${ring.x - ringSize / 2}px, ${ring.y - ringSize / 2}px)`,
          transition: "width 0.3s, height 0.3s",
          mixBlendMode: "difference",
        }}
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-14 py-6 bg-black/60 backdrop-blur-md border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:text-[#ffc800] transition-colors"
        >
          <span style={{ ...mono }} className="text-xs tracking-widest uppercase text-white/50 hover:text-white">
            ← Return to Main
          </span>
        </Link>

        <div style={{ ...mono }} className="text-[0.65rem] text-white/50 tracking-[0.2em] uppercase hidden sm:block">
          FOUNDERS ARCHIVE · BIJAPUR
        </div>

        <Link
          href="/contact"
          style={{ ...mono }}
          className="text-xs uppercase tracking-widest px-4 py-2 border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all"
        >
          Book a Session
        </Link>
      </header>

      {/* 1. Founder & Lead Cinematographer: Rahul (Above) */}
      <section
        id="founders-sequence"
        className="w-full relative px-6 lg:px-14 pt-36 pb-24 md:pb-28 bg-[#0a0a0a]"
      >
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Rahul Shutter Canvas Card (3:4 portrait rectangle) */}
            <div className="md:col-span-5 relative">
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#121212] shadow-2xl relative group">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover relative z-10"
                />
                <img
                  src="/amp-rahul-pics/frame-001.jpg"
                  alt="Rahul - Founder & Creative Director at AMP Studio"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
                  style={{ opacity: framesLoaded ? 0 : 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-20" />

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-30">
                  <div>
                    <h3 style={{ ...serif }} className="text-2xl text-white font-light">
                      Rahul R Chavan
                    </h3>
                    <p style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase mt-0.5">
                      Founder &amp; Lead Photographer
                    </p>
                  </div>
                  <div style={{ ...mono }} className="text-[0.65rem] text-white/50 tracking-widest uppercase">
                    Bijapur, KA
                  </div>
                </div>
              </div>

              {/* Decorative Gold Frame accent */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-[#ffc800]/20 -z-10 pointer-events-none" />
            </div>

            {/* Right: Sequence Story description */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-6">
              <div className="flex items-center gap-2">
                <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
                  About The Founder
                </span>
              </div>
              <h2 style={{ ...serif }} className="text-4xl lg:text-5xl text-white font-light leading-tight">
                About The Founder — <span style={{ ...script, color: GOLD }} className="text-5xl lg:text-7xl">Rahul R Chavan</span>
              </h2>
              <p style={{ ...mono }} className="text-xs text-[#ffc800] tracking-wider uppercase font-medium">
                Founder | Amma Mahadevi Photography Studio (AMP STUDIO) | Bijapur
              </p>

              <div className="relative pl-5 border-l-2 border-[#ffc800] py-1 bg-white/[0.02] rounded-r-lg">
                <p style={{ ...serif }} className="text-lg text-[#f5f0e8] italic font-light leading-relaxed">
                  &ldquo;Every picture should have a purpose and every frame should tell a story.&rdquo;
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-base text-[#bfbfb8] font-light leading-relaxed" style={{ ...sans }}>
                <p>
                  I am <strong className="text-white font-medium">Rahul R Chavan</strong>, founder and lead photographer at <strong className="text-white font-medium">Amma Mahadevi Photography Studio (AMP STUDIO) - Bijapur, Karnataka</strong>. With <strong className="text-[#ffc800] font-medium">8+ years of professional experience</strong> behind the lens, my journey has been driven by one simple belief — every picture should have a purpose and every frame should tell a story.
                </p>
                <p>
                  Based in <strong className="text-white font-medium">Vijayapura (Bijapur)</strong>, I have had the privilege of mastering almost every genre of modern photography. What started as a solo passion has now become a studio trusted by hundreds of businesses and families across North Karnataka.
                </p>
                <p>
                  Over these 8 years, I have built a wide and diverse client family including <span className="text-white">hospitals, hotels, restaurants, petrol pumps, real estate firms, furniture businesses, interior designers, fashion models, and wedding families.</span>
                </p>
              </div>

              {/* Specializations Pills */}
              <div className="pt-2">
                <div style={{ ...mono }} className="text-[0.68rem] uppercase tracking-[0.2em] text-[#ffc800] mb-3 font-medium flex items-center gap-2">
                  <span>Core Specializations</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {[
                    "Candid Photography",
                    "Wedding Photography",
                    "Product Photography",
                    "Commercial Photography",
                    "Drone Photography & Videography",
                    "Model & Portfolio Photoshoots",
                    "Real Estate & Interior Photography",
                    "Food & Hospitality Photography",
                    "Cinematic Videography",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-[#121212] hover:border-[#ffc800]/50 transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffc800] flex-shrink-0" />
                      <span style={{ ...sans }} className="text-xs text-white/90 font-light truncate">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Philosophy Quote */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#111111] space-y-1.5">
                <div style={{ ...mono }} className="text-[0.65rem] text-[#ffc800] tracking-[0.2em] uppercase font-medium">
                  The AMP Philosophy
                </div>
                <p style={{ ...sans }} className="text-xs md:text-sm text-[#c8c8c0] leading-relaxed font-light">
                  To me, photography is not just about the best camera or lighting. It is about understanding your need — whether it is a hospital that wants to look trustworthy, a hotel that wants to look luxurious, a furniture brand that wants to look premium, or a couple who wants to remember their wedding forever.
                </p>
              </div>

              {/* Invitation */}
              <div className="space-y-3">
                <p style={{ ...sans }} className="text-xs md:text-sm text-[#bfbfb8] leading-relaxed font-light">
                  If you are looking for the <strong className="text-white font-medium">best photographer in Bijapur, a professional photographer in Vijayapura, or an experienced commercial and wedding photographer near you</strong>, I, Rahul R Chavan, welcome you to AMP STUDIO. Let&apos;s create visuals that not only look beautiful but also work beautifully for you.
                </p>
                <div className="pt-2 border-t border-white/10">
                  <div style={{ ...serif }} className="text-xl text-white font-normal italic">
                    — Rahul R Chavan
                  </div>
                  <div style={{ ...mono }} className="text-[0.68rem] text-[#ffc800] tracking-[0.18em] uppercase mt-0.5">
                    Founder, AMP STUDIO Bijapur
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Co-Founder & Lead Photographer: Amma Mahadevi (Below) */}
      <section className="py-24 md:py-28 px-6 lg:px-14 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Lead Photographer Portrait Image */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/15 bg-[#121212] shadow-2xl relative group">
              <img
                src="/amma-mahadevi-about.jpg"
                alt="Principal Artist at AMP Studio"
                className="w-full h-full object-cover object-top filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-20" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-30">
                <div>
                  <p style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase mt-0.5">
                    Principal Artist
                  </p>
                </div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 tracking-widest uppercase">
                  Bijapur, KA
                </div>
              </div>
            </div>

            {/* Decorative Gold Frame accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-[#ffc800]/20 -z-10 pointer-events-none" />
          </div>

          {/* Right: Founder Story & Narrative */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-2">
              <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
                Co-Founder & Principal Artist
              </span>
            </div>

            <h2 style={{ ...serif }} className="text-4xl lg:text-5xl text-white font-light leading-tight">
              Honoring Life’s Moments Through <em style={{ ...script }} className="text-[#ffc800] text-5xl lg:text-7xl">Candid</em> Realism
            </h2>

            <p style={{ ...sans }} className="text-base text-[#a0a09a] leading-relaxed font-light">
              Over the course of 8+ years across Vijayapura district and North Karnataka, Amma has documented over 11,467 heartfelt sessions—from sacred sunrise rituals around the Gol Gumbaz and Bara Kaman to vibrant wedding celebrations.
            </p>

            <p style={{ ...sans }} className="text-base text-[#a0a09a] leading-relaxed font-light">
              Her intuitive eye for emotional depth and quiet authenticity shapes AMP Studio’s photographic signature, preserving memories that feel as genuine decades later as they did in the moment.
            </p>

            {/* Stats Block: Baseline aligned */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 items-end">
              <div className="flex flex-col justify-end">
                <div className="h-10 flex items-end">
                  <div style={{ ...serif }} className="text-3xl text-white font-light leading-none">11,467+</div>
                </div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-2">Sessions Completed</div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="h-10 flex items-end pb-0.5">
                  <div
                    style={{
                      ...mono,
                      fontSize: "1.7rem",
                      fontWeight: 500,
                      lineHeight: 1,
                      color: GOLD,
                      letterSpacing: "0.14em",
                      textShadow: "0 0 16px rgba(255,200,0,0.5)",
                    }}
                  >
                    ★★★★★
                  </div>
                </div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-2">5-Star Client Rating</div>
              </div>
              <div className="flex flex-col justify-end">
                <div className="h-10 flex items-end">
                  <div style={{ ...serif }} className="text-3xl text-white font-light leading-none">8+ yrs</div>
                </div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-2">Artistic Heritage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-24 px-6 lg:px-14 border-t border-white/10 bg-[#0f0f0f] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
            Work With Rahul, Amma & The Team
          </span>
          <h2 style={{ ...serif }} className="text-4xl md:text-5xl text-white font-light">
            Ready to plan your next chapter in Bijapur?
          </h2>
          <p style={{ ...sans }} className="text-sm text-[#888882] max-w-lg mx-auto leading-relaxed">
            Whether an intimate family portrait or a grand multi-day wedding celebration, we invite you to experience photography crafted with passion and authenticity.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/contact"
              style={{ ...mono }}
              className="px-8 py-3 rounded-full bg-[#ffc800] text-black font-medium text-xs uppercase tracking-widest hover:bg-[#e6b400] transition-colors"
            >
              Inquire Session
            </Link>
            <Link
              href="/"
              style={{ ...mono }}
              className="px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white text-xs uppercase tracking-widest transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
