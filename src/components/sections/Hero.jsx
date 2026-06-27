import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";

// ─── Typing Text ──────────────────────────────────────────────────────────────
const TypingText = ({ messages, currentIndex }) => {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const message = messages[currentIndex];
    let index = 0;
    setDisplayed("");
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (index < message.length) {
        setDisplayed(message.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <span>
      {displayed}
      {isTyping && (
        <span
          className="inline-block w-0.5 h-5 bg-accent ml-0.5
          align-middle animate-pulse"
        />
      )}
    </span>
  );
};

// ─── Message Box ──────────────────────────────────────────────────────────────
const MessageBox = ({ messages, currentIndex }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 16, x: -10 },
      { opacity: 1, y: 0, x: 0, duration: 0.6, ease: "power3.out" },
    );
  }, [currentIndex]);

  return (
    <div ref={boxRef} className="relative max-w-sm w-full">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-accent via-accent/50 to-transparent mb-0" />

      {/* Box */}
      <div
        className="bg-black/70 backdrop-blur-md border-l-2 border-accent
        border-r border-t border-b border-r-white/5 border-t-white/5 border-b-white/5
        px-6 py-5"
      >
        {/* Label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 bg-accent" />
          </span>
          <p className="text-accent text-[10px] font-bold uppercase tracking-[0.25em]">
            BreemTech
          </p>
        </div>

        {/* Typing message */}
        <p className="text-light text-lg sm:text-xl font-semibold leading-snug font-display min-h-[56px]">
          <TypingText messages={messages} currentIndex={currentIndex} />
        </p>

        {/* Bottom accent */}
        <div className="mt-4 h-px bg-gradient-to-r from-accent/40 to-transparent" />
      </div>
    </div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const StatsBar = () => {
  const stats = [
    { icon: <Zap size={14} />, value: "500+", label: "Products" },
    { icon: <Star size={14} />, value: "4.9★", label: "Rating" },
    { icon: <Shield size={14} />, value: "2 Yr", label: "Warranty" },
  ];

  return (
    <div className="flex items-center gap-0">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`stat-card flex items-center gap-3 px-5 py-3
            bg-black/60 backdrop-blur-md
            border-t border-b border-white/5
            ${i === 0 ? "border-l border-l-white/5" : ""}
            ${i === stats.length - 1 ? "border-r border-r-white/5" : ""}
            ${i !== stats.length - 1 ? "border-r border-r-accent/20" : ""}`}
        >
          <span className="text-accent">{s.icon}</span>
          <div>
            <p className="text-light font-bold text-sm leading-none">
              {s.value}
            </p>
            <p className="text-primary-500 text-[10px] uppercase tracking-wider mt-0.5">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);

  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "What are you looking for today?",
    "Explore our latest premium smartphones",
    "Discover powerful laptops for creators",
    "Best prices. Real warranty. Always.",
    "New arrivals just dropped. Shop now.",
  ];

  // Cycle messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: "power2.out" },
    ).fromTo(
      contentRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=0.8",
    );

    // Scroll indicator
    gsap.fromTo(
      scrollRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.5, ease: "power2.out" },
    );

    gsap.to(scrollRef.current, {
      y: 10,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      {/* ── Full BG Image ── */}
      <div className="absolute inset-0">
        <img
          src="/herobg.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ── Overlays ── */}
      <div ref={overlayRef} className="absolute inset-0">
        {/* Dark left gradient so text is readable */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)",
          }}
        />

        {/* Bottom fade to dark */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{
            background: "linear-gradient(to top, #080808 0%, transparent 100%)",
          }}
        />

        {/* Top fade */}
        <div
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        />

        {/* Green tint overlay to blend with accent */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 70% 50%, rgba(0,255,136,0.15) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div
        ref={contentRef}
        className="relative z-10 flex-1 flex flex-col justify-center
    max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8
    pt-20 pb-16 sm:pt-28 sm:pb-24 lg:justify-end lg:pb-32"
      >
        {/* Message Box */}
        <div className="mb-8 sm:mb-10">
          <MessageBox messages={messages} currentIndex={currentMessage} />
        </div>

        {/* CTA Buttons */}
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-12 w-full sm:w-auto">
          {/* Shop Now */}
          <Link
            to="/products"
            className="group relative overflow-hidden
      bg-accent text-dark font-bold text-xs uppercase tracking-widest
      px-7 py-3.5 flex items-center justify-center gap-2
      hover:bg-accent-dim transition-all duration-300
      hover:shadow-xl hover:shadow-accent/30
      w-full sm:w-auto"
          >
            <span className="relative z-10 flex items-center gap-2">
              Shop Now
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full
      bg-gradient-to-r from-transparent via-white/20 to-transparent
      transition-transform duration-700 skew-x-12"
            />
          </Link>

          {/* Bottom row — side by side on mobile */}
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/products?category=mobile"
              className="group flex-1 sm:flex-none border border-accent/40 text-light
        font-semibold text-xs uppercase tracking-widest
        px-5 sm:px-7 py-3.5 flex items-center justify-center gap-2
        hover:border-accent hover:text-accent
        transition-all duration-300 backdrop-blur-sm bg-black/30"
            >
              Mobiles
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100
          group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>

            <Link
              to="/products?category=pc"
              className="group flex-1 sm:flex-none border border-white/10 text-light/60
        font-semibold text-xs uppercase tracking-widest
        px-5 sm:px-7 py-3.5 flex items-center justify-center gap-2
        hover:border-accent/40 hover:text-light
        transition-all duration-300 backdrop-blur-sm bg-black/20"
            >
              View PCs
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100
          group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>
          </div>
        </div>
        {/* Stats */}
        <StatsBar />
      </div>

      {/* ── Scroll Indicator ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-6 right-8
          flex flex-col items-center gap-2 pointer-events-none z-20"
      >
        <div className="w-px h-10 bg-gradient-to-b from-accent/60 to-transparent" />
        <span className="text-accent/60 text-[9px] uppercase tracking-[0.2em] rotate-90 mt-2">
          Scroll
        </span>
      </div>
    </section>
  );
};

export default Hero;
