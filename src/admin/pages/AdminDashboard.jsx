// src/pages/admin/AdminDashboard.jsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useProducts } from "../../hooks/useProducts";
import { useOrders } from "../../hooks/useOrders";
import { useCustomers } from "../../hooks/useCustomers";
import { formatPrice } from "../../utils/formatPrice";

// ─── Status Config ────────────────────────────────────────────────────────────
const statusConfig = {
  delivered: {
    label: "Delivered",
    class: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  shipped: {
    label: "Shipped",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  pending: {
    label: "Pending",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  cancelled: {
    label: "Cancelled",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────
// ✅ Uses formatPrice for Naira
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-200 border border-dark-400 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-primary-400 text-xs mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-light font-bold text-sm">
            {entry.name === "revenue"
              ? formatPrice(entry.value)
              : `${entry.value.toLocaleString()} orders`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Monthly Sales Data (Naira amounts) ───────────────────────────────────────
const monthlySales = [
  { month: "Aug", revenue: 1240000, orders: 45 },
  { month: "Sep", revenue: 1860000, orders: 62 },
  { month: "Oct", revenue: 1520000, orders: 53 },
  { month: "Nov", revenue: 2480000, orders: 87 },
  { month: "Dec", revenue: 3250000, orders: 112 },
  { month: "Jan", revenue: 2890000, orders: 95 },
];

// ─── Color Map ────────────────────────────────────────────────────────────────
const colorMap = {
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/20",
    text: "text-accent",
    glow: "shadow-accent/10",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-blue-500/10",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    glow: "shadow-green-500/10",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/10",
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading } = useOrders();
  const { customers, loading: customersLoading } = useCustomers();

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // ✅ Total revenue in Naira
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const isLoading = productsLoading || ordersLoading || customersLoading;

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        ".stat-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out" },
      );
      gsap.fromTo(
        ".chart-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.4,
        },
      );
      gsap.fromTo(
        ".order-card",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.6,
        },
      );
    }
  }, [isLoading]);

  // ✅ All values use formatPrice for Naira
  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: <TrendingUp size={20} />,
      change: "+12.5%",
      up: true,
      color: "accent",
    },
    {
      title: "Total Orders",
      value: orders.length.toLocaleString(),
      icon: <ShoppingCart size={20} />,
      change: "+8.2%",
      up: true,
      color: "blue",
    },
    {
      title: "Total Customers",
      value: customers.length.toLocaleString(),
      icon: <Users size={20} />,
      change: "+5.1%",
      up: true,
      color: "green",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: <Clock size={20} />,
      change: "-2.4%",
      up: false,
      color: "yellow",
    },
  ];

  // ── Loading Skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-dark-200 border border-dark-400
              rounded-2xl p-5 animate-pulse h-32"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 bg-dark-200 border border-dark-400
            rounded-2xl p-5 animate-pulse h-72"
          />
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-5 animate-pulse h-72"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const c = colorMap[stat.color];
          return (
            <div
              key={i}
              className={`stat-card bg-dark-200 border border-dark-400
                rounded-2xl p-5 hover:border-accent/30
                transition-all duration-300 hover:shadow-lg ${c.glow}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl ${c.bg} border
                  ${c.border} flex items-center justify-center ${c.text}`}
                >
                  {stat.icon}
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-semibold
                  ${stat.up ? "text-green-400" : "text-red-400"}`}
                >
                  {stat.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              {/* ✅ Value already formatted via formatPrice in statCards array */}
              <p className="text-light font-display font-bold text-2xl truncate">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Area Chart */}
        <div
          className="chart-card lg:col-span-2 bg-dark-200
          border border-dark-400 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-light font-bold text-base">
                Revenue Overview
              </h3>
              <p className="text-primary-500 text-xs mt-0.5">Last 6 months</p>
            </div>
            <span
              className="bg-accent/10 border border-accent/20
              text-accent text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              Monthly
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySales}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8F135" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C8F135" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a2a"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              {/* ✅ Y-axis shows ₦ in millions shorthand */}
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000000
                    ? `₦${(v / 1000000).toFixed(1)}M`
                    : `₦${(v / 1000).toFixed(0)}K`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C8F135"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={{ fill: "#C8F135", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#C8F135" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Bar Chart */}
        <div
          className="chart-card bg-dark-200 border border-dark-400
          rounded-2xl p-5"
        >
          <div className="mb-6">
            <h3 className="text-light font-bold text-base">Orders</h3>
            <p className="text-primary-500 text-xs mt-0.5">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlySales} barSize={20}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a2a"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="orders"
                fill="#C8F135"
                radius={[6, 6, 0, 0]}
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders Table */}
        <div
          className="lg:col-span-2 bg-dark-200 border border-dark-400
          rounded-2xl overflow-hidden"
        >
          <div
            className="flex items-center justify-between
            px-5 py-4 border-b border-dark-400"
          >
            <div>
              <h3 className="text-light font-bold text-base">Recent Orders</h3>
              <p className="text-primary-500 text-xs mt-0.5">
                Latest transactions
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 text-accent
                text-xs font-semibold group transition-all duration-300"
            >
              View All
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Table Head */}
          <div
            className="hidden sm:grid grid-cols-12 gap-3
            px-5 py-2.5 border-b border-dark-400"
          >
            {["Customer", "Product", "Amount", "Status"].map((h, i) => (
              <div
                key={h}
                className={
                  i === 0
                    ? "col-span-4"
                    : i === 1
                      ? "col-span-4"
                      : i === 2
                        ? "col-span-2"
                        : "col-span-2 text-right"
                }
              >
                <p className="text-primary-600 text-[10px] font-semibold uppercase tracking-wider">
                  {h}
                </p>
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-dark-400">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart size={32} className="text-primary-600 mb-2" />
                <p className="text-primary-500 text-sm">No orders yet</p>
                <p className="text-primary-600 text-xs mt-1">
                  Orders from checkout will appear here
                </p>
              </div>
            ) : (
              recentOrders.map((order) => {
                const s = statusConfig[order.status] ?? statusConfig.pending;
                return (
                  <div
                    key={order.id}
                    className="order-card grid grid-cols-1 sm:grid-cols-12
                      gap-2 sm:gap-3 px-5 py-4
                      hover:bg-dark-300 transition-all duration-300"
                  >
                    {/* Customer */}
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-accent/10
                        border border-accent/20 flex items-center justify-center
                        text-accent font-bold text-xs shrink-0"
                      >
                        {order.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-light font-semibold text-sm truncate">
                          {order.customer}
                        </p>
                        <p className="text-primary-600 text-[10px] font-mono">
                          {order.id}
                        </p>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="sm:col-span-4 flex items-center sm:pl-0 pl-11">
                      <p className="text-primary-400 text-xs truncate">
                        {order.products?.[0] ?? "—"}
                        {order.products?.length > 1 && (
                          <span className="text-accent ml-1">
                            +{order.products.length - 1}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Amount ✅ Naira */}
                    <div
                      className="sm:col-span-2 flex sm:block
                      items-center justify-between pl-11 sm:pl-0"
                    >
                      <p className="text-light font-bold text-sm">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-primary-600 text-[10px] sm:mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Status */}
                    <div
                      className="sm:col-span-2 flex sm:justify-end
                      items-center pl-11 sm:pl-0"
                    >
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1
                        rounded-full border whitespace-nowrap ${s.class}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Low Stock Panel */}
        <div
          className="bg-dark-200 border border-dark-400
          rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-light font-bold text-base">Low Stock</h3>
              <p className="text-primary-500 text-xs mt-0.5">Needs attention</p>
            </div>
            <span
              className="bg-red-500/10 border border-red-500/20
              text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full"
            >
              {lowStockProducts.length} items
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <p className="text-primary-500 text-sm text-center py-4">
                All products well stocked ✅
              </p>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 bg-dark-300
                    rounded-xl p-3 border border-transparent
                    hover:border-red-500/20 transition-all duration-300"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover
                    border border-dark-400 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-light font-semibold text-xs truncate">
                      {p.name}
                    </p>
                    <p className="text-red-400 text-[10px] font-semibold mt-0.5">
                      {p.stock} left
                    </p>
                  </div>
                  {/* Stock bar */}
                  <div className="w-12 bg-dark-400 rounded-full h-1.5 shrink-0">
                    <div
                      className="bg-red-400 h-1.5 rounded-full"
                      style={{
                        width: `${Math.min((p.stock / 10) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Product summary */}
          <div
            className="mt-4 pt-4 border-t border-dark-400
            grid grid-cols-2 gap-3"
          >
            <div className="bg-dark-300 rounded-xl p-3 text-center">
              <p className="text-light font-bold text-lg">{products.length}</p>
              <p className="text-primary-500 text-[10px] mt-0.5">
                Total Products
              </p>
            </div>
            <div className="bg-dark-300 rounded-xl p-3 text-center">
              <p className="text-green-400 font-bold text-lg">
                {products.filter((p) => p.stock > 10).length}
              </p>
              <p className="text-primary-500 text-[10px] mt-0.5">In Stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
