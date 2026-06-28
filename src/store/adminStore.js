import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "../data/products";

const mockOrders = [
  {
    id: "ORD-001",
    customer: "James Wilson",
    email: "james@example.com",
    products: ["iPhone 15 Pro Max", "AirPods Pro"],
    total: 1298.99,
    status: "delivered",
    date: "2024-01-15",
    avatar: "J",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    products: ["MacBook Pro M3"],
    total: 2499.99,
    status: "shipped",
    date: "2024-01-18",
    avatar: "S",
  },
  {
    id: "ORD-003",
    customer: "Mike Davis",
    email: "mike@example.com",
    products: ["Samsung Galaxy S24 Ultra"],
    total: 1199.99,
    status: "pending",
    date: "2024-01-20",
    avatar: "M",
  },
  {
    id: "ORD-004",
    customer: "Emily Chen",
    email: "emily@example.com",
    products: ["Dell XPS 15", "USB-C Hub"],
    total: 1899.99,
    status: "delivered",
    date: "2024-01-22",
    avatar: "E",
  },
  {
    id: "ORD-005",
    customer: "Alex Turner",
    email: "alex@example.com",
    products: ["Google Pixel 8 Pro"],
    total: 999.99,
    status: "cancelled",
    date: "2024-01-23",
    avatar: "A",
  },
  {
    id: "ORD-006",
    customer: "Lisa Park",
    email: "lisa@example.com",
    products: ["iPad Pro M2", "Apple Pencil"],
    total: 1299.99,
    status: "shipped",
    date: "2024-01-24",
    avatar: "L",
  },
  {
    id: "ORD-007",
    customer: "David Brown",
    email: "david@example.com",
    products: ["OnePlus 12"],
    total: 799.99,
    status: "pending",
    date: "2024-01-25",
    avatar: "D",
  },
  {
    id: "ORD-008",
    customer: "Rachel Green",
    email: "rachel@example.com",
    products: ["Lenovo ThinkPad X1"],
    total: 1599.99,
    status: "delivered",
    date: "2024-01-26",
    avatar: "R",
  },
];

const mockCustomers = [
  {
    id: "CUS-001",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 234 567 8901",
    orders: 5,
    totalSpent: 4599.99,
    status: "active",
    joined: "2023-06-15",
    avatar: "J",
  },
  {
    id: "CUS-002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 8902",
    orders: 3,
    totalSpent: 3299.99,
    status: "active",
    joined: "2023-07-22",
    avatar: "S",
  },
  {
    id: "CUS-003",
    name: "Mike Davis",
    email: "mike@example.com",
    phone: "+1 234 567 8903",
    orders: 1,
    totalSpent: 1199.99,
    status: "active",
    joined: "2023-09-10",
    avatar: "M",
  },
  {
    id: "CUS-004",
    name: "Emily Chen",
    email: "emily@example.com",
    phone: "+1 234 567 8904",
    orders: 8,
    totalSpent: 9899.99,
    status: "active",
    joined: "2023-03-05",
    avatar: "E",
  },
  {
    id: "CUS-005",
    name: "Alex Turner",
    email: "alex@example.com",
    phone: "+1 234 567 8905",
    orders: 2,
    totalSpent: 1799.99,
    status: "inactive",
    joined: "2023-11-18",
    avatar: "A",
  },
  {
    id: "CUS-006",
    name: "Lisa Park",
    email: "lisa@example.com",
    phone: "+1 234 567 8906",
    orders: 4,
    totalSpent: 5199.99,
    status: "active",
    joined: "2023-05-30",
    avatar: "L",
  },
  {
    id: "CUS-007",
    name: "David Brown",
    email: "david@example.com",
    phone: "+1 234 567 8907",
    orders: 1,
    totalSpent: 799.99,
    status: "active",
    joined: "2024-01-02",
    avatar: "D",
  },
  {
    id: "CUS-008",
    name: "Rachel Green",
    email: "rachel@example.com",
    phone: "+1 234 567 8908",
    orders: 6,
    totalSpent: 7299.99,
    status: "active",
    joined: "2023-04-14",
    avatar: "R",
  },
];

const monthlySales = [
  { month: "Aug", revenue: 12400, orders: 45 },
  { month: "Sep", revenue: 18600, orders: 62 },
  { month: "Oct", revenue: 15200, orders: 53 },
  { month: "Nov", revenue: 24800, orders: 87 },
  { month: "Dec", revenue: 32500, orders: 112 },
  { month: "Jan", revenue: 28900, orders: 95 },
];

const useAdminStore = create(
  persist(
    (set, get) => ({
      // ✅ Products now live in Zustand
      products: initialProducts,
      orders: mockOrders,
      customers: mockCustomers,
      monthlySales,

      // ── Product Actions ──
      addProduct: (product) => {
        const newProduct = {
          ...product,
          id: Date.now(),
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          images: product.image ? [product.image] : [],
          colors: product.colors || ["#000000"],
          specs: product.specs || {},
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
          discount: Number(product.discount) || 0,
          price: Number(product.price),
          oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
          stock: Number(product.stock),
        };
        set((state) => ({
          products: [newProduct, ...state.products],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...updates,
                  price: Number(updates.price),
                  oldPrice: updates.oldPrice ? Number(updates.oldPrice) : null,
                  stock: Number(updates.stock),
                  discount: Number(updates.discount) || 0,
                  images: updates.image ? [updates.image] : p.images,
                }
              : p,
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // ── Order Actions ──
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== orderId),
        }));
      },

      // ── Stats ──
      getStats: () => {
        const { orders, customers, products } = get();
        const totalRevenue = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + o.total, 0);
        const totalOrders = orders.length;
        const totalCustomers = customers.length;
        const pendingOrders = orders.filter(
          (o) => o.status === "pending",
        ).length;
        const totalProducts = products.length;
        const lowStock = products.filter((p) => p.stock <= 10).length;

        return {
          totalRevenue,
          totalOrders,
          totalCustomers,
          pendingOrders,
          totalProducts,
          lowStock,
        };
      },
    }),
    {
      name: "admin-store",
    },
  ),
);

export default useAdminStore;
