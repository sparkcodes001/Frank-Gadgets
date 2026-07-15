import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ── Helper to map DB row → app format ──────────────────────────────────────
const mapProduct = (row) => ({
  id: row.id,
  name: row.name,
  brand: row.brand,
  category: row.category,
  price: Number(row.price),
  oldPrice: row.old_price ? Number(row.old_price) : null,
  rating: Number(row.rating),
  reviews: row.reviews,
  stock: row.stock,
  isNew: row.is_new,
  isFeatured: row.is_featured,
  discount: row.discount,
  colors: row.colors || ["#000000"],
  image: row.image,
  images: row.images || [],
  description: row.description,
  specs: row.specs || {},
});

// ── Helper to map app format → DB row ──────────────────────────────────────
const mapToDb = (product) => ({
  name: product.name,
  brand: product.brand,
  category: product.category,
  price: Number(product.price),
  old_price: product.oldPrice ? Number(product.oldPrice) : null,
  rating: Number(product.rating) || 4.5,
  reviews: Number(product.reviews) || 0,
  stock: Number(product.stock),
  is_new: product.isNew || false,
  is_featured: product.isFeatured || false,
  discount: Number(product.discount) || 0,
  colors: product.colors || ["#000000"],
  image: product.image || "",
  images: product.image ? [product.image] : [],
  description: product.description || "",
  specs: product.specs || {},
});

// ── Upload image to Supabase Storage ───────────────────────────────────────
export const uploadProductImage = async (file) => {
  try {
    const ext = file.name.split(".").pop();
    const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `products/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);

    return { success: true, url: data.publicUrl };
  } catch (err) {
    console.error("Image upload error:", err);
    return { success: false, error: err.message };
  }
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all products ──────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data.map(mapProduct));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Add product ────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([mapToDb(product)])
        .select()
        .single();

      if (error) throw error;

      const newProduct = mapProduct(data);
      setProducts((prev) => [newProduct, ...prev]);
      return { success: true, product: newProduct };
    } catch (err) {
      console.error("Error adding product:", err);
      return { success: false, error: err.message };
    }
  };

  // ── Update product ─────────────────────────────────────────────────────
  const updateProduct = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update(mapToDb(updates))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const updated = mapProduct(data);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return { success: true, product: updated };
    } catch (err) {
      console.error("Error updating product:", err);
      return { success: false, error: err.message };
    }
  };

  // ── Delete product ─────────────────────────────────────────────────────
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      console.error("Error deleting product:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchProducts();

    // ── Real-time subscription ────────────────────────────────────────
    const subscription = supabase
      .channel("products-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchProducts();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
