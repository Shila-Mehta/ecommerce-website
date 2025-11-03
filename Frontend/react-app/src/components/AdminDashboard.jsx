import "../css/Basis.css";
import "../css/AdminDashboard.css";
import SideBar from "./SideBar";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Map routes to titles
  useEffect(() => {
    const routeMap = {
      "/admin/dashboard": "Dashboard",
      "/admin/users": "Users",
      "/admin/messages": "Messages",
      "/admin/products": "Products",
      "/admin/orders": "Orders",
      "/admin/settings": "Settings",
      "/admin/testimonials": "Testimonials",
    };

    setPageTitle(routeMap[location.pathname] || "Dashboard");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="main-content">
        <header className="main-header">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <h2 className="page-title">{pageTitle}</h2>

          <div className="header-actions">
            <button
              className="header-btn"
              onClick={() => navigate("/admin/settings")}
            >
              ⚙️ Settings
            </button>
            <button className="header-btn logout" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </header>

        {/* Render child route content here */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
