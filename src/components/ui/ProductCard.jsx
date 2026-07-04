import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ShoppingCart, Heart, Eye, Check, Repeat2 } from "lucide-react";
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
      className="group relative bg-dark-200 border border-dark-400
        rounded-xl overflow-hidden hover:border-accent/40
        transition-all duration-300 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* ── Image ── */}
      <div
        className="relative overflow-hidden aspect-square sm:aspect-auto 
        sm:h-48 bg-dark-300 rounded-t-xl"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-t 
          from-dark-200 via-transparent to-transparent"
        />

        {/* ── Badges top left ── */}
        <div
          className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 
          flex flex-col gap-1"
        >
          {product.isNew && (
            <span
              className="bg-accent text-white text-[8px] sm:text-[9px] 
              font-bold px-1.5 sm:px-2 py-0.5 uppercase tracking-widest"
            >
              New
            </span>
          )}
          {product.discount > 0 && (
            <span
              className="bg-dark/80 text-accent text-[8px] sm:text-[9px] 
              font-bold px-1.5 sm:px-2 py-0.5 border-l-2 border-accent"
            >
              -{product.discount}%
            </span>
          )}
        </div>

        {/* ── Wishlist top right ── */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5
            w-6 h-6 sm:w-8 sm:h-8 rounded-full z-10
            backdrop-blur-md border flex items-center justify-center
            transition-all duration-300 active:scale-95 hover:scale-110
            ${
              isInWishlist
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-dark/60 border-white/10 text-white/50 hover:bg-red-500/10 hover:border-red-400/40 hover:text-red-400"
            }`}
        >
          <Heart
            size={10}
            className={`sm:w-[13px] sm:h-[13px] transition-all duration-300
              ${isInWishlist ? "fill-red-400 text-red-400" : ""}`}
          />
        </button>

        {/* ── Hover Actions desktop ── */}
        <div
          className="absolute bottom-0 left-0 right-0
          flex items-center justify-center gap-2 p-2
          translate-y-full group-hover:translate-y-0
          transition-transform duration-300 ease-out
          hidden sm:flex"
        >
          {/* Quick view */}
          <Link
            to={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5
              bg-dark/80 backdrop-blur-sm border border-white/10
              text-white text-[10px] font-medium
              hover:bg-accent hover:border-accent hover:text-white
              transition-all duration-200"
          >
            <Eye size={12} />
            Quick View
          </Link>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`flex items-center gap-1.5 px-3 py-1.5
              backdrop-blur-sm border text-[10px] font-medium
              transition-all duration-200
              ${
                isInCart
                  ? "bg-green-500/80 border-green-500/50 text-white"
                  : "bg-dark/80 border-white/10 text-white hover:bg-accent hover:border-accent"
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
          <div
            className="absolute bottom-1.5 left-1.5 right-1.5 
            sm:bottom-2 sm:left-2 sm:right-2"
          >
            <div
              className="bg-dark/90 px-2 py-0.5 sm:py-1 
              flex items-center gap-1.5"
            >
              <span className="w-1 h-1 bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[8px] sm:text-[9px] font-medium">
                Only {product.stock} left
              </span>
            </div>
          </div>
        )}

        {/* ── Out of Stock ── */}
        {product.stock === 0 && (
          <div
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm
            flex items-center justify-center"
          >
            <span
              className="bg-dark-200 border border-dark-400 
              text-primary-500 text-[10px] font-bold uppercase 
              tracking-widest px-3 py-1.5"
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-2 sm:p-3.5">
        {/* Brand */}
        <p
          className="text-accent text-[8px] sm:text-[10px] font-bold 
          uppercase tracking-widest mb-0.5 sm:mb-1.5 truncate"
        >
          {product.brand}
        </p>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-light font-semibold text-[10px] sm:text-sm 
            leading-snug line-clamp-2 hover:text-accent 
            transition-colors duration-200
            min-h-[24px] sm:min-h-[36px] mb-1.5 sm:mb-3"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div
          className="flex items-center justify-between pt-1.5 sm:pt-3 
          border-t border-dark-400"
        >
          {/* ✅ Naira Price */}
          <div>
            <span
              className="font-bold text-light text-[11px] sm:text-sm 
              block leading-none"
            >
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span
                className="text-primary-600 text-[8px] sm:text-[10px] 
                line-through mt-0.5 block"
              >
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Mobile: icon only | Desktop: icon + text */}
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
                    ? "bg-green-500 text-white"
                    : "bg-accent text-white hover:bg-accent-dim"
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

        {/* ✅ Swap badge - Frank Gadgets USP */}
        {product.swappable && (
          <div
            className="mt-2 pt-2 border-t border-dark-400/40
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
