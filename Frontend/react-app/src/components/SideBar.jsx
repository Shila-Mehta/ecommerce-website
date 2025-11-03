import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FaQuoteRight } from "react-icons/fa";
import { useEffect, useState } from "react";

const SideBar = ({ sidebarOpen, setSidebarOpen, category, setCategory }) => {
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false); // 👈 dropdown toggle
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* Close button for mobile */}
      <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
        ✖
      </button>

      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚙️</span>
          <span className="logo-text">AdminPanel</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="section-title">MAIN</h3>

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">👥</span>
            <span>Users</span>
          </NavLink>

          <NavLink
            to="/admin/messages"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">💬</span>
            <span>Messages</span>
          </NavLink>
        </div>

        <div className="nav-section">
          <h3 className="section-title">MANAGEMENT</h3>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </NavLink>


          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">📋</span>
            <span>Orders</span>
          </NavLink>

          <NavLink
            to="/admin/testimonials"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">
              <FaQuoteRight />
            </span>
            <span>Testimonials</span>
          </NavLink>
        </div>
      </nav>

      <div className="user-profile">
        <div className="avatar">
          <img src="https://placehold.co/100x100" alt="User avatar" />
        </div>
        <div className="user-info">
          <div className="name">{user?.name || "Admin User"}</div>
          <div className="role">{user?.role || "Super Admin"}</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
