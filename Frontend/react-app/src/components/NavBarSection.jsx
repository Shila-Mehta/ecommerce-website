import { useContext, useState } from "react";
import "../css/NavBarSection.css";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import CheckoutMenu from "./CheckoutMenu";

const NavBarSection = () => {
  const { cartCount, cartItems, setCartItems } = useContext(CartContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCheckout = () => setShowCheckout((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>Vendoz</h2>
        </div>

        {/* Desktop Links & Actions */}
        <div className="navbar-links desktop">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="navbar-actions desktop">
          <div className="cart-wrapper" onClick={toggleCheckout}>
            <FiShoppingCart size={22} className="cart-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>

          <Link to="/auth" className="auth-btn">Login</Link>
          {/* <Link to="/admin" className="admin-btn">Admin</Link> */}
        </div>

        {/* Hamburger for mobile */}
        <div className="hamburger mobile" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="navbar-links">
              <Link to="/" onClick={toggleMobileMenu}>Home</Link>
              <Link to="/products" onClick={toggleMobileMenu}>Products</Link>
              <Link to="/blog" onClick={toggleMobileMenu}>Blog</Link>
              <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
            </div>

            <div className="navbar-actions">
              <div className="cart-wrapper" onClick={toggleCheckout}>
                <FiShoppingCart size={22} className="cart-icon" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              
              <Link to="/auth" className="auth-btn" onClick={toggleMobileMenu}>Login</Link>
              {/* <Link to="/admin" className="admin-btn" onClick={toggleMobileMenu}>Admin</Link> */}
            </div>
          </div>
        )}
      </nav>

      {showCheckout && (
        <CheckoutMenu
          isOpen={showCheckout}
          onClose={toggleCheckout}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      )}
    </>
  );
};

export default NavBarSection;
