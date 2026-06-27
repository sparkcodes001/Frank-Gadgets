import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingCart, Heart, ArrowRight, Eye, Check } from "lucide-react";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import { useState } from "react";

gsap.registerPlugin(ScrollTrigger);

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
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
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
      const wishlistItem = {
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
      };
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-dark-200 border border-dark-400
    rounded-xl overflow-hidden hover:border-accent/40
    transition-all duration-400 hover:shadow-xl hover:shadow-accent/5"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden h-44 sm:h-48 bg-dark-300 rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-accent text-dark text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest">
              New
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-dark/80 backdrop-blur-sm text-accent text-[9px] font-bold px-2 py-0.5 border-l-2 border-accent">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full  
      backdrop-blur-md border flex items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            ${
              isInWishlist
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "bg-dark/60 border-white/10 text-white/50 hover:text-red-400 hover:border-red-400/40"
            }`}
        >
          <Heart size={13} className={isInWishlist ? "fill-red-400" : ""} />
        </button>

        {/* Hover overlay actions */}
        <div
          className="absolute inset-0 bg-dark/50 opacity-0
          group-hover:opacity-100 transition-all duration-300
          flex items-center justify-center gap-2"
        >
          <Link
            to={`/products/${product.id}`}
            className="w-9 h-9 rounded-lg bg-light text-dark flex items-center justify-center
              hover:bg-accent transition-all duration-200
              translate-y-3 group-hover:translate-y-0"
          >
            <Eye size={15} />
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`w-9 h-9 flex items-center justify-center
              transition-all duration-200
              translate-y-3 group-hover:translate-y-0
              ${
                isInCart
                  ? "bg-green-500 text-white"
                  : "bg-light text-dark hover:bg-accent"
              }`}
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
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-dark/90 px-2.5 py-1 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-red-400 animate-pulse" />
              <span className="text-red-400 text-[9px] font-medium">
                Only {product.stock} left
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="p-3.5 sm:p-4">
        {/* Brand + Category */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-accent text-[10px] font-bold uppercase tracking-widest">
            {product.brand}
          </span>
          <span className="text-primary-600 text-[10px]">
            {product.category === "mobile" ? "📱" : "💻"}
          </span>
        </div>

        {/* Name */}
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-light font-semibold text-sm leading-snug
            line-clamp-2 hover:text-accent transition-colors duration-200
            min-h-[36px] mb-3"
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-dark-400">
          <div>
            <span className="font-bold text-light text-sm sm:text-base block leading-none">
              ${product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-primary-600 text-[10px] line-through mt-0.5 block">
                ${product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isInCart && !justAdded}
            className={`text-[10px] font-bold uppercase tracking-wider
              px-3.5 py-2 flex items-center gap-1.5
              transition-all duration-300 active:scale-95
              ${
                isInCart && !justAdded
                  ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-default"
                  : justAdded
                    ? "bg-green-500 text-dark"
                    : "bg-accent text-dark hover:bg-accent-dim"
              }`}
          >
            {isInCart || justAdded ? (
              <>
                <Check size={11} />
                {justAdded ? "Added!" : "In Cart"}
              </>
            ) : (
              <>
                <ShoppingCart size={11} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
