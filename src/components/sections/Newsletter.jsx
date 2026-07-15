import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Send,
  Mail,
  CheckCircle,
  Gift,
  Zap,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");

  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 95%",
      },
    });

    tl.fromTo(
      leftRef.current,
      { x: -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
    )
      .fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
        "-=0.7",
      )
      .fromTo(
        ".perk-item",
        { y: 30, opacity: 0, scale: 0.5 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.4",
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
        setPhone("");

        gsap.fromTo(
          ".success-icon",
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
        );

        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const perks = [
    { icon: <Gift size={18} />, text: "Exclusive deals & discount codes" },
    { icon: <Zap size={18} />, text: "Flash sales — first to know" },
    { icon: <RefreshCw size={18} />, text: "Best swap & trade-in offers" },
    {
      icon: <MessageCircle size={18} />,
      text: "New arrivals straight to your inbox",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-dark-100 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gold glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[400px] bg-accent/10 blur-[130px] rounded-full"
        />
        {/* Sierra blue glow opposite side */}
        <div
          className="absolute bottom-0 right-0
          w-[300px] h-[300px] bg-secondary/10 blur-[100px] rounded-full"
        />
        {/* Grid pattern — gold tint */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,155,92,0.25) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,155,92,0.25) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className="bg-dark-200 border border-dark-400 rounded-3xl sm:rounded-[2.5rem]
          overflow-hidden hover:border-accent/40 transition-all duration-500
          hover:shadow-[0_25px_60px_-15px_rgba(200,155,92,0.15)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* ── LEFT: Content ── */}
            <div
              ref={leftRef}
              className="relative p-8 sm:p-12 lg:p-14 flex flex-col 
                justify-center bg-gradient-to-br from-accent/5 to-transparent
                border-b lg:border-b-0 lg:border-r border-dark-400"
            >
              <div className="absolute bottom-6 right-6 opacity-5 pointer-events-none select-none">
                <p className="font-display font-bold text-6xl text-accent">
                  FG
                </p>
              </div>

              <div
                className="inline-flex items-center gap-2 w-fit
                bg-accent/10 border border-accent/30 rounded-full
                px-4 py-2 mb-6"
              >
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                  Join Our Community
                </span>
              </div>

              <h2
                className="font-display font-bold text-3xl sm:text-4xl 
                lg:text-5xl text-light mb-4 leading-tight"
              >
                Get the{" "}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r 
                  from-accent to-secondary-dim"
                >
                  Best Deals
                </span>{" "}
                First
              </h2>

              <p className="text-primary-400 text-sm sm:text-base leading-relaxed mb-8">
                Be the first to know about new arrivals, flash sales and
                exclusive Frank Gadgets offers. Drop your email and phone number
                below — no spam, promise! 🤝
              </p>

              <div className="space-y-3 mb-8">
                {perks.map((perk, i) => (
                  <div
                    key={i}
                    className="perk-item flex items-center gap-3 text-sm text-primary-300"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-accent/10 
                      border border-accent/20 flex items-center 
                      justify-center text-accent shrink-0"
                    >
                      {perk.icon}
                    </div>
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-primary-600 flex items-center gap-2">
                <CheckCircle size={13} className="text-accent" />
                Your info is safe with us. Unsubscribe anytime.
              </p>
            </div>

            {/* ── RIGHT: Form ── */}
            <div
              ref={rightRef}
              className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-dark-300/30"
            >
              {status === "success" ? (
                <div className="text-center space-y-5 py-8">
                  <div
                    className="success-icon w-20 h-20 bg-accent/10 
                    border-2 border-accent rounded-full flex items-center 
                    justify-center mx-auto"
                  >
                    <CheckCircle size={36} className="text-accent" />
                  </div>
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-light">
                    You're In! 🎉
                  </h3>
                  <p className="text-primary-400 text-sm max-w-xs mx-auto">
                    Welcome to the Frank Gadgets family! Watch your inbox for
                    exclusive deals 🔥
                  </p>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500/10 
                      border border-green-500/30 text-green-400 px-6 py-3 
                      rounded-full text-sm font-medium hover:bg-green-500/20
                      transition-all duration-300 mx-auto"
                  >
                    <FaWhatsapp size={18} />
                    Chat us on WhatsApp
                  </a>
                </div>
              ) : status === "error" ? (
                <div className="text-center space-y-4 py-8">
                  <div
                    className="w-16 h-16 bg-red-500/10 border-2 
                    border-red-500/50 rounded-full flex items-center 
                    justify-center mx-auto"
                  >
                    <Mail size={28} className="text-red-400" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-light">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-primary-400 text-sm">
                    Please try again or reach us on WhatsApp directly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-accent text-sm underline hover:text-accent-dim transition-colors"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="font-display font-bold text-xl sm:text-2xl text-light mb-1">
                      Stay Updated 📲
                    </h3>
                    <p className="text-primary-500 text-sm">
                      Drop your details and we'll keep you in the loop.
                    </p>
                  </div>

                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        disabled={status === "loading"}
                        className="w-full bg-dark-200 border border-dark-400
                          text-light placeholder:text-primary-600
                          rounded-2xl px-5 py-4 pl-11
                          focus:outline-none focus:border-accent
                          transition-all duration-300 text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="relative">
                      <FaWhatsapp
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="WhatsApp number (optional)"
                        disabled={status === "loading"}
                        className="w-full bg-dark-200 border border-dark-400
                          text-light placeholder:text-primary-600
                          rounded-2xl px-5 py-4 pl-11
                          focus:outline-none focus:border-green-500/50
                          transition-all duration-300 text-sm
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-accent text-white font-bold text-sm
                        uppercase tracking-widest rounded-2xl px-8 py-4
                        hover:bg-accent-dim transition-all duration-300
                        hover:shadow-[0_20px_40px_-10px_rgba(200,155,92,0.35)]
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2 group
                        relative overflow-hidden"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Now
                          <Send
                            size={16}
                            className="group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </>
                      )}
                      <span
                        className="absolute inset-0 -translate-x-full
                        group-hover:translate-x-full
                        bg-gradient-to-r from-transparent via-white/20 
                        to-transparent transition-transform duration-700 
                        skew-x-12"
                      />
                    </button>
                  </form>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-dark-400" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-dark-300 px-4 text-primary-600 text-xs uppercase tracking-widest">
                        or
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=Hi Frank Gadgets! I'd like to know about your latest deals 🔥`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5
                      bg-green-500/10 border border-green-500/20 
                      text-green-400 rounded-2xl px-8 py-4 text-sm
                      font-semibold hover:bg-green-500/20 hover:border-green-500/40
                      transition-all duration-300 group"
                  >
                    <FaWhatsapp
                      size={20}
                      className="group-hover:scale-110 transition-transform duration-300"
                    />
                    Chat us on WhatsApp
                  </a>

                  {/* Social proof — gold/blue-grey avatars */}
                  <div className="mt-6 pt-6 border-t border-dark-400/50">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {["C89B5C", "8DA0B8", "DDBC85", "6E8299"].map(
                          (color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border-2 
                              border-dark-300 flex items-center 
                              justify-center text-white text-[9px] font-bold"
                              style={{ backgroundColor: `#${color}` }}
                            >
                              {["FG", "JK", "AB", "MC"][i]}
                            </div>
                          ),
                        )}
                      </div>
                      <div>
                        <p className="text-light text-sm font-semibold">
                          2,000+ subscribers
                        </p>
                        <p className="text-primary-600 text-xs">
                          Growing Lagos community 🚀
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
