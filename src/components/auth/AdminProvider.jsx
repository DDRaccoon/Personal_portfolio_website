"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AdminContext = createContext({ isAdmin: false, login: async () => false, logout: async () => {} });

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await response.json();
        if (!mounted) return;
        setIsAdmin(Boolean(data?.isAdmin));
      } catch {
        if (!mounted) return;
        setIsAdmin(false);
      } finally {
        if (mounted) setReady(true);
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (password) => {
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        return false;
      }

      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
    } catch {}
    setIsAdmin(false);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
