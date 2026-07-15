import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ShoppingCart, Heart, Eye, Check, Repeat2, Star } from "lucide-react";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import { formatPrice } from "../../utils/formatPrice";

const isMobile = window.innerWidth < 1024;

const ProductCard = ({ product, index }) => {
  const cardRef = useRef(null);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  const isInWishlist = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id),
  );

  const isInCart = cartItems.some((item) => item.id === product.id);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (isMobile) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(el, { opacity: 0, y: 25 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.35,
            delay: (index % 4) * 0.05,
            ease: "power2.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInCart) addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      className="group relative bg-dark-200 border border-white/[0.06]
        rounded-2xl overflow-hidden
        hover:border-accent/30 hover:-translate-y-1
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-black/50"
    >
      {/* ── Image — now fills the container ── */}
      <div className="relative overflow-hidden aspect-square bg-dark-300">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover
            group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Bottom fade so text/badges stay readable over busy photos */}
        <div
          className="absolute inset-0 bg-gradient-to-t
          from-black/70 via-black/0 to-black/10 pointer-events-none"
        />

        {/* ── Badges top left ── */}
        <div
          className="absolute top-2 left-2 sm:top-3 sm:left-3
          flex flex-col gap-1 z-10"
        >
          {product.isNew && (
            <span
              className="bg-accent text-dark text-[8px] sm:text-[9px]
              font-bold px-2 py-1 rounded-md uppercase tracking-wider
              shadow-lg shadow-accent/20"
            >
              New
            </span>
          )}
          {product.discount > 0 && (
            <span
              className="bg-red-500 text-white text-[8px] sm:text-[9px]
              font-bold px-2 py-1 rounded-md
              shadow-lg shadow-red-500/20"
            >
              -{product.discount}%
            </span>
          )}
        </div>

        {/* ── Wishlist top right ── */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3
            w-7 h-7 sm:w-8 sm:h-8 rounded-full z-10
            backdrop-blur-md border flex items-center justify-center
            transition-all duration-300 active:scale-90 hover:scale-110
            ${
              isInWishlist
                ? "bg-red-500/15 border-red-500/40 text-red-400"
                : "bg-black/40 border-white/10 text-white/70 hover:bg-red-500/10 hover:border-red-400/30 hover:text-red-400"
            }`}
        >
          <Heart
            size={12}
            className={`sm:w-[13px] sm:h-[13px] transition-all duration-300
              ${isInWishlist ? "fill-red-400 text-red-400" : ""}`}
          />
        </button>

        {/* ── Hover Actions (desktop) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10
          bg-gradient-to-t from-black/80 via-black/50 to-transparent
          pt-10 pb-3 px-3
          flex items-center justify-center gap-2
          translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-out
          hidden sm:flex"
        >
          <Link
            to={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 flex-1
              justify-center rounded-lg
              bg-white/10 backdrop-blur-sm border border-white/10
              text-white text-[10px] font-semibold
              hover:bg-white/20 transition-all duration-200"
          >
            <Eye size={12} />
            Quick View
          </Link>

          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`flex items-center gap-1.5 px-3 py-2 flex-1
              justify-center rounded-lg
              text-[10px] font-semibold
              transition-all duration-200
              ${
                isInCart || justAdded
                  ? "bg-green-500 text-white"
                  : "bg-accent text-dark hover:bg-white"
              }`}
          >
            {isInCart || justAdded ? (
              <>
                <Check size={12} /> Added
              </>
            ) : (
              <>
                <ShoppingCart size={12} /> Add
              </>
            )}
          </button>
        </div>

        {/* ── Low Stock ── */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 right-2 z-10 sm:hidden">
            <div
              className="bg-black/70 backdrop-blur-sm px-2 py-1
              rounded-md flex items-center gap-1.5 w-fit"
            >
              <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[8px] font-semibold">
                Only {product.stock} left
              </span>
            </div>
          </div>
        )}

        {/* ── Out of Stock ── */}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]
            flex items-center justify-center z-20"
          >
            <span
              className="bg-dark-200 border border-white/10
              text-primary-300 text-[10px] font-bold uppercase
              tracking-widest px-4 py-2 rounded-lg"
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3 sm:p-4">
        {/* Brand + Rating row */}
        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
          <p
            className="text-accent text-[8px] sm:text-[10px] font-bold
            uppercase tracking-widest truncate"
          >
            {product.brand}
          </p>
          {product.rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star
                size={10}
                className="fill-amber-400 text-amber-400 sm:w-3 sm:h-3"
              />
              <span className="text-primary-400 text-[9px] sm:text-[10px] font-medium">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-light font-semibold text-[11px] sm:text-sm
            leading-snug line-clamp-2 hover:text-accent
            transition-colors duration-200
            min-h-[28px] sm:min-h-[40px] mb-2 sm:mb-3"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between pt-2 sm:pt-3
          border-t border-white/[0.06]"
        >
          <div>
            <span
              className="font-bold text-light text-[12px] sm:text-base
              block leading-none"
            >
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span
                className="text-primary-600 text-[8px] sm:text-[10px]
                line-through mt-1 block"
              >
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`flex items-center justify-center gap-1
              transition-all duration-300 active:scale-90
              w-7 h-7 sm:w-auto sm:h-auto
              sm:px-4 sm:py-2.5 rounded-full sm:rounded-lg
              text-[9px] sm:text-[10px] font-bold uppercase tracking-wider
              ${
                isInCart && !justAdded
                  ? "bg-green-500/15 text-green-400 cursor-default"
                  : justAdded
                    ? "bg-green-500 text-white"
                    : "bg-accent text-dark hover:bg-white hover:shadow-lg hover:shadow-accent/20"
              }`}
          >
            {isInCart || justAdded ? (
              <>
                <Check size={10} className="sm:w-[11px] sm:h-[11px]" />
                <span className="hidden sm:inline">
                  {justAdded ? "Added!" : "In Cart"}
                </span>
              </>
            ) : (
              <>
                <ShoppingCart size={10} className="sm:w-[11px] sm:h-[11px]" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

        {/* Swap badge */}
        {product.swappable && (
          <div
            className="mt-2.5 pt-2.5 border-t border-white/[0.06]
            flex items-center gap-1.5 text-secondary-dim
            text-[9px] sm:text-[10px] font-medium"
          >
            <Repeat2 size={11} className="text-secondary-dim" />
            <span>Swap Available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
