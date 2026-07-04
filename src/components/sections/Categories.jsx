import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  Tablet,
  Headphones,
  RefreshCw,
  Zap,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: "Phones",
    path: "/products?category=phones",
    icon: Smartphone,
    count: 150,
    image: "/categoriesImg/smartphones.jpg",
    gradient: "from-red-400/20 to-orange-500/20",
    description: "iPhone, Samsung, Tecno, Infinix & more",
  },
  {
    id: 2,
    name: "Tablets",
    path: "/products?category=tablets",
    icon: Tablet,
    count: 45,
    image: "/categoriesImg/tab2.webp",
    gradient: "from-blue-400/20 to-purple-500/20",
    description: "iPad, Samsung Tab, Lenovo & more",
  },
  {
    id: 3,
    name: "Gadgets",
    path: "/products?category=gadgets",
    icon: Headphones,
    count: 200,
    image: "/categoriesImg/headp.webp",
    gradient: "from-green-400/20 to-emerald-500/20",
    description: "AirPods, Chargers, Cables & more",
  },
  {
    id: 4,
    name: "Buy & Swap",
    path: "/swap",
    icon: RefreshCw,
    count: 0,
    image: "/categoriesImg/tab.webp",
    gradient: "from-accent/20 to-pink-500/20",
    description: "Sell your old device or swap for new",
  },
];

const brands = [
  {
    name: "Apple",
    logo: "https://cdn.simpleicons.org/apple/ffffff",
  },
  {
    name: "Samsung",
    logo: "https://cdn.simpleicons.org/samsung/ffffff",
  },
  {
    name: "Tecno",
    logo: "https://cdn.simpleicons.org/tecno/ffffff",
  },
  {
    name: "Infinix",
    logo: "https://cdn.simpleicons.org/infinix/ffffff",
  },
  {
    name: "Xiaomi",
    logo: "https://cdn.simpleicons.org/xiaomi/ffffff",
  },
  {
    name: "Google",
    logo: "https://cdn.simpleicons.org/google/ffffff",
  },
  {
    name: "Huawei",
    logo: "https://cdn.simpleicons.org/huawei/ffffff",
  },
  {
    name: "OnePlus",
    logo: "https://cdn.simpleicons.org/oneplus/ffffff",
  },
  {
    name: "JBL",
    logo: "https://cdn.simpleicons.org/jbl/ffffff",
  },
  {
    name: "Anker",
    logo: "https://cdn.simpleicons.org/anker/ffffff",
  },
];

// ── Infinite Marquee ──
const InfiniteMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-dark-200 border-y border-dark-400 py-6">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {[...brands, ...brands, ...brands].map((brand, i) => (
          <div
            key={i}
            className="flex items-center justify-center min-w-[120px] h-12
              grayscale opacity-40 hover:grayscale-0 hover:opacity-100
              transition-all duration-300"
          >
            <img
              src={brand.logo}
              alt={brand.name}
              className="h-5 object-contain"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ── Category Card ──
const CategoryCard = ({ cat, index }) => {
  const cardRef = useRef(null);
  const IconComponent = cat.icon;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        delay: index * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 95%",
        },
      },
    );
  }, [index]);

  return (
    <Link
      to={cat.path}
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl
        bg-dark-200 border border-dark-400
        hover:border-accent/40
        transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5
        block w-full h-full"
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={cat.image}
          alt={cat.name}
          className="w-full h-full object-cover opacity-30
            group-hover:scale-110 group-hover:opacity-40
            transition-all duration-700"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-end">
        <div
          className="mb-4 w-12 h-12 rounded-2xl bg-accent/10 border border-accent/30
          flex items-center justify-center text-accent backdrop-blur-sm
          group-hover:scale-110 group-hover:bg-accent/20 group-hover:border-accent/50
          transition-all duration-300"
        >
          <IconComponent size={22} />
        </div>

        <h3
          className="font-display font-bold text-xl sm:text-2xl lg:text-3xl
          text-light mb-1 group-hover:text-accent transition-colors duration-300"
        >
          {cat.name}
        </h3>

        <p className="text-primary-500 text-xs sm:text-sm mb-3">
          {cat.description}
        </p>

        <div className="flex items-center justify-between">
          {cat.count > 0 ? (
            <span className="text-primary-400 text-sm font-medium">
              {cat.count}+ Items
            </span>
          ) : (
            <span className="text-accent text-sm font-medium">
              Free Valuation →
            </span>
          )}
          <div
            className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30
            flex items-center justify-center text-accent
            group-hover:translate-x-1 group-hover:bg-accent/20
            transition-all duration-300"
          >
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-tr from-accent/5 via-transparent to-transparent
        transition-opacity duration-500 pointer-events-none"
      />
    </Link>
  );
};

// ── Main Section ──
const Categories = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      ".cat-heading",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-dark relative overflow-hidden">
      {/* ── Header ── */}
      <div className="section-padding pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div
            className="cat-heading flex items-center justify-center gap-2
            text-accent text-xs sm:text-sm uppercase tracking-[0.3em]
            font-semibold mb-2"
          >
            <Zap size={14} className="animate-pulse" />
            Browse By Category
          </div>
          <h2
            className="cat-heading font-display font-bold
            text-3xl sm:text-4xl lg:text-5xl text-light"
          >
            Find Your Perfect{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r
              from-accent to-light"
            >
              Device
            </span>
          </h2>
          <p className="cat-heading text-primary-400 text-sm sm:text-base max-w-xl mx-auto">
            From smartphones to gadgets — we've got you covered. We buy, sell
            and swap!
          </p>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Phones - tall left card */}
          <div className="sm:row-span-2 min-h-[300px] sm:min-h-[500px]">
            <CategoryCard cat={categories[0]} index={0} />
          </div>

          {/* Tablets - top right */}
          <div className="min-h-[240px]">
            <CategoryCard cat={categories[1]} index={1} />
          </div>

          {/* Gadgets */}
          <div className="min-h-[240px]">
            <CategoryCard cat={categories[2]} index={2} />
          </div>

          {/* Buy & Swap - spans 2 cols on desktop */}
          <div className="sm:col-span-2 min-h-[200px]">
            <CategoryCard cat={categories[3]} index={3} />
          </div>
        </div>
      </div>

      {/* ── Infinite Moving Brands ── */}
      <InfiniteMarquee />

      {/* ── Stats Bar ── */}
      <div className="section-padding pt-12 sm:pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: "300+", label: "Gadgets", icon: "📦" },
              { value: "10+", label: "Brands", icon: "🏆" },
              { value: "2K+", label: "Happy Customers", icon: "🎉" },
              { value: "24H", label: "Delivery", icon: "🚀" },
            ].map((stat, i) => (
              <div
                key={i}
                className="cat-heading bg-dark-200 border border-dark-400
                  rounded-2xl p-4 sm:p-6 text-center
                  hover:border-accent/40 hover:bg-dark-300
                  transition-all duration-300 group"
              >
                <div
                  className="text-2xl sm:text-3xl mb-2
                  group-hover:scale-125 transition-transform duration-300"
                >
                  {stat.icon}
                </div>
                <p
                  className="font-display font-bold text-xl sm:text-2xl
                  text-accent mb-1
                  group-hover:text-light transition-colors duration-300"
                >
                  {stat.value}
                </p>
                <p className="text-primary-500 text-[10px] sm:text-xs uppercase tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background glow - red tint */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[600px] bg-accent/5 blur-[150px] rounded-full pointer-events-none"
      />
    </section>
  );
};

export default Categories;
