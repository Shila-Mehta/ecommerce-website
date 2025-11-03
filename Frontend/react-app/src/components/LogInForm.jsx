import { useState } from "react";
import "../css/Basis.css";
import "../css/LogInForm.css";
import { useNavigate } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogInForm = ({ setLogin, setSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ User logged in successfully!");
        setTimeout(() => {
          if (data.role === "admin") {
            localStorage.setItem("adminToken", data.token);
            navigate("/admin");
          } else {
            localStorage.setItem("customerToken", data.token);
            navigate("/");
          }
        }, 1500);
      } else {
        toast.error(`❌ Error: ${data.message}`);
      }

    } catch (err) {
      toast.error(`❌ Server error: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <input
          type="email"
          placeholder="Enter your Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign In</button>

        <div className="form-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLogin(false);
              setSignUp(true);
            }}
          >
            Don’t have an account? Sign Up
          </a>
        </div>
      </form>

      {/* Toast container (can move to App.jsx if used globally) */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LogInForm;
