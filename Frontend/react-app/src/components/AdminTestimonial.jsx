import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminTestimonials.css";

const API_URL = "http://localhost:5000/api/testimonials";
const IMAGE_URL = "http://localhost:5000/uploads";

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [form, setForm] = useState({ name: "", comment: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      const data = await res.json();
      setTestimonials(data);
    } catch (error) {
      toast.error("Error fetching testimonials ❌");
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
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("comment", form.comment);
      if (form.image) formData.append("image", form.image);

      const url = editingTestimonial
        ? `${API_URL}/${editingTestimonial._id}`
        : API_URL;
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save testimonial");

      await fetchTestimonials();
      resetForm();

      toast.success(
        editingTestimonial
          ? "Testimonial updated successfully 🎉"
          : "Testimonial added successfully 🎉"
      );
    } catch (error) {
      toast.error("Error saving testimonial ❌");
    }
  };

  const resetForm = () => {
    setForm({ name: "", comment: "", image: null });
    setImagePreview(null);
    setEditingTestimonial(null);
    setShowModal(false);
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, comment: t.comment, image: null });
    setImagePreview(t.image ? `${IMAGE_URL}/${t.image}` : null);
    setEditingTestimonial(t);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This testimonial will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          if (!res.ok) throw new Error("Failed to delete testimonial");

          await fetchTestimonials();
          toast.success("Testimonial deleted ✅");
        } catch (error) {
          toast.error("Error deleting testimonial ❌");
        }
      }
    });
  };

  return (
    <div className="testimonials-page">
      {/* Toast container local */}
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="testimonials-header">
        <button className="testimonial-add-btn" onClick={() => setShowModal(true)}>
          <FiPlus size={18} /> Add Testimonial
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="testimonial-modal">
          <div className="testimonial-modal-content">
            <form onSubmit={handleSave}>
              <h3>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h3>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <textarea
                name="comment"
                placeholder="Comment"
                value={form.comment}
                onChange={handleChange}
                required
              ></textarea>

              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="testimonial-image-preview"
                />
              )}

              <div className="testimonial-modal-actions">
                <button type="submit" className="testimonial-save-btn">
                  {editingTestimonial ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  className="testimonial-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="testimonial-table-wrapper">
        <table className="testimonial-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Comment</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan="5" className="testimonial-empty-msg">
                  No testimonials available
                </td>
              </tr>
            ) : (
              testimonials.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{t.comment}</td>
                  <td>
                    {t.image ? (
                      <img
                        src={`${IMAGE_URL}/${t.image}`}
                        alt={t.name}
                        className="testimonial-table-img"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="testimonial-icon-btn edit"
                      onClick={() => handleEdit(t)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="testimonial-icon-btn delete"
                      onClick={() => confirmDelete(t._id)}
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
    </div>
  );
};

export default AdminTestimonials;
