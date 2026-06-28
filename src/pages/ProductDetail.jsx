import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingCart,
  Heart,
  Star,
  ArrowLeft,
  Shield,
  Truck,
  RotateCcw,
  Zap,
  Check,
  Minus,
  Plus,
  Share2,
} from "lucide-react";
import useAdminStore from "../store/adminStore";
import ProductCard from "../components/ui/ProductCard";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

gsap.registerPlugin(ScrollTrigger);

const ProductDetail = () => {
  const { id } = useParams();

  // ✅ Get products from store
  const products = useAdminStore((state) => state.products);
  const product = products.find((p) => p.id === Number(id));

  // ✅ related declared ONCE only here
  const related = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product?.id),
  );

  const isInCart = product
    ? cartItems.some(
        (item) =>
          item.id === product.id &&
          item.color === product.colors?.[selectedColor],
      )
    : false;

  const imageRef = useRef(null);
  const infoRef = useRef(null);
  const pageRef = useRef(null);

  // ❌ REMOVED duplicate related declaration that was here

  useEffect(() => {
    window.scrollTo(0, 0);
    const tl = gsap.timeline();
    tl.fromTo(
      imageRef.current,
      { x: -60, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" },
    )
      .fromTo(
        infoRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.7",
      )
      .fromTo(
        ".detail-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.6",
      );
  }, [id]);

  const handleAddToCart = () => {
    if (!isInCart && product) {
      addToCart(product, quantity, product.colors?.[selectedColor]);
    }
    setAddedToCart(true);
    gsap.fromTo(
      ".cart-btn",
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: "back.out(2)" },
    );
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleImageChange = (i) => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
    );
    setSelectedImage(i);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-6xl">😔</p>
          <p className="text-light font-display font-bold text-2xl">
            Product Not Found
          </p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "specs", label: "Specs" },
    { id: "description", label: "Description" },
    { id: "shipping", label: "Shipping" },
  ];

  const guarantees = [
    {
      icon: <Shield size={18} />,
      title: "2 Year Warranty",
      sub: "Full coverage",
    },
    { icon: <Truck size={18} />, title: "Free Delivery", sub: "Over $100" },
    {
      icon: <RotateCcw size={18} />,
      title: "30 Day Returns",
      sub: "Hassle free",
    },
    { icon: <Zap size={18} />, title: "Fast Shipping", sub: "1-2 days" },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-1.5 text-[10px] sm:text-xs
          text-primary-600 mb-6 sm:mb-8 flex-wrap"
        >
          <Link to="/" className="hover:text-accent transition-colors shrink-0">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-accent transition-colors shrink-0"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-accent transition-colors shrink-0 capitalize"
          >
            {product.category === "mobile" ? "Smartphones" : "Laptops"}
          </Link>
          <span>/</span>
          <span className="text-primary-400 line-clamp-1 min-w-0">
            {product.name}
          </span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* LEFT: Images */}
          <div ref={imageRef} className="space-y-3 sm:space-y-4">
            <div
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl
              bg-dark-200 border border-dark-400 aspect-square w-full"
            >
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <span
                    className="bg-accent text-dark text-[9px] sm:text-[10px]
                    font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
                  >
                    New
                  </span>
                )}
                {product.discount > 0 && (
                  <span
                    className="bg-dark/70 backdrop-blur-sm text-accent
                    text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full
                    border border-accent/40"
                  >
                    -{product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Share + Wishlist */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
                <button
                  onClick={handleWishlistToggle}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full
                    backdrop-blur-md border flex items-center justify-center
                    transition-all duration-300 hover:scale-110 active:scale-95
                    ${
                      isInWishlist
                        ? "bg-red-500/20 border-red-500/50 text-red-400"
                        : "bg-dark/60 border-white/20 text-white/60 hover:text-red-400"
                    }`}
                >
                  <Heart
                    size={15}
                    className={isInWishlist ? "fill-red-400" : ""}
                  />
                </button>
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full
                  bg-dark/60 backdrop-blur-md border border-white/20
                  flex items-center justify-center text-white/60
                  hover:text-accent hover:border-accent/50
                  transition-all duration-300 hover:scale-110"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleImageChange(i)}
                    className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20
                      rounded-xl sm:rounded-2xl overflow-hidden border-2
                      transition-all duration-300 hover:scale-105
                      ${
                        selectedImage === i
                          ? "border-accent shadow-lg shadow-accent/30"
                          : "border-dark-400 hover:border-accent/50"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div ref={infoRef} className="flex flex-col gap-4 sm:gap-5">
            {/* Brand + Category */}
            <div className="detail-item flex items-center justify-between">
              <span
                className="text-accent text-[10px] sm:text-xs font-bold
                uppercase tracking-widest"
              >
                {product.brand}
              </span>
              <span
                className="text-primary-600 text-[10px] sm:text-xs
                uppercase tracking-wider"
              >
                {product.category === "mobile" ? "📱 Smartphone" : "💻 PC"}
              </span>
            </div>

            {/* Name */}
            <h1
              className="detail-item font-display font-bold
              text-xl sm:text-2xl lg:text-3xl xl:text-4xl
              text-light leading-tight"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="detail-item flex items-center flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? "text-accent fill-accent"
                          : "text-dark-400"
                      }
                    />
                  ))}
                </div>
                <span className="text-light font-semibold text-xs sm:text-sm">
                  {product.rating}
                </span>
              </div>
              <span className="text-primary-500 text-xs sm:text-sm">
                ({product.reviews} reviews)
              </span>
              {product.stock <= 10 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-400 text-[10px] sm:text-xs font-medium">
                    Only {product.stock} left
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="detail-item flex items-center flex-wrap gap-2 sm:gap-3">
              <span
                className="font-display font-bold text-2xl sm:text-3xl
                lg:text-4xl text-light"
              >
                ${product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-primary-600 text-base sm:text-lg line-through">
                    ${product.oldPrice.toLocaleString()}
                  </span>
                  <span
                    className="bg-green-500/10 text-green-400 text-[10px]
                    sm:text-xs font-bold px-2 py-1 rounded-full
                    border border-green-500/20"
                  >
                    Save ${(product.oldPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Colors */}
            <div className="detail-item space-y-2">
              <p
                className="text-primary-400 text-[10px] sm:text-xs
                uppercase tracking-widest font-semibold"
              >
                Color
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full
                      transition-all duration-300 hover:scale-110 active:scale-95
                      ${
                        selectedColor === i
                          ? "ring-2 ring-accent ring-offset-2 ring-offset-dark scale-110"
                          : "ring-1 ring-dark-400"
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="detail-item space-y-2">
              <p
                className="text-primary-400 text-[10px] sm:text-xs
                uppercase tracking-widest font-semibold"
              >
                Quantity
              </p>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div
                  className="flex items-center bg-dark-200 border border-dark-400
                  rounded-xl sm:rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-primary-400
                      hover:text-accent hover:bg-dark-300
                      transition-all duration-300 active:scale-95"
                  >
                    <Minus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                  <span
                    className="px-4 sm:px-5 py-2.5 sm:py-3 text-light
                    font-bold text-sm border-x border-dark-400
                    min-w-[44px] sm:min-w-[50px] text-center"
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-primary-400
                      hover:text-accent hover:bg-dark-300
                      transition-all duration-300 active:scale-95"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
                <span className="text-primary-600 text-[10px] sm:text-xs">
                  {product.stock} units available
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="detail-item flex flex-col xs:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isInCart && !addedToCart}
                className={`cart-btn flex-1 flex items-center justify-center gap-2
                  font-bold text-xs sm:text-sm uppercase tracking-widest
                  px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                  transition-all duration-300 hover:scale-[1.02] active:scale-95
                  ${
                    isInCart && !addedToCart
                      ? "bg-green-500 text-white cursor-default"
                      : addedToCart
                        ? "bg-green-500 text-white"
                        : "bg-accent text-dark hover:bg-light hover:shadow-xl hover:shadow-accent/30"
                  }`}
              >
                {isInCart || addedToCart ? (
                  <>
                    <Check size={16} />
                    {addedToCart ? "Added!" : "In Cart"}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`flex items-center justify-center gap-2
                  px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                  font-semibold text-xs sm:text-sm border
                  transition-all duration-300 hover:scale-[1.02] active:scale-95
                  ${
                    isInWishlist
                      ? "bg-red-500/10 border-red-500/40 text-red-400"
                      : "border-dark-400 text-primary-400 hover:border-accent hover:text-accent"
                  }`}
              >
                <Heart
                  size={16}
                  className={isInWishlist ? "fill-red-400 text-red-400" : ""}
                />
                {isInWishlist ? "Saved" : "Wishlist"}
              </button>
            </div>

            {/* Guarantees */}
            <div className="detail-item grid grid-cols-2 gap-2 sm:gap-3 pt-1">
              {guarantees.map((g, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 sm:gap-3 bg-dark-200
                    border border-dark-400 rounded-xl sm:rounded-2xl
                    p-2.5 sm:p-3 hover:border-accent/40 transition-all duration-300"
                >
                  <div className="text-accent shrink-0">{g.icon}</div>
                  <div className="min-w-0">
                    <p
                      className="text-light text-[10px] sm:text-xs font-semibold
                      leading-tight"
                    >
                      {g.title}
                    </p>
                    <p
                      className="text-primary-600 text-[9px] sm:text-[10px]
                      leading-tight mt-0.5"
                    >
                      {g.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12 sm:mb-16">
          <div
            className="grid grid-cols-3 gap-1 bg-dark-200
            border border-dark-400 rounded-xl sm:rounded-2xl p-1 mb-6 sm:mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  text-[10px] sm:text-sm font-bold uppercase tracking-wider
                  text-center transition-all duration-300
                  ${
                    activeTab === tab.id
                      ? "bg-accent text-dark shadow-lg"
                      : "text-primary-400 hover:text-light"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8"
          >
            {activeTab === "specs" && product.specs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-4
                      py-3 sm:py-4 border-b border-dark-400
                      last:border-0 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
                  >
                    <span
                      className="text-primary-500 text-xs sm:text-sm
                      capitalize font-medium shrink-0"
                    >
                      {key}
                    </span>
                    <span
                      className="text-light text-xs sm:text-sm
                      font-semibold text-right"
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="text-primary-300 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
                <p className="text-primary-400 text-xs sm:text-sm leading-relaxed">
                  Experience the pinnacle of technology with the {product.name}.
                  Crafted with precision and built for performance.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
                  {[
                    {
                      icon: "🎨",
                      title: "Premium Design",
                      desc: "Crafted with finest materials",
                    },
                    {
                      icon: "⚡",
                      title: "Top Performance",
                      desc: "Blazing fast processor",
                    },
                    {
                      icon: "📸",
                      title: "Pro Camera",
                      desc: "Capture every moment",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-dark-300 rounded-xl sm:rounded-2xl p-4 text-center"
                    >
                      <div className="text-2xl sm:text-3xl mb-2">
                        {item.icon}
                      </div>
                      <p className="text-light font-semibold text-xs sm:text-sm mb-1">
                        {item.title}
                      </p>
                      <p className="text-primary-500 text-[10px] sm:text-xs">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-3">
                {[
                  {
                    icon: "🚀",
                    title: "Express Delivery",
                    desc: "1-2 business days",
                    price: "$9.99",
                  },
                  {
                    icon: "📦",
                    title: "Standard Delivery",
                    desc: "3-5 business days",
                    price: "Free over $100",
                  },
                  {
                    icon: "🏪",
                    title: "Store Pickup",
                    desc: "Available same day",
                    price: "Free",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 bg-dark-300
                      rounded-xl sm:rounded-2xl p-3 sm:p-4
                      hover:border-accent/40 border border-transparent
                      transition-all duration-300"
                  >
                    <span className="text-2xl sm:text-3xl shrink-0">
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-light font-semibold text-xs sm:text-sm">
                        {item.title}
                      </p>
                      <p className="text-primary-500 text-[10px] sm:text-xs mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-accent font-bold text-xs sm:text-sm shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2
              className="font-display font-bold text-xl sm:text-2xl
              lg:text-3xl text-light mb-5 sm:mb-6"
            >
              Related{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r
                from-accent to-light"
              >
                Products
              </span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
