import { useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Package,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import useAdminStore from "../../store/adminStore";

const statusConfig = {
  instock: {
    label: "In Stock",
    class: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  lowstock: {
    label: "Low Stock",
    class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  outofstock: {
    label: "Out of Stock",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

const getStockStatus = (stock) => {
  if (stock === 0) return "outofstock";
  if (stock <= 10) return "lowstock";
  return "instock";
};

const emptyForm = {
  name: "",
  brand: "",
  category: "mobile",
  price: "",
  oldPrice: "",
  stock: "",
  discount: "",
  description: "",
  image: "",
  isNew: false,
  isFeatured: false,
};

const AdminProducts = () => {
  // ✅ Use store instead of local state
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);
  const updateProduct = useAdminStore((state) => state.updateProduct);
  const deleteProduct = useAdminStore((state) => state.deleteProduct);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".product-row",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
    );
  }, [products, search, categoryFilter, stockFilter]);

  // Filter + Sort
  const filtered = products
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchStock =
        stockFilter === "all" || getStockStatus(p.stock) === stockFilter;
      return matchSearch && matchCategory && matchStock;
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
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

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || "",
      stock: product.stock,
      discount: product.discount || "",
      description: product.description || "",
      image: product.image || "",
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.brand || !form.price || !form.stock) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, form);
    } else {
      addProduct(form);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowModal(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    gsap.to(`#product-row-${id}`, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        deleteProduct(id);
        setDeleteConfirm(null);
      },
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div
          className="flex items-center gap-2 bg-dark-200
          border border-dark-400 rounded-xl px-4 py-2.5 flex-1"
        >
          <Search size={15} className="text-primary-500 shrink-0" />
          <input
            type="text"
            placeholder="Search products..."
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

        <div className="flex gap-2">
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

          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5
              bg-accent text-dark rounded-xl font-bold text-sm
              hover:bg-light transition-all duration-300
              hover:shadow-lg hover:shadow-accent/20
              hover:scale-[1.02] active:scale-95"
          >
            <Plus size={15} />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-3 bg-dark-200
          border border-dark-400 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
              Category:
            </span>
            {["all", "mobile", "pc"].map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-300 capitalize
                  ${
                    categoryFilter === c
                      ? "bg-accent text-dark"
                      : "bg-dark-300 text-primary-400 hover:text-light border border-dark-400"
                  }`}
              >
                {c === "all" ? "All" : c === "mobile" ? "📱 Mobile" : "💻 PC"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
              Stock:
            </span>
            {[
              { value: "all", label: "All" },
              { value: "instock", label: "In Stock" },
              { value: "lowstock", label: "Low Stock" },
              { value: "outofstock", label: "Out of Stock" },
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => setStockFilter(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold
                  transition-all duration-300
                  ${
                    stockFilter === s.value
                      ? "bg-accent text-dark"
                      : "bg-dark-300 text-primary-400 hover:text-light border border-dark-400"
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: products.length, color: "text-light" },
          {
            label: "In Stock",
            value: products.filter((p) => getStockStatus(p.stock) === "instock")
              .length,
            color: "text-green-400",
          },
          {
            label: "Low Stock",
            value: products.filter(
              (p) => getStockStatus(p.stock) === "lowstock",
            ).length,
            color: "text-yellow-400",
          },
          {
            label: "Out of Stock",
            value: products.filter(
              (p) => getStockStatus(p.stock) === "outofstock",
            ).length,
            color: "text-red-400",
          },
        ].map((s, i) => (
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
        {/* Table Header */}
        <div
          className="hidden sm:grid grid-cols-12 gap-4
          px-5 py-3 border-b border-dark-400
          text-primary-500 text-xs font-semibold uppercase tracking-wider"
        >
          <div className="col-span-4">
            <button
              onClick={() => handleSort("name")}
              className="flex items-center gap-1 hover:text-light transition-colors"
            >
              Product <SortIcon field="name" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("category")}
              className="flex items-center gap-1 hover:text-light transition-colors"
            >
              Category <SortIcon field="category" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("price")}
              className="flex items-center gap-1 hover:text-light transition-colors"
            >
              Price <SortIcon field="price" />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("stock")}
              className="flex items-center gap-1 hover:text-light transition-colors"
            >
              Stock <SortIcon field="stock" />
            </button>
          </div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-dark-400">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Package size={40} className="text-primary-600 mb-3" />
              <p className="text-light font-semibold">No products found</p>
              <p className="text-primary-500 text-sm mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filtered.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const s = statusConfig[stockStatus];

              return (
                <div
                  key={product.id}
                  id={`product-row-${product.id}`}
                  className="product-row grid grid-cols-2 sm:grid-cols-12
                    gap-3 sm:gap-4 px-4 sm:px-5 py-4
                    hover:bg-dark-300 transition-all duration-300 items-center"
                >
                  {/* Product Info */}
                  <div className="col-span-2 sm:col-span-4 flex items-center gap-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-xl object-cover
                        border border-dark-400 shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl bg-dark-300
                        border border-dark-400 shrink-0 flex items-center justify-center"
                      >
                        <Package size={20} className="text-primary-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-light font-semibold text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-primary-500 text-xs mt-0.5">
                        {product.brand}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {product.isNew && (
                          <span
                            className="inline-block bg-accent/10 text-accent
                            text-[9px] font-bold px-1.5 py-0.5 rounded-full
                            border border-accent/20"
                          >
                            NEW
                          </span>
                        )}
                        {product.isFeatured && (
                          <span
                            className="inline-block bg-blue-500/10 text-blue-400
                            text-[9px] font-bold px-1.5 py-0.5 rounded-full
                            border border-blue-500/20"
                          >
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:block sm:col-span-2">
                    <span className="text-primary-400 text-sm capitalize">
                      {product.category === "mobile" ? "📱 Mobile" : "💻 PC"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-light font-semibold text-sm">
                      ${product.price.toLocaleString()}
                    </p>
                    {product.oldPrice && (
                      <p className="text-primary-600 text-xs line-through">
                        ${product.oldPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="hidden sm:block sm:col-span-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1
                      rounded-full border ${s.class}`}
                    >
                      {s.label}
                    </span>
                    <p className="text-primary-500 text-xs mt-1">
                      {product.stock} units
                    </p>
                  </div>

                  {/* Actions */}
                  <div
                    className="col-span-2 sm:col-span-2 flex items-center
                    justify-end gap-2"
                  >
                    {/* Mobile Price + Stock */}
                    <div className="sm:hidden flex-1">
                      <p className="text-light font-bold text-sm">
                        ${product.price.toLocaleString()}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5
                        rounded-full border ${s.class}`}
                      >
                        {s.label}
                      </span>
                    </div>

                    <button
                      onClick={() => openEdit(product)}
                      className="w-8 h-8 rounded-lg bg-dark-300
                        border border-dark-400 flex items-center justify-center
                        text-primary-400 hover:text-accent hover:border-accent/40
                        transition-all duration-300 hover:scale-110"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            className="px-5 py-3 border-t border-dark-400
            flex items-center justify-between"
          >
            <p className="text-primary-500 text-xs">
              Showing{" "}
              <span className="text-light font-semibold">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="text-light font-semibold">
                {products.length}
              </span>{" "}
              products
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}
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
              <h3 className="text-light font-bold text-lg">Delete Product</h3>
              <p className="text-primary-500 text-sm mt-1">
                This will remove the product from your store permanently.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-dark-400
                  text-primary-400 font-semibold text-sm
                  hover:text-light hover:border-accent/40 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 rounded-xl bg-red-500/10
                  border border-red-500/30 text-red-400 font-bold text-sm
                  hover:bg-red-500/20 transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          z-50 flex items-center justify-center px-4"
        >
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-6 w-full max-w-lg
            max-h-[90vh] overflow-y-auto space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-light font-bold text-lg">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-dark-300
                  border border-dark-400 flex items-center justify-center
                  text-primary-400 hover:text-light transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              {/* Name */}
              <div>
                <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. iPhone 15 Pro"
                  className="w-full bg-dark-300 border border-dark-400
                    rounded-xl px-4 py-2.5 text-light text-sm
                    placeholder:text-primary-600 focus:outline-none
                    focus:border-accent/50 transition-all duration-300"
                />
              </div>

              {/* Brand + Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="e.g. Apple"
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      placeholder:text-primary-600 focus:outline-none
                      focus:border-accent/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      focus:outline-none focus:border-accent/50
                      transition-all duration-300"
                  >
                    <option value="mobile">📱 Mobile</option>
                    <option value="pc">💻 PC / Laptop</option>
                  </select>
                </div>
              </div>

              {/* Price + Old Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="999"
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      placeholder:text-primary-600 focus:outline-none
                      focus:border-accent/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Old Price ($)
                  </label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) =>
                      setForm({ ...form, oldPrice: e.target.value })
                    }
                    placeholder="1199"
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      placeholder:text-primary-600 focus:outline-none
                      focus:border-accent/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Stock + Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="50"
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      placeholder:text-primary-600 focus:outline-none
                      focus:border-accent/50 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                    placeholder="10"
                    className="w-full bg-dark-300 border border-dark-400
                      rounded-xl px-4 py-2.5 text-light text-sm
                      placeholder:text-primary-600 focus:outline-none
                      focus:border-accent/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Image URL
                </label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-dark-300 border border-dark-400
                    rounded-xl px-4 py-2.5 text-light text-sm
                    placeholder:text-primary-600 focus:outline-none
                    focus:border-accent/50 transition-all duration-300"
                />
                {/* Image Preview */}
                {form.image && (
                  <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-dark-400">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Product description..."
                  rows={3}
                  className="w-full bg-dark-300 border border-dark-400
                    rounded-xl px-4 py-2.5 text-light text-sm
                    placeholder:text-primary-600 focus:outline-none
                    focus:border-accent/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4">
                {/* Is New */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isNew: !form.isNew })}
                    className={`w-10 h-6 rounded-full transition-all duration-300
                      flex items-center px-0.5
                      ${form.isNew ? "bg-accent" : "bg-dark-400"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-dark transition-all duration-300
                        ${form.isNew ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-primary-400 text-xs">New</span>
                </div>

                {/* Is Featured */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, isFeatured: !form.isFeatured })
                    }
                    className={`w-10 h-6 rounded-full transition-all duration-300
                      flex items-center px-0.5
                      ${form.isFeatured ? "bg-accent" : "bg-dark-400"}`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-dark transition-all duration-300
                        ${form.isFeatured ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-primary-400 text-xs">Featured</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-dark-400
                  text-primary-400 font-semibold text-sm
                  hover:text-light hover:border-accent/40 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !form.name || !form.brand || !form.price || !form.stock
                }
                className={`flex-1 py-3 rounded-xl font-bold text-sm
                  transition-all duration-300 flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    saveSuccess
                      ? "bg-green-500 text-white"
                      : "bg-accent text-dark hover:bg-light hover:shadow-lg hover:shadow-accent/20"
                  }`}
              >
                {saveSuccess ? (
                  <>
                    <Check size={16} /> Saved!
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {editingProduct ? "Save Changes" : "Add Product"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
