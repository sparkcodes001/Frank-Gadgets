import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3x3,
  LayoutGrid,
} from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/ui/ProductCard";

const isMobile = window.innerWidth < 1024;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [sortBy, setSortBy] = useState("featured");
  const [gridCols, setGridCols] = useState(3);
  const [showFilters, setShowFilters] = useState(false);

  const headerRef = useRef(null);
  const drawerRef = useRef(null);

  const brands = ["all", ...new Set(products.map((p) => p.brand))];

  const categories = [
    { value: "all", label: "All Products", icon: "🔥" },
    { value: "mobile", label: "Smartphones", icon: "📱" },
    { value: "pc", label: "Laptops & PCs", icon: "💻" },
    { value: "accessories", label: "Accessories", icon: "🎧" },
    { value: "tablet", label: "Tablets", icon: "📱" },
  ];

  // ✅ Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ── Filter & Sort ──
  const filteredProducts = products
    .filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchBrand = selectedBrand === "all" || p.brand === selectedBrand;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchBrand && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return Number(b.isNew) - Number(a.isNew);
        default:
          return 0;
      }
    });

  // ── GSAP entrance ──
  useEffect(() => {
    if (isMobile) return;

    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
    );
    gsap.fromTo(
      ".sidebar-anim",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: "power2.out" },
    );
  }, []);

  // ── Mobile drawer animation ──
  useEffect(() => {
    if (!drawerRef.current) return;
    if (showFilters) {
      gsap.fromTo(
        drawerRef.current,
        { y: "100%" },
        { y: "0%", duration: 0.35, ease: "power3.out" },
      );
    } else {
      gsap.to(drawerRef.current, {
        y: "100%",
        duration: 0.25,
        ease: "power3.in",
      });
    }
  }, [showFilters]);

  // ── Sync URL params ──
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 3000]);
    setSearchQuery("");
    setSortBy("featured");
  };

  // ── Filter Content ──
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-display font-bold text-light text-xs uppercase tracking-widest mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setShowFilters(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm
                transition-all duration-200 flex items-center gap-2.5
                ${
                  selectedCategory === cat.value
                    ? "bg-accent text-dark font-semibold"
                    : "text-primary-400 hover:bg-dark-300 hover:text-light"
                }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="font-display font-bold text-light text-xs uppercase tracking-widest mb-3">
          Brand
        </h3>
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-dark-400 scrollbar-track-transparent pr-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer group py-0.5"
            >
              <div
                onClick={() => setSelectedBrand(brand)}
                className={`w-4 h-4 rounded-full border-2 flex items-center
                  justify-center shrink-0 transition-all duration-200
                  ${
                    selectedBrand === brand
                      ? "border-accent bg-accent"
                      : "border-dark-400 group-hover:border-accent"
                  }`}
              >
                {selectedBrand === brand && (
                  <div className="w-1.5 h-1.5 rounded-full bg-dark" />
                )}
              </div>
              <span
                onClick={() => setSelectedBrand(brand)}
                className="text-sm text-primary-400 capitalize
                  group-hover:text-light transition-colors cursor-pointer"
              >
                {brand === "all" ? "All Brands" : brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-display font-bold text-light text-xs uppercase tracking-widest mb-3">
          Price Range
        </h3>
        <input
          type="range"
          min="0"
          max="3000"
          step="100"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full accent-amber-500 cursor-pointer"
        />
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-primary-500 text-xs">${priceRange[0]}</span>
          <span className="text-accent font-bold text-sm">
            Up to ${priceRange[1].toLocaleString()}
          </span>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full bg-dark-300 border border-dark-400 text-primary-400
          py-3 rounded-2xl text-xs font-bold uppercase tracking-widest
          hover:border-accent hover:text-accent transition-all duration-200"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div ref={headerRef} className="mb-6 sm:mb-8">
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-light mb-2">
            All{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-light">
              Products
            </span>
          </h1>
          <p className="text-primary-500 text-sm">
            {filteredProducts.length} products found
          </p>
        </div>

        {/* ── Top Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-200 border border-dark-400 text-light text-sm
                pl-11 pr-10 py-3 rounded-2xl focus:outline-none focus:border-accent
                transition-colors duration-200 placeholder:text-primary-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-primary-600 hover:text-accent transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Right controls */}
          <div className="flex gap-2 sm:gap-3">
            {/* Sort */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full bg-dark-200 border border-dark-400
                  text-light text-sm pl-4 pr-9 py-3 rounded-2xl
                  focus:outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price ↑</option>
                <option value="price-high">Price ↓</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none"
              />
            </div>

            {/* Grid toggle — desktop only */}
            <div className="hidden lg:flex items-center gap-1 bg-dark-200 border border-dark-400 rounded-2xl p-1">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2 rounded-xl transition-all duration-200
                  ${gridCols === 3 ? "bg-accent text-dark" : "text-primary-600 hover:text-accent"}`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2 rounded-xl transition-all duration-200
                  ${gridCols === 4 ? "bg-accent text-dark" : "text-primary-600 hover:text-accent"}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Mobile filter button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-2 bg-dark-200 border border-dark-400
                text-light text-sm px-4 py-3 rounded-2xl hover:border-accent/50
                transition-colors shrink-0"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden xs:block">Filters</span>
            </button>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="sidebar-anim hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="bg-dark-200 border border-dark-400 rounded-2xl p-5 sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length > 0 ? (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-5 grid-cols-2
                  ${gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"}`}
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={isMobile ? 0 : i}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">😔</div>
                <p className="text-light font-display font-bold text-xl mb-2">
                  No Products Found
                </p>
                <p className="text-primary-500 text-sm mb-6">
                  Try adjusting your search or filters
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      <div
        ref={drawerRef}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden
          bg-dark-200 border-t border-dark-400 rounded-t-3xl p-6 pb-10
          max-h-[85vh] overflow-y-auto translate-y-full"
      >
        <div className="w-12 h-1 bg-dark-400 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-light text-lg">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="w-8 h-8 rounded-full bg-dark-300 border border-dark-400
              flex items-center justify-center text-primary-400
              hover:text-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <FilterContent />
      </div>
    </div>
  );
};

export default Products;
