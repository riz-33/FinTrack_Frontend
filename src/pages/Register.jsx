import React, { useState } from "react";
import api from "../services/api";
import Logo from "../assets/logo4.png";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar, CircularProgress } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    if (status.msg) setStatus({ type: "", msg: "" });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // setStatus({ type: "", msg: "" });

    try {
      const res = await api.post("/auth/register", formData);
      showToast("Registration successful!"); // Success Toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      console.log(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error"); // Error Toast
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="FinTrack Logo" src={Logo} className="mx-auto h-40 w-80" />
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block text-sm/6 font-medium text-gray-100">
              Username
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={loading}
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm/6 font-medium text-gray-100">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm/6 font-medium text-gray-100">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              disabled={loading}
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 disabled:opacity-50"
            />
          </div>

          <div className="mt-5">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" className="mr-2" />
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm/6 text-gray-400">
          Already have an account?
          <Link
            to="/"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {" "}
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
