import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ShoppingCart, Heart, Eye, Check } from "lucide-react";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";

// ✅ Check if mobile once — no ScrollTrigger on mobile at all
const isMobile = window.innerWidth < 1024;

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
    const el = cardRef.current;
    if (!el) return;

    // ✅ On mobile: no animation, just show cards immediately
    if (isMobile) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    // ✅ Desktop only: fast IntersectionObserver animation
    gsap.set(el, { opacity: 0, y: 25 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.35, // ✅ fast
            delay: (index % 4) * 0.05, // ✅ max delay is only 0.15s (caps at 4 cols)
            ease: "power2.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 }, // ✅ fires immediately when just 5% visible
    );

    observer.observe(el);
    return () => observer.disconnect();
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
        transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden aspect-square sm:aspect-auto sm:h-48 bg-dark-300 rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-accent text-dark text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 uppercase tracking-widest">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-dark/80 text-accent text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 border-l-2 border-accent">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5
            w-6 h-6 sm:w-8 sm:h-8 rounded-full
            backdrop-blur-md border flex items-center justify-center
            transition-all duration-300 active:scale-95
            ${
              isInWishlist
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-dark/60 border-white/10 text-white/50 hover:text-red-400"
            }`}
        >
          <Heart
            size={10}
            className={`sm:w-[13px] sm:h-[13px] ${isInWishlist ? "fill-red-400" : ""}`}
          />
        </button>

        {/* Hover overlay — desktop only */}
        <div
          className="absolute inset-0 bg-dark/50 opacity-0
          group-hover:opacity-100 transition-all duration-300
          hidden sm:flex items-center justify-center gap-2"
        >
          <Link
            to={`/products/${product.id}`}
            className="w-9 h-9 rounded-lg bg-light text-dark
              flex items-center justify-center hover:bg-accent
              transition-all duration-200
              translate-y-3 group-hover:translate-y-0"
          >
            <Eye size={15} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`w-9 h-9 rounded-lg flex items-center justify-center
              transition-all duration-200
              translate-y-3 group-hover:translate-y-0
              ${isInCart ? "bg-green-500 text-white" : "bg-light text-dark hover:bg-accent"}`}
            style={{ transitionDelay: "40ms" }}
          >
            {isInCart || justAdded ? (
              <Check size={15} />
            ) : (
              <ShoppingCart size={15} />
            )}
          </button>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && (
          <div className="absolute bottom-1.5 left-1.5 right-1.5 sm:bottom-2 sm:left-2 sm:right-2">
            <div className="bg-dark/90 px-2 py-0.5 sm:py-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[8px] sm:text-[9px] font-medium">
                Only {product.stock} left
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-2 sm:p-3.5">
        {/* Brand */}
        <p className="text-accent text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1.5 truncate">
          {product.brand}
        </p>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-light font-semibold text-[10px] sm:text-sm leading-snug
            line-clamp-2 hover:text-accent transition-colors duration-200
            min-h-[24px] sm:min-h-[36px] mb-1.5 sm:mb-3"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1.5 sm:pt-3 border-t border-dark-400">
          <div>
            <span className="font-bold text-light text-[11px] sm:text-sm block leading-none">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-primary-600 text-[8px] sm:text-[10px] line-through mt-0.5 block">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile: icon only | Desktop: text + icon */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`flex items-center justify-center gap-1
              transition-all duration-300 active:scale-95
              w-6 h-6 sm:w-auto sm:h-auto
              sm:px-3.5 sm:py-2 rounded-lg
              text-[9px] sm:text-[10px] font-bold uppercase tracking-wider
              ${
                isInCart && !justAdded
                  ? "bg-green-500/20 text-green-400 cursor-default"
                  : justAdded
                    ? "bg-green-500 text-dark"
                    : "bg-accent text-dark hover:bg-accent-dim"
              }`}
          >
            {isInCart || justAdded ? (
              <>
                <Check size={9} className="sm:w-[11px] sm:h-[11px]" />
                <span className="hidden sm:inline">
                  {justAdded ? "Added!" : "In Cart"}
                </span>
              </>
            ) : (
              <>
                <ShoppingCart size={9} className="sm:w-[11px] sm:h-[11px]" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
