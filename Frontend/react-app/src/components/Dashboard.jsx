import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "../css/Dashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [quickStats, setQuickStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    outOfStockProducts: 0,
  });
  const [salesTrends, setSalesTrends] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState("30days");
  const IMAGE_URL = "http://localhost:5000/uploads";

  const profitLegendRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [metricsRes, ordersRes, stockRes, profitRes, quickStatsRes, trendsRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/dashboard"),
            fetch("http://localhost:5000/api/dashboard/recent-orders"),
            fetch("http://localhost:5000/api/dashboard/low-stock"),
            fetch("http://localhost:5000/api/dashboard/profit"),
            fetch("http://localhost:5000/api/dashboard/quick-stats"),
            fetch(`http://localhost:5000/api/dashboard/sales-trends?period=${activePeriod}`),
          ]);

        if (!metricsRes.ok) throw new Error("Metrics fetch failed");
        if (!ordersRes.ok) throw new Error("Orders fetch failed");
        if (!stockRes.ok) throw new Error("Stock fetch failed");
        if (!profitRes.ok) throw new Error("Profit fetch failed");
        if (!quickStatsRes.ok) throw new Error("Quick stats fetch failed");
        if (!trendsRes.ok) throw new Error("Sales trends fetch failed");

        const metricsData = await metricsRes.json();
        const ordersData = await ordersRes.json();
        const stockData = await stockRes.json();
        const profitData = await profitRes.json();
        const quickStatsData = await quickStatsRes.json();
        const trendsData = await trendsRes.json();

        setMetrics(metricsData);
        setRecentOrders(Array.isArray(ordersData) ? ordersData : []);
        setLowStock(Array.isArray(stockData) ? stockData : []);
        setProfitData(Array.isArray(profitData) ? profitData : []);
        setQuickStats(quickStatsData);
        setSalesTrends(Array.isArray(trendsData) ? trendsData : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setFallbackData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePeriod]);

  const setFallbackData = () => {
    setMetrics({
      usersCount: 1542,
      productsCount: 287,
      ordersCount: 892,
      revenue: 125430,
    });
    setQuickStats({
      todayOrders: 12,
      pendingOrders: 8,
      outOfStockProducts: 3,
    });
    setProfitData(generateFallbackProfitData());
    setSalesTrends(generateFallbackSalesTrends());
    setLowStock([
      { name: "Product A", stock: 2, image: "/images/productA.jpg", alertLevel: "critical" },
      { name: "Product B", stock: 5, image: "/images/productB.jpg", alertLevel: "warning" },
    ]);
  };

  const generateFallbackProfitData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    return months.map((month, index) => ({
      month: `${month} ${currentYear}`,
      monthShort: month,
      year: currentYear,
      monthNum: index + 1,
      revenue: Math.floor(Math.random() * 10000) + 5000,
      cost: Math.floor(Math.random() * 6000) + 3000,
      profit: Math.floor(Math.random() * 4000) + 2000,
      orderCount: Math.floor(Math.random() * 50) + 20,
      totalItemsSold: Math.floor(Math.random() * 200) + 100,
      profitMargin: Math.floor(Math.random() * 30) + 10,
    }));
  };

  const generateFallbackSalesTrends = () => {
    const trends = [];
    const days = activePeriod === "7days" ? 7 : activePeriod === "90days" ? 90 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      trends.push({
        date: date.toISOString().split("T")[0],
        dailyRevenue: Math.floor(Math.random() * 5000) + 1000,
        orderCount: Math.floor(Math.random() * 20) + 5,
      });
    }
    return trends;
  };

  const toggleExpanded = (idx) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: "pending",
      completed: "completed",
      processing: "processing",
      cancelled: "cancelled",
      shipped: "shipped",
      delivered: "completed",
    };
    return `status-${statusMap[status.toLowerCase()] || "pending"}`;
  };

  // Profit Chart
  const profitChart = {
    labels: profitData.map((p) => p.monthShort),
    datasets: [
      {
        label: "Revenue",
        data: profitData.map((p) => p.revenue),
        fill: false,
        borderColor: "rgba(74, 108, 247, 1)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(74, 108, 247, 1)",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: "Profit",
        data: profitData.map((p) => p.profit),
        fill: true,
        backgroundColor: "rgba(58, 199, 146, 0.1)",
        borderColor: "rgba(58, 199, 146, 1)",
        borderWidth: 3,
        tension: 0.3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(58, 199, 146, 1)",
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const profitOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { display: true } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const salesTrendsChart = {
    labels: salesTrends.map((t) => {
      const date = new Date(t.date);
      return activePeriod === "7days"
        ? date.toLocaleDateString("en-US", { weekday: "short" })
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [
      {
        label: "Daily Revenue",
        data: salesTrends.map((t) => t.dailyRevenue),
        borderColor: "rgba(249, 151, 29, 1)",
        backgroundColor: "rgba(249, 151, 29, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const salesTrendsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } },
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Quick Stats */}
      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <div className="quick-stat-icon today">
            <i className="icon-calendar"></i>
          </div>
          <div className="quick-stat-content">
            <h3>Today's Orders</h3>
            <p className="quick-stat-number">{quickStats.todayOrders}</p>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon pending">
            <i className="icon-clock"></i>
          </div>
          <div className="quick-stat-content">
            <h3>Pending Orders</h3>
            <p className="quick-stat-number">{quickStats.pendingOrders}</p>
          </div>
        </div>
        <div className="quick-stat-card">
          <div className="quick-stat-icon out-of-stock">
            <i className="icon-alert"></i>
          </div>
          <div className="quick-stat-content">
            <h3>Out of Stock</h3>
            <p className="quick-stat-number">{quickStats.outOfStockProducts}</p>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <i className="icon-user"></i>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{metrics.usersCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products">
            <i className="icon-package"></i>
          </div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-number">{metrics.productsCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orders">
            <i className="icon-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>Orders</h3>
            <p className="stat-number">{metrics.ordersCount.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="icon-dollar"></i>
          </div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">${metrics.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Profit Analysis</h3>
          </div>
          <div className="chart-container">
            <Line data={profitChart} options={profitOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Sales Trends</h3>
            <div className="period-selector">
              <button
                className={`period-btn ${activePeriod === "7days" ? "active" : ""}`}
                onClick={() => setActivePeriod("7days")}
              >
                7D
              </button>
              <button
                className={`period-btn ${activePeriod === "30days" ? "active" : ""}`}
                onClick={() => setActivePeriod("30days")}
              >
                30D
              </button>
              <button
                className={`period-btn ${activePeriod === "90days" ? "active" : ""}`}
                onClick={() => setActivePeriod("90days")}
              >
                90D
              </button>
            </div>
          </div>
          <div className="chart-container">
            <Line data={salesTrendsChart} options={salesTrendsOptions} />
          </div>
        </div>
      </div>

      {/* Low Stock Products as Cards */}
      <div className="low-stock-section">
        <div className="section-header">
          <h3>Low Stock Products</h3>
        </div>
        {lowStock.length > 0 ? (
          <div className="low-stock-grid">
            {lowStock.map((product, idx) => (
              <div key={idx} className={`low-stock-card alert-${product.alertLevel}`}>
                <img
                  src={product.image.includes("http") ? product.image : `${IMAGE_URL}/${product.image}`}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/images/default-product.png")}
                />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>Stock: {product.stock}</p>
                  <span className="alert-level">{product.alertLevel.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-low-stock">
            <i className="icon-check"></i>
            <p>All products are sufficiently stocked</p>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="recent-section">
        <div className="section-header">
          <h3>Recent Orders</h3>
        </div>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => {
                const visibleProducts = order.products.slice(0, 3);
                const remaining = order.products.length - visibleProducts.length;
                return (
                  <tr key={order.id || idx}>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customer}</span>
                        {order.email && <span className="customer-email">{order.email}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="product-images">
                        {visibleProducts.map((p, i) => (
                          <img
                            key={i}
                            src={p.image.includes("http") ? p.image : `${IMAGE_URL}/${p.image}`}
                            alt={p.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.target.src = "/images/default-product.png";
                            }}
                          />
                        ))}
                        {remaining > 0 && !expandedOrders[idx] && (
                          <button className="more-btn" onClick={() => toggleExpanded(idx)}>
                            +{remaining}
                          </button>
                        )}
                      </div>
                      {expandedOrders[idx] && (
                        <div className="expanded-products">
                          {order.products.slice(3).map((p, i) => (
                            <img
                              key={i}
                              src={p.image.includes("http") ? p.image : `${IMAGE_URL}/${p.image}`}
                              alt={p.name}
                              className="product-thumb"
                              onError={(e) => {
                                e.target.src = "/images/default-product.png";
                              }}
                            />
                          ))}
                          <button className="more-btn" onClick={() => toggleExpanded(idx)}>
                            Show less
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="amount-cell">${order.total}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="date-cell">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <div className="no-orders">
              <i className="icon-package"></i>
              <p>No recent orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
