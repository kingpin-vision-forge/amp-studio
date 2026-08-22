"use client";

import { useState, useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriftWall from "./DriftWall";

gsap.registerPlugin(ScrollTrigger);

const GOLD = "#ffc800";
const BG = "#0b0b0b";
const BG_DARK = "#0f0f0f";
const WHITE = "#f5f0e8";
const MUTED = "#888882";
const BORDER = "#1e1e1e";
const CARD = "#141414";
const TOTAL_FRAMES = 22;

const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;
const sans = { fontFamily: "DM Sans, sans-serif" } as const;

/* Helpers */
function SectionTag({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-5 mb-16">
      <span className="text-xs tracking-[0.2em]" style={{ ...mono, color: MUTED }}>
        {"{ "}
        {num}
        {" }"}
      </span>
      <div className="flex-1 h-px gsap-section-line" style={{ background: BORDER }} />
      <span className="text-xs tracking-[0.2em] uppercase" style={{ ...mono, color: MUTED }}>
        {label}
      </span>
    </div>
  );
}

/* Services data (Bijapur, Karnataka) */
const services = [
  {
    num: "01",
    name: "Weddings & Elopements",
    desc: "Full-day and half-day wedding photography and videography in Bijapur and North Karnataka for haldi, mehendi, mandap rituals, baraat, and receptions, shot candidly as they happen.",
    price: "From ₹45,000",
    img: "photo-1606800052052-a08af7148866",
    alt: "Wedding photography in Bijapur, Karnataka",
  },
  {
    num: "02",
    name: "Couples & Engagements",
    desc: "Pre-wedding and engagement shoots at locations around Bijapur including Gol Gumbaz, Ibrahim Rauza, Bara Kaman, or anywhere meaningful to you.",
    price: "From ₹12,000",
    img: "photo-1519225421980-715cb0215aed",
    alt: "Engagement and pre-wedding photography in Bijapur",
  },
  {
    num: "03",
    name: "Family Portraits",
    desc: "Family portrait sessions at home or outdoors for families across Bijapur and Vijayapura district.",
    price: "From ₹8,000",
    img: "photo-1555252333-9f8e92e65df9",
    alt: "Family portrait photography in Bijapur",
  },
  {
    num: "04",
    name: "Maternity",
    desc: "Natural maternity photography for expecting parents in Bijapur, in-studio or at home, scheduled around your due date.",
    price: "From ₹7,500",
    img: "photo-1476703993599-0035a21b17a9",
    alt: "Maternity photography in Bijapur",
  },
  {
    num: "05",
    name: "Portrait Sessions",
    desc: "Individual portrait sessions in natural light for professionals, students, and creators across Bijapur.",
    price: "From ₹6,000",
    img: "photo-1531746020798-e6953c6e8e04",
    alt: "Portrait photography session in Bijapur",
  },
];

const faqItems = [
  {
    q: "How far in advance should I book?",
    a: "For portraits and family sessions in Bijapur, book 2 to 3 weeks in advance. For weddings, we recommend booking 3 to 4 months ahead, especially for the November to February wedding season in North Karnataka.",
  },
  {
    q: "Where do sessions take place?",
    a: "Around Bijapur monuments like Gol Gumbaz, Ibrahim Rauza, and Bara Kaman, at your home, or in-studio. We also travel across Vijayapura district and nearby towns for weddings and events.",
  },
  {
    q: "When will I receive my photos?",
    a: "Portrait and family sessions are delivered within 1 to 2 weeks. Wedding galleries take 3 to 4 weeks. You will get a private online gallery with full-resolution downloads.",
  },
  {
    q: "Do you travel outside Bijapur for weddings?",
    a: "Yes. We travel for weddings and events across North Karnataka, including Vijayapura, Bagalkot, and Solapur. Travel fees apply outside Bijapur city limits.",
  },
  {
    q: "What is your editing style?",
    a: "We keep colors natural and true to the lighting of the day, avoiding heavy filters or artificial processing so your photos stay timeless.",
  },
];

const driftWallImages = [
  { src: "photo-1519225421980-715cb0215aed", label: "Engagement photography, Bijapur" },
  { src: "photo-1606800052052-a08af7148866", label: "Wedding photography, Bijapur" },
  { src: "photo-1529636798458-92182e662485", label: "Candid couple photography, Bijapur" },
  { src: "photo-1520854221256-17451cc331bf", label: "Wedding photography, North Karnataka" },
  { src: "photo-1583939003579-730e3918a45a", label: "Pre-wedding shoot, Bijapur" },
  { src: "photo-1476703993599-0035a21b17a9", label: "Maternity photography, Bijapur" },
  { src: "photo-1531746020798-e6953c6e8e04", label: "Portrait photography, Bijapur" },
  { src: "photo-1555252333-9f8e92e65df9", label: "Family portrait photography, Bijapur" },
].map(({ src, label }) => ({
  image: `https://images.unsplash.com/${src}?w=600&q=80&fit=crop&auto=format`,
  title: label,
}));

const testimonials = [
  {
    stars: "★★★★★",
    text: `"AMP Studio made the entire shoot relaxed and simple. Our engagement photos around Gol Gumbaz turned out clear, natural, and candid."`,
    name: "Priya & Rahul",
    meta: "Couples Session · Bijapur · 2025",
    avatar: "photo-1438761681033-6461ffad8d80",
  },
  {
    stars: "★★★★★",
    text: `"We booked AMP Studio for our maternity session and are very happy with the results. They were patient and easy to work with throughout."`,
    name: "Ankita R.",
    meta: "Maternity Session · Bijapur · 2025",
    avatar: "photo-1494790108377-be9c29b29330",
  },
];

/* Main component */
export default function Home({ loaded = true }: { loaded?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stat1, setStat1] = useState(0);
  const [stat2, setStat2] = useState(0);

  /* Frame Sequence State & Refs */
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const frameImagesRef = useRef<HTMLImageElement[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const ringRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const rafRef = useRef<number>(0);

  /* Preload 22 Frame Images from amp-rahul-pics */
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/amp-rahul-pics/frame-${i}.png`;
      img.onload = () => {
        count++;
        if (count === TOTAL_FRAMES) {
          setFramesLoaded(true);
        }
      };
      imgs.push(img);
    }
    frameImagesRef.current = imgs;
  }, []);

  /* Canvas draw frame function */
  const drawCanvasFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = frameImagesRef.current[index];
    if (!img || !img.complete) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const hRatio = rect.width / img.width;
    const vRatio = rect.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShiftX = (rect.width - img.width * ratio) / 2;
    const centerShiftY = (rect.height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShiftX,
      centerShiftY,
      img.width * ratio,
      img.height * ratio
    );
    ctx.restore();
  };

  /* Draw frame-1 as soon as frames or canvas are ready */
  useEffect(() => {
    if (framesLoaded) {
      drawCanvasFrame(currentFrameIndex);
    }
  }, [framesLoaded, currentFrameIndex]);

  /* Resize listener for canvas */
  useEffect(() => {
    const handleResize = () => {
      drawCanvasFrame(currentFrameIndex);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrameIndex]);

  /* Lenis smooth scrolling setup */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* Control Lenis based on loading screen status */
  useEffect(() => {
    if (!lenisRef.current) return;
    if (loaded) {
      lenisRef.current.start();
      ScrollTrigger.refresh();
    } else {
      lenisRef.current.stop();
    }
  }, [loaded]);

  /* Smooth scroll for anchor navigation */
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMenuOpen(false);
      const target = document.querySelector(href);
      if (target && lenisRef.current) {
        lenisRef.current.scrollTo(target as HTMLElement, { offset: -60, duration: 1.2 });
      }
    }
  };

  /* GSAP ScrollTrigger and Entrance Animations */
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Timeline
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".gsap-hero-tag", { y: 24, opacity: 0, duration: 0.8, delay: 0.2 })
        .from(".gsap-hero-title-line", { y: 50, opacity: 0, duration: 1, stagger: 0.12 }, "-=0.5")
        .from(".gsap-hero-desc", { y: 24, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".gsap-hero-btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, "-=0.5")
        .from(".gsap-hero-wall", { opacity: 0, duration: 1.2 }, "-=0.8");

      // 2. Section divider line draw animations
      gsap.utils.toArray<HTMLElement>(".gsap-section-line").forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
          },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1,
          ease: "power3.out",
        });
      });

      // 3. About Section: Pinned Screen-Size Frame Sequence + Fade-in of frame-1 + Word Scrubbing
      // Fade in frame-1 container on scroll into section
      gsap.fromTo(
        ".gsap-about-frame-container",
        { opacity: 0, scale: 0.94, y: 40 },
        {
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
            end: "top top",
            scrub: 0.6,
          },
          opacity: 1,
          scale: 1,
          y: 0,
          ease: "power2.out",
        }
      );

      // Pin About section for frame-by-frame scrub (frame-1 -> frame-22)
      ScrollTrigger.create({
        trigger: "#about",
        pin: true,
        start: "top top",
        end: "+=2600",
        scrub: 0.8,
        onUpdate: (self) => {
          const frameIdx = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(self.progress * TOTAL_FRAMES))
          );
          setCurrentFrameIndex(frameIdx);
          drawCanvasFrame(frameIdx);
        },
      });

      // Word-by-word text color reveal (grey -> white & gold) scrubbed across pinned section
      const aboutWords = gsap.utils.toArray<HTMLElement>(".about-word");
      gsap.fromTo(
        aboutWords,
        {
          color: (i, target) =>
            target.classList.contains("about-gold")
              ? "rgba(255, 200, 0, 0.2)"
              : "rgba(245, 240, 232, 0.2)",
        },
        {
          scrollTrigger: {
            trigger: "#about",
            start: "top top",
            end: "+=2000",
            scrub: 0.8,
          },
          color: (i, target) =>
            target.classList.contains("about-gold") ? GOLD : WHITE,
          stagger: {
            amount: 1.2,
          },
          ease: "none",
        }
      );

      // Stat counters count-up
      const counterObj = { val1: 0, val2: 0 };
      gsap.to(counterObj, {
        scrollTrigger: {
          trigger: ".gsap-about-stats",
          start: "top 90%",
        },
        val1: 500,
        val2: 8,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          setStat1(Math.floor(counterObj.val1));
          setStat2(Math.floor(counterObj.val2));
        },
      });

      gsap.from(".gsap-stat-item", {
        scrollTrigger: {
          trigger: ".gsap-about-stats",
          start: "top 90%",
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 4. Work / Gallery Section
      gsap.from(".gsap-work-header", {
        scrollTrigger: {
          trigger: "#work",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".gsap-gallery-item", {
        scrollTrigger: {
          trigger: ".gsap-gallery-grid",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Parallax effect on gallery images
      gsap.utils.toArray<HTMLElement>(".gsap-gallery-img").forEach((img) => {
        gsap.to(img, {
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -25,
          ease: "none",
        });
      });

      // 5. Services Section
      gsap.from(".gsap-services-header", {
        scrollTrigger: {
          trigger: "#services",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".gsap-service-row", {
        scrollTrigger: {
          trigger: ".gsap-services-list",
          start: "top 80%",
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      // 6. Testimonials Section
      gsap.from(".gsap-quote-block", {
        scrollTrigger: {
          trigger: "#reviews",
          start: "top 80%",
        },
        scale: 0.94,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".gsap-review-card", {
        scrollTrigger: {
          trigger: ".gsap-reviews-grid",
          start: "top 80%",
        },
        y: 45,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      // 7. FAQ Section
      gsap.from(".gsap-faq-header", {
        scrollTrigger: {
          trigger: "#faq",
          start: "top 80%",
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".gsap-faq-item", {
        scrollTrigger: {
          trigger: ".gsap-faq-list",
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      // 8. CTA Section
      gsap.from(".gsap-cta-content", {
        scrollTrigger: {
          trigger: "#contact",
          start: "top 80%",
        },
        y: 45,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, mainRef);

    return () => ctx.revert();
  }, [loaded]);

  /* Smooth cursor ring via rAF */
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

  /* Scroll for nav */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Hover listeners for cursor */
  const addHoverListeners = (el: HTMLElement | null) => {
    if (!el) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    el.querySelectorAll("a, button").forEach((node) => {
      node.addEventListener("mouseenter", enter);
      node.addEventListener("mouseleave", leave);
    });
  };

  const ringSize = hovered ? 56 : 36;

  return (
    <div
      ref={mainRef}
      className="no-cursor overflow-x-hidden"
      style={{ ...sans, background: BG, color: WHITE, minHeight: "100vh" }}
      onMouseMove={() => addHoverListeners(mainRef.current)}
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

      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-14 transition-all duration-500"
        style={{
          paddingTop: scrolled ? "1rem" : "1.75rem",
          paddingBottom: scrolled ? "1rem" : "1.75rem",
          background: scrolled ? "rgba(11,11,11,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? `1px solid ${BORDER}` : "1px solid transparent",
        }}
      >
        <a
          href="#"
          onClick={(e) => handleAnchorClick(e, "#")}
          style={{ ...serif, fontSize: "1.4rem", letterSpacing: "-0.02em", color: WHITE, textDecoration: "none" }}
        >
          AMP Studio
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            ["Work", "#work"],
            ["Services", "#services"],
            ["Reviews", "#reviews"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleAnchorClick(e, href)}
              style={{ ...mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleAnchorClick(e, "#contact")}
            style={{ ...mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: WHITE, textDecoration: "none", border: `1px solid #2a2a2a`, padding: "0.45rem 1.1rem", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = WHITE; (e.target as HTMLElement).style.color = BG; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = WHITE; }}
          >
            Book Now
          </a>
        </nav>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          style={{ background: "none", border: "none", color: WHITE }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-px" style={{ background: WHITE }} />
          <span className="block w-4 h-px" style={{ background: WHITE }} />
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-8"
          style={{ background: "rgba(11,11,11,0.98)" }}
        >
          <button
            className="absolute top-6 right-6 text-2xl"
            style={{ ...sans, background: "none", border: "none", color: MUTED }}
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          {[["Work", "#work"], ["Services", "#services"], ["Reviews", "#reviews"], ["Contact", "#contact"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleAnchorClick(e, href)}
              style={{ ...serif, fontSize: "2.5rem", color: WHITE, textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="min-h-screen grid md:grid-cols-2 relative overflow-hidden">
        {/* Left */}
        <div className="flex flex-col justify-end pb-20 pt-36 px-6 lg:px-14 relative z-10">
          <div
            className="gsap-hero-tag flex items-center gap-4 mb-12"
            style={{ ...mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}
          >
            <span className="w-10 h-px" style={{ background: "#2a2a2a" }} />
            {"{ 00 }"} : Wedding & Event Photography in Bijapur
          </div>

          <h1 style={{ ...serif, fontWeight: 300, fontSize: "clamp(3.5rem, 7vw, 7.5rem)", lineHeight: 0.9, letterSpacing: "-0.02em", color: WHITE }}>
            {[
              { text: "THE", delay: "0s", color: WHITE },
              { text: "ESSENCE", delay: "0.1s", color: GOLD },
              { text: "of", delay: "0.2s", color: WHITE, style: script },
              { text: "PHOTOGRAPHY", delay: "0.3s", color: WHITE },
            ].map(({ text, color, style: st }) => (
              <span key={text} className="block overflow-hidden">
                <span
                  className="gsap-hero-title-line block"
                  style={{ color, ...(st ?? {}) }}
                >
                  {text}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="gsap-hero-desc mt-8 leading-relaxed max-w-xs"
            style={{ fontSize: "0.875rem", color: MUTED }}
          >
            Wedding and event photography and videography in Bijapur,
            Karnataka. We cover weddings, engagements, maternity, and
            portrait sessions across North Karnataka.
          </p>

          <div className="flex gap-5 mt-10 items-center">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
              className="gsap-hero-btn"
              style={{ background: GOLD, color: BG, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", padding: "0.8rem 1.6rem", textDecoration: "none", fontWeight: 500, transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#e6b400")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = GOLD)}
            >
              Book a Session
            </a>
            <a
              href="#work"
              onClick={(e) => handleAnchorClick(e, "#work")}
              className="gsap-hero-btn"
              style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: MUTED, textDecoration: "none", borderBottom: `1px solid #2a2a2a`, paddingBottom: "2px", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
            >
              See the work →
            </a>
          </div>
        </div>

        {/* Right: drifting photo wall */}
        <div className="gsap-hero-wall relative overflow-hidden" style={{ minHeight: "55vw", maxHeight: "100vh" }}>
          <DriftWall
            items={driftWallImages}
            columns={5}
            tileWidth={150}
            tileHeight={170}
            gap={10}
            tilt={16}
            turn={-14}
            perspective={900}
            depth={140}
            speed={26}
            direction="up"
            variance={0.5}
            parallax={1.2}
            lift={40}
            fade={0.15}
            dim={0.82}
            overlayColor={BG}
            radius={2}
            roll={0}
            pauseOnHover
          />
          {/* gradient blend left */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${BG} 0%, transparent 28%), linear-gradient(to top, ${BG} 0%, transparent 18%)` }}
          />
        </div>

        {/* Location tag */}
        <div
          className="gsap-hero-tag absolute bottom-20 right-6 lg:right-14 hidden md:block"
          style={{ ...mono, fontSize: "0.65rem", color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl" }}
        >
          AMP Studio · Bijapur, Karnataka
        </div>
      </section>

      {/* About Section - Screen Size with Pinned Frame Sequence (frame-1 -> frame-22) */}
      <section
        id="about"
        className="w-full h-screen min-h-screen relative overflow-hidden flex flex-col justify-between px-6 lg:px-14 py-8"
        style={{ borderTop: `1px solid ${BORDER}`, background: BG_DARK }}
      >
        <div style={{ maxWidth: 1280, width: "100%", margin: "0 auto" }} className="h-full flex flex-col justify-between">
          {/* Header Tag + Frame counter */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-5 flex-1">
              <span className="text-xs tracking-[0.2em]" style={{ ...mono, color: MUTED }}>
                {"{ 01 }"}
              </span>
              <div className="flex-1 h-px gsap-section-line" style={{ background: BORDER }} />
              <span className="text-xs tracking-[0.2em] uppercase" style={{ ...mono, color: MUTED }}>
                About
              </span>
            </div>
            <div className="ml-6 px-3.5 py-1 rounded-full border border-[#2a2a2a] bg-[#141414] text-xs font-mono tracking-widest text-[#ffc800]">
              FRAME {String(currentFrameIndex + 1).padStart(2, "0")} / 22
            </div>
          </div>

          {/* Main Grid: Pinned Frame Showcase on Left, Text + Stats on Right */}
          <div className="grid md:grid-cols-12 gap-8 items-center flex-1 my-auto">
            {/* Pinned Frame Showcase */}
            <div className="gsap-about-frame-container md:col-span-6 lg:col-span-5 h-[52vh] md:h-[68vh] relative rounded-2xl overflow-hidden border border-[#262626] bg-[#0b0b0b] shadow-2xl flex items-center justify-center p-2">
              {/* High-DPI Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain relative z-10"
              />
              {/* Fallback image while canvas initializes */}
              <img
                src={`/amp-rahul-pics/frame-${currentFrameIndex + 1}.png`}
                alt={`AMP Studio frame ${currentFrameIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-150"
                style={{ opacity: framesLoaded ? 0 : 1 }}
              />
              {/* Decorative Glass Overlay & Frame Badge */}
              <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/10" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-20 text-[0.6rem] font-mono uppercase text-white/40 tracking-widest bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span>AMP Studio Story</span>
                <span className="text-[#ffc800]">Rahul · 2025</span>
              </div>
            </div>

            {/* About Text + Stat Counters */}
            <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center pl-0 md:pl-6">
              <p
                className="gsap-about-text flex flex-wrap items-baseline"
                style={{
                  ...serif,
                  fontWeight: 300,
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.35,
                  marginBottom: "2.5rem",
                }}
              >
                {[
                  { text: "AMP", isGold: false },
                  { text: "Studio", isGold: false },
                  { text: "is", isGold: false },
                  { text: "a", isGold: false },
                  { text: "photography", isGold: true, font: script },
                  { text: "and", isGold: true, font: script },
                  { text: "videography", isGold: true, font: script },
                  { text: "studio", isGold: false },
                  { text: "based", isGold: false },
                  { text: "in", isGold: false },
                  { text: "Bijapur,", isGold: false },
                  { text: "Karnataka.", isGold: false },
                  { text: "We", isGold: false },
                  { text: "cover", isGold: false },
                  { text: "weddings,", isGold: false },
                  { text: "engagements,", isGold: false },
                  { text: "and", isGold: false },
                  { text: "portraits", isGold: false },
                  { text: "across", isGold: false },
                  { text: "North", isGold: false },
                  { text: "Karnataka", isGold: false },
                  { text: "in", isGold: false },
                  { text: "a", isGold: false },
                  { text: "natural,", isGold: false },
                  { text: "candid", isGold: false },
                  { text: "style.", isGold: false },
                ].map(({ text, isGold, font }, idx) => (
                  <span
                    key={idx}
                    className={`about-word inline-block mr-[0.3em] ${isGold ? "about-gold" : ""}`}
                    style={{
                      color: isGold ? "rgba(255, 200, 0, 0.2)" : "rgba(245, 240, 232, 0.2)",
                      transition: "color 0.15s ease",
                      ...(font ?? {}),
                    }}
                  >
                    {text}
                  </span>
                ))}
              </p>

              <div className="gsap-about-stats grid grid-cols-3 gap-6 pt-6 border-t border-[#1e1e1e]">
                <div className="gsap-stat-item">
                  <div style={{ ...serif, fontSize: "2.5rem", fontWeight: 300, lineHeight: 1, color: WHITE }}>{stat1}+</div>
                  <div style={{ ...mono, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "0.5rem" }}>Sessions completed</div>
                </div>
                <div className="gsap-stat-item">
                  <div style={{ ...serif, fontSize: "2.5rem", fontWeight: 300, lineHeight: 1, color: WHITE }}>5-star</div>
                  <div style={{ ...mono, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "0.5rem" }}>Client rating</div>
                </div>
                <div className="gsap-stat-item">
                  <div style={{ ...serif, fontSize: "2.5rem", fontWeight: 300, lineHeight: 1, color: WHITE }}>{stat2} yrs</div>
                  <div style={{ ...mono, fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "0.5rem" }}>Photography experience</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom indicator hint */}
          <div className="flex justify-between items-center text-[0.65rem] font-mono text-white/30 tracking-widest uppercase pt-2">
            <span>AMP Studio · Bijapur</span>
            <span className="animate-pulse">Scroll to advance →</span>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="work" style={{ padding: "4rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="gsap-work-header flex justify-between items-end mb-10">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.025em", lineHeight: 0.95, color: WHITE }}>
              Recent
              <br />
              <em style={{ ...script, color: MUTED }}>Work</em>
            </h2>
            <p className="hidden md:block text-sm leading-relaxed text-right max-w-[200px]" style={{ color: MUTED }}>
              Photos from weddings, engagements, and family sessions in Bijapur and North Karnataka.
            </p>
          </div>

          {/* Asymmetric masonry grid */}
          <div
            className="gsap-gallery-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gridAutoRows: "5rem", gap: "3px" }}
          >
            {[
              { src: "photo-1519225421980-715cb0215aed", col: "span 5", row: "span 5", label: "Couples · 2025", alt: "Couple photography session in Bijapur" },
              { src: "photo-1520854221256-17451cc331bf", col: "span 4", row: "span 3", label: "Weddings · 2025", alt: "Wedding photography in Bijapur, Karnataka" },
              { src: "photo-1583939003579-730e3918a45a", col: "span 3", row: "span 3", label: "Engagements · 2025", alt: "Engagement shoot in Bijapur" },
              { src: "photo-1476703993599-0035a21b17a9", col: "span 4", row: "span 4", label: "Maternity · 2024", alt: "Maternity photography in Bijapur" },
              { src: "photo-1531746020798-e6953c6e8e04", col: "span 3", row: "span 2", label: "Portrait · 2025", alt: "Portrait photography session in Bijapur" },
              { src: "photo-1606800052052-a08af7148866", col: "span 5", row: "span 4", label: "Weddings · 2024", alt: "Wedding photography in Vijayapura district" },
              { src: "photo-1529636798458-92182e662485", col: "span 4", row: "span 3", label: "Couples · 2024", alt: "Candid couple photography in Bijapur" },
            ].map(({ src, col, row, label, alt }) => (
              <div
                key={src}
                className="gsap-gallery-item overflow-hidden relative group"
                style={{ gridColumn: col, gridRow: row }}
              >
                <img
                  src={`https://images.unsplash.com/${src}?w=900&q=85&fit=crop&auto=format`}
                  alt={alt}
                  className="gsap-gallery-img w-full h-full object-cover"
                  style={{ filter: "brightness(0.78) contrast(1.05) saturate(0.85)", transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s" }}
                  onMouseEnter={(e) => { const img = e.target as HTMLElement; img.style.transform = "scale(1.06)"; img.style.filter = "brightness(0.92) contrast(1.05) saturate(1)"; }}
                  onMouseLeave={(e) => { const img = e.target as HTMLElement; img.style.transform = "scale(1)"; img.style.filter = "brightness(0.78) contrast(1.05) saturate(0.85)"; }}
                />
                <div
                  className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  style={{ padding: "0.6rem 0.8rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", ...mono, fontSize: "0.65rem", color: "rgba(245,240,232,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-3">
            <a
              href="#contact"
              onClick={(e) => handleAnchorClick(e, "#contact")}
              style={{ ...mono, fontSize: "0.7rem", color: MUTED, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", borderBottom: `1px solid #2a2a2a`, paddingBottom: "2px", transition: "color 0.2s, border-color 0.2s" }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = WHITE; (e.target as HTMLElement).style.borderBottomColor = MUTED; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = MUTED; (e.target as HTMLElement).style.borderBottomColor = "#2a2a2a"; }}
            >
              See more work →
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" style={{ background: BG_DARK, borderTop: `1px solid ${BORDER}`, padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTag num="03" label="Services" />

          <div className="gsap-services-header grid md:grid-cols-2 gap-10 items-end mb-16">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.5rem, 5vw, 5rem)", letterSpacing: "-0.025em", lineHeight: 0.95, color: WHITE }}>
              What
              <br />
              <em style={{ ...script, color: MUTED }}>We Offer</em>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: MUTED }}>
              Wedding, event, and portrait photography in Bijapur, covering full-day weddings, engagement shoots, and family sessions.
            </p>
          </div>

          <div className="gsap-services-list flex flex-col">
            {services.map((svc, i) => (
              <div
                key={svc.num}
                className="gsap-service-row group"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr 5rem auto",
                  gap: "1.5rem 2rem",
                  alignItems: "center",
                  padding: "1.5rem 0",
                  borderBottom: `1px solid ${BORDER}`,
                  borderTop: i === 0 ? `1px solid ${BORDER}` : undefined,
                  transition: "padding 0.3s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.paddingLeft = "1rem"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.paddingLeft = "0"; }}
              >
                <span style={{ ...mono, fontSize: "0.7rem", color: MUTED, letterSpacing: "0.1em" }}>{svc.num}</span>
                <div>
                  <div style={{ ...serif, fontSize: "1.75rem", fontWeight: 300, color: WHITE, marginBottom: "0.25rem", transition: "color 0.2s" }} className="group-hover:opacity-60 transition-opacity">{svc.name}</div>
                  <div style={{ fontSize: "0.78rem", color: MUTED, lineHeight: 1.7, maxWidth: 500 }}>{svc.desc}</div>
                </div>
                <div
                  className="overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 hidden md:block"
                  style={{ width: "5rem", height: "4rem" }}
                >
                  <img
                    src={`https://images.unsplash.com/${svc.img}?w=300&q=80&fit=crop&auto=format`}
                    alt={svc.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div style={{ ...serif, fontSize: "1.2rem", color: MUTED, fontStyle: "italic", textAlign: "right", whiteSpace: "nowrap" }}>{svc.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" style={{ borderTop: `1px solid ${BORDER}`, padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <SectionTag num="04" label="Testimonials" />

          <blockquote
            className="gsap-quote-block relative mx-auto text-center mb-5"
            style={{ ...serif, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.4rem, 2.8vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1.4, color: WHITE, maxWidth: 780 }}
          >
            <span
              className="absolute pointer-events-none select-none"
              style={{ ...serif, fontSize: "8rem", color: BORDER, lineHeight: 1, top: "-1rem", left: "-1.5rem" }}
            >
              "
            </span>
            "AMP Studio photographed our Bijapur wedding. The photos captured each part of the day, including the ceremony rituals, reception, and small details."
          </blockquote>
          <div className="text-center mb-20" style={{ ...mono, fontSize: "0.7rem", color: MUTED, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Aishwarya & Sanjay · Wedding, Bijapur
          </div>

          <div className="gsap-reviews-grid grid md:grid-cols-2 gap-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="gsap-review-card"
                style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "2rem", transition: "border-color 0.3s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = BORDER)}
              >
                <div style={{ ...mono, fontSize: "0.7rem", color: MUTED, letterSpacing: "0.15em", marginBottom: "1.25rem" }}>{t.stars}</div>
                <p style={{ ...serif, fontSize: "1rem", fontStyle: "italic", color: MUTED, lineHeight: 1.75, marginBottom: "1.25rem" }}>{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 36, height: 36, background: "#2a2a2a" }}>
                    <img src={`https://images.unsplash.com/${t.avatar}?w=100&q=80&fit=crop&auto=format`} alt={`${t.name}, AMP Studio client`} className="w-full h-full object-cover" style={{ filter: "grayscale(1)" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: WHITE, fontWeight: 300 }}>{t.name}</div>
                    <div style={{ ...mono, fontSize: "0.65rem", color: MUTED, letterSpacing: "0.1em", marginTop: "0.1rem" }}>{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ background: BG_DARK, borderTop: `1px solid ${BORDER}`, padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <SectionTag num="05" label="FAQ" />
          <h2 className="gsap-faq-header mb-14" style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.2rem, 4vw, 4rem)", letterSpacing: "-0.025em", lineHeight: 0.95 }}>
            Frequently
            <br />
            <em style={{ ...script, color: MUTED }}>Asked</em>
          </h2>

          <div className="gsap-faq-list flex flex-col">
            {faqItems.map((item, i) => (
              <div key={i} className="gsap-faq-item" style={{ borderBottom: `1px solid ${BORDER}`, borderTop: i === 0 ? `1px solid ${BORDER}` : undefined }}>
                <button
                  className="w-full flex justify-between items-center gap-6 text-left"
                  style={{ background: "none", border: "none", color: WHITE, padding: "1.25rem 0" }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ ...serif, fontSize: "1.2rem", fontWeight: 300, transition: "color 0.2s", color: openFaq === i ? MUTED : WHITE }}>
                    {item.q}
                  </span>
                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 24, height: 24, border: `1px solid #2a2a2a`, fontSize: "0.8rem", color: MUTED, transition: "transform 0.3s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
                <div style={{ maxHeight: openFaq === i ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                  <p style={{ fontSize: "0.875rem", color: MUTED, lineHeight: 1.85, paddingBottom: "1.25rem" }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ borderTop: `1px solid ${BORDER}`, padding: "8rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>
        <div className="gsap-cta-content" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-16 h-px" style={{ background: BORDER }} />
            <span style={{ ...mono, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: MUTED }}>
              Get in Touch
            </span>
            <div className="w-16 h-px" style={{ background: BORDER }} />
          </div>
          <h2
            className="mb-12"
            style={{ ...serif, fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2.5rem, 6vw, 6.5rem)", letterSpacing: "-0.025em", lineHeight: 1, color: WHITE }}
          >
            Ready to book
            <br />
            <span style={{ color: MUTED }}>your Bijapur photo session?</span>
          </h2>
          <div className="flex gap-5 justify-center items-center">
            <a
              href="mailto:hello@ampstudio.com"
              style={{ background: GOLD, color: BG, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", padding: "0.9rem 2rem", textDecoration: "none", fontWeight: 500, transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#e6b400")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = GOLD)}
            >
              Book a Session
            </a>
            <a
              href="mailto:hello@ampstudio.com"
              style={{ ...mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: MUTED, textDecoration: "none", borderBottom: `1px solid #2a2a2a`, paddingBottom: "2px", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
            >
              Send an email →
            </a>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-24 overflow-hidden" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "1.5rem" }}>
          <div className="animate-marquee inline-block whitespace-nowrap">
            {["Weddings", "Couples", "Portraits", "Maternity", "Family", "Elopements", "Editorial", "Weddings", "Couples", "Portraits", "Maternity", "Family", "Elopements", "Editorial"].map((s, i) => (
              <span key={i} style={{ ...serif, fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", color: BORDER, padding: "0 2rem" }}>
                {s} ·
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 lg:px-14 py-7"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <a
          href="#"
          onClick={(e) => handleAnchorClick(e, "#")}
          style={{ ...serif, fontSize: "1rem", fontStyle: "italic", color: MUTED, textDecoration: "none", letterSpacing: "-0.02em", transition: "color 0.2s" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
        >
          AMP Studio
        </a>
        <div style={{ ...mono, fontSize: "0.65rem", color: MUTED, letterSpacing: "0.15em", textAlign: "center" }}>
          © 2026 AMP Studio Photography · Bijapur, Karnataka · All rights reserved
        </div>
        <div className="flex gap-6">
          {["Instagram", "Pinterest", "Contact"].map((link) => (
            <a
              key={link}
              href={link === "Contact" ? "#contact" : "#"}
              onClick={(e) => link === "Contact" && handleAnchorClick(e, "#contact")}
              style={{ ...mono, fontSize: "0.65rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
