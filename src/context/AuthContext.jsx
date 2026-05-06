import React, { createContext, useState, useContext } from 'react';
import * as api from '../services/api';


export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('isAuth'));
  const [userRole,  setUserRole]  = useState(localStorage.getItem('userRole')  || null);
  const [isHost,    setIsHost]    = useState(localStorage.getItem('isHost') === 'true');
  const [userName,  setUserName]  = useState(localStorage.getItem('userName')  || 'User');
  const [userId,    setUserId]    = useState(localStorage.getItem('userId')     || null);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || null);

  const _persist = (uid, name, email, role, is_host) => {
    localStorage.setItem('isAuth',    'true');
    localStorage.setItem('userId',    uid);
    localStorage.setItem('userName',  name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole',  role);
    localStorage.setItem('isHost',    String(is_host));
    setIsAuthenticated(true);
    setUserId(String(uid));
    setUserName(name);
    setUserEmail(email);
    setUserRole(role);
    setIsHost(is_host);
  };

  const loginWithUser = (user) => {
    _persist(user.id, user.name, user.email, user.role, user.is_host);
  };

  const loginWithGoogle = async (credential, role = 'traveler') => {
    try {
      const data = await api.googleAuth(credential, role);
      if (data.status === 'success') {
        const { id, name, email: em, role: r, is_host } = data.user;
        _persist(id, name, em, r, is_host);
        return { success: true, role: r, isHost: is_host };
      }
      return { success: false, message: data.message };
    } catch (e) {
      console.error('Google login error:', e);
      return { success: false, message: 'Server error during Google login' };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data.status === 'success') {
        const { id, name, email: em, role, is_host } = data.user;
        _persist(id, name, em, role, is_host);
        return { success: true, role, isHost: is_host };
      }
      return { success: false, message: data.message };
    } catch (e) {
      console.error('Login error:', e);
      return { success: false, message: 'Server error during login' };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const data = await api.register(name, email, password, role);
      if (data.status === 'success') {
        const { id, name: n, email: em, role: r, is_host } = data.user;
        _persist(id, n, em, r, is_host);
        return { success: true, role: r, isHost: is_host };
      }
      return { success: false, message: data.message };
    } catch (e) {
      console.error('Register error:', e);
      return { success: false, message: 'Server error during registration' };
    }
  };

  const switchRole = (newRole) => {
    localStorage.setItem('userRole', newRole);
    setUserRole(newRole);
  };

  const logout = () => {
    ['isAuth', 'userId', 'userRole', 'userName', 'userEmail', 'isHost'].forEach(k => localStorage.removeItem(k));
    setIsAuthenticated(false);
    setUserRole(null);
    setIsHost(false);
    setUserName('User');
    setUserId(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated, userRole, userName, userId, userEmail, isHost,
      login, loginWithGoogle, register, logout, switchRole, setIsHost, loginWithUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
