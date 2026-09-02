"use client";

import { useEffect } from "react";

export type LegalTab = "terms" | "privacy" | "cookie";

interface LegalModalProps {
  activeTab: LegalTab | null;
  onClose: () => void;
  onSelectTab: (tab: LegalTab) => void;
}

const serif = { fontFamily: "Italiana, serif" } as const;
const mono = { fontFamily: "DM Mono, monospace" } as const;
const sans = { fontFamily: "DM Sans, sans-serif" } as const;

export default function LegalModal({ activeTab, onClose, onSelectTab }: LegalModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (activeTab) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeTab, onClose]);

  if (!activeTab) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8"
      style={{
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(16px)",
      }}
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl border border-white/15 bg-[#121212] shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
        style={{ ...sans }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#161616]">
          <div className="flex items-center gap-3">
            <span style={{ ...mono }} className="text-[0.65rem] text-[#ffc800] uppercase tracking-widest px-2 py-0.5 rounded bg-[#ffc800]/10 border border-[#ffc800]/20">
              AMP Studio Legal
            </span>
            <span style={{ ...mono }} className="text-[0.7rem] text-white/50 uppercase tracking-widest hidden sm:inline">
              Bijapur, Karnataka
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
            aria-label="Close legal modal"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-[#0f0f0f] px-6">
          <button
            onClick={() => onSelectTab("terms")}
            style={{ ...mono }}
            className={`py-3 px-4 text-xs uppercase tracking-widest transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "terms"
                ? "border-[#ffc800] text-[#ffc800] font-medium"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => onSelectTab("privacy")}
            style={{ ...mono }}
            className={`py-3 px-4 text-xs uppercase tracking-widest transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "privacy"
                ? "border-[#ffc800] text-[#ffc800] font-medium"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onSelectTab("cookie")}
            style={{ ...mono }}
            className={`py-3 px-4 text-xs uppercase tracking-widest transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === "cookie"
                ? "border-[#ffc800] text-[#ffc800] font-medium"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-[#a0a09a] leading-relaxed">
          {activeTab === "terms" && (
            <div>
              <h2 style={{ ...serif }} className="text-2xl md:text-3xl text-white font-light mb-4">
                Terms & Conditions
              </h2>
              <p className="text-xs text-[#ffc800] font-mono tracking-widest uppercase mb-6">
                Last updated: March 2026 · AMP Studio (Bijapur, Karnataka)
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-1.5">1. Booking & Reservations</h3>
                  <p>
                    All photography and videography assignments across Bijapur and North Karnataka are secured on a first-confirmed basis upon written consultation or mutual date confirmation. We encourage reserving dates 2 to 4 weeks in advance for portrait/family sessions and 3 to 4 months for weddings.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">2. Creative Rights & Gallery Usage</h3>
                  <p>
                    AMP Studio retains the artistic copyright to all original photographs and motion assets captured. Clients receive high-resolution, watermark-free digital galleries with personal, non-commercial reproduction rights for printing and social sharing.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">3. Delivery Timelines</h3>
                  <p>
                    Curated portraits and family collections are typically delivered within 1 to 2 weeks. Comprehensive wedding collections are processed within 3 to 4 weeks to maintain meticulous color integrity and candid realism.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">4. Location & Permits</h3>
                  <p>
                    Shoots conducted around heritage monuments (such as Gol Gumbaz, Ibrahim Rauza, or Bara Kaman) adhere to local municipal guidelines and regulations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h2 style={{ ...serif }} className="text-2xl md:text-3xl text-white font-light mb-4">
                Privacy Policy
              </h2>
              <p className="text-xs text-[#ffc800] font-mono tracking-widest uppercase mb-6">
                Effective: March 2026 · Committed to Client Confidentiality
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-1.5">1. Information We Collect</h3>
                  <p>
                    We collect personal details such as client names, contact numbers, email addresses, shoot dates, and preferred Bijapur venues solely to communicate, prepare custom itineraries, and deliver client galleries.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">2. Photo Gallery Confidentiality</h3>
                  <p>
                    Client photo galleries are hosted in private, secure cloud spaces. Private galleries are accessible only to the client and invited guests with authorized credentials or links.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">3. Third-Party Sharing</h3>
                  <p>
                    AMP Studio never sells, rents, or leases personal details to marketing vendors or unauthorized third parties.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">4. Data Inquiries</h3>
                  <p>
                    For inquiries regarding data removal, gallery storage, or access logs, please contact us directly via our phone line or email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cookie" && (
            <div>
              <h2 style={{ ...serif }} className="text-2xl md:text-3xl text-white font-light mb-4">
                Cookie Policy
              </h2>
              <p className="text-xs text-[#ffc800] font-mono tracking-widest uppercase mb-6">
                Transparent Browser Storage
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-1.5">1. What Are Cookies?</h3>
                  <p>
                    Cookies are small text records placed on your device to ensure seamless web navigation, remember visual settings (such as shutter animations and interactive photo shelf states), and optimize page performance.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">2. How We Use Them</h3>
                  <p>
                    We utilize strictly essential and performance cookies to render high-resolution image sequences, enable Lenis smooth scrolling, and record anonymous interaction metrics.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-1.5">3. Managing Preferences</h3>
                  <p>
                    You can configure your browser to block or alert you about these cookies at any time, though certain animation components may not operate smoothly without them.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#161616] flex justify-between items-center text-xs">
          <span style={{ ...mono }} className="text-white/40 uppercase tracking-wider">
            © 2026 AMP Studio · All Rights Reserved
          </span>
          <button
            onClick={onClose}
            style={{ ...mono }}
            className="px-4 py-1.5 rounded bg-[#ffc800] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e6b400] transition-colors cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
