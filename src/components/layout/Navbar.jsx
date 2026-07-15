// Navbar.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Smartphone,
  Tablet,
  Headphones,
  TrendingUp,
  Clock,
} from "lucide-react";
import { gsap } from "gsap";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import logo from "../../assets/logo.png";

const ANNOUNCEMENTS = [
  "Free Nationwide Delivery",
  "1-Year Warranty on All Devices",
  "We Buy • We Sell • We Swap",
  "100% Genuine Products Guaranteed",
];

const TRENDING = [
  { label: "iPhone 15 Pro", icon: <Smartphone size={14} /> },
  { label: "Samsung S24 Ultra", icon: <Smartphone size={14} /> },
  { label: "iPad Air", icon: <Tablet size={14} /> },
  { label: "AirPods Pro", icon: <Headphones size={14} /> },
];

/* ══════════════════════════ MAGNETIC ICON BUTTON ══════════════════════════ */

const MagneticIcon = ({ children, className, style, ...props }) => {
  const btnRef = useRef(null);

  const handleMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };
  const handleLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = "translate(0,0)";
  };

  const Component = props.to ? Link : "button";

  return (
    <Component
      ref={btnRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform 0.2s ease-out", ...style }}
      {...props}
    >
      {children}
    </Component>
  );
};

/* ══════════════════════════ BADGE ══════════════════════════ */

const CountBadge = ({ count }) => {
  const badgeRef = useRef(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current && badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 1.6 },
        { scale: 1, duration: 0.4, ease: "back.out(3)" },
      );
    }
    prevCount.current = count;
  }, [count]);

  if (count <= 0) return null;

  return (
    <span
      ref={badgeRef}
      className="absolute top-0.5 right-0.5 text-white text-[9px] w-4 h-4
        rounded-full flex items-center justify-center font-bold"
      style={{
        background: "linear-gradient(135deg, #C89B5C, #A67D3D)",
        boxShadow: "0 0 12px rgba(200,155,92,0.6)",
      }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
};

/* ══════════════════════════ NAVBAR HEIGHT HOOK ══════════════════════════ */

// Export so pages can consume it for padding-top
export const useNavbarHeight = (showAnnouncement) => {
  const ANNOUNCEMENT_H = 36; // h-9 = 36px
  const NAV_H = 64; // approximate navbar height
  return showAnnouncement ? ANNOUNCEMENT_H + NAV_H : NAV_H;
};

/* ══════════════════════════ NAVBAR ══════════════════════════ */

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0, opacity: 0 });
  const [recentSearches, setRecentSearches] = useState([]);
  const [navHeight, setNavHeight] = useState(0);

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const iconsRef = useRef([]);
  const logoRef = useRef(null);
  const searchInputRef = useRef(null);
  const linkRefs = useRef({});
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.getTotalItems());

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Phones", path: "/products?category=phones" },
    { name: "Tablets", path: "/products?category=tablets" },
    { name: "Gadgets", path: "/products?category=gadgets" },
  ];

  const isActiveLink = useCallback(
    (path) => {
      if (path === "/") return location.pathname === "/";
      if (path.includes("?"))
        return location.pathname + location.search === path;
      return location.pathname === path;
    },
    [location],
  );

  // ── Measure real navbar height and expose as CSS var ──────────────────
  useEffect(() => {
    const measureNav = () => {
      const announcementH = showAnnouncement ? 36 : 0;
      const navH = navRef.current ? navRef.current.offsetHeight : 64;
      const total = announcementH + navH;
      setNavHeight(total);
      document.documentElement.style.setProperty(
        "--navbar-height",
        `${total}px`,
      );
    };

    measureNav();
    window.addEventListener("resize", measureNav);
    return () => window.removeEventListener("resize", measureNav);
  }, [showAnnouncement]);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("fg_recent_searches") || "[]",
      );
      setRecentSearches(stored.slice(0, 4));
    } catch {
      setRecentSearches([]);
    }
  }, [searchOpen]);

  const saveSearch = (term) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("fg_recent_searches") || "[]",
      );
      const updated = [term, ...stored.filter((t) => t !== term)].slice(0, 4);
      localStorage.setItem("fg_recent_searches", JSON.stringify(updated));
    } catch {
      /* noop */
    }
  };

  // Scroll: progress + direction hide/show
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? y / docHeight : 0);
      setIsScrolled(y > 50);

      if (y > lastScrollY.current && y > 150) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sliding pill indicator
  const updatePill = useCallback(() => {
    const activeLink = navLinks.find((l) => isActiveLink(l.path));
    if (!activeLink) {
      setPillStyle((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const el = linkRefs.current[activeLink.path];
    if (el) {
      setPillStyle({ width: el.offsetWidth, left: el.offsetLeft, opacity: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  // Entrance animation
  useEffect(() => {
    if (!navRef.current || !logoRef.current) return;
    const validIcons = iconsRef.current.filter(Boolean);

    const tl = gsap.timeline();
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    )
      .fromTo(
        logoRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.7",
      )
      .fromTo(
        validIcons,
        { y: -20, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.6",
      )
      .call(updatePill);
  }, [updatePill]);

  // Mobile menu animation
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        menuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" },
      );
      gsap.fromTo(
        ".menu-item",
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.2,
          ease: "back.out(1.2)",
        },
      );
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  // Search animation
  useEffect(() => {
    if (!searchContainerRef.current) return;

    if (searchOpen) {
      document.body.style.overflow = "hidden";
      gsap.to(searchContainerRef.current, {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        ".search-input",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      );
      gsap.fromTo(
        ".search-chip",
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          delay: 0.2,
          ease: "power2.out",
        },
      );
      setTimeout(() => searchInputRef.current?.focus(), 300);
    } else {
      document.body.style.overflow = "";
      gsap.to(searchContainerRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        if (isMenuOpen) setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [searchOpen, isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveSearch(searchQuery.trim());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleQuickSearch = (term) => {
    saveSearch(term);
    navigate(`/products?search=${encodeURIComponent(term)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Announcement bar height: 36px (h-9), Navbar height tracked via ref
  const announcementH = showAnnouncement ? 36 : 0;

  return (
    <>
      {/* ── SCROLL PROGRESS BAR ──────────────────────────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-[80] h-[2px] pointer-events-none"
        style={{
          background: "linear-gradient(90deg, #C89B5C, #EAD3A3)",
          width: `${scrollProgress * 100}%`,
          transition: "width 0.1s ease-out",
          boxShadow: "0 0 8px rgba(200,155,92,0.6)",
        }}
      />

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────────────── */}
      {showAnnouncement && (
        <div
          className="fixed top-0 left-0 right-0 z-[60] h-9 overflow-hidden flex items-center"
          style={{
            background: "linear-gradient(90deg, #C89B5C, #DDBC85, #C89B5C)",
          }}
        >
          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, dupeIdx) => (
              <div key={dupeIdx} className="flex items-center">
                {ANNOUNCEMENTS.map((msg, i) => (
                  <span
                    key={`${dupeIdx}-${i}`}
                    className="text-white text-[11px] font-semibold tracking-wide px-6"
                  >
                    ✦ {msg}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAnnouncement(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2
              text-white/70 hover:text-white transition-colors duration-200 p-1"
            aria-label="Dismiss announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── NAVBAR ───────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-500`}
        style={{
          top: announcementH,
          transform: hideNav
            ? `translateY(calc(-100% - ${announcementH}px))`
            : "translateY(0)",
          background: isScrolled
            ? "rgba(247,241,231,0.95)"
            : "rgba(247,241,231,0.25)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: isScrolled
            ? "1px solid rgba(30,24,16,0.06)"
            : "1px solid transparent",
          boxShadow: isScrolled ? "0 4px 30px rgba(200,155,92,0.1)" : "none",
          paddingTop: isScrolled ? "0.5rem" : "0.9rem",
          paddingBottom: isScrolled ? "0.5rem" : "0.9rem",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link
            ref={logoRef}
            to="/"
            className="flex items-center gap-2 group shrink-0 z-10"
          >
            {/* <div className="relative">
              <img
                src={logo}
                alt="Frank Gadgets"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain
                  group-hover:scale-110 transition-transform duration-300 relative z-10"
              />
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 blur-lg"
                style={{ background: "rgba(200,155,92,0.5)" }}
              />
            </div> */}
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-sm sm:text-base md:text-xl
                  font-bold tracking-wider transition-colors duration-300"
                style={{ color: "#1E1810" }}
              >
                CLOUD
                <span style={{ color: "#C89B5C" }}>GADGETS</span>
              </span>
              <span
                className="text-[7px] sm:text-[8px] tracking-[0.15em] uppercase mt-0.5"
                style={{ color: "rgba(30,24,16,0.4)" }}
              >
                We Buy • We Sell • We Swap
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <ul className="hidden md:flex items-center gap-1 relative">
            {/* Sliding pill */}
            <div
              className="absolute top-0 h-full rounded-full pointer-events-none"
              style={{
                width: pillStyle.width,
                left: pillStyle.left,
                opacity: pillStyle.opacity,
                background: "linear-gradient(135deg, #C89B5C, #A67D3D)",
                boxShadow: "0 0 20px rgba(200,155,92,0.4)",
                transition:
                  "width 0.4s cubic-bezier(0.65,0,0.35,1), left 0.4s cubic-bezier(0.65,0,0.35,1), opacity 0.3s ease",
              }}
            />
            {navLinks.map((link) => (
              <li key={link.name} className="relative z-10">
                <Link
                  ref={(el) => (linkRefs.current[link.path] = el)}
                  to={link.path}
                  className="block px-4 py-2 rounded-full text-sm font-semibold
                    tracking-wide transition-colors duration-300"
                  style={{
                    color: isActiveLink(link.path)
                      ? "#ffffff"
                      : "rgba(30,24,16,0.65)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActiveLink(link.path))
                      e.currentTarget.style.color = "#C89B5C";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActiveLink(link.path))
                      e.currentTarget.style.color = "rgba(30,24,16,0.65)";
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-1 sm:gap-2 relative z-10">
            <MagneticIcon
              ref={(el) => (iconsRef.current[0] = el)}
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full transition-colors duration-300"
              style={{ color: "rgba(30,24,16,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C89B5C")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(30,24,16,0.65)")
              }
            >
              <Search size={18} />
            </MagneticIcon>

            <MagneticIcon
              ref={(el) => (iconsRef.current[1] = el)}
              to="/wishlist"
              className="hidden sm:flex relative p-2 rounded-full transition-colors duration-300"
              style={{ color: "rgba(30,24,16,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C89B5C")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(30,24,16,0.65)")
              }
            >
              <Heart size={18} />
              <CountBadge count={wishlistItems} />
            </MagneticIcon>

            <MagneticIcon
              ref={(el) => (iconsRef.current[2] = el)}
              to="/cart"
              className="relative p-2 rounded-full transition-colors duration-300"
              style={{ color: "rgba(30,24,16,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C89B5C")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(30,24,16,0.65)")
              }
            >
              <ShoppingCart size={18} />
              <CountBadge count={cartItems} />
            </MagneticIcon>

            <button
              ref={(el) => (iconsRef.current[3] = el)}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full transition-all duration-300 active:scale-95"
              style={{ color: "#1E1810" }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── SPACER — pushes page content below fixed navbar ─────────── */}
      <div style={{ height: navHeight }} aria-hidden="true" />

      {/* ── SEARCH OVERLAY ───────────────────────────────────────────── */}
      <div
        ref={searchContainerRef}
        className="fixed inset-0 z-[70] opacity-0 pointer-events-none overflow-hidden"
        style={{
          background: "rgba(247,241,231,0.97)",
          backdropFilter: "blur(30px)",
        }}
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
            rounded-full pointer-events-none"
          style={{ background: "rgba(200,155,92,0.15)", filter: "blur(80px)" }}
        />

        <button
          onClick={() => setSearchOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full z-10 transition-colors duration-300"
          style={{ color: "rgba(30,24,16,0.5)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C89B5C")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(30,24,16,0.5)")
          }
        >
          <X size={24} />
        </button>

        <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
          <p
            className="text-[10px] tracking-[0.3em] uppercase mb-8 text-center font-semibold"
            style={{ color: "rgba(30,24,16,0.4)" }}
          >
            Frank Gadgets / Search
          </p>

          <form
            onSubmit={handleSearch}
            className="search-input w-full max-w-2xl relative"
          >
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phones, tablets, gadgets..."
              className="w-full text-base sm:text-xl px-6 py-5 focus:outline-none
                transition-all duration-300"
              style={{
                background: "#ffffff",
                color: "#1E1810",
                borderTop: "1px solid rgba(30,24,16,0.08)",
                borderBottom: "1px solid rgba(30,24,16,0.08)",
                borderRight: "1px solid rgba(30,24,16,0.08)",
                borderLeft: "4px solid #C89B5C",
                boxShadow: "0 20px 60px rgba(30,24,16,0.12)",
              }}
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-6 text-white font-bold
                text-sm tracking-widest uppercase transition-colors duration-300"
              style={{ background: "#C89B5C" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#A67D3D")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#C89B5C")
              }
            >
              Search
            </button>
          </form>

          <div className="w-full max-w-2xl mt-8 space-y-6">
            {recentSearches.length > 0 && (
              <div>
                <p
                  className="search-chip flex items-center gap-2 text-[10px] uppercase
                    tracking-wider font-bold mb-3"
                  style={{ color: "rgba(30,24,16,0.4)" }}
                >
                  <Clock size={11} /> Recent Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="search-chip px-3 py-1.5 text-xs rounded-full transition-all duration-300"
                      style={{
                        color: "rgba(30,24,16,0.6)",
                        background: "rgba(30,24,16,0.04)",
                        border: "1px solid rgba(30,24,16,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#C89B5C";
                        e.currentTarget.style.color = "#C89B5C";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(30,24,16,0.08)";
                        e.currentTarget.style.color = "rgba(30,24,16,0.6)";
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p
                className="search-chip flex items-center gap-2 text-[10px] uppercase
                  tracking-wider font-bold mb-3"
                style={{ color: "rgba(30,24,16,0.4)" }}
              >
                <TrendingUp size={11} /> Trending Now
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRENDING.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleQuickSearch(item.label)}
                    className="search-chip flex items-center gap-2 px-3 py-2.5 rounded-xl
                      transition-all duration-300 text-left"
                    style={{
                      background: "rgba(200,155,92,0.06)",
                      border: "1px solid rgba(200,155,92,0.15)",
                      color: "#1E1810",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(200,155,92,0.15)";
                      e.currentTarget.style.borderColor = "#C89B5C";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(200,155,92,0.06)";
                      e.currentTarget.style.borderColor =
                        "rgba(200,155,92,0.15)";
                    }}
                  >
                    <span style={{ color: "#C89B5C" }}>{item.icon}</span>
                    <span className="text-xs font-medium truncate">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p
            className="absolute bottom-8 text-xs"
            style={{ color: "rgba(30,24,16,0.3)" }}
          >
            Press{" "}
            <kbd
              className="px-2 py-0.5 text-xs"
              style={{
                background: "rgba(30,24,16,0.05)",
                border: "1px solid rgba(30,24,16,0.1)",
                color: "rgba(30,24,16,0.5)",
              }}
            >
              ESC
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>

      {/* ── MOBILE MENU ──────────────────────────────────────────────── */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-[65] flex flex-col md:hidden overflow-hidden"
          style={{
            background: "rgba(247,241,231,0.97)",
            backdropFilter: "blur(30px)",
          }}
        >
          {/* Decorative blur blob */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72
              rounded-full pointer-events-none"
            style={{
              background: "rgba(200,155,92,0.15)",
              filter: "blur(80px)",
            }}
          />

          {/* Top bar */}
          <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-1.5">
              <img
                src={logo}
                alt=""
                className="w-7 h-7 object-contain opacity-70"
              />
              <span
                className="text-xs font-display tracking-widest"
                style={{ color: "rgba(30,24,16,0.4)" }}
              >
                FG
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 transition-colors duration-300"
              style={{ color: "rgba(30,24,16,0.5)" }}
            >
              <X size={26} />
            </button>
          </div>

          {/* Nav links — centred in remaining space */}
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <ul className="flex flex-col items-center gap-5 sm:gap-7">
              {navLinks.map((link, idx) => (
                <li
                  key={link.name}
                  className="menu-item flex items-center gap-3"
                >
                  <span
                    className="text-xs font-mono opacity-40"
                    style={{
                      color: isActiveLink(link.path) ? "#C89B5C" : "#1E1810",
                    }}
                  >
                    0{idx + 1}
                  </span>
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-display text-4xl sm:text-5xl font-bold
                      tracking-wider transition-all duration-300 relative group"
                    style={{
                      color: isActiveLink(link.path)
                        ? "#C89B5C"
                        : "rgba(30,24,16,0.85)",
                    }}
                  >
                    {link.name}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[3px]
                        group-hover:w-full transition-all duration-500"
                      style={{ background: "#C89B5C" }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom actions — always above safe-area */}
          <div className="relative z-10 w-full px-8 pb-10 flex flex-col items-center gap-5">
            <div className="flex items-center gap-8">
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="menu-item relative flex flex-col items-center gap-1
                  transition-colors duration-300"
                style={{ color: "rgba(30,24,16,0.65)" }}
              >
                <Heart size={26} />
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(30,24,16,0.4)" }}
                >
                  Wishlist
                </span>
                {wishlistItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4
                      rounded-full flex items-center justify-center font-bold"
                    style={{ background: "#C89B5C" }}
                  >
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <div
                className="w-px h-8"
                style={{ background: "rgba(30,24,16,0.12)" }}
              />

              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="menu-item relative flex flex-col items-center gap-1
                  transition-colors duration-300"
                style={{ color: "rgba(30,24,16,0.65)" }}
              >
                <ShoppingCart size={26} />
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(30,24,16,0.4)" }}
                >
                  Cart
                </span>
                {cartItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-[9px] w-4 h-4
                      rounded-full flex items-center justify-center font-bold"
                    style={{ background: "#C89B5C" }}
                  >
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>

            <p
              className="text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "rgba(30,24,16,0.4)" }}
            >
              We Buy • We Sell • We Swap
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
