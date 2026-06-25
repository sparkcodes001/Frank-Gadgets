import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Zap,
  Shield,
  Truck,
  HeadphonesIcon,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const WhyUs = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  const perks = [
    {
      icon: <Zap size={22} />,
      title: "Lightning Fast Delivery",
      desc: "Get your order delivered within 24–48 hours anywhere in the country.",
      stat: "48h",
      statLabel: "Max Delivery",
    },
    {
      icon: <Shield size={22} />,
      title: "2-Year Warranty",
      desc: "Every product comes with a full manufacturer warranty. No compromises.",
      stat: "2yr",
      statLabel: "Warranty",
    },
    {
      icon: <BadgeCheck size={22} />,
      title: "100% Authentic",
      desc: "All products are sourced directly from authorized distributors only.",
      stat: "100%",
      statLabel: "Genuine",
    },
    {
      icon: <HeadphonesIcon size={22} />,
      title: "24/7 Support",
      desc: "Our team is always available to help you before and after purchase.",
      stat: "24/7",
      statLabel: "Support",
    },
    {
      icon: <RefreshCw size={22} />,
      title: "Easy Returns",
      desc: "Changed your mind? Return within 30 days, no questions asked.",
      stat: "30d",
      statLabel: "Returns",
    },
    {
      icon: <Truck size={22} />,
      title: "Free Shipping",
      desc: "Free delivery on all orders above $100. No hidden charges ever.",
      stat: "$100+",
      statLabel: "Free Ship",
    },
  ];

  useEffect(() => {
    // Animate the top accent line
    gsap.fromTo(
      lineRef.current,
      { scaleX: 0, transformOrigin: "left" },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      },
    );

    // Header text
    gsap.fromTo(
      ".whyus-header",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      },
    );

    // Cards stagger
    gsap.fromTo(
      ".perk-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".perks-grid",
          start: "top 80%",
        },
      },
    );

    // Stat counters pop in
    gsap.fromTo(
      ".stat-number",
      { scale: 0.5, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".perks-grid",
          start: "top 70%",
        },
      },
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-dark-200 overflow-hidden">
      {/* Top accent line */}
      <div
        ref={lineRef}
        className="h-px w-full bg-gradient-to-r
        from-accent via-accent/50 to-transparent"
      />

      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2
        w-[600px] h-[300px] bg-accent/5 blur-[120px]
        pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14 sm:mb-16">
          <div className="space-y-3">
            <div className="whyus-header flex items-center gap-2">
              <div className="h-px w-8 bg-accent" />
              <span
                className="text-accent text-[11px] font-bold
                uppercase tracking-[0.3em]"
              >
                Why BreemTech
              </span>
            </div>
            <h2
              className="whyus-header font-display font-bold
              text-3xl sm:text-4xl lg:text-5xl text-light leading-tight"
            >
              We Don't Just Sell. <br className="hidden sm:block" />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #00ff88 0%, #f0f0f0 100%)",
                }}
              >
                We Deliver Trust.
              </span>
            </h2>
            <p className="whyus-header text-primary-400 text-sm sm:text-base max-w-md leading-relaxed">
              From the moment you browse to long after your purchase — we've got
              you covered at every step.
            </p>
          </div>

          {/* Big stat */}
          <div
            className="whyus-header shrink-0 border-l-2 border-accent pl-5
            hidden sm:block"
          >
            <p className="font-display font-bold text-4xl lg:text-5xl text-light">
              10k+
            </p>
            <p className="text-primary-500 text-xs uppercase tracking-widest mt-1">
              Happy Customers
            </p>
          </div>
        </div>

        {/* Perks Grid */}
        <div
          className="perks-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px
          border border-white/5 bg-white/5"
        >
          {perks.map((perk, i) => (
            <div
              key={i}
              className="perk-card group bg-dark-200 p-6 sm:p-8
                hover:bg-dark-300 transition-all duration-500
                relative overflow-hidden cursor-default"
            >
              {/* Hover accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-px
                bg-gradient-to-r from-accent to-transparent
                scale-x-0 group-hover:scale-x-100
                transition-transform duration-500 origin-left"
              />

              {/* Corner accent on hover */}
              <div
                className="absolute bottom-0 right-0 w-16 h-16
                bg-accent/5 group-hover:bg-accent/10
                transition-all duration-500"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 flex items-center justify-center
                text-accent bg-accent/10 mb-5
                group-hover:bg-accent group-hover:text-dark
                transition-all duration-300"
              >
                {perk.icon}
              </div>

              {/* Stat */}
              <div className="stat-number mb-3">
                <span
                  className="font-display font-bold text-2xl text-accent
                  leading-none"
                >
                  {perk.stat}
                </span>
                <span className="text-primary-600 text-[10px] uppercase tracking-widest ml-2">
                  {perk.statLabel}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-semibold text-light text-base mb-2
                group-hover:text-accent transition-colors duration-300"
              >
                {perk.title}
              </h3>

              {/* Desc */}
              <p className="text-primary-500 text-sm leading-relaxed">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div
          className="mt-px border border-white/5 bg-white/5
          grid grid-cols-2 sm:grid-cols-4"
        >
          {[
            { value: "500+", label: "Products" },
            { value: "4.9★", label: "Avg Rating" },
            { value: "10k+", label: "Orders Shipped" },
            { value: "99%", label: "Satisfaction Rate" },
          ].map((s, i) => (
            <div
              key={i}
              className={`bg-dark-200 px-6 py-4
                flex items-center gap-4
                ${i !== 3 ? "border-r border-white/5" : ""}`}
            >
              <div>
                <p className="font-display font-bold text-xl sm:text-2xl text-accent">
                  {s.value}
                </p>
                <p className="text-primary-600 text-[10px] uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
    </section>
  );
};

export default WhyUs;
