import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame } from "lucide-react";
import { getFeatured } from "../../data/products";
import ProductCard from "../ui/ProductCard";

gsap.registerPlugin(ScrollTrigger);

const Featured = () => {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const allFeatured = getFeatured();

  const filtered = (
    activeFilter === "all"
      ? allFeatured
      : allFeatured.filter((p) => p.category === activeFilter)
  ).slice(0, 8);

  useEffect(() => {
    gsap.fromTo(
      ".featured-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );

    gsap.fromTo(
      ".filter-btn",
      { y: 20, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      },
    );
  }, []);

  const filters = [
    { label: "🔥 All", value: "all" },
    { label: "📱 Phones", value: "phones" },
    { label: "📟 Tablets", value: "tablets" },
    { label: "🎧 Accessories", value: "accessories" },
    { label: "🎮 Gadgets", value: "gadgets" },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-dark relative overflow-hidden"
    >
      {/* BG Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 
        w-[600px] h-[400px] bg-accent/5 blur-[130px] 
        rounded-full pointer-events-none"
      />
      <div
        className="absolute bottom-0 right-0 
        w-[300px] h-[300px] bg-secondary/5 blur-[100px] 
        rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Header ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end
          justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          <div className="space-y-2">
            <div className="featured-title flex items-center gap-2">
              <Flame size={13} className="text-accent animate-pulse" />
              <span
                className="text-accent text-[11px] font-bold 
                uppercase tracking-[0.3em]"
              >
                Hot Deals This Week 🇳🇬
              </span>
            </div>
            <h2
              className="featured-title font-display font-bold
              text-3xl sm:text-4xl lg:text-5xl text-light leading-tight"
            >
              Featured{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r
                from-accent to-secondary-dim"
              >
                Gadgets
              </span>
            </h2>
            <p className="featured-title text-primary-500 text-xs sm:text-sm">
              Best prices in Lagos 🔥 Pay in Naira • No hidden charges
            </p>
          </div>

          <Link
            to="/products"
            className="featured-title group flex items-center gap-2
              text-primary-400 hover:text-accent transition-colors duration-300
              text-sm font-medium self-start sm:self-auto shrink-0"
          >
            View All
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* ── Filter Tabs ── */}
        <div
          className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 
          overflow-x-auto pb-2 
          scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`filter-btn whitespace-nowrap px-4 py-2 rounded-full
                text-[10px] sm:text-xs font-bold uppercase tracking-widest
                transition-all duration-300 border
                ${
                  activeFilter === f.value
                    ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                    : "bg-transparent text-primary-400 border-dark-400 hover:border-accent/50 hover:text-accent"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Product Grid ── */}
        {/* 2 cols mobile → 3 cols sm → 4 cols lg */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 
          gap-3 sm:gap-4 lg:gap-5"
        >
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* ── Empty State ── */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-primary-500 text-sm">
              No products in this category yet. Check back soon!
            </p>
          </div>
        )}

        {/* ── Bottom CTA ── */}
        <div
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row 
          items-center justify-center gap-4"
        >
          <Link
            to="/products"
            className="group inline-flex items-center gap-2
              bg-accent text-white px-8 py-4 rounded-full
              font-semibold text-xs uppercase tracking-widest
              transition-all duration-300
              hover:bg-accent-dim hover:shadow-xl hover:shadow-accent/20"
          >
            Explore All Products
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>

          {/* WhatsApp order option */}
          <a
            href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi! I want to order a gadget from Frank Gadgets 🔥`}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2
              bg-dark-200 border border-dark-400 text-primary-400
              hover:border-green-500/40 hover:text-green-400
              px-8 py-4 rounded-full
              font-semibold text-xs uppercase tracking-widest
              transition-all duration-300"
          >
            <span>💬</span>
            Order via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};

export default Featured;
