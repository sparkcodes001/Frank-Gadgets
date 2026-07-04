// src/pages/admin/AdminProducts.jsx
import { useState, useEffect, useRef } from "react";
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
  Loader,
  Upload,
  ImagePlus,
  AlertCircle,
} from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { formatPrice } from "../../utils/formatPrice";

// ─── Constants ────────────────────────────────────────────────────────────────
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

const CATEGORIES = [
  { value: "phones", label: "📱 Phones" },
  { value: "tablets", label: "📟 Tablets" },
  { value: "accessories", label: "🎧 Accessories" },
  { value: "gadgets", label: "🎮 Gadgets" },
];

const getStockStatus = (stock) => {
  if (stock === 0) return "outofstock";
  if (stock <= 10) return "lowstock";
  return "instock";
};

const emptyForm = {
  name: "",
  brand: "",
  category: "phones",
  price: "",
  oldPrice: "",
  stock: "",
  discount: "",
  description: "",
  image: "", // will hold base64 or blob URL
  imageFile: null, // holds the actual File object
  isNew: false,
  isFeatured: false,
};

// ─── Image Upload Zone ────────────────────────────────────────────────────────
const ImageUploadZone = ({ value, onChange }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const MAX_SIZE_MB = 5;

  const processFile = (file) => {
    setError("");

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (JPG, PNG, WebP)");
      return;
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    // Convert to base64 so it persists in localStorage with the product
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        preview: e.target.result, // base64 string - used as img src
        file, // File object - in case you send to server
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider">
        Product Image
      </label>

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative w-full rounded-2xl border-2 border-dashed
          cursor-pointer transition-all duration-300 overflow-hidden
          ${
            isDragging
              ? "border-accent bg-accent/10 scale-[1.01]"
              : value
                ? "border-accent/40 bg-dark-300"
                : "border-dark-400 bg-dark-300 hover:border-accent/50 hover:bg-dark-200"
          }`}
      >
        {value ? (
          // ── Image Preview ──────────────────────────────────────────────────
          <div className="relative">
            <img
              src={value}
              alt="Product preview"
              className="w-full h-52 object-contain p-4"
            />
            {/* Overlay on hover */}
            <div
              className="absolute inset-0 bg-black/0 hover:bg-black/40
              transition-all duration-300 flex items-center justify-center
              opacity-0 hover:opacity-100 gap-3"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-accent text-dark
                  font-bold text-xs px-4 py-2 rounded-xl
                  hover:bg-light transition-all duration-200"
              >
                <Upload size={13} />
                Change
              </button>
              <button
                onClick={handleRemove}
                className="flex items-center gap-2 bg-red-500/20 text-red-400
                  font-bold text-xs px-4 py-2 rounded-xl border border-red-500/30
                  hover:bg-red-500/30 transition-all duration-200"
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          // ── Upload Prompt ──────────────────────────────────────────────────
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center
              transition-all duration-300
              ${isDragging ? "bg-accent/20" : "bg-dark-400"}`}
            >
              <ImagePlus
                size={26}
                className={isDragging ? "text-accent" : "text-primary-500"}
              />
            </div>
            <div className="text-center">
              <p className="text-light text-sm font-semibold">
                {isDragging ? "Drop image here" : "Click or drag to upload"}
              </p>
              <p className="text-primary-600 text-xs mt-1">
                JPG, PNG, WebP — max {MAX_SIZE_MB}MB
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 bg-accent/10
              border border-accent/20 rounded-xl"
            >
              <Upload size={13} className="text-accent" />
              <span className="text-accent text-xs font-semibold">
                Browse Files
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <p className="text-red-400 text-[11px] flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}

      {/* Info row */}
      {value && (
        <p className="text-primary-600 text-[10px] flex items-center gap-1">
          <Check size={10} className="text-green-400" />
          Image ready · click image to change
        </p>
      )}
    </div>
  );
};

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, required, children }) => (
  <div>
    <label className="text-primary-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = `w-full bg-dark-300 border border-dark-400 rounded-xl
  px-4 py-2.5 text-light text-sm placeholder:text-primary-600
  focus:outline-none focus:border-accent/50 transition-all duration-300`;

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminProducts = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts();

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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".product-row",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      );
    }
  }, [loading, products]);

  // ── Filtering & Sorting ───────────────────────────────────────────────────
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
    if (sortBy === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
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

  // ── Modal Handlers ────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormError("");
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice || "",
      stock: product.stock,
      discount: product.discount || "",
      description: product.description || "",
      image: product.image || "", // existing base64/url
      imageFile: null,
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
    });
    setShowModal(true);
  };

  // ── Image Upload Handler ──────────────────────────────────────────────────
  const handleImageChange = (result) => {
    if (!result) {
      // Removed
      setForm((f) => ({ ...f, image: "", imageFile: null }));
      return;
    }
    // result = { preview: base64, file: File }
    setForm((f) => ({ ...f, image: result.preview, imageFile: result.file }));
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setFormError("");

    // Validate required fields
    if (!form.name.trim()) {
      setFormError("Product name is required");
      return;
    }
    if (!form.brand.trim()) {
      setFormError("Brand is required");
      return;
    }
    if (!form.price) {
      setFormError("Price is required");
      return;
    }
    if (!form.stock) {
      setFormError("Stock quantity is required");
      return;
    }

    setSaving(true);

    // Build the product data - image is already base64 in form.image
    const productData = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      discount: form.discount ? Number(form.discount) : null,
      description: form.description.trim(),
      image: form.image, // base64 string stored directly
      isNew: form.isNew,
      isFeatured: form.isFeatured,
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await addProduct(productData);
    }

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
      }, 900);
    } else {
      setFormError(result.error || "Failed to save product");
    }

    setSaving(false);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeleting(true);
    const result = await deleteProduct(id);
    if (result.success) setDeleteConfirm(null);
    setDeleting(false);
  };

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="text-accent animate-spin" />
          <p className="text-primary-500 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border
              text-sm font-semibold transition-all duration-300
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

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      {showFilters && (
        <div
          className="flex flex-wrap gap-4 bg-dark-200
          border border-dark-400 rounded-xl p-4"
        >
          {/* Category filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-primary-500 text-xs font-semibold uppercase tracking-wider">
              Category:
            </span>
            {["all", ...CATEGORIES.map((c) => c.value)].map((c) => (
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
                {c === "all"
                  ? "All"
                  : (CATEGORIES.find((cat) => cat.value === c)?.label ?? c)}
              </button>
            ))}
          </div>

          {/* Stock filter */}
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

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
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
            className="bg-dark-200 border border-dark-400 rounded-xl p-3 text-center"
          >
            <p className={`font-bold text-xl ${s.color}`}>{s.value}</p>
            <p className="text-primary-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Products Table ─────────────────────────────────────────────────── */}
      <div className="bg-dark-200 border border-dark-400 rounded-2xl overflow-hidden">
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
                Try adjusting your filters or add a product
              </p>
            </div>
          ) : (
            filtered.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const s = statusConfig[stockStatus];
              const categoryLabel =
                CATEGORIES.find((c) => c.value === product.category)?.label ??
                product.category;

              return (
                <div
                  key={product.id}
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
                          border border-dark-400 shrink-0 bg-dark-300"
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
                            text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-accent/20"
                          >
                            NEW
                          </span>
                        )}
                        {product.isFeatured && (
                          <span
                            className="inline-block bg-blue-500/10 text-blue-400
                            text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-blue-500/20"
                          >
                            FEATURED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:block sm:col-span-2">
                    <span className="text-primary-400 text-sm">
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Price ✅ Naira */}
                  <div className="hidden sm:block sm:col-span-2">
                    <p className="text-light font-semibold text-sm">
                      {formatPrice(product.price)}
                    </p>
                    {product.oldPrice && (
                      <p className="text-primary-600 text-xs line-through">
                        {formatPrice(product.oldPrice)}
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
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-end gap-2">
                    {/* Mobile price + status */}
                    <div className="sm:hidden flex-1">
                      <p className="text-light font-bold text-sm">
                        {formatPrice(product.price)}
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
                      className="w-8 h-8 rounded-lg bg-dark-300 border border-dark-400
                        flex items-center justify-center text-primary-400
                        hover:text-accent hover:border-accent/40
                        transition-all duration-300 hover:scale-110"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="w-8 h-8 rounded-lg bg-dark-300 border border-dark-400
                        flex items-center justify-center text-primary-400
                        hover:text-red-400 hover:border-red-400/40
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

      {/* ── Delete Modal ───────────────────────────────────────────────────── */}
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
                This will permanently remove the product from your store.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl border border-dark-400
                  text-primary-400 font-semibold text-sm
                  hover:text-light transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500/10
                  border border-red-500/30 text-red-400 font-bold text-sm
                  hover:bg-red-500/20 transition-all duration-300
                  flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <Loader size={14} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          z-50 flex items-center justify-center px-4"
        >
          <div
            className="bg-dark-200 border border-dark-400
            rounded-2xl p-6 w-full max-w-lg
            max-h-[92vh] overflow-y-auto space-y-4"
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between sticky top-0
              bg-dark-200 pb-2 border-b border-dark-400 z-10"
            >
              <div>
                <h3 className="text-light font-bold text-lg">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-primary-500 text-xs mt-0.5">
                  {editingProduct
                    ? "Update product details"
                    : "Fill in the details below"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-dark-300 border border-dark-400
                  flex items-center justify-center text-primary-400
                  hover:text-light transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {/* ── Image Upload ────────────────────────────────────────── */}
              <ImageUploadZone
                value={form.image}
                onChange={handleImageChange}
              />

              {/* ── Product Name ─────────────────────────────────────────── */}
              <Field label="Product Name" required>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Samsung Galaxy S24 Ultra"
                  className={inputClass}
                />
              </Field>

              {/* ── Brand + Category ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand" required>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="e.g. Samsung"
                    className={inputClass}
                  />
                </Field>
                <Field label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className={inputClass}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* ── Price (₦) + Old Price ────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₦)" required>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="150000"
                    min="0"
                    className={inputClass}
                  />
                </Field>
                <Field label="Old Price (₦)">
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) =>
                      setForm({ ...form, oldPrice: e.target.value })
                    }
                    placeholder="180000"
                    min="0"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* ── Stock + Discount ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Stock Quantity" required>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="50"
                    min="0"
                    className={inputClass}
                  />
                </Field>
                <Field label="Discount (%)">
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) =>
                      setForm({ ...form, discount: e.target.value })
                    }
                    placeholder="10"
                    min="0"
                    max="100"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* ── Description ──────────────────────────────────────────── */}
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Write a short product description..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {/* ── Toggles ───────────────────────────────────────────────── */}
              <div className="flex items-center gap-6 pt-1">
                {[
                  { key: "isNew", label: "Mark as New" },
                  { key: "isFeatured", label: "Featured" },
                ].map((toggle) => (
                  <div key={toggle.key} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, [toggle.key]: !form[toggle.key] })
                      }
                      className={`w-10 h-6 rounded-full transition-all duration-300
                        flex items-center px-0.5
                        ${form[toggle.key] ? "bg-accent" : "bg-dark-400"}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-dark
                        transition-all duration-300
                        ${form[toggle.key] ? "translate-x-4" : "translate-x-0"}`}
                      />
                    </button>
                    <span className="text-primary-400 text-xs">
                      {toggle.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Form Error ────────────────────────────────────────────── */}
              {formError && (
                <div
                  className="flex items-center gap-2 p-3 bg-red-500/10
                  border border-red-500/20 rounded-xl"
                >
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{formError}</p>
                </div>
              )}
            </div>

            {/* ── Modal Actions ─────────────────────────────────────────── */}
            <div
              className="flex gap-3 pt-2 sticky bottom-0
              bg-dark-200 pt-4 border-t border-dark-400"
            >
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="flex-1 py-3 rounded-xl border border-dark-400
                  text-primary-400 font-semibold text-sm
                  hover:text-light hover:border-accent/40 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || saveSuccess}
                className={`flex-1 py-3 rounded-xl font-bold text-sm
                  transition-all duration-300 flex items-center justify-center gap-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    saveSuccess
                      ? "bg-green-500 text-white"
                      : "bg-accent text-dark hover:bg-light"
                  }`}
              >
                {saving ? (
                  <>
                    <Loader size={16} className="animate-spin" /> Saving...
                  </>
                ) : saveSuccess ? (
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
