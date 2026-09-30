import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { getServerUrl, getCsrfToken } from "../api/backendApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // ── checkAuthStatus ───────────────────────────────────────────────────────
  // Checks the current Django session via GET /api/auth/me/
  const checkAuthStatus = useCallback(async () => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(getServerUrl("/api/auth/me/"), {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user?.is_superuser) {
            setUser(data.user);
            setIsAuthenticated(true);
            setLoading(false);
            return;
          }
        }

        // Response 401 or 403 means server answered and user is not an authenticated superuser
        if (res.status === 401 || res.status === 403) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Any other non-ok HTTP status (e.g. 502/503 during boot)
        throw new Error(`Server returned status ${res.status}`);
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn("[Auth] Backend not reachable after maximum retries:", err);
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  // Submits credentials to POST /api/auth/login/ using Django session auth
  const login = async (username, password) => {
    let csrfToken = getCsrfToken();
    if (!csrfToken) {
      try {
        await fetch(getServerUrl("/api/auth/csrf/"), {
          method: "GET",
          credentials: "include",
        });
        csrfToken = getCsrfToken();
      } catch (e) {
        // Fallback if csrf endpoint fails
      }
    }

    const headers = {
      "Content-Type": "application/json",
    };
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }

    const res = await fetch(getServerUrl("/api/auth/login/"), {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (data.success && data.user?.is_superuser) {
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } else {
      throw new Error("Superuser access required.");
    }
  };

  // ── logout ────────────────────────────────────────────────────────────────
  // Destroys the Django session via POST /api/auth/logout/
  const logout = async () => {
    try {
      const csrfToken = getCsrfToken();
      const headers = {
        "Content-Type": "application/json",
      };
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }

      await fetch(getServerUrl("/api/auth/logout/"), {
        method: "POST",
        credentials: "include",
        headers,
      });
    } catch (err) {
      console.error("[Auth] Logout request failed:", err);
    } finally {
      // Clear legacy storage keys if present
      localStorage.removeItem("app_unlocked");
      localStorage.removeItem("app_login_timestamp");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ── Mount effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Clear legacy localStorage keys to ensure clean state
    localStorage.removeItem("app_unlocked");
    localStorage.removeItem("app_login_timestamp");
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
