import "../css/Footer.css";
import CheckoutMenu from "./CheckoutMenu";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Shop Info */}
        <div className="footer-col">
          <h2 className="footer-title ">Vendoz</h2>
          <p>123 Street, City, Country</p>
          <p>+123 456 7890</p>
          <p>shop@example.com</p>
        </div>

        {/* Menu Links */}
        <div className="footer-col">
          <h2 className="footer-title">Menu</h2>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-col">
          <h2 className="footer-title">Account</h2>
          <ul className="footer-links">
            <li><a href="/auth">Register</a></li>
            <li><a href="/products">Shopping</a></li>
            <li><a href="" onClick={()=><CheckoutMenu/>}>Checkout</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col newsletter">
          <h2 className="footer-title">Newsletter</h2>
          <p>Subscribe to get our latest updates and offers.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
