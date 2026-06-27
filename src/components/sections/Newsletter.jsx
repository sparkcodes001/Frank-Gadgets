import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, Mail, CheckCircle, Gift, Zap, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

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
      { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
    )
      .fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.7",
      )
      .fromTo(
        ".perk-item",
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
        },
        "-=0.5",
      );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("loading");

    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");

      // Confetti animation
      gsap.fromTo(
        ".success-icon",
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
      );

      // Reset after 3s
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
  };

  const perks = [
    {
      icon: <Gift size={18} />,
      text: "Exclusive launch discounts",
    },
    {
      icon: <Zap size={18} />,
      text: "Early access to flash sales",
    },
    {
      icon: <Sparkles size={18} />,
      text: "Tech tips & buying guides",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-dark-100 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full"
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div
          className="bg-dark-200 border border-dark-400 rounded-3xl sm:rounded-[2.5rem]
          overflow-hidden hover:border-accent/40 transition-all duration-500
          hover:shadow-2xl hover:shadow-accent/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* ── LEFT: Content ── */}
            <div
              ref={leftRef}
              className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center
                bg-gradient-to-br from-accent/5 to-transparent"
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 w-fit
                bg-accent/10 border border-accent/30 rounded-full
                px-4 py-2 mb-6"
              >
                <Mail size={14} className="text-accent" />
                <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                  Join 5,000+ Subscribers
                </span>
              </div>

              {/* Heading */}
              <h2
                className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl
                text-light mb-4 leading-tight"
              >
                Never Miss a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-light">
                  Deal
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-primary-400 text-sm sm:text-base leading-relaxed mb-8">
                Get exclusive access to flash sales, new product launches, and
                tech insights delivered straight to your inbox. No spam, just
                value.
              </p>

              {/* Perks list */}
              <div className="space-y-3 mb-8">
                {perks.map((perk, i) => (
                  <div
                    key={i}
                    className="perk-item flex items-center gap-3 text-sm text-primary-300"
                  >
                    <div
                      className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30
                      flex items-center justify-center text-accent shrink-0"
                    >
                      {perk.icon}
                    </div>
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust badge */}
              <p className="text-xs text-primary-600 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                Unsubscribe anytime. We respect your privacy.
              </p>
            </div>

            {/* ── RIGHT: Form ── */}
            <div
              ref={rightRef}
              className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center
                bg-dark-300/50"
            >
              {status === "success" ? (
                // Success state
                <div className="text-center space-y-4">
                  <div
                    className="success-icon w-16 h-16 bg-green-500/10 border-2 border-green-500
                    rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-light">
                    You're In! 🎉
                  </h3>
                  <p className="text-primary-400 text-sm">
                    Check your inbox for a welcome gift from BREEMTECH
                  </p>
                </div>
              ) : (
                // Form state
                <>
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    {/* Email Input */}
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        disabled={status === "loading"}
                        className="w-full bg-dark-200 border border-dark-400
                          text-light placeholder:text-primary-600
                          rounded-2xl px-6 py-4 pr-14
                          focus:outline-none focus:border-accent
                          transition-all duration-300
                          disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Mail size={20} className="text-primary-600" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-accent text-dark font-bold text-sm
                        uppercase tracking-widest rounded-2xl px-8 py-4
                        hover:bg-light transition-all duration-300
                        hover:shadow-xl hover:shadow-accent/30
                        disabled:opacity-50 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2 group
                        relative overflow-hidden"
                    >
                      {status === "loading" ? (
                        <>
                          <div
                            className="w-4 h-4 border-2 border-dark/30 border-t-dark
                            rounded-full animate-spin"
                          />
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
                      {/* Shimmer effect */}
                      <span
                        className="absolute inset-0 -translate-x-full
                        group-hover:translate-x-full
                        bg-gradient-to-r from-transparent via-white/25 to-transparent
                        transition-transform duration-700 skew-x-12"
                      />
                    </button>
                  </form>

                  {/* Social proof */}
                  <div className="mt-8 pt-8 border-t border-dark-400">
                    <div className="flex items-center gap-3">
                      {/* Avatar stack */}
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br
                              from-accent/40 to-primary-600 border-2 border-dark-300"
                          />
                        ))}
                      </div>
                      <div>
                        <p className="text-light text-sm font-semibold">
                          5,000+ subscribers
                        </p>
                        <p className="text-primary-600 text-xs">
                          Join our growing community
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
