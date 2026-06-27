import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Star,
  Package,
  Tag,
} from "lucide-react";
import ProductCard from "../components/ui/ProductCard";
import useWishlistStore from "../store/wishlistStore";
import useCartStore from "../store/cartStore";

const isMobile = window.innerWidth < 1024;

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyWishlist = () => {
  const emptyRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      emptyRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
    );
  }, []);

  return (
    <div
      ref={emptyRef}
      className="flex flex-col items-center justify-center py-16 sm:py-24"
    >
      <div
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full
        bg-dark-200 border border-dark-400
        flex items-center justify-center mb-6 relative"
      >
        <Heart size={48} className="text-primary-600" />
        <div
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full
          bg-dark-300 border border-dark-400 flex items-center justify-center"
        >
          <span className="text-primary-500 text-xs font-bold">0</span>
        </div>
      </div>
      <h2 className="font-display font-bold text-2xl sm:text-3xl text-light mb-2">
        Your Wishlist is Empty
      </h2>
      <p className="text-primary-500 text-sm sm:text-base mb-8 text-center max-w-md">
        Save items you love by clicking the heart icon on any product. They'll
        appear here for easy access.
      </p>
      <Link to="/products" className="btn-primary flex items-center gap-2">
        Explore Products
        <ArrowRight size={16} />
      </Link>
    </div>
  );
};

// ─── Main Wishlist Component ──────────────────────────────────────────────────
const Wishlist = () => {
  const wishlistItems = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const moveAllToCart = useWishlistStore((state) => state.moveAllToCart);

  const addToCart = useCartStore((state) => state.addItem);

  const pageRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
    );

    gsap.fromTo(
      ".wishlist-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.1,
      },
    );
  }, []);

  const handleMoveAllToCart = () => {
    moveAllToCart(addToCart);
  };

  const handleClearWishlist = () => {
    gsap.to(".wishlist-card", {
      scale: 0.8,
      opacity: 0,
      duration: 0.25,
      stagger: 0.04,
      ease: "power2.in",
      onComplete: clearWishlist,
    });
  };

  const totalSavings = wishlistItems.reduce(
    (sum, item) => sum + (item.oldPrice ? item.oldPrice - item.price : 0),
    0,
  );
  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const inStockCount = wishlistItems.filter((i) => i.stock > 0).length;

  return (
    <div ref={pageRef} className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-end
            justify-between gap-4 mb-6 sm:mb-10"
        >
          <div>
            <h1
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl
              text-light mb-2"
            >
              My{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-light">
                Wishlist
              </span>
            </h1>
            <p className="text-primary-500 text-sm">
              {wishlistItems.length}{" "}
              {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {/* Bulk actions */}
          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 bg-accent text-dark
                  font-bold text-xs uppercase tracking-widest
                  px-4 py-2.5 rounded-xl hover:bg-light
                  transition-all duration-300 hover:scale-[1.02]
                  active:scale-95 hover:shadow-lg hover:shadow-accent/30"
              >
                <ShoppingCart size={14} />
                Add All to Cart
              </button>
              <button
                onClick={handleClearWishlist}
                className="flex items-center gap-2 border border-dark-400
                  text-primary-400 font-semibold text-xs uppercase
                  tracking-widest px-4 py-2.5 rounded-xl
                  hover:border-red-400/50 hover:text-red-400
                  transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Trash2 size={14} />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* ── Stats Bar ── */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
            {[
              {
                label: "Saved Items",
                value: wishlistItems.length,
                icon: Heart,
                color: "text-red-400",
              },
              {
                label: "In Stock",
                value: inStockCount,
                icon: Package,
                color: "text-green-400",
              },
              {
                label: "Total Value",
                value: `$${totalValue.toLocaleString()}`,
                icon: Tag,
                color: "text-accent",
              },
              {
                label: "Potential Savings",
                value: `$${totalSavings.toLocaleString()}`,
                icon: Star,
                color: "text-yellow-400",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="bg-dark-200 border border-dark-400 rounded-2xl
                  p-4 flex items-center gap-3"
              >
                <div
                  className="w-9 h-9 rounded-xl bg-dark-300 border border-dark-400
                  flex items-center justify-center shrink-0"
                >
                  <Icon size={16} className={color} />
                </div>
                <div className="min-w-0">
                  <p className="text-light font-bold text-sm sm:text-base truncate">
                    {value}
                  </p>
                  <p className="text-primary-500 text-[10px] sm:text-xs">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            {/* ✅ Same grid as Products page — 2 cols mobile, 3-4 desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {wishlistItems.map((item, index) => (
                // ✅ group class added so delete button hover works
                <div key={item.id} className="wishlist-card group relative">
                  <ProductCard product={item} index={isMobile ? 0 : index} />

                  {/* ✅ Delete button — visible on hover via group */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 z-20
                      w-7 h-7 sm:w-8 sm:h-8 rounded-xl
                      bg-dark/80 backdrop-blur-sm border border-dark-400
                      flex items-center justify-center
                      text-red-400 hover:text-red-300
                      hover:border-red-400/50 hover:bg-red-500/10
                      transition-all duration-200
                      hover:scale-110 active:scale-95
                      // ✅ always visible on mobile, hover on desktop
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div
              className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center
              justify-center gap-4 pt-8 border-t border-dark-400"
            >
              <Link
                to="/products"
                className="border border-dark-400 text-primary-400
                  font-semibold text-sm px-6 py-3 rounded-2xl
                  hover:border-accent hover:text-accent
                  transition-all duration-300 flex items-center gap-2
                  hover:scale-[1.02] active:scale-95"
              >
                Continue Shopping
                <ArrowRight size={16} />
              </Link>
              <Link to="/cart" className="btn-primary flex items-center gap-2">
                <ShoppingCart size={16} />
                View Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
