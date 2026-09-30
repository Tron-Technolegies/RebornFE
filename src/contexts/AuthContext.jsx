import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { getServerUrl, getCsrfToken } from "../api/backendApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check the current Django session
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

        if (res.status === 401 || res.status === 403) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        throw new Error(`Server returned status ${res.status}`);
      } catch (err) {
        attempts++;

        if (attempts >= maxAttempts) {
          console.warn(
            "[Auth] Backend not reachable after maximum retries:",
            err
          );

          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }, []);

  // Login using Django session authentication
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
        console.warn("[Auth] Could not obtain CSRF token.");
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
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    if (data.success && data.user?.is_superuser) {
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    }

    throw new Error("Superuser access required.");
  };

  // Logout from Django session
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
      setUser(null);
      setIsAuthenticated(false);

      // Remove legacy authentication keys if they still exist
      localStorage.removeItem("app_unlocked");
      localStorage.removeItem("app_login_timestamp");
    }
  };

  useEffect(() => {
    // Remove old authentication state
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