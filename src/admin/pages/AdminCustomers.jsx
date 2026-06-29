import { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Users,
  Eye,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Loader,
} from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import { useOrders } from "../../hooks/useOrders";

const statusConfig = {
  active: {
    label: "Active",
    class: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  inactive: {
    label: "Inactive",
    class: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  },
};

const AdminCustomers = () => {
  const { customers, loading } = useCustomers();
  const { orders } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".customer-row",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
      );
    }
  }, [loading, customers]);

  const filtered = customers
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === "joined") {
        valA = new Date(a.joined);
        valB = new Date(b.joined);
      }
      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field)
      return <ChevronUp size={12} className="text-primary-600" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} className="text-accent" />
    ) : (
      <ChevronDown size={12} className="text-accent" />
    );
  };

  const getCustomerOrders = (email) => orders.filter((o) => o.email === email);

  const stats = [
    {
      label: "Total Customers",
      value: customers.length,
      color: "text-light",
      icon: <Users size={16} />,
    },
    {
      label: "Active",
      value: customers.filter((c) => c.status === "active").length,
      color: "text-green-400",
      icon: <Users size={16} />,
    },
    {
      label: "Total Orders",
      value: customers.reduce((sum, c) => sum + c.orders, 0),
      color: "text-blue-400",
      icon: <ShoppingBag size={16} />,
    },
    {
      label: "Total Revenue",
      value: `$${customers
        .reduce((sum, c) => sum + c.totalSpent, 0)
        .toLocaleString()}`,
      color: "text-accent",
      icon: <DollarSign size={16} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="text-accent animate-spin" />
          <p className="text-primary-500 text-sm">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 bg-dark-200
          border border-dark-400 rounded-xl px-4 py-2.5 flex-1"
        >
          <Search size={15} className="text-primary-500 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-light text-sm
              placeholder:text-primary-600 focus:outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={14} className="text-primary-500 hover:text-light" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5
            rounded-xl border text-sm font-semibold transition-all duration-300
            ${
              showFilters
                ? "bg-accent text-dark border-accent"
                : "bg-dark-200 border-dark-400 text-primary-400 hover:text-light"
            }`}
        >
          <Filter size={15} />
          Filters
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-3 bg-dark-200
          border border-dark-400 rounded-xl p-4"
        >
          <span className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
            Status:
          </span>
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                transition-all duration-300 capitalize
                ${
                  statusFilter === s
                    ? "bg-accent text-dark"
                    : "bg-dark-300 text-primary-400 hover:text-light border border-dark-400"
                }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-dark-200 border border-dark-400 rounded-xl p-3"
          >
            <div
              className={`w-8 h-8 rounded-lg bg-dark-300
              border border-dark-400 flex items-center justify-center
              ${s.color} mb-2`}
            >
              {s.icon}
            </div>
            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-primary-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="bg-dark-200 border border-dark-400
        rounded-2xl overflow-hidden"
      >
        {/* Header */}
        <div
          className="hidden sm:grid grid-cols-12 gap-4
          px-5 py-3 border-b border-dark-400
          text-primary-500 text-xs font-semibold uppercase tracking-wider"
        >
          <div className="col-span-3">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-1 hover:text-light"
            >
              Customer <SortIcon field="name" />
            </button>
          </div>
          <div className="col-span-3">
            <button
              onClick={() => handleSort("email")}
              className="flex items-center gap-1 hover:text-light"
            >
              Email <SortIcon field="email" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("orders")}
              className="flex items-center gap-1 hover:text-light"
            >
              Orders <SortIcon field="orders" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("totalSpent")}
              className="flex items-center gap-1 hover:text-light"
            >
              Spent <SortIcon field="totalSpent" />
            </button>
          </div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-dark-400">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Users size={40} className="text-primary-600 mb-3" />
              <p className="text-light font-semibold">No customers found</p>
              <p className="text-primary-500 text-sm mt-1">
                Customers will appear here after they place an order
              </p>
            </div>
          ) : (
            filtered.map((customer) => {
              const s = statusConfig[customer.status];
              return (
                <div
                  key={customer.id}
                  className="customer-row grid grid-cols-2 sm:grid-cols-12
                    gap-3 sm:gap-4 px-4 sm:px-5 py-4
                    hover:bg-dark-300 transition-all duration-300 items-center"
                >
                  {/* Customer */}
                  <div className="col-span-1 sm:col-span-3 flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full bg-accent/10
                      border border-accent/20 flex items-center justify-center
                      text-accent font-bold text-sm shrink-0"
                    >
                      {customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-light font-semibold text-sm truncate">
                        {customer.name}
                      </p>
                      <p className="text-primary-500 text-xs truncate sm:hidden">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="hidden sm:block sm:col-span-3">
                    <p className="text-primary-400 text-sm truncate">
                      {customer.email}
                    </p>
                  </div>

                  {/* Orders */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-light font-semibold text-sm">
                      {customer.orders}
                    </p>
                  </div>

                  {/* Total Spent */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-light font-bold text-sm">
                      ${customer.totalSpent.toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block sm:col-span-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-1
                      rounded-full border ${s.class}`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div
                    className="col-span-1 sm:col-span-1 flex items-center
                    justify-end gap-1.5"
                  >
                    <div className="sm:hidden flex-1 text-right">
                      <p className="text-light font-bold text-sm">
                        {customer.orders} orders
                      </p>
                      <p className="text-accent font-semibold text-xs">
                        ${customer.totalSpent.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="w-8 h-8 rounded-lg bg-dark-300
                        border border-dark-400 flex items-center justify-center
                        text-primary-400 hover:text-accent hover:border-accent/40
                        transition-all duration-300 hover:scale-110"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-dark-400">
            <p className="text-primary-500 text-xs">
              Showing{" "}
              <span className="text-light font-semibold">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="text-light font-semibold">
                {customers.length}
              </span>{" "}
              customers
            </p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          z-50 flex items-center justify-center px-4"
        >
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-6 w-full max-w-lg space-y-5
            max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-accent/10
                  border border-accent/20 flex items-center justify-center
                  text-accent font-bold text-lg"
                >
                  {selectedCustomer.avatar}
                </div>
                <div>
                  <h3 className="text-light font-bold text-lg">
                    {selectedCustomer.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-1
                    rounded-full border
                    ${statusConfig[selectedCustomer.status].class}`}
                  >
                    {statusConfig[selectedCustomer.status].label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-lg bg-dark-300
                  border border-dark-400 flex items-center justify-center
                  text-primary-400 hover:text-light transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Contact */}
            <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-3">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Contact Information
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-primary-500 shrink-0" />
                  <p className="text-light text-sm truncate">
                    {selectedCustomer.email}
                  </p>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-primary-500 shrink-0" />
                    <p className="text-light text-sm">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary-500 shrink-0" />
                  <p className="text-light text-sm">
                    Joined{" "}
                    {new Date(selectedCustomer.joined).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 text-center">
                <ShoppingBag size={20} className="text-blue-400 mx-auto mb-2" />
                <p className="text-light font-bold text-xl">
                  {selectedCustomer.orders}
                </p>
                <p className="text-primary-500 text-xs mt-0.5">Total Orders</p>
              </div>
              <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 text-center">
                <DollarSign size={20} className="text-accent mx-auto mb-2" />
                <p className="text-light font-bold text-xl">
                  ${selectedCustomer.totalSpent.toLocaleString()}
                </p>
                <p className="text-primary-500 text-xs mt-0.5">Total Spent</p>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-3">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Order History
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {getCustomerOrders(selectedCustomer.email).length === 0 ? (
                  <p className="text-primary-500 text-sm text-center py-4">
                    No orders found
                  </p>
                ) : (
                  getCustomerOrders(selectedCustomer.email).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between
                      bg-dark-200 rounded-lg p-3"
                    >
                      <div>
                        <p className="text-accent font-bold text-xs">
                          {order.id}
                        </p>
                        <p className="text-primary-500 text-xs mt-0.5">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-light font-bold text-sm">
                          ${order.total.toLocaleString()}
                        </p>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5
                          rounded-full border
                          ${
                            order.status === "delivered"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : order.status === "shipped"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : order.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full py-3 rounded-xl bg-accent text-dark
                font-bold text-sm hover:bg-light transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
