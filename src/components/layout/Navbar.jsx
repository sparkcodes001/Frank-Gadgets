import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);
  const iconsRef = useRef([]);
  const logoRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.getTotalItems());

  // ✅ Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Entrance animation - same as BreemTech
  useEffect(() => {
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
        iconsRef.current.filter(Boolean),
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
      );
  }, []);

  // ✅ Mobile menu animation - same as BreemTech but cooler
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
          stagger: 0.1,
          delay: 0.2,
          ease: "back.out(1.2)",
        },
      );
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen]);

  // ✅ Search animation
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

  // ✅ Keyboard ESC handler
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

  // ✅ Close on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  // ✅ Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Phones", path: "/products?category=phones" },
    { name: "Tablets", path: "/products?category=tablets" },
    { name: "Gadgets", path: "/products?category=gadgets" },
  ];

  const isActiveLink = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* ✅ NAVBAR */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-dark/95 backdrop-blur-md border-b border-white/5 py-2 sm:py-3"
            : "bg-transparent py-3 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* ✅ LOGO - clean, no double logo issue */}
          <Link
            ref={logoRef}
            to="/"
            className="flex items-center gap-2 group shrink-0 z-10"
          >
            <img
              src={logo}
              alt="Frank Gadgets"
              className="w-9 h-9 sm:w-11 sm:h-11 object-contain
                group-hover:scale-110 transition-transform duration-300
                drop-shadow-lg"
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-sm sm:text-base md:text-xl
                  font-bold tracking-wider text-white
                  group-hover:text-accent transition-colors duration-300"
              >
                FRANK<span className="text-accent">GADGETS</span>
              </span>
              <span
                className="text-[7px] sm:text-[8px] text-white/30 
                tracking-[0.15em] uppercase mt-0.5"
              >
                We Buy • We Sell • We Swap
              </span>
            </div>
          </Link>

          {/* ✅ DESKTOP NAV LINKS */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all
                    duration-300 relative
                    after:absolute after:bottom-[-2px] after:left-0
                    after:h-[2px] after:bg-accent
                    after:transition-all after:duration-300
                    hover:text-accent
                    ${
                      isActiveLink(link.path)
                        ? "text-accent after:w-full"
                        : "text-light/60 after:w-0 hover:after:w-full"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* ✅ RIGHT ICONS */}
          <div className="flex items-center gap-1 sm:gap-2 relative z-10">
            {/* Search */}
            <button
              ref={(el) => (iconsRef.current[0] = el)}
              onClick={() => setSearchOpen(true)}
              className="text-light/60 hover:text-accent transition-all
                duration-300 p-2 hover:scale-110 active:scale-95 rounded-lg
                hover:bg-white/5"
            >
              <Search size={18} />
            </button>

            {/* Wishlist - hidden on mobile */}
            <Link
              ref={(el) => (iconsRef.current[1] = el)}
              to="/wishlist"
              className="hidden sm:flex text-light/60 hover:text-accent 
                transition-all duration-300 relative p-2 hover:scale-110 
                active:scale-95 rounded-lg hover:bg-white/5"
            >
              <Heart size={18} />
              {wishlistItems > 0 && (
                <span
                  className="absolute top-1 right-1 bg-accent text-white
                  text-[9px] w-3.5 h-3.5 rounded-full flex items-center
                  justify-center font-bold shadow-lg shadow-accent/50"
                >
                  {wishlistItems}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              ref={(el) => (iconsRef.current[2] = el)}
              to="/cart"
              className="text-light/60 hover:text-accent transition-all
                duration-300 relative p-2 hover:scale-110 active:scale-95
                rounded-lg hover:bg-white/5"
            >
              <ShoppingCart size={18} />
              {cartItems > 0 && (
                <span
                  className="absolute top-1 right-1 bg-accent text-white
                  text-[9px] w-3.5 h-3.5 rounded-full flex items-center
                  justify-center font-bold shadow-lg shadow-accent/50"
                >
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              ref={(el) => (iconsRef.current[3] = el)}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-light hover:text-accent
                transition-all duration-300 p-2 hover:scale-110
                active:scale-95 rounded-lg hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ SEARCH OVERLAY - fullscreen like BreemTech */}
      <div
        ref={searchContainerRef}
        className="fixed inset-0 z-[60] bg-dark/98 backdrop-blur-xl
          opacity-0 pointer-events-none"
      >
        {/* Close button */}
        <button
          onClick={() => setSearchOpen(false)}
          className="absolute top-6 right-6 text-white/40 hover:text-accent
            transition-colors duration-300 p-2 rounded-lg hover:bg-white/5"
        >
          <X size={24} />
        </button>

        <div className="h-full flex flex-col items-center justify-center px-4">
          <p
            className="text-white/20 text-[10px] tracking-[0.3em] uppercase 
            mb-8 text-center"
          >
            Frank Gadgets / Search
          </p>

          {/* Search form */}
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
              className="w-full bg-dark-300 text-light text-base sm:text-xl
                px-6 py-5 border border-white/10 border-l-4 border-l-accent
                focus:outline-none focus:border-accent/50
                placeholder:text-primary-600 shadow-2xl
                transition-all duration-300"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-6
                bg-accent text-white font-bold text-sm tracking-widest
                uppercase hover:bg-accent-dim transition-colors duration-300"
            >
              Search
            </button>
          </form>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2 mt-6 justify-center">
            <span className="text-white/20 text-xs">Try:</span>
            {["iPhone 15", "Samsung S24", "iPad", "AirPods", "Charger"].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    navigate(`/products?search=${encodeURIComponent(term)}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="px-3 py-1.5 text-xs text-white/40
                    border border-white/10 hover:border-accent
                    hover:text-accent transition-all duration-300"
                >
                  {term}
                </button>
              ),
            )}
          </div>

          <p className="absolute bottom-8 text-white/20 text-xs">
            Press{" "}
            <kbd
              className="px-2 py-0.5 bg-white/5 border border-white/10
              text-white/30 text-xs"
            >
              ESC
            </kbd>{" "}
            to close
          </p>
        </div>
      </div>

      {/* ✅ MOBILE MENU - exactly like BreemTech but Frank Gadgets style */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 bg-dark/98 backdrop-blur-lg
            flex flex-col justify-center items-center md:hidden"
        >
          {/* ✅ Single X button to close - NO duplicate logo */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-5 right-4 text-white/50 hover:text-accent
              transition-colors duration-300 p-2"
          >
            <X size={26} />
          </button>

          {/* ✅ Small brand tag top left - minimal, not a full logo */}
          <div className="absolute top-5 left-4 flex items-center gap-1.5">
            <img
              src={logo}
              alt=""
              className="w-7 h-7 object-contain opacity-60"
            />
            <span className="text-white/30 text-xs font-display tracking-widest">
              FG
            </span>
          </div>

          {/* ✅ Nav Links - big like BreemTech */}
          <ul className="flex flex-col items-center gap-5 sm:gap-7">
            {navLinks.map((link) => (
              <li key={link.name} className="menu-item overflow-hidden">
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-display text-4xl sm:text-5xl font-bold
                    tracking-wider transition-all duration-300 hover:text-accent
                    relative group
                    ${
                      isActiveLink(link.path) ? "text-accent" : "text-light/80"
                    }`}
                >
                  {link.name}
                  {/* Underline effect */}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-[3px]
                    bg-accent group-hover:w-full transition-all duration-500"
                  />
                </Link>
              </li>
            ))}
          </ul>

          {/* ✅ Bottom section */}
          <div
            className="absolute bottom-10 w-full px-8 
            flex flex-col items-center gap-5"
          >
            {/* Icons */}
            <div className="flex items-center gap-8">
              <Link
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="menu-item text-light/60 hover:text-accent
                  transition-all duration-300 relative flex flex-col
                  items-center gap-1"
              >
                <Heart size={26} />
                <span className="text-[10px] text-white/30">Wishlist</span>
                {wishlistItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-accent
                    text-white text-[9px] w-4 h-4 rounded-full
                    flex items-center justify-center font-bold"
                  >
                    {wishlistItems}
                  </span>
                )}
              </Link>

              <div className="w-px h-8 bg-white/10" />

              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="menu-item text-light/60 hover:text-accent
                  transition-all duration-300 relative flex flex-col
                  items-center gap-1"
              >
                <ShoppingCart size={26} />
                <span className="text-[10px] text-white/30">Cart</span>
                {cartItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-accent
                    text-white text-[9px] w-4 h-4 rounded-full
                    flex items-center justify-center font-bold"
                  >
                    {cartItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Tagline */}
            <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase">
              We Buy • We Sell • We Swap
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
