// src/components/admin/Orders.js
import { useEffect, useState } from "react";
import "../css/Orders.css";
import "../css/orderModal.css";
import OrderModal from "../components/orderModel";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/orders";
      if (filter !== "all") url += `?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ update either orderStatus or paymentStatus
  const updateOrderField = async (id, field, value) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error(`Failed to update ${field}`);
      await fetchOrders(); // refresh list
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, [field]: value });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const downloadReceipt = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pdf/receipt/${orderId}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to fetch PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${orderId}.pdf`; // filename
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
    }
  };


  const formatOrderId = (id) => `#${id.slice(-6)}`; // short readable ID

  return (
    <div className="orders-container">

      {/* Filters */}
      <div className="filters">
        <label>Status Filter: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              {/* <th>Payment</th> */}
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o._id}>
                  <td>{formatOrderId(o._id)}</td>
                  <td>
                    {o.user?.full_name || "N/A"} <br />
                    <small>{o.user?.email}</small>
                  </td>
                  <td>{o.items?.length || 0} items</td>
                  <td>${o.totalAmount?.toFixed(2) || "0.00"}</td>
                  <td>
                    <span className={`status ${o.orderStatus}`}>
                      {o.orderStatus}
                    </span>
                  </td>

                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => setSelectedOrder(o)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal */}
      <OrderModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <div className="order-details">
            <h3>Order Details ({formatOrderId(selectedOrder._id)})</h3>

            <table className="order-info-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>City</th>
                  {/* <th>Country</th> */}
                  {/* <th>postalCode</th> */}
                  <th>paymentMethod</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {selectedOrder.user?.full_name} <br />
                    <small>{selectedOrder.user?.email}</small>
                  </td>
                  <td>
                    <small>{selectedOrder.shippingAddress.phoneNumber}</small>
                  </td>
                  <td>{selectedOrder.shippingAddress.address}</td>
                  <td>{selectedOrder.shippingAddress.city}</td>
                  {/* <td>{selectedOrder.shippingAddress.country}</td> */}
                  {/* <td>{selectedOrder.shippingAddress.postalCode}</td> */}
                  <td>{selectedOrder.paymentMethod}</td>

                </tr>
              </tbody>
            </table>

            <h4>Products</h4>
            <table className="order-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                      />
                    </td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan="4" style={{ textAlign: "right" }}>
                    Total:
                  </th>
                  <td>${selectedOrder.totalAmount?.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            {/* Update Status */}
            <div class="status-dropdown">
              <div className="status-update">
                <label>Update Order Status: </label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    updateOrderField(selectedOrder._id, "orderStatus", e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {/* ✅ Update Payment Status */}
              {/* <div className="status-update">
                <label>Update Payment Status: </label>
                <select
                  value={selectedOrder.paymentStatus}
                  onChange={(e) =>
                    updateOrderField(selectedOrder._id, "paymentStatus", e.target.value)
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Failed">Failed</option>
                  <option value="Refunded">Refunded</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div> */}


              <div className="receipt-download">
                <button
                  className="download-btn"
                  onClick={() => downloadReceipt(selectedOrder._id)}
                >
                  Download Receipt
                </button>
              </div>

            </div>
          </div>
        )}
      </OrderModal>
    </div>
  );
};

export default Orders;
