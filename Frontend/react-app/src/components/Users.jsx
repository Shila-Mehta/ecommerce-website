import "../css/Basis.css";
import "../css/Users.css";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MySwal = withReactContent(Swal);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/signup");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users");
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/signup/${id}`, { method: "DELETE" });
        if (res.ok) {
          setUsers(users.filter((u) => u._id !== id));
          toast.success("User deleted");
        } else {
          throw new Error("Failed to delete user");
        }
      } catch (err) {
        console.error("Failed to delete user:", err);
        toast.error("Failed to delete user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setForm({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role || "customer",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editingUser) {
        res = await fetch(`/api/signup/${editingUser}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      if (editingUser) {
        setUsers(users.map((u) => (u._id === data._id ? data : u)));
        toast.success("User updated");
      } else {
        setUsers([...users, data]);
        toast.success("User added");
      }

      setEditingUser(null);
      setForm({ full_name: "", email: "", password: "", role: "customer" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
    }
  };

  const renderRoleBadge = (role) => {
    const roleClass =
      role === "admin" ? "role-badge role-admin" : "role-badge role-customer";
    return <span className={roleClass}>{role}</span>;
  };

  return (
    <div className="users-container">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="user-form">
        {/* <h2>{editingUser ? "Update User" : "Add User"}</h2> */}
        <input
          type="text"
          name="full_name"
          placeholder="Enter Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          type="password"
          name="password"
          placeholder={
            editingUser ? "Leave blank to keep password" : "Enter Password"
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editingUser}
        />

        <select
          name="role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <div className="form-actions">
          <button type="submit">
            {editingUser ? "Update User" : "Add User"}
          </button>
          {editingUser && (
            <button
              type="button"
              className="cancel"
              onClick={() => {
                setEditingUser(null);
                setForm({
                  full_name: "",
                  email: "",
                  password: "",
                  role: "customer",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Users Table */}
      {/* <h1>User List</h1> */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{renderRoleBadge(user.role)}</td>
                <td>
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
