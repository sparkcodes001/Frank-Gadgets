import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import useAdminAuthStore from "../../store/adminAuthStore";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAdminAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const title = pageTitles[location.pathname] || "Admin";

  const handleOpen = () => setSidebarOpen(true);
  const handleClose = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={handleClose} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Header */}
        <AdminHeader onMenuClick={handleOpen} title={title} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
