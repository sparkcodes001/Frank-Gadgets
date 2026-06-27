import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart, ArrowRight, Zap, Check } from "lucide-react";
import { getFeatured } from "../../data/products";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

gsap.registerPlugin(ScrollTrigger);

// ── Product Card ──
const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );

  const isInCart = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        delay: index * 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 92%",
        },
      },
    );
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isInCart) addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        oldPrice: product.oldPrice || null,
        image: product.image,
        category: product.category,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        stock: product.stock || 10,
        colors: product.colors || ["#000000"],
        isNew: product.isNew || false,
        discount: product.discount || 0,
        description: product.description || "",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-dark-200 border border-dark-400
    rounded-xl overflow-hidden hover:border-accent/40        
    transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-dark-300 aspect-square rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200/80 via-transparent to-transparent" />

        {/* Wishlist — top right */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-1.5 right-1.5 w-6 h-6 sm:w-7 sm:h-7
            flex items-center justify-center
            transition-all duration-300 active:scale-95
            ${
              isInWishlist
                ? "bg-red-500/20 text-red-400"
                : "bg-dark/70 text-white/40 hover:text-red-400"
            }`}
        >
          <Heart size={11} className={isInWishlist ? "fill-red-400" : ""} />
        </button>

        {/* Badges — top left */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-accent text-dark text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-dark/80 text-accent text-[8px] font-bold px-1.5 py-0.5 border-l border-accent">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-2 sm:p-3">
        {/* Brand */}
        <p className="text-accent text-[8px] sm:text-[9px] font-bold uppercase tracking-widest mb-1 truncate">
          {product.brand}
        </p>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-light font-medium text-[11px] sm:text-xs
            leading-snug line-clamp-2 hover:text-accent
            transition-colors duration-200 min-h-[28px] sm:min-h-[32px] mb-2"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + Cart */}
        <div className="flex items-center justify-between gap-1">
          <div>
            <span className="font-bold text-light text-xs sm:text-sm block leading-none">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-primary-600 text-[9px] line-through mt-0.5 block">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`flex items-center justify-center
              w-7 h-7 sm:w-8 sm:h-8 shrink-0
              transition-all duration-300 active:scale-95
              ${
                isInCart && !justAdded
                  ? "bg-green-500/20 text-green-400 cursor-default"
                  : justAdded
                    ? "bg-green-500 text-dark"
                    : "bg-accent text-dark hover:bg-accent-dim"
              }`}
          >
            {isInCart || justAdded ? (
              <Check size={12} />
            ) : (
              <ShoppingCart size={12} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Featured Section ──
const Featured = () => {
  const sectionRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const allFeatured = getFeatured();

  const filtered = (
    activeFilter === "all"
      ? allFeatured
      : allFeatured.filter((p) => p.category === activeFilter)
  ).slice(0, 6);

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
    { label: "All", value: "all" },
    { label: "📱 Mobiles", value: "mobile" },
    { label: "💻 PCs", value: "pc" },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-dark relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px]
        bg-accent/5 blur-[130px] rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end
          justify-between gap-4 sm:gap-6 mb-8 sm:mb-10"
        >
          <div className="space-y-2">
            <div className="featured-title flex items-center gap-2">
              <Zap size={13} className="text-accent animate-pulse" />
              <span className="text-accent text-[11px] font-bold uppercase tracking-[0.3em]">
                Hand Picked For You
              </span>
            </div>
            <h2
              className="featured-title font-display font-bold
              text-3xl sm:text-4xl lg:text-5xl text-light leading-tight"
            >
              Featured{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r
                from-accent to-light"
              >
                Products
              </span>
            </h2>
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

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`filter-btn whitespace-nowrap px-4 py-2
                text-[10px] sm:text-xs font-bold uppercase tracking-widest
                transition-all duration-300 border
                ${
                  activeFilter === f.value
                    ? "bg-accent text-dark border-accent"
                    : "bg-transparent text-primary-400 border-dark-400 hover:border-accent/50 hover:text-accent"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ✅ 3 columns on mobile, 4 on sm, 6 on lg */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-14 text-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-2
              bg-dark-200 border border-dark-400
              hover:border-accent/50 hover:bg-dark-300
              text-light px-8 py-4
              font-semibold text-xs uppercase tracking-widest
              transition-all duration-300
              hover:shadow-xl hover:shadow-accent/10"
          >
            Explore All Products
            <ArrowRight
              size={15}
              className="text-accent group-hover:translate-x-1
                transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
