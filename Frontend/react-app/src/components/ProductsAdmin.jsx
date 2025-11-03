import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "../css/ProductsAdmin.css";
import "../css/AdminForms.css";

const API_URL = "http://localhost:5000/api/products";
const IMAGE_URL = "http://localhost:5000/uploads";

const ProductsAdmin = ({ category = "all" }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    cost: "",
    image: null,
    category: "men",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error("❌ Error fetching products");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, image: file || null }));
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      formData.append("cost", form.cost);
      formData.append("category", form.category);
      if (form.image) formData.append("image", form.image);

      const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save product");

      await fetchProducts();
      resetForm();

      toast.success(
        editingProduct
          ? "✅ Product updated successfully!"
          : "✅ Product added successfully!"
      );
    } catch (error) {
      toast.error("❌ Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", price: "", stock: "", cost: "", image: null, category: "men" });
    setImagePreview(null);
    setEditingProduct(null);
    setShowModal(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      cost: product.cost,
      image: null,
      category: product.category || "men",
    });
    setImagePreview(product.image ? `${IMAGE_URL}/${product.image}` : null);
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete product");

          await fetchProducts();
          toast.success("🗑️ Product deleted successfully!");
        } catch (error) {
          toast.error("❌ Error deleting product");
        }
      }
    });
  };

  // 🔹 Filter products by selected category from sidebar
  const filteredProducts =
    category && category !== "all"
      ? products.filter((p) => p.category === category)
      : products;

  return (
    <div className="pa-page">
      <div className="pa-header">
        <button className="pa-add-btn" onClick={() => setShowModal(true)}>
          <FiPlus size={18} /> Add Product
        </button>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-body">
            <form onSubmit={handleSave} className="product-form-container">
              <div className="form-grid two-columns">
                <div className="form-group">
                  <label className="form-label required">
                    <span className="form-label-icon">📦</span>
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter product name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <span className="form-label-icon">💰</span>
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    placeholder="0.00"
                    value={form.price}
                    min="0"
                    step="0.01"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <span className="form-label-icon">📊</span>
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    className="form-input"
                    placeholder="0"
                    value={form.stock}
                    min="0"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <span className="form-label-icon">💵</span>
                    Cost Price
                  </label>
                  <input
                    type="number"
                    name="cost"
                    className="form-input"
                    placeholder="0.00"
                    value={form.cost}
                    min="0"
                    step="0.01"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label required">
                    <span className="form-label-icon">🏷️</span>
                    Category
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <span className="form-label-icon">🖼️</span>
                    Product Image
                  </label>
                  <div className="form-file-upload">
                    <input
                      type="file"
                      name="image"
                      className="form-file-input"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label className="form-file-label">
                      <span className="form-label-icon">📁</span>
                      {imagePreview ? "Change Image" : "Choose Image"}
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="image-preview">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="pa-preview-img"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="form-btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="form-btn primary"
                  disabled={isSubmitting}
                >
                  <span className="form-label-icon">💾</span>
                  {isSubmitting ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="pa-table-wrapper">
        <table className="pa-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="7" className="pa-empty-msg">
                  No products available
                </td>
              </tr>
            ) : (
              filteredProducts.map((product, i) => (
                <tr key={product._id}>
                  <td>{i + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{product.category}</td>
                  <td>
                    {product.image ? (
                      <img
                        src={`${IMAGE_URL}/${product.image}`}
                        alt={product.name}
                        className="pa-thumb-img"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="pa-icon-btn pa-edit"
                      onClick={() => handleEdit(product)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="pa-icon-btn pa-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default ProductsAdmin;
