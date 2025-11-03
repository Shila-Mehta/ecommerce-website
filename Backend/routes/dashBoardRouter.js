import express from "express";
import User from "../models/userModel.js";
import Product from "../models/productsModel.js";
import Order from "../models/OrderModel.js";

const router = express.Router();

// Helper function for error handling
const handleError = (res, err, context) => {
  console.error(`${context} error:`, err);
  res.status(500).json({ 
    error: "Failed to fetch dashboard data",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Validation helper
const validateData = (data, fallback) => data !== null && data !== undefined ? data : fallback;

// Metrics endpoint
router.get("/", async (req, res) => {
  try {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments()
    ]);

    const revenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    const revenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      usersCount: validateData(usersCount, 0),
      productsCount: validateData(productsCount, 0),
      ordersCount: validateData(ordersCount, 0),
      revenue: parseFloat(revenue.toFixed(2))
    });
  } catch (err) {
    handleError(res, err, "Metrics");
  }
});

// Recent orders
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "full_name email")
      .populate("items.product", "name imageUrl price")
      .lean();

    const recentOrders = orders.map(order => ({
      id: order._id,
      customer: order.user?.full_name || "Guest Customer",
      email: order.user?.email || "",
      products: order.items.map(item => ({
        id: item.product?._id || item._id,
        name: item.name || item.product?.name || "Unknown Product",
        image: item.image || item.product?.imageUrl || "/images/default-product.png",
        price: item.price || item.product?.price || 0,
        quantity: item.quantity || 1
      })),
      total: parseFloat((order.totalAmount || 0).toFixed(2)),
      status: order.orderStatus || "pending",
      date: order.createdAt || new Date(),
      shippingAddress: order.shippingAddress || {}
    }));

    res.json(recentOrders);
  } catch (err) {
    handleError(res, err, "Recent Orders");
  }
});

// Low stock products
router.get("/low-stock", async (req, res) => {
  try {
    const lowStockThreshold = parseInt(req.query.threshold) || 10;

    const lowStockProducts = await Product.find({
      stock: { $lt: lowStockThreshold },
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    })
      .select("name stock image price cost category")
      .sort({ stock: 1 })
      .limit(20)
      .lean();

    const enhancedProducts = lowStockProducts.map(product => ({
      id: product._id,
      name: product.name,
      stock: Number(product.stock),
      image: product.image || "/images/default-product.png",
      price: product.price,
      cost: product.cost,
      category: product.category,
      alertLevel: product.stock < 5 ? "critical" : "warning",
    }));

    res.json(enhancedProducts);
  } catch (err) {
    handleError(res, err, "Low Stock");
  }
});

// Profit analysis
router.get("/profit", async (req, res) => {
  try {
    const { year = new Date().getFullYear(), months = 12 } = req.query;
    
    const monthlyProfit = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(parseInt(year) - 1, 0, 1),
            $lte: new Date(parseInt(year), 11, 31)
          },
          orderStatus: { $nin: ["cancelled", "failed"] }
        }
      },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDoc"
        }
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          salePrice: { $ifNull: ["$items.price", "$productDoc.price", 0] },
          costPrice: { $ifNull: ["$items.cost", "$productDoc.cost", 0] },
          quantity: { $ifNull: ["$items.quantity", 1] },
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        }
      },
      {
        $addFields: {
          itemRevenue: { $multiply: ["$salePrice", "$quantity"] },
          itemCost: { $multiply: ["$costPrice", "$quantity"] },
          itemProfit: { $subtract: [{ $multiply: ["$salePrice", "$quantity"] }, { $multiply: ["$costPrice", "$quantity"] }] }
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          revenue: { $sum: "$itemRevenue" },
          cost: { $sum: "$itemCost" },
          profit: { $sum: "$itemProfit" },
          totalOrders: { $addToSet: "$_id" },
          totalItemsSold: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: { $round: ["$revenue", 2] },
          cost: { $round: ["$cost", 2] },
          profit: { $round: ["$profit", 2] },
          orderCount: { $size: "$totalOrders" },
          totalItemsSold: 1,
          profitMargin: {
            $cond: [
              { $eq: ["$revenue", 0] },
              0,
              { $round: [{ $multiply: [{ $divide: ["$profit", "$revenue"] }, 100] }, 2] }
            ]
          }
        }
      }
    ]);

    const formattedData = monthlyProfit.map(row => {
      const date = new Date(row.year, row.month - 1);
      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        monthShort: date.toLocaleDateString("en-US", { month: "short" }),
        year: row.year,
        monthNum: row.month,
        revenue: row.revenue,
        cost: row.cost,
        profit: row.profit,
        orderCount: row.orderCount,
        totalItemsSold: row.totalItemsSold,
        profitMargin: row.profitMargin
      };
    });

    // Fill missing months
    const completeData = [];
    const currentYear = new Date().getFullYear();
    const maxMonths = parseInt(months);

    for (let i = 0; i < maxMonths; i++) {
      const date = new Date(currentYear, new Date().getMonth() - i, 1);
      const yearVal = date.getFullYear();
      const monthVal = date.getMonth() + 1;

      const existing = formattedData.find(d => d.year === yearVal && d.monthNum === monthVal);
      completeData.unshift(existing || {
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        monthShort: date.toLocaleDateString("en-US", { month: "short" }),
        year: yearVal,
        monthNum: monthVal,
        revenue: 0,
        cost: 0,
        profit: 0,
        orderCount: 0,
        totalItemsSold: 0,
        profitMargin: 0
      });
    }

    res.json(completeData.reverse());
  } catch (err) {
    handleError(res, err, "Profit Analysis");
  }
});

// Quick stats
router.get("/quick-stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, pendingOrders, outOfStockProducts] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      Order.countDocuments({ orderStatus: "pending" }),
      Product.countDocuments({ stock: 0 })
    ]);

    res.json({ todayOrders, pendingOrders, outOfStockProducts });
  } catch (err) {
    handleError(res, err, "Quick Stats");
  }
});



// backend/routes/dashboard.js
router.get("/sales-trends", async (req, res) => {
  try {
    const period = req.query.period || "30days";
    const days = period === "7days" ? 7 : period === "90days" ? 90 : 30;
    const trends = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);

      const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
      const dailyRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      trends.push({
        date: date.toISOString().split("T")[0],
        dailyRevenue,
        orderCount: orders.length,
      });
    }

    res.json(trends);
  } catch (err) {
    console.error("Sales trends error:", err);
    res.status(500).json({ error: "Failed to fetch sales trends" });
  }
});


export default router;
