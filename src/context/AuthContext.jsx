import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    // Check if data exists and is NOT the literal string "undefined"
    if (savedUser && savedUser !== "undefined") {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        return null;
      }
    }
    return null;
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
