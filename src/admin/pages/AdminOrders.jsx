import { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  ShoppingCart,
  Trash2,
  Eye,
  Check,
  Loader,
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";

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

const AdminOrders = () => {
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(false);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".order-row",
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
  }, [loading, orders]);

  const filtered = orders
    .filter((o) => {
      const matchSearch =
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
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

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    await updateOrderStatus(orderId, newStatus);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    }
    setUpdatingStatus(false);
  };

  const handleDelete = async (id) => {
    setDeletingOrder(true);
    await deleteOrder(id);
    setDeleteConfirm(null);
    setDeletingOrder(false);
  };

  const stats = [
    { label: "Total", value: orders.length, color: "text-light" },
    {
      label: "Pending",
      value: orders.filter((o) => o.status === "pending").length,
      color: "text-yellow-400",
    },
    {
      label: "Shipped",
      value: orders.filter((o) => o.status === "shipped").length,
      color: "text-blue-400",
    },
    {
      label: "Delivered",
      value: orders.filter((o) => o.status === "delivered").length,
      color: "text-green-400",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="text-accent animate-spin" />
          <p className="text-primary-500 text-sm">Loading orders...</p>
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
            placeholder="Search by order ID, customer, email..."
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
          {["all", "pending", "shipped", "delivered", "cancelled"].map((s) => (
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
              {s === "all" ? "All Orders" : s}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-dark-200 border border-dark-400
            rounded-xl p-3 text-center"
          >
            <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
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
          <div className="col-span-1">
            <button
              onClick={() => handleSort("id")}
              className="flex items-center gap-1 hover:text-light"
            >
              ID <SortIcon field="id" />
            </button>
          </div>
          <div className="col-span-3">
            <button
              onClick={() => handleSort("customer")}
              className="flex items-center gap-1 hover:text-light"
            >
              Customer <SortIcon field="customer" />
            </button>
          </div>
          <div className="col-span-3">Products</div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("total")}
              className="flex items-center gap-1 hover:text-light"
            >
              Total <SortIcon field="total" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("date")}
              className="flex items-center gap-1 hover:text-light"
            >
              Date <SortIcon field="date" />
            </button>
          </div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-dark-400">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <ShoppingCart size={40} className="text-primary-600 mb-3" />
              <p className="text-light font-semibold">No orders found</p>
              <p className="text-primary-500 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filtered.map((order) => {
              const s = statusConfig[order.status];
              return (
                <div
                  key={order.id}
                  className="order-row grid grid-cols-2 sm:grid-cols-12
                    gap-3 sm:gap-4 px-4 sm:px-5 py-4
                    hover:bg-dark-300 transition-all duration-300 items-center"
                >
                  {/* ID */}
                  <div className="hidden sm:block sm:col-span-1">
                    <p className="text-accent font-bold text-xs">{order.id}</p>
                  </div>

                  {/* Customer */}
                  <div className="col-span-1 sm:col-span-3 flex items-center gap-2">
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
                      <p className="text-primary-500 text-xs truncate hidden sm:block">
                        {order.email}
                      </p>
                      <p className="text-accent text-xs font-bold sm:hidden">
                        {order.id}
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="hidden sm:block sm:col-span-3">
                    <p className="text-primary-400 text-xs truncate">
                      {order.products[0]}
                      {order.products.length > 1 &&
                        ` +${order.products.length - 1} more`}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-light font-bold text-sm">
                      ${order.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-primary-400 text-xs">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div
                    className="col-span-1 sm:col-span-1 flex items-center
                    justify-end gap-1.5"
                  >
                    <div className="sm:hidden flex-1">
                      <p className="text-light font-bold text-sm">
                        ${order.total.toLocaleString()}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5
                        rounded-full border ${s.class}`}
                      >
                        {s.label}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-8 h-8 rounded-lg bg-dark-300
                        border border-dark-400 flex items-center justify-center
                        text-primary-400 hover:text-accent hover:border-accent/40
                        transition-all duration-300 hover:scale-110"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(order.id)}
                      className="w-8 h-8 rounded-lg bg-dark-300
                        border border-dark-400 flex items-center justify-center
                        text-primary-400 hover:text-red-400 hover:border-red-400/40
                        transition-all duration-300 hover:scale-110"
                    >
                      <Trash2 size={13} />
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
              <span className="text-light font-semibold">{filtered.length}</span>{" "}
              of{" "}
              <span className="text-light font-semibold">{orders.length}</span>{" "}
              orders
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          z-50 flex items-center justify-center px-4"
        >
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-6 w-full max-w-md space-y-5
            max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-light font-bold text-lg">Order Details</h3>
                <p className="text-accent text-xs font-bold mt-0.5">
                  {selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-lg bg-dark-300
                  border border-dark-400 flex items-center justify-center
                  text-primary-400 hover:text-light transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Customer */}
            <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-2">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Customer
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-accent/10
                  border border-accent/20 flex items-center justify-center
                  text-accent font-bold shrink-0"
                >
                  {selectedOrder.avatar}
                </div>
                <div>
                  <p className="text-light font-semibold text-sm">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-primary-500 text-xs">
                    {selectedOrder.email}
                  </p>
                  {selectedOrder.phone && (
                    <p className="text-primary-500 text-xs">
                      {selectedOrder.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping */}
            {selectedOrder.address && (
              <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-2">
                <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                  Shipping Address
                </p>
                <p className="text-light text-sm">{selectedOrder.address}</p>
                <p className="text-accent text-xs capitalize">
                  {selectedOrder.shippingMethod} shipping
                </p>
              </div>
            )}

            {/* Products */}
            <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-2">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Products
              </p>
              <div className="space-y-2">
                {(selectedOrder.productDetails?.length > 0
                  ? selectedOrder.productDetails
                  : selectedOrder.products.map((name) => ({ name }))
                ).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-dark-400 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-light text-sm font-semibold truncate">
                        {item.name}
                      </p>
                      {item.quantity && (
                        <p className="text-primary-500 text-xs">
                          Qty: {item.quantity} ×{" "}
                          ${item.price?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-dark-300 rounded-xl p-4 border border-dark-400 space-y-3">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Order Info
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-primary-400 text-sm">Total</span>
                  <span className="text-light font-bold text-sm">
                    ${selectedOrder.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-400 text-sm">Date</span>
                  <span className="text-light text-sm">
                    {new Date(selectedOrder.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {selectedOrder.paymentLast4 && (
                  <div className="flex justify-between">
                    <span className="text-primary-400 text-sm">Payment</span>
                    <span className="text-light text-sm">
                      •••• {selectedOrder.paymentLast4}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-primary-400 text-sm">Status</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1
                    rounded-full border ${statusConfig[selectedOrder.status].class}`}
                  >
                    {statusConfig[selectedOrder.status].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="space-y-2">
              <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
                Update Status
              </p>
              <div className="grid grid-cols-2 gap-2">
                {["pending", "shipped", "delivered", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedOrder.id, s)}
                    disabled={updatingStatus}
                    className={`py-2.5 rounded-xl text-xs font-bold
                      capitalize border transition-all duration-300
                      flex items-center justify-center gap-1
                      disabled:opacity-50
                      ${
                        selectedOrder.status === s
                          ? `${statusConfig[s].class} scale-[1.02]`
                          : "bg-dark-300 border-dark-400 text-primary-400 hover:text-light"
                      }`}
                  >
                    {updatingStatus && selectedOrder.status !== s ? (
                      <Loader size={10} className="animate-spin" />
                    ) : (
                      selectedOrder.status === s && (
                        <Check size={10} />
                      )
                    )}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 rounded-xl bg-accent text-dark
                font-bold text-sm hover:bg-light transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          z-50 flex items-center justify-center px-4"
        >
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-6 w-full max-w-sm space-y-4"
          >
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-full bg-red-500/10
                border border-red-500/20 flex items-center justify-center mx-auto mb-3"
              >
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h3 className="text-light font-bold text-lg">Delete Order</h3>
              <p className="text-primary-500 text-sm mt-1">
                This will permanently delete this order from the database.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deletingOrder}
                className="flex-1 py-3 rounded-xl border border-dark-400
                  text-primary-400 font-semibold text-sm
                  hover:text-light transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deletingOrder}
                className="flex-1 py-3 rounded-xl bg-red-500/10
                  border border-red-500/30 text-red-400 font-bold text-sm
                  hover:bg-red-500/20 transition-all duration-300
                  flex items-center justify-center gap-2"
              >
                {deletingOrder ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;