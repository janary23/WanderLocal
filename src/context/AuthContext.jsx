import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuth'));
  const [userRole, setUserRole]   = useState(localStorage.getItem('userRole') || null);
  const [userName, setUserName]   = useState(localStorage.getItem('userName') || 'User');

  const API_URL = 'http://localhost/WandereLocal/api';

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const role = data.user.role;
        const name = data.user.name;
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', name);
        setIsAuthenticated(true);
        setUserRole(role);
        setUserName(name);
        return { success: true, role };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error("Login fetch error:", e);
      return { success: false, message: 'Server error during login' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch(`${API_URL}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const uRole = data.user.role;
        const uName = data.user.name;
        localStorage.setItem('isAuth', 'true');
        localStorage.setItem('userRole', uRole);
        localStorage.setItem('userName', uName);
        setIsAuthenticated(true);
        setUserRole(uRole);
        setUserName(uName);
        return { success: true, role: uRole };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error("Register fetch error:", e);
      return { success: false, message: 'Server error during registration' };
    }
  };

  const logout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName('User');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userName, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
