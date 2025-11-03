import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpForm = ({ setSignUp, setLogin }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: ""
  });

  const updateState = () => {
    setLogin(true);
    setSignUp(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ User created successfully!", {
          autoClose: 1500,
          onClose: () => updateState() // switch after toast closes
        });
      } else {
        toast.error(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      toast.error(`❌ Server error: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Enter Your Full Name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Sign Up</button>

        <div className="form-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              updateState();
            }}
          >
            Already have an account? Log In
          </a>
        </div>
      </form>

      {/* Toast container lives here inside signup */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default SignUpForm;
