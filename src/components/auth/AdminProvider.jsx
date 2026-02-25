"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ADMIN_KEY = "portfolio_admin";
const ADMIN_HASH = "MEIYOUmima007";

const AdminContext = createContext({ isAdmin: false, login: () => false, logout: () => {} });

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(sessionStorage.getItem(ADMIN_KEY) === ADMIN_HASH);
  }, []);

  const login = useCallback((password) => {
    if (password === ADMIN_HASH) {
      sessionStorage.setItem(ADMIN_KEY, ADMIN_HASH);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
