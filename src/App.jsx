import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import CreateAccount from "./pages/CreateAccount";
import Transactions from "./pages/Transactions";
import CreateTransaction from "./pages/CreateTransaction";
import Budgets from "./pages/Budgets";
import CreateBudget from "./pages/CreateBudget";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <AuthProvider>
      <Analytics />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - Wrap the Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/add" element={<CreateAccount />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/add" element={<CreateTransaction />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/budgets/add" element={<CreateBudget />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
