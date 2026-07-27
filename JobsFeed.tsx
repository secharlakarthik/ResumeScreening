import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Notification } from "../types";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppContextType {
  user: User | null;
  token: string | null;
  theme: "light" | "dark";
  toasts: Toast[];
  commandPaletteOpen: boolean;
  notifications: Notification[];
  login: (token: string, user: User) => void;
  logout: () => void;
  toggleTheme: () => void;
  showToast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("rs_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("rs_token"));
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem("rs_theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    // System preferences fallback
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Apply theme class to root
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("rs_theme", theme);
  }, [theme]);

  // Sync token and user to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("rs_token", token);
    } else {
      localStorage.removeItem("rs_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("rs_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("rs_user");
    }
  }, [user]);

  // Fetch notifications regularly when logged in
  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user, token]);

  // Global Keyboard Shortcut: Ctrl+K or Cmd+K for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`, "success");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setNotifications([]);
    showToast("Logged out successfully.", "info");
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wrapper for all fetch calls with automatic token addition
  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const mergedOptions = { ...options, headers };
    const response = await fetch(endpoint, mergedOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "An error occurred on the server.");
    }
    return data;
  };

  const fetchNotifications = async () => {
    try {
      const data = await apiFetch("/api/notifications");
      setNotifications(data);
    } catch (err) {
      // Quietly log error to console without breaking user workflow
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markNotificationsRead = async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        theme,
        toasts,
        commandPaletteOpen,
        notifications,
        login,
        logout,
        toggleTheme,
        showToast,
        dismissToast,
        setCommandPaletteOpen,
        fetchNotifications,
        markNotificationsRead,
        apiFetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
