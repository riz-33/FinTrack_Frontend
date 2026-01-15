import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // If there is no user in context, redirect to Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user exists, render the child components (the app)
  return children;
};

export default ProtectedRoute;
