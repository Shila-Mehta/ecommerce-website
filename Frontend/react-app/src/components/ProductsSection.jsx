import { useEffect, useState, useContext } from "react";
import "../css/ProductsSection.css";
import CheckoutMenu from "./CheckoutMenu";
import { CartContext } from "../context/cartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [category, setCategory] = useState("all");

  const { cartItems, setCartItems, addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleBuyNow = (product) => {
    addToCart(product);
    setCheckoutOpen(true);
  };

  const filteredProducts =
    category === "all"
      ? products
      : products.filter((product) => product.category === category);

  const displayedProducts = showAll
    ? filteredProducts
    : filteredProducts.slice(0, 6);

  const toggleShowAll = () => setShowAll((prev) => !prev);

  const formatUSD = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const categories = ["all", "men", "women", "kids"];

  return (
    <section className="products-container">
      <h2 className="section-title">Our Products</h2>

      {/* Toast container lives inside ProductsSection */}
      <ToastContainer position="bottom-left" autoClose={2000} />

      {/* Category Filters */}
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${category === cat ? "active" : ""}`}
            onClick={() => {
              setCategory(cat);
              setShowAll(false);
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {displayedProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-img-wrapper">
              <img
                className="product-img"
                src={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
              />
              <div className="product-actions">
                <button
                  className="btn-outline"
                  onClick={() => {
                    addToCart(product);
                    toast.success(`${product.name} added to cart 🛒`);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn-primary"
                  onClick={() => handleBuyNow(product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="price">{formatUSD(product.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show All / View Less */}
      {filteredProducts.length > 6 && (
        <div className="view-all">
          <button className="btn-view-all" onClick={toggleShowAll}>
            {showAll ? "Show Less" : "View All Products"}
          </button>
        </div>
      )}

      <CheckoutMenu
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </section>
  );
};

export default ProductsSection;
