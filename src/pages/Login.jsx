import React, { useState } from "react";
import api from "../services/api";
import Logo from "../assets/logo2.png";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

export default function Login() {
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    try {
      const res = await api.post("/auth/login", formData);
      setStatus({ type: "success", msg: "Login successful!" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      console.log(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setStatus({ type: "error", msg: errorMsg });
    }
  };

  return (
    <div className="bg-gray-900 flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="FinTrack Logo" src={Logo} className="mx-auto h-50 w-80" />
        <h2 className="text-center text-2xl/9 font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {status.type && <Alert severity={status.type}>{status.msg}</Alert>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Not a member?
          <a
            href="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {" "}
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
