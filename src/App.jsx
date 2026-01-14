import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Accounts } from "./pages/Accounts";
import Transactions from "./pages/Transactions";
import { Budgets } from "./pages/Budgets";
// import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                // <ProtectedRoute>
                <Dashboard />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                // <ProtectedRoute>
                <Accounts />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                // <ProtectedRoute>
                <Transactions />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/budgets"
              element={
                // <ProtectedRoute>
                <Budgets />
                // </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
