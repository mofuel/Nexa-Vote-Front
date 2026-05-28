import { createContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/api";


export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!token;
  const isAdmin = role === "admin";
  const login = (newToken, newUser, newRole) => {
    sessionStorage.setItem("token", newToken);
    if (newRole === "admin") {
      sessionStorage.setItem("admin_token", newToken);
      sessionStorage.setItem("admin", JSON.stringify(newUser));
    } else {
      sessionStorage.setItem("voter_id", newUser.id);
      sessionStorage.setItem("voter", JSON.stringify(newUser));
    }
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
  };
  const logout = () => {
    ["token", "admin_token", "voter", "admin", "voter_id"].forEach(
      (k) => sessionStorage.removeItem(k)
    );
    setToken(null);
    setUser(null);
    setRole(null);
  };
  useEffect(() => {
    (async () => {
      const saved =
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("admin_token");
      if (!saved) { setLoading(false); return; }
      try {
        const res = await getCurrentUser();
        if (res?.success) {
          const r = sessionStorage.getItem("admin_token") === saved ? "admin" : "voter";
          const u = JSON.parse(sessionStorage.getItem(r) || "null");
          setToken(saved); setUser(u); setRole(r);
        } else { logout(); }
      } catch { logout(); }
      finally { setLoading(false); }
    })();
  }, []);
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, []);
  return (
    <AuthContext.Provider value={{ user, token, role, isAuthenticated, isAdmin, loading, login, logout }}>
      {!loading ? children : <div className="auth-loading" />}
    </AuthContext.Provider>
  );
}