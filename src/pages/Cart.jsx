import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Lock,
  Smartphone,
  Tablet,
  Headphones,
  Gamepad2,
} from "lucide-react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/formatPrice";

// ✅ Category icon map (matches Frank Gadgets categories)
const categoryIcons = {
  phones: <Smartphone size={12} />,
  tablets: <Tablet size={12} />,
  accessories: <Headphones size={12} />,
  gadgets: <Gamepad2 size={12} />,
};

const Cart = () => {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const pageRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    gsap.fromTo(
      headerRef.current,
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );

    gsap.fromTo(
      ".cart-item",
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      },
    );

    gsap.fromTo(
      ".cart-summary",
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 },
    );
  }, []);

  const handleUpdateQuantity = (id, color, newQty) => {
    if (newQty < 1) return;
    updateQuantity(id, color, newQty);
  };

  const handleRemoveItem = (id, color) => {
    const itemId = `cart-item-${id}-${color.replace("#", "")}`;
    gsap.to(`#${itemId}`, {
      x: -100,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        removeItem(id, color);
      },
    });
  };

  // ✅ Calculations - Real Naira, no fake tax
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const savings = cartItems.reduce(
    (sum, item) =>
      sum + ((item.oldPrice || item.price) - item.price) * item.quantity,
    0,
  );
  const total = subtotal;

  return (
    <div ref={pageRef} className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="mb-6 sm:mb-8">
          <h1
            className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl
            text-light mb-2"
          >
            Shopping{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r
              from-accent to-secondary-dim"
            >
              Cart
            </span>
          </h1>
          <p className="text-primary-500 text-sm">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full
              bg-dark-200 border border-dark-400
              flex items-center justify-center mb-6"
            >
              <ShoppingBag size={48} className="text-primary-600" />
            </div>
            <h2
              className="font-display font-bold text-2xl sm:text-3xl
              text-light mb-2"
            >
              Your Cart is Empty
            </h2>
            <p
              className="text-primary-500 text-sm sm:text-base mb-8 text-center
              max-w-md"
            >
              Looks like you haven't added any gadgets yet. Start shopping now!
            </p>
            <Link
              to="/products"
              className="btn-primary flex items-center gap-2"
            >
              Start Shopping
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* LEFT: Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.color}`}
                  id={`cart-item-${item.id}-${item.color.replace("#", "")}`}
                  className="cart-item bg-dark-200 border border-dark-400
                    rounded-2xl sm:rounded-3xl overflow-hidden
                    hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex gap-3 sm:gap-4 p-3 sm:p-5">
                    {/* Image */}
                    <Link
                      to={`/products/${item.id}`}
                      className="shrink-0 w-20 h-20 sm:w-28 sm:h-28
                        rounded-xl sm:rounded-2xl overflow-hidden
                        bg-dark-300 border border-dark-400
                        hover:border-accent/50 transition-all duration-300 group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover
                          group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-3">
                      {/* Brand + Category */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="text-accent text-[10px] sm:text-xs
                          font-bold uppercase tracking-widest"
                        >
                          {item.brand}
                        </span>
                        <span className="text-primary-500">
                          {categoryIcons[item.category] || (
                            <Smartphone size={12} />
                          )}
                        </span>
                      </div>

                      {/* Name */}
                      <Link
                        to={`/products/${item.id}`}
                        className="text-light font-semibold text-sm sm:text-base
                          leading-snug hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {/* Color */}
                      <div className="flex items-center gap-2">
                        <span className="text-primary-500 text-[10px] sm:text-xs">
                          Color:
                        </span>
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-dark-400"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-end justify-between gap-2 mt-auto">
                        {/* Quantity */}
                        <div
                          className="flex items-center bg-dark-300
                          border border-dark-400 rounded-xl overflow-hidden"
                        >
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.color,
                                item.quantity - 1,
                              )
                            }
                            className="px-2.5 sm:px-3 py-1.5 sm:py-2
                              text-primary-400 hover:text-accent hover:bg-dark-200
                              transition-all duration-300 active:scale-95"
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="px-3 sm:px-4 py-1.5 sm:py-2
                            text-light font-bold text-xs sm:text-sm
                            border-x border-dark-400 min-w-[36px] sm:min-w-[44px] text-center"
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(
                                item.id,
                                item.color,
                                item.quantity + 1,
                              )
                            }
                            className="px-2.5 sm:px-3 py-1.5 sm:py-2
                              text-primary-400 hover:text-accent hover:bg-dark-200
                              transition-all duration-300 active:scale-95"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* ✅ Price in Naira */}
                        <div className="text-right">
                          <p className="text-light font-bold text-sm sm:text-base leading-none">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.oldPrice && (
                            <p className="text-primary-600 text-[10px] sm:text-xs line-through mt-0.5">
                              {formatPrice(item.oldPrice * item.quantity)}
                            </p>
                          )}
                        </div>

                        {/* Actions - Desktop */}
                        <div className="hidden sm:flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleRemoveItem(item.id, item.color)
                            }
                            className="w-9 h-9 rounded-xl bg-dark-300
                              border border-dark-400 flex items-center justify-center
                              text-primary-400 hover:text-red-400 hover:border-red-400/50
                              transition-all duration-300 hover:scale-110 active:scale-95"
                            title="Remove from Cart"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Actions - Mobile */}
                      <div className="flex sm:hidden items-center gap-2 pt-2 border-t border-dark-400">
                        <button
                          onClick={() => handleRemoveItem(item.id, item.color)}
                          className="flex-1 flex items-center justify-center gap-2
                            bg-dark-300 border border-dark-400 text-primary-400
                            py-2 rounded-xl text-xs font-semibold
                            hover:text-red-400 hover:border-red-400/50
                            transition-all duration-300 active:scale-95"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Swap badge if available */}
                  {item.swappable && (
                    <div className="px-3 sm:px-5 pb-3 sm:pb-4">
                      <span
                        className="inline-flex items-center gap-1.5
                        text-secondary-dim text-[10px] font-medium
                        bg-secondary/10 px-2.5 py-1 rounded-full"
                      >
                        🔄 Swap available for this item
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT: Summary */}
            <div className="lg:col-span-1">
              <div
                className="cart-summary bg-dark-200 border border-dark-400
                rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-5 sm:space-y-6
                lg:sticky lg:top-24"
              >
                <h2 className="font-display font-bold text-xl sm:text-2xl text-light">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-400">Subtotal</span>
                    <span className="text-light font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {savings > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-accent">You're Saving</span>
                      <span className="text-accent font-semibold">
                        -{formatPrice(savings)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-400">Delivery Fee</span>
                    <span className="text-primary-500 text-xs italic">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="border-t border-dark-400" />

                <div className="flex items-center justify-between">
                  <span className="text-light font-display font-bold text-lg">
                    Total
                  </span>
                  <span className="text-accent font-display font-bold text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Free pickup hint */}
                <div
                  className="bg-dark-300 border border-dark-400
                  rounded-xl p-3 text-xs text-primary-400 text-center"
                >
                  🏪 <span className="text-accent font-semibold">Free</span>{" "}
                  when you pick up at our Lagos store!
                </div>

                <Link
                  to="/checkout"
                  className="w-full bg-accent text-white font-bold text-sm
                    uppercase tracking-widest py-4 rounded-2xl
                    hover:bg-accent-dim transition-all duration-300
                    hover:shadow-xl hover:shadow-accent/30
                    flex items-center justify-center gap-2
                    hover:scale-[1.02] active:scale-95"
                >
                  <Lock size={16} />
                  Proceed to Checkout
                </Link>

                <Link
                  to="/products"
                  className="w-full border border-dark-400 text-primary-400
                    font-semibold text-sm py-4 rounded-2xl
                    hover:border-accent hover:text-accent
                    transition-all duration-300 flex items-center
                    justify-center gap-2 hover:scale-[1.02] active:scale-95"
                >
                  Continue Shopping
                  <ArrowRight size={16} />
                </Link>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 pt-2">
                  <div className="text-center">
                    <p
                      className="text-primary-600 text-[10px] uppercase
                      tracking-widest mb-1"
                    >
                      Secure Checkout
                    </p>
                    <div className="flex gap-2 justify-center">
                      {["🔒", "✅", "🇳🇬"].map((icon, i) => (
                        <span key={i} className="text-lg">
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
