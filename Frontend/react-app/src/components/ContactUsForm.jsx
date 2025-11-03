import "../css/Basis.css";
import "../css/ContactUsForm.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast container (place in your App.jsx root once)
import { ToastContainer } from "react-toastify";

const ContactUsForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Message sent successfully ✅");
        setForm({ name: "", email: "", message: "" }); // reset form
      } else {
        toast.error("Error sending message ❌");
      }
    } catch (err) {
      toast.error("Something went wrong ⚠️");
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Contact Us</h1>
        <input
          type="text"
          name="name"
          placeholder="Enter Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Enter Your  Message "
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      {/* Toast container (you can also move this to App.jsx once) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ContactUsForm;
