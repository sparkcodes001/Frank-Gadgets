import { NavLink, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Zap,
  LogOut,
  X,
} from "lucide-react";
import useAdminAuthStore from "../../store/adminAuthStore";

const navItems = [
  {
    icon: <LayoutDashboard size={18} />,
    label: "Dashboard",
    to: "/admin/dashboard",
  },
  {
    icon: <Package size={18} />,
    label: "Products",
    to: "/admin/products",
  },
  {
    icon: <ShoppingCart size={18} />,
    label: "Orders",
    to: "/admin/orders",
  },
  {
    icon: <Users size={18} />,
    label: "Customers",
    to: "/admin/customers",
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const { admin, logout } = useAdminAuthStore();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Only animate on first desktop mount, NOT on mobile
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleNavClick = () => {
    // Only close on mobile
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* ✅ Mobile Overlay - sits behind sidebar */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm
          z-40 lg:hidden transition-all duration-300
          ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* ✅ Sidebar - controlled ONLY by CSS transition, no GSAP */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-dark-200
          border-r border-dark-400 flex flex-col
          transition-transform duration-300 ease-in-out
          z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Logo + Close */}
        <div
          className="flex items-center justify-between
          px-6 py-5 border-b border-dark-400 shrink-0"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-accent/10
              border border-accent/30 flex items-center justify-center"
            >
              <Zap size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-light font-display font-bold text-base leading-none">
                Nexus
              </p>
              <p className="text-accent text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                Admin
              </p>
            </div>
          </div>

          {/* ✅ Close Button - Mobile Only */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="lg:hidden w-8 h-8 rounded-lg bg-dark-300
              border border-dark-400 flex items-center justify-center
              text-primary-400 hover:text-light hover:bg-dark-200
              transition-all duration-200 active:scale-90
              touch-manipulation cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-accent text-dark shadow-lg shadow-accent/20"
                    : "text-primary-400 hover:text-light hover:bg-dark-300"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Admin Profile + Logout */}
        <div className="px-3 py-4 border-t border-dark-400 space-y-3 shrink-0">
          {/* Profile */}
          <div
            className="flex items-center gap-3 px-4 py-3
            bg-dark-300 rounded-xl border border-dark-400"
          >
            <div
              className="w-9 h-9 rounded-full bg-accent/20
              border border-accent/30 flex items-center justify-center
              text-accent font-bold text-sm shrink-0"
            >
              {admin?.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-light font-semibold text-sm leading-none truncate">
                {admin?.name}
              </p>
              <p className="text-primary-500 text-[10px] mt-0.5 truncate">
                {admin?.role}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3
              rounded-xl text-sm font-semibold text-primary-400
              hover:text-red-400 hover:bg-red-500/10
              border border-transparent hover:border-red-500/20
              transition-all duration-300 active:scale-95"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
