import "../css/WhyShopWithUs.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const WhyShopWithUs = () => {
  return (
      <section className="why-shop-with-us">
      <h1>Why Shop With Us</h1>
      <div className="cards-container">
        <div className="card">
          <i className="bi bi-lightning-charge-fill"></i>
          <h3>Fast Delivery</h3>
          <p>Get your orders quickly with our efficient delivery network.</p>
        </div>
        <div className="card">
          <i className="bi bi-truck"></i>
          <h3>Free Shipping</h3>
          <p>Enjoy free shipping on all orders over $50 — no hidden fees.</p>
        </div>
        <div className="card">
          <i className="bi bi-award-fill"></i>
          <h3>Best Quality</h3>
          <p>We source only top-quality products that are built to last.</p>
        </div>
      </div>
      </section>
  );
};

export default WhyShopWithUs;
