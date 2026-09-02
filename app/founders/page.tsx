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

  // Initial canvas render
  useEffect(() => {
    if (framesLoaded) {
      drawCanvasFrame(0);
    }
  }, [framesLoaded]);

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

      {/* Hero: Amma Mahadevi Lead Photographer Showcase */}
      <section className="pt-36 pb-20 px-6 lg:px-14 max-w-7xl mx-auto">

        <div className="grid md:grid-cols-12 gap-12 items-center">
          {/* Left: Lead Photographer Portrait Image */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/15 bg-[#121212] shadow-2xl relative group">
              <img
                src="/amma-mahadevi-about.jpg"
                alt="Amma Mahadevi - Founder & Lead Photographer at AMP Studio"
                className="w-full h-full object-cover object-top filter contrast-[1.04] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <p style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase mt-1">
                    Founder & Principal Artist
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
            <h2 style={{ ...serif }} className="text-4xl lg:text-6xl text-white font-light leading-tight">
              Honoring Life’s Moments Through <em style={{ ...script }} className="text-[#ffc800] text-5xl lg:text-7xl">Candid</em> Realism
            </h2>

            <p style={{ ...sans }} className="text-base text-[#a0a09a] leading-relaxed font-light">
              Founded in Bijapur by Rahul, AMP Studio was established with a singular vision: to liberate wedding and portrait photography from artificial poses and over-processed aesthetics, returning to authentic light, quiet connections, and enduring heritage.
            </p>

            <p style={{ ...sans }} className="text-base text-[#a0a09a] leading-relaxed font-light">
              Over the course of 8+ years across Vijayapura district and North Karnataka, Amma has documented over 11,467 heartfelt sessions—from sacred sunrise rituals around the Gol Gumbaz and Bara Kaman to vibrant wedding celebrations.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div style={{ ...serif }} className="text-3xl text-white font-light">11,467+</div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-1">Sessions Completed</div>
              </div>
              <div>
                <div style={{ ...mono }} className="text-2xl text-[#ffc800] font-medium tracking-widest">★★★★★</div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-1">5-Star Client Rating</div>
              </div>
              <div>
                <div style={{ ...serif }} className="text-3xl text-white font-light">8+ yrs</div>
                <div style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest mt-1">Artistic Heritage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pinned Scrollable Cinematic Frame Showcase Section */}
      <section
        id="founders-sequence"
        className="w-full h-screen relative overflow-hidden flex flex-col justify-between px-6 lg:px-14 py-8 bg-[#0a0a0a] border-t border-white/10"
      >
        <div className="max-w-7xl w-full mx-auto h-full flex flex-col justify-between">

          {/* Center Canvas Viewfinder */}
          <div className="grid md:grid-cols-12 gap-8 items-center flex-1 my-auto">
            <div className="md:col-span-8 h-[65vh] md:h-[75vh] relative rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl flex items-center justify-center p-1">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain relative z-10"
              />
              <img
                src="/amp-rahul-pics/frame-001.jpg"
                alt="Frame sequence fallback"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
                style={{ opacity: framesLoaded ? 0 : 1 }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20 text-[0.65rem] font-mono text-white/70 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 pointer-events-none">
                <span>AMP Studio</span>
                <span className="text-[#ffc800]">Scroll down to scrub frames ↓</span>
              </div>
            </div>

            {/* Sequence Story description */}
            <div className="md:col-span-4 flex flex-col justify-center space-y-5 pl-0 md:pl-6">
              <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
                Continuous Motion Narrative
              </span>
              <h3 style={{ ...serif }} className="text-3xl lg:text-4xl text-white font-light leading-snug">
                Every movement, <br />
                preserved in <br />
                <span style={{ ...script, color: GOLD }} className="text-5xl">108 pristine frames.</span>
              </h3>
              <p style={{ ...sans }} className="text-sm text-[#888882] leading-relaxed">
                By capturing continuous cinema-grade shutter sequences, our lead photographers isolate genuine laughter, subtle glances, and the authentic energy of the occasion.
              </p>
              <div style={{ ...mono }} className="text-[0.7rem] text-white/40 tracking-widest uppercase pt-4 border-t border-white/10">
                SCROLL TO ADVANCE SEQUENCE
              </div>
            </div>
          </div>

          {/* Viewfinder Footer */}
          <div className="flex justify-between items-center text-[0.65rem] font-mono text-white/30 tracking-widest uppercase pt-2">
            <span>AMP STUDIO · BIJAPUR FOUNDERS</span>
            <span>SHUTTER TIMELINE 108 FPS</span>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-24 px-6 lg:px-14 border-t border-white/10 bg-[#0f0f0f] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-widest uppercase">
            Work With Amma Mahadevi & The Team
          </span>
          <h2 style={{ ...serif }} className="text-4xl md:text-5xl text-white font-light">
            Ready to plan your next chapter in Bijapur?
          </h2>
          <p style={{ ...sans }} className="text-sm text-[#888882] max-w-lg mx-auto leading-relaxed">
            Whether an intimate family portrait or a grand multi-day wedding celebration, we invite you to experience photography crafted with passion and authenticity.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/#contact"
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
