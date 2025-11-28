import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/cartContext";

import Home from "./pages/Home";
import Products from "./pages/Products";
import WhyShopWithUS from "./pages/WhyShopWithUsPage";
import ContactUs from "./pages/ContactUs";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import Messages from "./components/Messages";
import Orders from "./components/Orders";
import Settings from "./components/settings";
import AdminTestimonials from "./components/AdminTestimonial";
import ProductsAdminWrapper from "./components/ProductsAdminWrapper"; // wrapper for category

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/products", element: <Products /> },
  { path: "/blog", element: <WhyShopWithUS /> },
  { path: "/contact", element: <ContactUs /> },
  { path: "/auth", element: <AuthPage /> },
  {
    path: "/admin",
    element: <AdminDashboardPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "users", element: <Users /> },
      { path: "messages", element: <Messages /> },
      // ✅ Products route with optional category param
      { path: "products/:category?", element: <ProductsAdminWrapper /> },
      { path: "orders", element: <Orders /> },
      { path: "settings", element: <Settings /> },
      { path: "testimonials", element: <AdminTestimonials /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);
