import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const mapCustomer = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  orders: row.orders,
  totalSpent: Number(row.total_spent),
  status: row.status,
  avatar: row.avatar,
  joined: row.joined,
});

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data.map(mapCustomer));
    } catch (err) {
      setError(err.message);
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();

    const subscription = supabase
      .channel("customers-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        () => fetchCustomers(),
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
  };
};
