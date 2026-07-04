// src/hooks/useOrders.js
import { useState, useEffect } from "react";

const ORDERS_KEY = "frankgadgets_orders";

// ─── Helper: load from localStorage ──────────────────────────────────────────
const loadOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ─── Helper: save to localStorage ────────────────────────────────────────────
const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save orders:", err);
  }
};

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    const stored = loadOrders();
    setOrders(stored);
    setLoading(false);
  }, []);

  // ─── addOrder ───────────────────────────────────────────────────────────────
  // Transforms the nested checkout data into flat order shape
  // that AdminOrders can read directly
  const addOrder = ({
    shippingData,
    cartItems,
    total,
    orderNumber,
    paymentRef = "",
    paymentStatus = "pending",
    cardLast4 = "",
  }) => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      landmark,
      shippingMethod,
    } = shippingData;

    // Build avatar initials from name
    const avatar =
      `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

    // Build address string
    const fullAddress = [
      address,
      landmark ? `(Near ${landmark})` : "",
      city,
      state,
    ]
      .filter(Boolean)
      .join(", ");

    // Map cart items to product names + details
    const products = cartItems.map((item) => item.name);
    const productDetails = cartItems.map((item) => ({
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      brand: item.brand,
    }));

    // ✅ Flat order object - exactly what AdminOrders expects
    const newOrder = {
      id: orderNumber,
      customer: `${firstName} ${lastName}`,
      email,
      phone,
      avatar,
      address: fullAddress || "Store Pickup",
      shippingMethod,
      products,
      productDetails,
      total,
      status: "pending", // always starts pending
      date: new Date().toISOString(),
      paymentRef,
      paymentStatus,
      paymentLast4: cardLast4,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev]; // newest first
      saveOrders(updated);
      return updated;
    });

    return newOrder;
  };

  // ─── updateOrderStatus ──────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId, newStatus) => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 600));

    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      );
      saveOrders(updated);
      return updated;
    });
  };

  // ─── deleteOrder ────────────────────────────────────────────────────────────
  const deleteOrder = async (orderId) => {
    await new Promise((res) => setTimeout(res, 400));

    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      saveOrders(updated);
      return updated;
    });
  };

  // ─── clearAllOrders (useful for testing) ────────────────────────────────────
  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem(ORDERS_KEY);
  };

  return {
    orders,
    loading,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    clearAllOrders,
  };
};
