"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";

const GOLD = "#ffc800";
const BG = "#0b0b0b";
const BG_DARK = "#0f0f0f";
const WHITE = "#f5f0e8";
const MUTED = "#888882";
const BORDER = "#1e1e1e";

const serif = { fontFamily: "Italiana, serif" } as const;
const script = { fontFamily: "Italianno, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;
const sans = { fontFamily: "DM Sans, sans-serif" } as const;

const SERVICES = [
  "Maternity",
  "Pre Wedding",
  "Wedding",
  "Occasions",
  "Candid Portraits",
  "Designing / Editing",
  "New Borns",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICES[0]);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Bijapur, Karnataka");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  // Custom cursor
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [ring, setRing] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
    };
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

  const buildWhatsAppMessage = () => {
    let msg = `*AMP Studio: Session Booking Enquiry*\n\n`;
    msg += `*Name:* ${name.trim() || "[Not specified]"}\n`;
    msg += `*WhatsApp:* ${phone.trim() || "[Not specified]"}\n`;
    msg += `*Session Type:* ${service}\n`;
    if (date) msg += `*Preferred Date:* ${date}\n`;
    if (location.trim()) msg += `*Location / Venue:* ${location.trim()}\n`;
    if (notes.trim()) msg += `*Notes & Vision:*\n${notes.trim()}\n\n`;
    msg += `_Sent via AMP Studio website booking portal_`;
    return msg;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your WhatsApp contact number.");
      return;
    }
    setError("");
    setSent(true);

    const message = buildWhatsAppMessage();
    const waUrl = `https://wa.me/919686810436?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const ringSize = hovered ? 52 : 36;

  return (
    <div
      className="no-cursor overflow-x-hidden hide-scrollbar min-h-screen"
      style={{ ...sans, background: BG, color: WHITE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Custom cursor dot & ring */}
      <div
        className="fixed pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{
          width: 8,
          height: 8,
          background: WHITE,
          transform: `translate(${dot.x - 4}px, ${dot.y - 4}px)`,
          mixBlendMode: "difference",
        }}
      />
      <div
        className="fixed pointer-events-none z-[9999] rounded-full hidden md:block"
        style={{
          width: ringSize,
          height: ringSize,
          border: `1px solid rgba(245,240,232,0.35)`,
          transform: `translate(${ring.x - ringSize / 2}px, ${ring.y - ringSize / 2}px)`,
          transition: "width 0.25s, height 0.25s",
          mixBlendMode: "difference",
        }}
      />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 lg:px-14 py-6 bg-black/75 backdrop-blur-md border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 text-white hover:text-[#ffc800] transition-colors"
        >
          <span style={{ ...mono }} className="text-xs tracking-widest uppercase text-white/60 hover:text-white">
            ← Return to Main
          </span>
        </Link>


        <a
          href="tel:+919686810436"
          style={{ ...mono }}
          className="text-xs uppercase tracking-widest px-4 py-2 border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all"
        >
          Direct Call
        </a>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-24 px-6 lg:px-14 max-w-7xl mx-auto">
        {/* Page Hero Title */}
        <div className="mb-14 lg:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ ...mono }} className="text-xs text-[#ffc800] tracking-[0.25em] uppercase font-medium">
              Reserve Your Date
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-[#ffc800]/40 to-transparent max-w-xs" />
          </div>

          <h1
            style={{ ...serif }}
            className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-tight"
          >
            Book Your <span style={{ ...script, color: GOLD }} className="text-5xl sm:text-6xl lg:text-8xl">Session</span> With Us
          </h1>

          <p style={{ ...sans }} className="text-base text-[#9e9e98] max-w-2xl mt-4 leading-relaxed font-light">
            Fill out your celebration details below. Submitting will open WhatsApp with your customized booking details directly sent to AMP Studio.
          </p>
        </div>

        {/* 2-Column Booking Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact Info & Guarantees */}
          <div className="lg:col-span-5 space-y-8">
            {/* WhatsApp Direct Card */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#121212] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffc800]/5 rounded-full blur-3xl pointer-events-none" />

              <div style={{ ...mono }} className="text-xs text-[#ffc800] uppercase tracking-widest mb-2">
                Fastest Response
              </div>
              <h2 style={{ ...serif }} className="text-2xl text-white font-light mb-2">
                Instant WhatsApp Booking
              </h2>
              <p style={{ ...sans }} className="text-sm text-[#888882] mb-6 leading-relaxed font-light">
                Have a quick question or want to check date availability right away? Message our team directly.
              </p>

              <a
                href="https://wa.me/919686810436?text=Hi%20AMP%20Studio%2C%20I%20would%20like%20to%20check%20availability%20for%20a%20photography%20session."
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...mono }}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-black border border-[#25D366]/40 rounded-none uppercase text-xs tracking-widest font-medium transition-all duration-300"
              >
                <span>Chat on WhatsApp Directly</span>
                <span>→</span>
              </a>
            </div>

            {/* Studio Info Details */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#0f0f0f] border border-white/10 space-y-6">
              <div>
                <div style={{ ...mono }} className="text-[0.68rem] text-white/50 uppercase tracking-widest">
                  Studio Phone
                </div>
                <a
                  href="tel:+919686810436"
                  style={{ ...serif }}
                  className="text-2xl text-white hover:text-[#ffc800] transition-colors mt-1 block font-light"
                >
                  +91 96868 10436
                </a>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <div style={{ ...mono }} className="text-[0.68rem] text-white/50 uppercase tracking-widest">
                  Studio Location
                </div>
                <div style={{ ...sans }} className="text-sm text-white/90 mt-1.5 font-light leading-relaxed">
                  AMP Studio, Bijapur (Vijayapura), Karnataka, India
                </div>
                <div style={{ ...mono }} className="text-xs text-[#888882] mt-1">
                  Covering Vijayapura and other Northern Karnataka Cities
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <div style={{ ...mono }} className="text-[0.68rem] text-white/50 uppercase tracking-widest">
                  Operating Hours
                </div>
                <div style={{ ...sans }} className="text-sm text-white/90 mt-1 font-light">
                  Monday - Sunday · 9:00 AM - 9:00 PM IST
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div>
                <div style={{ ...mono }} className="text-[0.68rem] text-white/50 uppercase tracking-widest">
                  Booking Recommendation
                </div>
                <p style={{ ...sans }} className="text-xs text-[#888882] mt-1 leading-relaxed font-light">
                  For weddings in North Karnataka, we recommend reserving 3 to 4 months prior. Portrait and maternity sessions typically require 2 to 3 weeks notice.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-10 rounded-2xl bg-[#141414] border border-white/15 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <h3 style={{ ...serif }} className="text-2xl sm:text-3xl text-white font-light">
                    Session Request Form
                  </h3>
                  <p style={{ ...mono }} className="text-xs text-white/50 tracking-wider mt-1 uppercase">
                    Connects directly to WhatsApp
                  </p>
                </div>
                <span className="text-2xl">📸</span>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-500/40 text-red-200 text-xs rounded font-mono">
                  ⚠ {error}
                </div>
              )}

              {sent && (
                <div className="mb-6 p-4 bg-[#25D366]/15 border border-[#25D366]/40 text-[#25D366] text-xs rounded font-mono flex items-center justify-between">
                  <span>✓ WhatsApp window opened. Feel free to press send!</span>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-white/60 hover:text-white underline ml-3"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                {/* Name & Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Pooja & Rohan"
                      className="w-full bg-[#0a0a0a] border border-white/20 focus:border-[#ffc800] text-white px-4 py-3 text-sm rounded-none outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 96868 10436"
                      className="w-full bg-[#0a0a0a] border border-white/20 focus:border-[#ffc800] text-white px-4 py-3 text-sm rounded-none outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Session Type Chips */}
                <div>
                  <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2.5">
                    Session / Event Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {SERVICES.map((item) => {
                      const active = service === item;
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setService(item)}
                          className={`text-left px-3.5 py-2.5 text-xs transition-all border ${
                            active
                              ? "bg-[#ffc800] text-black border-[#ffc800] font-medium"
                              : "bg-[#0a0a0a] text-white/75 border-white/15 hover:border-white/40"
                          }`}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Location */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#0a0a0a] border border-white/20 focus:border-[#ffc800] text-white px-4 py-3 text-sm rounded-none outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2">
                      Location / Venue
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bijapur, Karnataka"
                      className="w-full bg-[#0a0a0a] border border-white/20 focus:border-[#ffc800] text-white px-4 py-3 text-sm rounded-none outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Vision / Notes */}
                <div>
                  <label style={{ ...mono }} className="block text-xs uppercase tracking-widest text-white/70 mb-2">
                    Session Details / Vision (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell us about the ceremonies, hours, family traditions, or any special requests..."
                    className="w-full bg-[#0a0a0a] border border-white/20 focus:border-[#ffc800] text-white px-4 py-3 text-sm rounded-none outline-none transition-colors resize-none"
                  />
                </div>

                {/* WhatsApp Message Preview Box */}
                <div className="p-4 rounded-lg bg-black/50 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ ...mono }} className="text-[0.65rem] text-white/50 uppercase tracking-widest">
                      WhatsApp Message Preview
                    </span>
                    <span style={{ ...mono }} className="text-[0.65rem] text-[#25D366]">
                      ● Directly formatted
                    </span>
                  </div>
                  <pre className="text-xs text-[#a0a09a] font-mono whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
                    {buildWhatsAppMessage()}
                  </pre>
                </div>

                {/* Submit Rectangular Button */}
                <button
                  type="submit"
                  style={{ ...mono }}
                  className="w-full py-4 bg-[#ffc800] hover:bg-[#e6b400] text-black uppercase tracking-[0.2em] font-medium text-xs rounded-none transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Book via WhatsApp</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </button>

                <p style={{ ...mono }} className="text-[0.65rem] text-center text-[#888882] tracking-wider uppercase">
                  Sent directly to +91 96868 10436 · No spam guarantee
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 lg:px-14 py-8 bg-black border-t border-white/10"
      >
        <div style={{ ...mono }} className="text-xs text-white/50 tracking-wider">
          © 2026 AMP Studio · Bijapur, Karnataka
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            style={{ ...mono }}
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/founders"
            style={{ ...mono }}
            className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            Founders
          </Link>
          <a
            href="tel:+919686810436"
            style={{ ...mono }}
            className="text-xs uppercase tracking-widest text-[#ffc800] hover:underline"
          >
            +91 96868 10436
          </a>
        </div>
      </footer>
    </div>
  );
}
