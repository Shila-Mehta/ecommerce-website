import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import "../css/Basis.css";
import "../css/CheckoutMenu.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const MySwal = withReactContent(Swal);

// --- Toast setup (FIXED: use Swal instead of MySwal) ---
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

// --- Currency formatter (USD) ---
const formatUSD = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

// Stripe setup (publishable key from frontend .env)
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
  console.error("❌ Stripe publishable key is missing. Check your .env file.");
}
const stripePromise = loadStripe(stripeKey);

// --- Cart Items ---
const CartList = ({ cartItems, updateQuantity, cancelItem, total }) => (
  <div className="cart-section">
    <h4>Your Cart</h4>
    <div className="cart-items">
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id} className="cart-card">
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.name}
              className="cart-card-img"
            />
            <div className="cart-card-details">
              <h5>
                {item.name} <span className="qty-tag">× {item.quantity}</span>
              </h5>
              <p className="price">
                {formatUSD(item.price)}{" "}
                <span className="each">per item</span>
              </p>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
              </div>
              <p className="subtotal">
                Subtotal:{" "}
                <strong>{formatUSD(item.price * item.quantity)}</strong>
              </p>
            </div>
            <button
              className="cancel-btn"
              onClick={() => cancelItem(item._id, item.name)}
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
    <div className="cart-total">
      <strong>Total: {formatUSD(total)}</strong>
    </div>
  </div>
);

// --- Shipping Form ---
const ShippingForm = ({
  address,
  setAddress,
  city,
  setCity,
  country,
  setCountry,
  postalCode,
  setPostalCode,
  phone,
  setPhone,
}) => (
  <div className="shipping-section">
    <h4>Shipping Details</h4>
    <input
      type="text"
      placeholder="Address"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
    <input
      type="text"
      placeholder="City"
      value={city}
      onChange={(e) => setCity(e.target.value)}
    />
    <input
      type="text"
      placeholder="Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
    />
  </div>
);

// --- Payment Section ---
const PaymentSection = ({ paymentMethod, setPaymentMethod }) => (
  <div className="payment-section">
    <h4>Payment Method</h4>
    <select
      value={paymentMethod}
      onChange={(e) => setPaymentMethod(e.target.value)}
    >
      <option value="COD">Cash on Delivery</option>
      <option value="Card">Card Payment</option>
    </select>
  </div>
);

// --- Stripe Card Payment Component ---
function CardPayment({ total, placeOrder, onClose, setCartItems }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePay = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total * 100 }), // Stripe needs cents
      });

      const data = await res.json();
      if (!data.clientSecret) {
        throw new Error("No clientSecret returned from backend");
      }

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        MySwal.fire("Error", paymentResult.error.message, "error");
        return;
      }

      if (paymentResult.paymentIntent?.status === "succeeded") {
        const orderData = await placeOrder("paid");
        onClose();
        MySwal.fire(
          "Order Placed 🎉",
          `<p><strong>Order ID:</strong> ${orderData._id}</p>
           <p><strong>Total:</strong> ${formatUSD(total)}</p>`,
          "success"
        );
        setCartItems([]);
      }
    } catch (err) {
      MySwal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="stripe-payment">
      <CardElement />
      <button className="confirm-btn" onClick={handlePay}>
        Pay Now
      </button>
    </div>
  );
}

// --- Main Checkout ---
const CheckoutMenu = ({ isOpen, onClose, cartItems, setCartItems }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- Quantity Update with Toast ---
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          Toast.fire({
            icon: "info",
            title: `${item.name} quantity updated to ${newQty}`,
          });
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // --- Cancel Item with Toast ---
  const cancelItem = (id, name) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
    Toast.fire({
      icon: "error",
      title: `${name} removed from cart`,
    });
  };

  // --- Save order to backend ---
  const placeOrder = async (paymentStatus) => {
    const customerToken = localStorage.getItem("customerToken");
    const user = jwtDecode(customerToken);
    const userId = user.id || user._id;

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
      },
      body: JSON.stringify({
        user: userId,
        items: cartItems.map((p) => ({
          product: p._id,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
          image: p.image,
        })),
        shippingAddress: {
          address,
          city,
          country,
          postalCode,
          phoneNumber: phone,
        },
        paymentMethod,
        paymentStatus,
        orderStatus: "pending",
        totalAmount: total,
      }),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error("❌ Order API error:", responseText);
      throw new Error("Failed to place order: " + responseText);
    }
    return JSON.parse(responseText);
  };

  const confirmOrder = async () => {
    if (paymentMethod === "COD") {
      try {
        const data = await placeOrder("unpaid");
        onClose();
        MySwal.fire(
          "Order Placed 🎉",
          `<p><strong>Order ID:</strong> ${data._id}</p>
           <p><strong>Total:</strong> ${formatUSD(total)}</p>
           <p><strong>Shipping:</strong> ${address}, ${city}, ${country}</p>`,
          "success"
        );
        setCartItems([]);
      } catch (err) {
        onClose();
        MySwal.fire("Error", err.message, "error");
      }
    }
  };

  return (
    <div className="checkout-overlay">
      <div className="checkout-box">
        <h3>Checkout</h3>

        <CartList
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          cancelItem={cancelItem}
          total={total}
        />
        <ShippingForm
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          postalCode={postalCode}
          setPostalCode={setPostalCode}
          phone={phone}
          setPhone={setPhone}
        />
        <PaymentSection
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {paymentMethod === "Card" && (
          <Elements stripe={stripePromise}>
            <CardPayment
              total={total}
              placeOrder={placeOrder}
              onClose={onClose}
              setCartItems={setCartItems}
            />
          </Elements>
        )}

        <div className="checkout-actions">
          {paymentMethod === "COD" && (
            <button className="confirm-btn" onClick={confirmOrder}>
              Confirm Order
            </button>
          )}
          <button className="close-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMenu;
