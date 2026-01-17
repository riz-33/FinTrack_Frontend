import React, { useState, useContext } from "react";
import api from "../services/api";
import Logo from "../assets/logo4.png";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar, CircularProgress } from "@mui/material";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState({ type: "success", msg: "" });

  const [formData, setFormData] = useState({
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
      const res = await api.post("/auth/login", formData);
      login(res.data);
      setStatus({ type: "success", msg: "Login successful!" });
      setOpen(true);
      // setTimeout(() => {
        // navigate("/dashboard");
      // }, 1500);
      console.log(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setStatus({ type: "error", msg: errorMsg });
      setOpen(true);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
        <Alert severity={status.type} variant="filled"
        style={{ width: "250px" }}
        >
          {status.msg}
        </Alert>
      </Snackbar>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="FinTrack Logo" src={Logo} className="mx-auto h-40 w-80" />
        <h2 className="mt-7 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm/6 font-medium text-gray-100">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={loading}
              // autoComplete="email"
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
              // autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500 disabled:opacity-50"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" className="mr-2" />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {" "}
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
