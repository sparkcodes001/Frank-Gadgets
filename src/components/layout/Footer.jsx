import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

// ✅ No ScrollTrigger needed anymore
const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const cols = el.querySelectorAll(".footer-col");
    gsap.set(cols, { y: 40, opacity: 0 });

    // ✅ IntersectionObserver — fires immediately when footer enters view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(cols, {
            y: 0,
            opacity: 1,
            duration: 0.45, // ✅ fast
            stagger: 0.08, // ✅ tight stagger
            ease: "power2.out",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.05 }, // ✅ fires when just 5% of footer is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Mobiles", path: "/products?category=mobile" },
    { name: "PCs", path: "/products?category=pc" },
    { name: "Cart", path: "/cart" },
    { name: "Wishlist", path: "/wishlist" },
  ];

  const categories = [
    { name: "Smartphones", path: "/products?category=mobile" },
    { name: "Laptops", path: "/products?category=pc" },
    { name: "Desktop PCs", path: "/products?category=pc" },
    { name: "Accessories", path: "/products?category=accessories" },
    { name: "Tablets", path: "/products?category=tablet" },
  ];

  const socials = [
    { icon: <FaFacebookF size={16} />, href: "#", name: "Facebook" },
    { icon: <FaInstagram size={16} />, href: "#", name: "Instagram" },
    { icon: <FaXTwitter size={16} />, href: "#", name: "Twitter" },
    { icon: <FaYoutube size={16} />, href: "#", name: "Youtube" },
  ];

  return (
    <footer
      ref={footerRef}
      className="bg-dark-100 border-t border-dark-400 mt-20"
    >
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 - Brand */}
          <div className="footer-col space-y-5">
            <Link to="/">
              <span className="font-display text-2xl font-bold tracking-widest">
                BREEM<span className="text-accent">TECH</span>
              </span>
            </Link>
            <p className="text-primary-400 text-sm leading-relaxed">
              Your number one destination for the latest mobiles and PCs.
              Quality products, unbeatable prices.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 rounded-full border border-dark-400
                    flex items-center justify-center text-primary-400
                    hover:border-accent hover:text-accent
                    transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider uppercase text-sm">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-400 text-sm hover:text-accent
                      transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100
                        group-hover:translate-x-0 transition-all duration-300 text-accent"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Categories */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider uppercase text-sm">
              Categories
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    to={cat.path}
                    className="text-primary-400 text-sm hover:text-accent
                      transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100
                        group-hover:translate-x-0 transition-all duration-300 text-accent"
                    />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div className="footer-col space-y-5">
            <h3 className="font-display font-bold text-light tracking-wider uppercase text-sm">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-primary-400 text-sm">
                <MapPin size={16} className="text-accent mt-0.5 shrink-0" />
                <span>123 Fayose Market, Ado-Ekiti, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-primary-400 text-sm">
                <Phone size={16} className="text-accent shrink-0" />
                <a
                  href="tel:+2341234567890"
                  className="hover:text-accent transition-colors duration-300"
                >
                  +234 706 061 2577
                </a>
              </li>
              <li className="flex items-center gap-3 text-primary-400 text-sm">
                <Mail size={16} className="text-accent shrink-0" />
                <a
                  href="mailto:info@breemtech.com"
                  className="hover:text-accent transition-colors duration-300"
                >
                  ibrahimkhalill@gmail.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-primary-400 text-xs mb-3">
                Subscribe for deals & updates
              </p>
              <div className="flex gap-0">
                <input
                  type="email"
                  placeholder="Your email..."
                  className="bg-dark-300 text-light text-xs px-4 py-2.5
                    rounded-l-full border border-dark-400 focus:outline-none
                    focus:border-accent w-full placeholder:text-primary-600
                    transition-colors duration-300"
                />
                <button
                  className="bg-accent text-dark px-4 py-2.5 rounded-r-full
                  hover:bg-light transition-colors duration-300"
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
        <div
          className="max-w-7xl mx-auto px-6 py-5
          flex flex-col md:flex-row items-center justify-between gap-3"
        >
          <p className="text-primary-500 text-xs">
            © {new Date().getFullYear()} BREEMTECH. All rights reserved.
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
