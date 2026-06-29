import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const mapOrder = (row) => ({
  id: row.id,
  customer: row.customer,
  email: row.email,
  phone: row.phone,
  address: row.address,
  products: row.products || [],
  productDetails: row.product_details || [],
  total: Number(row.total),
  status: row.status,
  shippingMethod: row.shipping_method,
  paymentLast4: row.payment_last4,
  paymentName: row.payment_name,
  avatar: row.avatar,
  date: row.date,
});

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data.map(mapOrder));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (orderData) => {
    const { shippingData, paymentData, cartItems, total, orderNumber } =
      orderData;

    const fullName = `${shippingData.firstName} ${shippingData.lastName}`;
    const avatar = shippingData.firstName.charAt(0).toUpperCase();

    try {
      // ── Insert order ──
      const { data: orderRow, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            id: orderNumber,
            customer: fullName,
            email: shippingData.email,
            phone: shippingData.phone,
            address: `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.zip}`,
            products: cartItems.map((item) => item.name),
            product_details: cartItems.map((item) => ({
              id: item.id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
              color: item.color,
            })),
            total,
            status: "pending",
            shipping_method: shippingData.shippingMethod,
            payment_last4: paymentData.cardNumber.replace(/\s/g, "").slice(-4),
            payment_name: paymentData.cardName,
            avatar,
            date: new Date().toISOString().split("T")[0],
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // ── Upsert customer ──
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("*")
        .eq("email", shippingData.email)
        .single();

      if (existingCustomer) {
        await supabase
          .from("customers")
          .update({
            orders: existingCustomer.orders + 1,
            total_spent: Number(existingCustomer.total_spent) + total,
          })
          .eq("email", shippingData.email);
      } else {
        await supabase.from("customers").insert([
          {
            id: `CUS-${Date.now()}`,
            name: fullName,
            email: shippingData.email,
            phone: shippingData.phone,
            orders: 1,
            total_spent: total,
            status: "active",
            avatar,
            joined: new Date().toISOString().split("T")[0],
          },
        ]);
      }

      // ── Update product stock ──
      for (const item of cartItems) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (product) {
          await supabase
            .from("products")
            .update({ stock: Math.max(0, product.stock - item.quantity) })
            .eq("id", item.id);
        }
      }

      await fetchOrders();
      return { success: true, order: mapOrder(orderRow) };
    } catch (err) {
      console.error("Error adding order:", err);
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating order:", err);
      return { success: false, error: err.message };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting order:", err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel("orders-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => fetchOrders(),
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrderStatus,
    deleteOrder,
  };
};
