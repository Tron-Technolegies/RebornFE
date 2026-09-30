import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { getServerUrl } from "../api/backendApi";

const STORAGE_KEY_UNLOCKED = "app_unlocked";
const STORAGE_KEY_LOGIN_TS = "app_login_timestamp";

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const expiryTimerRef = useRef(null);

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current !== null) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  };

  const clearLocalAuth = () => {
    clearExpiryTimer();

    localStorage.removeItem(STORAGE_KEY_UNLOCKED);
    localStorage.removeItem(STORAGE_KEY_LOGIN_TS);

    // If your backend stores a token, clear it here too.
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsAuthenticated(false);
  };

  const scheduleExpiry = (loginTimestampStr) => {
    if (!loginTimestampStr) {
      return false;
    }

    const loginTime = new Date(loginTimestampStr).getTime();

    if (isNaN(loginTime)) {
      return false;
    }

    const expiresAt = loginTime + SESSION_DURATION_MS;
    const msRemaining = expiresAt - Date.now();

    if (msRemaining <= 0) {
      return false;
    }

    clearExpiryTimer();

    expiryTimerRef.current = setTimeout(() => {
      console.info(
        "[Auth] 7-day session expired."
      );

      clearLocalAuth();
    }, msRemaining);

    return true;
  };

  // --------------------------------------------------
  // NORMAL LOGOUT
  // --------------------------------------------------
  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await fetch(getServerUrl("/api/logout/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {}),
        },
      });
    } catch (err) {
      console.error(
        "Backend logout failed:",
        err
      );
    } finally {
      // Logout locally even if backend request fails
      clearLocalAuth();
    }
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  const login = (success) => {
    if (!success) return;

    const now = new Date().toISOString();

    localStorage.setItem(
      STORAGE_KEY_UNLOCKED,
      "true"
    );

    localStorage.setItem(
      STORAGE_KEY_LOGIN_TS,
      now
    );

    setIsAuthenticated(true);

    scheduleExpiry(now);
  };

  // --------------------------------------------------
  // CHECK AUTH
  // --------------------------------------------------
  const checkAuthStatus = async () => {
    let attempts = 0;
    const maxAttempts = 30;

    while (attempts < maxAttempts) {
      try {
        const res = await fetch(
          getServerUrl("/api/settings/")
        );

        if (!res.ok) {
          throw new Error(
            "Server returned error status"
          );
        }

        const data = await res.json();

        setIsPasswordEnabled(
          data.is_password_enabled
        );

        if (!data.is_password_enabled) {
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }

        const storedUnlocked =
          localStorage.getItem(
            STORAGE_KEY_UNLOCKED
          ) === "true";

        const storedTimestamp =
          localStorage.getItem(
            STORAGE_KEY_LOGIN_TS
          );

        if (
          storedUnlocked &&
          storedTimestamp
        ) {
          const stillValid =
            scheduleExpiry(storedTimestamp);

          if (stillValid) {
            setIsAuthenticated(true);
          } else {
            clearLocalAuth();
          }
        } else {
          clearLocalAuth();
        }

        setLoading(false);
        return;
      } catch (err) {
        console.warn(
          `Backend not ready, retrying in 1s... (${attempts + 1}/${maxAttempts})`
        );

        attempts++;

        await new Promise((resolve) =>
          setTimeout(resolve, 1000)
        );
      }
    }

    console.error(
      "Failed to connect to backend."
    );

    setLoading(false);
  };

  useEffect(() => {
    checkAuthStatus();

    return () => {
      clearExpiryTimer();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isPasswordEnabled,
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

export const useAuth = () =>
  useContext(AuthContext);
