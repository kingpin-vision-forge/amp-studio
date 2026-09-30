"use client";
import imgLogo from "./imports/logo.png";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DriftWall, { type DriftWallItem } from "./DriftWall";
import SelectedWork, { type WorkGalleryItem } from "./SelectedWork";
import PhotoModal, { type PhotoModalItem } from "./PhotoModal";
import LegalModal, { type LegalTab } from "./LegalModal";

gsap.registerPlugin(ScrollTrigger);

const GOLD = "#ffc800";
const BG = "#0b0b0b";
const BG_DARK = "#0f0f0f";
const WHITE = "#f5f0e8";
const MUTED = "#888882";
const BORDER = "#1e1e1e";
const CARD = "#141414";
const TOTAL_FRAMES = 108;

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
    name: "Maternity",
    desc: "Graceful and intimate maternity sessions celebrating motherhood in natural light, shot in-studio or at home across Bijapur.",
    img: "photo-1476703993599-0035a21b17a9",
    alt: "Maternity photography session in Bijapur",
  },
  {
    num: "02",
    name: "Pre Wedding",
    desc: "Romantic, cinematic pre-wedding shoots around Bijapur heritage marvels including Gol Gumbaz, Ibrahim Rauza, and Bara Kaman.",
    img: "photo-1519225421980-715cb0215aed",
    alt: "Pre wedding photography in Bijapur",
  },
  {
    num: "03",
    name: "Wedding",
    desc: "Comprehensive wedding photography and videography for haldi, mehendi, sangeet, sacred mandap ceremonies, and grand receptions across North Karnataka.",
    img: "photo-1520854221256-17451cc331bf",
    alt: "Wedding photography in Bijapur, Karnataka",
  },
  {
    num: "04",
    name: "Occasions",
    desc: "Documenting birthdays, anniversaries, naming ceremonies, housewarmings, and festive family celebrations with candid realism.",
    img: "photo-1511795409834-ef04bbd61622",
    alt: "Occasions and celebrations photography in Bijapur",
  },
  {
    num: "05",
    name: "Candid Portraits",
    desc: "Unposed, authentic personal, creative, and family portraits captured with honest light and timeless character.",
    img: "photo-1531746020798-e6953c6e8e04",
    alt: "Candid portrait photography in Bijapur",
  },
  {
    num: "06",
    name: "Designing / Editing",
    desc: "Bespoke handcrafted photobook album design, high-end editorial retouching, color grading, and cinematic video post-production.",
    img: "photo-1542744094-3a31727201eb",
    alt: "Album designing and professional photo editing",
  },
  {
    num: "07",
    name: "New Borns",
    desc: "Delicate and patient newborn photography sessions prioritizing baby comfort, gentle natural lighting, and heirloom keepsakes.",
    img: "photo-1555252333-9f8e92e65df9",
    alt: "Newborn baby photography in Bijapur",
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

const galleryItems: WorkGalleryItem[] = [
  {
    num: "01",
    title: "Maternity",
    category: "Studio Album · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=900&q=85&fit=crop&auto=format",
    desc: "Intimate and serene maternity albums celebrating the beauty of expecting parents in natural light.",
    tags: ["Natural Light", "Fine Art", "Studio Portraits"],
    location: "Bijapur, Karnataka",
  },
  {
    num: "02",
    title: "Pre Wedding",
    category: "Cinematic Film · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85&fit=crop&auto=format",
    desc: "Cinematic romantic pre-wedding stories documented across Bijapur's architectural marvels and golden sunsets.",
    tags: ["Heritage Locations", "Drone 4K", "Cinematic Film"],
    location: "Gol Gumbaz & Bijapur",
  },
  {
    num: "03",
    title: "Wedding",
    category: "Sacred Ceremonies · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&q=85&fit=crop&auto=format",
    desc: "Heirloom wedding collections capturing the sacred vows, laughter, tears, and vibrant North Karnataka festivities.",
    tags: ["Heirloom Album", "Muhurtham", "Traditional Rituals"],
    location: "Vijayapura Mandapam",
  },
  {
    num: "04",
    title: "Occasions",
    category: "Family Milestones · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85&fit=crop&auto=format",
    desc: "Joyous milestone celebrations, anniversaries, cradle ceremonies, and cultural gatherings preserved forever.",
    tags: ["Anniversaries", "Cradle Ceremony", "Festivities"],
    location: "Bijapur, Karnataka",
  },
  {
    num: "05",
    title: "Candid Portraits",
    category: "Signature Series · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=85&fit=crop&auto=format",
    desc: "Raw, expressive candid portraits illuminating genuine personalities and honest human emotion.",
    tags: ["Editorial", "Ambient Light", "Black & White"],
    location: "AMP Studio, Bijapur",
  },
  {
    num: "06",
    title: "Designing / Editing",
    category: "Post-Production · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1542744094-3a31727201eb?w=900&q=85&fit=crop&auto=format",
    desc: "Signature custom-bound photobooks, artisanal layouts, precision color-correction, and cinematic film cuts.",
    tags: ["Custom Binding", "Color Grading", "Handcrafted Layouts"],
    location: "Design Suite",
  },
  {
    num: "07",
    title: "New Borns",
    category: "Gentle Memories · 2025",
    meta: "2025",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=900&q=85&fit=crop&auto=format",
    desc: "Tender, peaceful portraits of your newborn's earliest days, wrapped in warmth and timeless simplicity.",
    tags: ["Studio Setup", "Gentle Light", "Keepsake Frames"],
    location: "AMP Baby Studio",
  },
];

const testimonials: {
  stars: string;
  text: string;
  name: string;
  meta: string;
  avatar?: string;
}[] = [
  {
    stars: "★★★★★",
    text: "Highly recommended! I got my brother's birthday photo frame designed by Amma Mahadevi Photography Studio, and it turned out absolutely amazing. The design, photo editing, print quality, and frame finish were all excellent. They were very patient with my requests and delivered exactly what I wanted. My brother loved the gift! Thank you for the beautiful work and great service. I'll definitely come back again.",
    name: "Sudeep Kadam",
    meta: "Google Review",
    avatar: "/reviews/reviewer-1.png",
  },
  {
    stars: "★★★★★",
    text: "Absolutely loved the photography for our ring ceremony! Every special moment was captured so beautifully and naturally. The pictures are full of emotions, details, and memories we'll cherish forever. The team was professional, creative, and made us feel comfortable throughout the event. Highly recommended for anyone who wants their special day captured perfectly!",
    name: "Sachin Sanadi",
    meta: "Google Review",
    avatar: "/reviews/reviewer-2.png",
  },
  {
    stars: "★★★★★",
    text: "One of the best photo studio in Vijayapura. Thank you so much for the all photos. They arrived on time, maintained a friendly and approachable demeanor, made us feel ease throughout the session.",
    name: "Deepa S",
    meta: "Google Review",
  },
  {
    stars: "★★★★★",
    text: "I just explained how my kid photoshoot. They have taken care everything with proper all poses and emotions were captured.",
    name: "Saddam Bavakhan",
    meta: "Local Guide · Google Review",
  },
  {
    stars: "★★★★★",
    text: "Absolutely loved my experience with Amma Mahadevi Photography! Their service, staff, atmosphere, and speed were all excellent, and the product quality for the price was outstanding.",
    name: "Sachin Kulkarni",
    meta: "Local Guide · Google Review",
    avatar: "/reviews/reviewer-3.png",
  },
];


/* Dynamic Interactive Service Row with 3D Hover Image Expansion */
function ServiceRow({
  svc,
  i,
  onPhotoClick,
}: {
  svc: (typeof services)[0];
  i: number;
  onPhotoClick?: (item: PhotoModalItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotY(((x - centerX) / centerX) * 14);
    setRotX(-((y - centerY) / centerY) * 12);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  return (
    <div
      ref={rowRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-service-row group relative cursor-pointer py-6 px-4 md:px-6 rounded-2xl border-b border-[#1e1e1e] transition-all duration-300 hover:bg-[#141414]"
      style={{
        borderTop: i === 0 ? `1px solid ${BORDER}` : undefined,
      }}
    >
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
        {/* Number + Title + Description */}
        <div className="w-full md:col-span-8 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span
              style={{ ...mono }}
              className={`text-xs md:text-sm tracking-widest transition-colors duration-300 ${isHovered ? "text-[#ffc800] font-semibold" : "text-[#888882]"
                }`}
            >
              {svc.num}
            </span>
            <h3
              style={{ ...serif }}
              className={`text-xl md:text-3xl font-light transition-all duration-300 ${isHovered ? "text-[#ffc800] translate-x-1" : "text-white"
                }`}
            >
              {svc.name}
            </h3>
          </div>
          <p className="text-xs md:text-sm text-[#888882] leading-relaxed max-w-xl font-sans pl-7 md:pl-8 mt-1">
            {svc.desc}
          </p>
        </div>

        {/* Right: Dynamic Image Preview (Click to open photo separately) */}
        <div
          className="w-full md:col-span-4 flex justify-start md:justify-end items-center relative z-20 my-2 md:my-0 pl-7 md:pl-0"
          onClick={(e) => {
            e.stopPropagation();
            onPhotoClick?.({
              image: `https://images.unsplash.com/${svc.img}?w=1600&q=90&fit=crop&auto=format`,
              title: svc.name,
              category: "AMP Studio · Services Archive",
              location: "Bijapur, Karnataka",
            });
          }}
        >
          <div
            className={`relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ease-out border ${isHovered
                ? "w-full md:w-64 h-48 md:h-40 opacity-100 scale-100 border-[#ffc800]/60 shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                : "w-36 md:w-36 h-24 md:h-20 opacity-80 border-white/10"
              }`}
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
              transform: isHovered
                ? `rotateX(${rotX}deg) rotateY(${rotY}deg) rotate(1.5deg)`
                : "rotateX(0deg) rotateY(0deg) rotate(0deg)",
            }}
          >
            <img
              src={`https://images.unsplash.com/${svc.img}?w=800&q=85&fit=crop&auto=format`}
              alt={svc.alt}
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"
                }`}
            />
            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoModalItem | null>(null);
  const [legalTab, setLegalTab] = useState<LegalTab | null>(null);

  /* Frame Sequence State & Refs */
  const frameBadgeRef = useRef<HTMLDivElement | null>(null);
  const lastFrameRef = useRef<number>(0);
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
    const checkComplete = () => {
      count++;
      if (count === TOTAL_FRAMES) {
        setFramesLoaded(true);
      }
    };
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/amp-rahul-pics/frame-${String(i).padStart(3, "0")}.jpg`;
      if (img.complete) {
        checkComplete();
      } else {
        img.onload = checkComplete;
        if (img.decode) {
          img.decode().then(checkComplete).catch(() => { });
        }
      }
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rectW = canvas.width / dpr;
    const rectH = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rectW, rectH);

    const hRatio = rectW / img.width;
    const vRatio = rectH / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShiftX = (rectW - img.width * ratio) / 2;
    const centerShiftY = (rectH - img.height * ratio) / 2;

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

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.floor(rect.width * dpr);
    const targetH = Math.floor(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    drawCanvasFrame(lastFrameRef.current);
  };

  /* Draw frame-1 as soon as frames load */
  useEffect(() => {
    if (framesLoaded) {
      resizeCanvas();
      drawCanvasFrame(0);
    }
  }, [framesLoaded]);

  /* Resize listener */
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  /* Lenis smooth scrolling setup */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.8,
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

      if (href === "#" || href === "#top") {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      try {
        const target = document.querySelector(href);
        if (target && lenisRef.current) {
          lenisRef.current.scrollTo(target as HTMLElement, { offset: -60, duration: 1.2 });
        } else if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } catch (err) {
        console.warn("Invalid anchor selector:", href, err);
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

      // 3. About Section: Elegant entrance for shop image and textual content
      gsap.fromTo(
        ".gsap-about-frame-container",
        { opacity: 0, scale: 0.96, y: 30 },
        {
          scrollTrigger: {
            trigger: "#about",
            start: "top 85%",
          },
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".gsap-about-text",
        { opacity: 0, y: 25 },
        {
          scrollTrigger: {
            trigger: "#about",
            start: "top 80%",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Stat counters count-up
      const counterObj = { val1: 0, val2: 0 };
      gsap.to(counterObj, {
        scrollTrigger: {
          trigger: ".gsap-about-stats",
          start: "top 90%",
        },
        val1: 11467,
        val2: 8,
        duration: 2.2,
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

      // 4. Work Section ScrollTrigger refresh
      ScrollTrigger.refresh();

      // 5. Services Section (Guaranteed Visible)
      gsap.fromTo(
        ".gsap-services-header",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "#services",
            start: "top 95%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );

      gsap.fromTo(
        ".gsap-service-row",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: "#services",
            start: "top 95%",
          },
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );

      // 6. Testimonials Section
      gsap.fromTo(".gsap-quote-block", { scale: 0.96, opacity: 0 }, {
        scrollTrigger: { trigger: "#reviews", start: "top 95%" },
        scale: 1, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity"
      });

      gsap.fromTo(".gsap-review-card", { y: 30, opacity: 0 }, {
        scrollTrigger: { trigger: "#reviews", start: "top 95%" },
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out", clearProps: "transform,opacity"
      });

      // 7. FAQ Section
      gsap.fromTo(".gsap-faq-header", { y: 30, opacity: 0 }, {
        scrollTrigger: { trigger: "#faq", start: "top 95%" },
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity"
      });

      gsap.fromTo(".gsap-faq-item", { y: 25, opacity: 0 }, {
        scrollTrigger: { trigger: "#faq", start: "top 95%" },
        y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity"
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
      className="no-cursor overflow-x-hidden hide-scrollbar"
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
          className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
        >
          <img
            src={imgLogo.src}
            alt="AMP Studio Logo"
            className="h-8 md:h-10 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(255,200,0,0.2)]"
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {[
            ["About", "#about"],
            ["Founders", "/founders"],
            ["Work", "#work"],
            ["Services", "#services"],
            ["Reviews", "#reviews"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            href.startsWith("/") ? (
              <Link
                key={label}
                href={href}
                style={{ ...mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = WHITE)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
              >
                {label}
              </Link>
            ) : (
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
            )
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
          {[
            ["About", "#about"],
            ["About Founders", "/founders"],
            ["Work", "#work"],
            ["Services", "#services"],
            ["Reviews", "#reviews"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            href.startsWith("/") ? (
              <Link
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{ ...serif, fontSize: "2.5rem", color: WHITE, textDecoration: "none" }}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                onClick={(e) => handleAnchorClick(e, href)}
                style={{ ...serif, fontSize: "2.5rem", color: WHITE, textDecoration: "none" }}
              >
                {label}
              </a>
            )
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="min-h-screen grid md:grid-cols-2 relative">
        {/* Left */}
        <div className="flex flex-col justify-end pb-20 pt-36 px-6 lg:px-14 relative z-10">
          <div
            className="gsap-hero-tag flex items-center gap-4 mb-12"
            style={{ ...mono, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: MUTED }}
          >
          </div>

          <h1 style={{ ...serif, fontWeight: 300, color: WHITE }}>
            {[
              { text: "AMMA", color: WHITE, size: "clamp(4rem, 7vw, 7rem)" },
              { text: "Mahadevi", color: GOLD, size: "clamp(4.2rem, 12.5vw, 12.5rem)", font: script },
              { text: "PHOTOGRAPHY", color: WHITE, size: "clamp(3.2rem, 6.2vw, 6.3rem)", tracking: "0.02em" },
            ].map(({ text, color, size, tracking, font }: { text: string; color: string; size: string; tracking?: string; font?: any }) => (
              <span key={text} className="block overflow-visible whitespace-nowrap py-1">
                <span
                  className="gsap-hero-title-line block leading-none"
                  style={{
                    color,
                    fontSize: size,
                    letterSpacing: tracking || "-0.02em",
                    fontStyle: "italic",
                    ...(font ?? {}),
                  }}
                >
                  {text}
                </span>
              </span>
            ))}
          </h1>

          {/* <p
            className="gsap-hero-desc mt-6 text-sm md:text-base text-[#ffc800] tracking-wide"
            style={{ ...serif, fontStyle: "italic", fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)" }}
          >
            “Capturing the essence of photography in Bijapur”
          </p> */}

          <p
            className="gsap-hero-desc mt-4 leading-relaxed max-w-sm"
            style={{ fontSize: "0.875rem", color: MUTED }}
          >
            Wedding and event photography and videography in Bijapur,
            Karnataka. We cover weddings, engagements, maternity, and
            portrait sessions across North Karnataka.
          </p>

          <div className="flex gap-5 mt-10 items-center">
            <Link
              href="/contact"
              className="gsap-hero-btn"
              style={{ background: GOLD, color: BG, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", padding: "0.8rem 1.6rem", textDecoration: "none", fontWeight: 500, transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#e6b400")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = GOLD)}
            >
              Book a Session
            </Link>
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
            onItemClick={(item: DriftWallItem) => {
              setSelectedPhoto({
                image: item.image.replace("w=600", "w=1600"),
                title: item.title || "AMP Studio Photography",
                category: "Bijapur Photography Archive",
                location: "Bijapur, Karnataka",
              });
            }}
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

      {/* About Section - Studio Showcase with Shop Image & Link to Founders */}
      <section
        id="about"
        className="w-full min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col justify-center px-6 lg:px-14 xl:px-20 py-20 md:py-28"
        style={{ borderTop: `1px solid ${BORDER}`, background: BG_DARK }}
      >
        <div className="w-full my-auto" style={{ maxWidth: 1480, margin: "0 auto" }}>
          {/* Main Grid: Studio Shop Image on Left, Text + Stats on Right */}
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
            {/* Studio Workspace / Shop Image */}
            <div className="gsap-about-frame-container md:col-span-6 relative rounded-2xl overflow-hidden border border-white/15 bg-[#070707] shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] xl:aspect-[5/4] w-full relative overflow-hidden min-h-[340px] md:min-h-[460px] lg:min-h-[540px]">
                <img
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1400&q=85&fit=crop&auto=format"
                  alt="AMP Studio photography workspace and studio in Bijapur"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* About Text + Stat Counters + About Founders Button */}
            <div className="md:col-span-6 flex flex-col justify-center space-y-7 md:space-y-8">
              {/* Subtle kicker badge */}
              <div className="flex items-center gap-3">
                <span
                  style={{ ...mono }}
                  className="text-[0.68rem] text-[#ffc800] tracking-[0.25em] uppercase font-medium"
                >
                  About The Studio
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#ffc800]/40 to-transparent max-w-[120px]" />
              </div>

              <p
                className="gsap-about-text"
                style={{
                  ...serif,
                  fontWeight: 300,
                  fontSize: "clamp(1.9rem, 2.75vw, 2.75rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.38,
                  color: WHITE,
                }}
              >
                AMP Studio is a <span style={{ ...script, color: GOLD }} className="text-4xl md:text-5xl lg:text-6xl font-normal">photography</span> and <span style={{ ...script, color: GOLD }} className="text-4xl md:text-5xl lg:text-6xl font-normal">videography</span> studio based in Bijapur, Karnataka. We cover weddings, engagements, and portraits across North Karnataka in a natural, candid style.
              </p>

              {/* Rectangular "About the founders" CTA button */}
              <div className="pt-1">
                <Link
                  href="/founders"
                  style={{ ...mono }}
                  className="inline-flex items-center gap-3 px-7 py-3.5 border border-[#ffc800] text-[#ffc800] hover:bg-[#ffc800] hover:text-black text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 group"
                >
                  <span>About the founders</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </Link>
              </div>

            </div>

            {/* Full-width stats row */}
            <div className="gsap-about-stats md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mt-2 md:mt-6 pt-8 border-t border-[#1e1e1e] items-end justify-items-center text-center">
              <div className="gsap-stat-item flex min-w-0 w-full flex-col items-center justify-end">
                <div className="h-20 flex items-end justify-center">
                  <div className="tabular-nums" style={{ ...serif, fontSize: "clamp(3rem, 5vw, 4.75rem)", fontWeight: 300, lineHeight: 0.9, color: WHITE }}>
                    {stat1.toLocaleString()}+
                  </div>
                </div>
                <div className="whitespace-nowrap" style={{ ...mono, fontSize: "clamp(0.58rem, 0.8vw, 0.68rem)", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "1rem" }}>
                  Sessions completed
                </div>
              </div>

              <div className="gsap-stat-item flex min-w-0 w-full flex-col items-center justify-end">
                <div className="h-20 flex items-end justify-center">
                  <div
                    role="img"
                    aria-label="5 out of 5 stars"
                    className="flex items-center justify-center gap-[0.1em]"
                    style={{
                      ...mono,
                      fontSize: "clamp(3rem, 4.6vw, 4.75rem)",
                      fontWeight: 500,
                      lineHeight: 0.9,
                      color: GOLD,
                      textShadow: "0 0 20px rgba(255,200,0,0.55)",
                    }}
                  >
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="whitespace-nowrap" style={{ ...mono, fontSize: "clamp(0.58rem, 0.8vw, 0.68rem)", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "1rem" }}>
                  5-Star Client Rating
                </div>
              </div>

              <div className="gsap-stat-item flex min-w-0 w-full flex-col items-center justify-end">
                <div className="h-20 flex items-end justify-center">
                  <div className="tabular-nums" style={{ ...serif, fontSize: "clamp(3rem, 5vw, 4.75rem)", fontWeight: 300, lineHeight: 0.9, color: WHITE }}>
                    {stat2} yrs
                  </div>
                </div>
                <div className="whitespace-nowrap" style={{ ...mono, fontSize: "clamp(0.58rem, 0.8vw, 0.68rem)", textTransform: "uppercase", letterSpacing: "0.15em", color: MUTED, marginTop: "1rem" }}>
                  Photography experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Gallery (Side scrolling on scroll down matching kingpinvisionforge.com) */}
      <SelectedWork
        items={galleryItems}
        onPhotoClick={(item) => setSelectedPhoto(item)}
      />

      {/* Services */}
      <section id="services" style={{ background: BG_DARK, borderTop: `1px solid ${BORDER}`, padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div className="gsap-services-header flex flex-col gap-3 mb-14">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", letterSpacing: "-0.025em", lineHeight: 1.1, color: WHITE }} className="whitespace-nowrap flex items-baseline gap-3">
              <span>What</span>
              <em style={{ ...script, color: GOLD }}>We Offer</em>
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-xl" style={{ color: MUTED }}>
              Bespoke photography, videography, and handcrafted album designing across Bijapur and North Karnataka.
            </p>
          </div>

          <div className="gsap-services-list flex flex-col gap-2">
            {services.map((svc, i) => (
              <ServiceRow
                key={svc.num}
                svc={svc}
                i={i}
                onPhotoClick={(item) => setSelectedPhoto(item)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" style={{ borderTop: `1px solid ${BORDER}`, padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="flex flex-col gap-3 mb-12">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", letterSpacing: "-0.025em", lineHeight: 1.1, color: WHITE }} className="whitespace-nowrap flex items-baseline gap-3">
              <span>Client</span>
              <em style={{ ...script, color: GOLD }}>Stories</em>
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-xl" style={{ color: MUTED }}>
              Read what couples and families across Bijapur say about their candid photo sessions.
            </p>
          </div>

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
                className={`gsap-review-card flex flex-col justify-between${i === testimonials.length - 1 && testimonials.length % 2 === 1 ? " md:col-span-2" : ""}`}
                style={{ background: CARD, border: `1px solid ${BORDER}`, padding: "2rem", transition: "border-color 0.3s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = BORDER)}
              >
                <div
                  style={{
                    ...mono,
                    fontSize: "1.25rem",
                    color: GOLD,
                    letterSpacing: "0.2em",
                    marginBottom: "1.25rem",
                    textShadow: "0 0 10px rgba(255,200,0,0.35)",
                  }}
                >
                  {t.stars}
                </div>
                <p style={{ ...serif, fontSize: "1rem", fontStyle: "italic", color: MUTED, lineHeight: 1.75, marginBottom: "1.25rem" }}>{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ width: 36, height: 36, background: "#2a2a2a", ...mono, fontSize: "0.8rem", color: GOLD }}>
                    {t.avatar ? (
                      <img src={t.avatar} alt={`${t.name}, AMP Studio client`} className="w-full h-full object-cover" />
                    ) : (
                      t.name.charAt(0)
                    )}
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
          <div className="gsap-faq-header flex flex-col gap-3 mb-12">
            <h2 style={{ ...serif, fontWeight: 300, fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)", letterSpacing: "-0.025em", lineHeight: 1.1, color: WHITE }} className="whitespace-nowrap flex items-baseline gap-3">
              <span>Frequently Asked</span>
              <em style={{ ...script, color: GOLD }}>Questions</em>
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-xl" style={{ color: MUTED }}>
              Everything you need to know about booking, session locations, timelines, and photo delivery in Bijapur.
            </p>
          </div>

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
            <Link
              href="/contact"
              style={{ background: GOLD, color: BG, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", padding: "0.9rem 2rem", textDecoration: "none", fontWeight: 500, transition: "background 0.2s" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#e6b400")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.background = GOLD)}
            >
              Book a Session
            </Link>
          </div>
        </div>

        {/* Marquee */}
        <div className="mt-24 overflow-hidden" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "1.5rem" }}>
          <div className="animate-marquee inline-block whitespace-nowrap">
            {["Maternity", "Pre Wedding", "Wedding", "Occasions", "Candid Portraits", "Designing / Editing", "New Borns", "Maternity", "Pre Wedding", "Wedding", "Occasions", "Candid Portraits", "Designing / Editing", "New Borns"].map((s, i) => (
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
        {/* Left: 2026 AMP Studio */}
        <div style={{ ...mono, fontSize: "0.68rem", color: MUTED, letterSpacing: "0.15em" }}>
          © 2026 AMP Studio
        </div>

        {/* Center: Made by KingpiN Vision Forge */}
        <div style={{ ...mono, fontSize: "0.68rem", color: WHITE, letterSpacing: "0.15em", textAlign: "center" }} className="flex items-center gap-1.5">
          <span style={{ color: MUTED }}>Made by</span>
          <span style={{ color: GOLD, fontWeight: 500 }}>KingpiN Vision Forge</span>
        </div>

        {/* Legal Links (T&C, Privacy Policy, Cookie Policy) */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-5 my-2 md:my-0">
          <button
            onClick={() => setLegalTab("terms")}
            style={{ ...mono, fontSize: "0.65rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", padding: 0 }}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Terms & Conditions
          </button>
          <span className="text-white/20 text-xs">·</span>
          <button
            onClick={() => setLegalTab("privacy")}
            style={{ ...mono, fontSize: "0.65rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", padding: 0 }}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-white/20 text-xs">·</span>
          <button
            onClick={() => setLegalTab("cookie")}
            style={{ ...mono, fontSize: "0.65rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", padding: 0 }}
            className="hover:text-white cursor-pointer transition-colors"
          >
            Cookie Policy
          </button>
        </div>

        {/* Right: Social Links */}
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

      {/* Standalone Photo Viewer Modal */}
      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Terms & Conditions / Privacy Policy / Cookie Policy Modal */}
      <LegalModal
        activeTab={legalTab}
        onClose={() => setLegalTab(null)}
        onSelectTab={(tab) => setLegalTab(tab)}
      />
    </div>
  );
}
