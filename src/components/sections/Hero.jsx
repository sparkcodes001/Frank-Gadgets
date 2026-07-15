// Hero.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight, Zap, Shield, Star, Sparkles } from "lucide-react";

// ─── Background Image + Overlay Effects ────────────────────────────────────────
const HeroBackground = ({ mousePos }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Actual product photo — slow Ken Burns zoom */}
      <img
        src="/herobg.jpg"
        alt="Premium Apple Devices — Frank Gadgets"
        className="w-full h-full object-cover object-center animate-kenburns"
      />

      {/* Legibility overlay — warm espresso gradient, left-heavy for text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(30,24,16,0.92) 0%, rgba(30,24,16,0.72) 32%, rgba(30,24,16,0.35) 55%, rgba(30,24,16,0.1) 75%, transparent 100%)",
        }}
      />

      {/* Bottom fade for stats bar legibility */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "45%",
          background:
            "linear-gradient(to top, rgba(30,24,16,0.95) 0%, rgba(30,24,16,0.5) 45%, transparent 100%)",
        }}
      />

      {/* Top fade for navbar legibility */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: "25%",
          background:
            "linear-gradient(to bottom, rgba(30,24,16,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Gold glow — mouse tracking, adds warmth over the photo */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-overlay"
        style={{
          width: "900px",
          height: "900px",
          top: "50%",
          left: "35%",
          transform: `translate(calc(-50% + ${mousePos.x * 50}px), calc(-50% + ${mousePos.y * 50}px))`,
          background:
            "radial-gradient(circle, rgba(200,155,92,0.35) 0%, rgba(200,155,92,0.1) 40%, transparent 70%)",
          transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />

      {/* Secondary glow bottom-right — sierra blue accent */}
      <div
        className="absolute rounded-full pointer-events-none mix-blend-overlay"
        style={{
          width: "500px",
          height: "500px",
          bottom: "-60px",
          right: "-40px",
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
          background:
            "radial-gradient(circle, rgba(141,160,184,0.25) 0%, transparent 65%)",
          transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      />

      <FloatingOrbs />

      {/* Fine noise grain — keeps the darkened area from looking flat/banded */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
};

// ─── Floating Orbs ─────────────────────────────────────────────────────────────
const FloatingOrbs = () => {
  const orbs = [
    {
      size: 220,
      top: "20%",
      left: "8%",
      color: "rgba(234,211,163,0.15)",
      delay: "0s",
      duration: "8s",
    },
    {
      size: 140,
      top: "70%",
      left: "15%",
      color: "rgba(200,155,92,0.15)",
      delay: "2s",
      duration: "10s",
    },
    {
      size: 100,
      top: "40%",
      left: "5%",
      color: "rgba(141,160,184,0.12)",
      delay: "4s",
      duration: "7s",
    },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            animation: `float ${orb.duration} ease-in-out infinite`,
            animationDelay: orb.delay,
            filter: "blur(3px)",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </>
  );
};

// ─── Typing Text ───────────────────────────────────────────────────────────────
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
    }, 38);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <span>
      {displayed}
      {isTyping && (
        <span
          className="inline-block w-[3px] ml-1 align-middle animate-pulse rounded-sm"
          style={{
            height: "1em",
            background: "linear-gradient(180deg, #C89B5C, #EAD3A3)",
          }}
        />
      )}
    </span>
  );
};

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsBar = () => {
  const stats = [
    { icon: <Zap size={13} />, value: "300+", label: "Gadgets" },
    { icon: <Star size={13} />, value: "4.8★", label: "Rated" },
    { icon: <Shield size={13} />, value: "Swap", label: "We Buy Too" },
  ];

  return (
    <div className="flex items-stretch">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 px-5 py-3 flex-1
            transition-all duration-300 cursor-default
            hover:bg-white/10
            ${i === 0 ? "border border-white/15" : "border-t border-b border-r border-white/15"}`}
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ color: "#EAD3A3" }}>{s.icon}</span>
          <div>
            <p className="text-white font-bold text-sm leading-none">
              {s.value}
            </p>
            <p
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{ color: "rgba(234,211,163,0.6)" }}
            >
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Floating Badge ─────────────────────────────────────────────────────────────
const FloatingBadge = () => {
  const badgeRef = useRef(null);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { opacity: 0, y: -20, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: 1.8,
        ease: "back.out(1.7)",
      },
    );
  }, []);

  return (
    <div
      ref={badgeRef}
      className="hidden lg:flex absolute top-28 right-10 z-20 items-center gap-3
        rounded-2xl px-5 py-3 opacity-0"
      style={{
        background: "rgba(30,24,16,0.55)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(234,211,163,0.25)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex -space-x-2">
        {["#C89B5C", "#DDBC85", "#EAD3A3"].map((color, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${color}cc, ${color}66)`,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <span className="text-[8px] text-white font-bold">
              {["FK", "AM", "CB"][i]}
            </span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={8}
              className="fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <p className="text-white text-xs font-bold leading-none">
          4.8/5 Rating
        </p>
        <p
          className="text-[10px] mt-0.5"
          style={{ color: "rgba(234,211,163,0.7)" }}
        >
          2,400+ Happy Customers
        </p>
      </div>
    </div>
  );
};

// ─── Live Indicator ────────────────────────────────────────────────────────────
const LiveIndicator = () => (
  <div
    className="hidden lg:flex absolute bottom-40 right-10 z-20 items-center gap-2
      rounded-full px-4 py-2"
    style={{
      background: "rgba(30,24,16,0.5)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(200,155,92,0.35)",
    }}
  >
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
    </span>
    <span className="text-white/80 text-[10px] font-medium tracking-widest uppercase">
      Store Open Now
    </span>
  </div>
);

// ─── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const messages = [
    "What gadget are you looking for today?",
    "Latest smartphones at unbeatable prices",
    "Got an old device? We buy & swap too!",
    "Genuine products. Real warranty. Always.",
    "New arrivals just dropped. Shop now.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    let rafId;
    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / rect.width - 0.5;
      target.y = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const animate = () => {
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      setMousePos({ x: current.x, y: current.y });
      rafId = requestAnimationFrame(animate);
    };

    node.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      node.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      )
        .fromTo(
          ".hero-headline",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        )
        .fromTo(
          ".hero-stats",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        );

      if (scrollRef.current) {
        gsap.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, delay: 2, ease: "power2.out" },
        );
        gsap.to(scrollRef.current, {
          y: 8,
          duration: 1.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 2.5,
        });
      }
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ background: "#1E1810" }}
    >
      <HeroBackground mousePos={mousePos} />
      <FloatingBadge />
      <LiveIndicator />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-center min-h-screen
          max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8
          pt-32 pb-24"
      >
        <div className="max-w-2xl">
          <div className="hero-badge opacity-0 mb-6">
            <span
              className="inline-flex items-center gap-2
                text-[10px] font-bold uppercase tracking-[0.25em]
                px-4 py-2 rounded-full"
              style={{
                background: "rgba(200,155,92,0.18)",
                border: "1px solid rgba(200,155,92,0.4)",
                color: "#EAD3A3",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles size={10} />
              Nigeria's #1 Premium Gadget Store
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#C89B5C" }}
              />
            </span>
          </div>

          <div className="hero-headline opacity-0 mb-4">
            <h1
              className="font-display font-bold leading-[1.05] tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                color: "#ffffff",
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              Premium Tech,
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #EAD3A3 0%, #C89B5C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Real Prices.
              </span>
            </h1>
          </div>

          <div className="hero-sub opacity-0 mb-10">
            <div
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(30,24,16,0.5)",
                border: "1px solid rgba(200,155,92,0.25)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#C89B5C" }}
                  />
                  <span
                    className="relative inline-flex h-1.5 w-1.5 rounded-full"
                    style={{ background: "#C89B5C" }}
                  />
                </span>
              </div>
              <p
                className="text-base sm:text-lg font-medium leading-snug min-h-[28px]"
                style={{ color: "rgba(247,241,231,0.95)" }}
              >
                <TypingText messages={messages} currentIndex={currentMessage} />
              </p>
            </div>
          </div>

          <div className="hero-cta opacity-0 flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              to="/products"
              className="group relative overflow-hidden flex items-center
                justify-center gap-2 px-8 py-4 font-bold text-xs uppercase
                tracking-widest text-white transition-all duration-300
                active:scale-95 w-full sm:w-auto"
              style={{
                background: "linear-gradient(135deg, #C89B5C 0%, #A67D3D 100%)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 40px rgba(200,155,92,0.6), 0 8px 32px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Shop Now
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 skew-x-12" />
            </Link>

            <Link
              to="/products?category=phones"
              className="group flex items-center justify-center gap-2
                px-8 py-4 font-semibold text-xs uppercase tracking-widest
                transition-all duration-300 active:scale-95 w-full sm:w-auto"
              style={{
                background: "rgba(30,24,16,0.4)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#ffffff",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(200,155,92,0.25)";
                e.currentTarget.style.borderColor = "rgba(200,155,92,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(30,24,16,0.4)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              }}
            >
              Browse Phones
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>

            <Link
              to="/products?category=gadgets"
              className="group flex items-center justify-center gap-2
                px-8 py-4 font-semibold text-xs uppercase tracking-widest
                transition-all duration-300 active:scale-95 w-full sm:w-auto"
              style={{
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(30,24,16,0.25)",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              All Gadgets
              <ArrowRight
                size={14}
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>
          </div>

          <div className="hero-stats opacity-0">
            <StatsBar />
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20
          flex flex-col items-center gap-2 pointer-events-none opacity-0"
      >
        <span
          className="text-[9px] uppercase tracking-[0.3em] font-medium"
          style={{ color: "rgba(234,211,163,0.7)" }}
        >
          Scroll
        </span>
        <div
          className="w-px h-12"
          style={{
            background:
              "linear-gradient(to bottom, rgba(234,211,163,0.6), transparent)",
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
