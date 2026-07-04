import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
} from "react-icons/fa6";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import logo from "../../assets/logo.png";

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const cols = el.querySelectorAll(".footer-col");
    gsap.set(cols, { y: 40, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(cols, {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Phones", path: "/products?category=phones" },
    { name: "Tablets", path: "/products?category=tablets" },
    { name: "Cart", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  const categories = [
    { name: "Smartphones", path: "/products?category=phones" },
    { name: "Tablets", path: "/products?category=tablets" },
    { name: "Gadgets", path: "/products?category=gadgets" },
    { name: "Accessories", path: "/products?category=accessories" },
    { name: "Buy & Swap", path: "/products?category=swap" },
  ];

  const socials = [
    { icon: <FaFacebookF size={16} />, href: "#", name: "Facebook" },
    { icon: <FaInstagram size={16} />, href: "#", name: "Instagram" },
    { icon: <FaXTwitter size={16} />, href: "#", name: "Twitter" },
    { icon: <FaTiktok size={16} />, href: "#", name: "Tiktok" },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-dark-100 border-t border-dark-400 mt-20"
    >
      {/* Brand Strip */}
      <div className="bg-secondary py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center 
          justify-center gap-3">
          <div className="h-[1px] flex-1 bg-white/10" />
          <p className="text-white/60 text-xs tracking-widest uppercase">
            We Buy • We Sell • We Swap
          </p>
          <div className="h-[1px] flex-1 bg-white/10" />
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 - Brand */}
          <div className="footer-col space-y-5">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="Frank Gadgets"
                className="w-10 h-10 object-contain"
              />
              <span className="font-display text-xl font-bold tracking-widest">
                FRANK<span className="text-accent">GADGETS</span>
              </span>
            </Link>
            <p className="text-primary-400 text-sm leading-relaxed">
              Your number one destination for the latest phones, tablets 
              and gadgets in Lagos. Quality products, unbeatable prices. 
              We buy, sell and swap!
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-dark-400
                    flex items-center justify-center text-primary-400
                    hover:border-accent hover:text-accent hover:bg-accent/10
                    transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider 
              uppercase text-sm border-l-2 border-accent pl-3">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-400 text-sm hover:text-accent
                      transition-colors duration-300 flex items-center 
                      gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100
                        group-hover:translate-x-0 transition-all duration-300 
                        text-accent"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Categories */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider 
              uppercase text-sm border-l-2 border-accent pl-3">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    className="text-primary-400 text-sm hover:text-accent
                      transition-colors duration-300 flex items-center 
                      gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100
                        group-hover:translate-x-0 transition-all duration-300 
                        text-accent"
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider 
              uppercase text-sm border-l-2 border-accent pl-3">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-400 text-sm">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span>Lagos Island, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-primary-400 text-sm">
                <Phone size={16} className="text-accent shrink-0" />
                <a
                  href="tel:+2348XXXXXXXXX"
                  className="hover:text-accent transition-colors duration-300"
                >
                  +234 8XX XXX XXXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-400 text-sm">
                <Mail size={16} className="text-accent shrink-0" />
                <a
                  href="mailto:info@frankgadgets.com"
                  className="hover:text-accent transition-colors duration-300"
                >
                  info@frankgadgets.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-primary-400 text-xs mb-3">
                Subscribe for deals & updates 🔥
              </p>
              <div className="flex gap-0">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="bg-dark-300 text-light text-xs px-4 py-2.5
                    border border-dark-400 focus:outline-none
                    focus:border-accent w-full placeholder:text-primary-600
                    transition-colors duration-300"
                />
                <button
                  className="bg-accent text-white px-4 py-2.5
                  hover:bg-accent-dim transition-colors duration-300"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-dark-400">
        <div className="max-w-7xl mx-auto px-6 py-5
          flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-500 text-xs">
            © {new Date().getFullYear()} FRANK GADGETS. All rights reserved.
          </p>
          <p className="text-primary-500 text-xs">
            Built with ❤️ by{" "}
            <span className="text-accent">SparkWeb</span>
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="text-primary-500 text-xs
              hover:text-accent transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-primary-500 text-xs
              hover:text-accent transition-colors duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;