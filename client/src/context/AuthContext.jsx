import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/services.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('homehub_token'));
  const [loading, setLoading] = useState(true);

  // Check auth state on reload
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        if (response?.success) {
          setUser(response.user);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error('Failed to load user session:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response?.success && response?.token) {
        localStorage.setItem('homehub_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      }
      throw new Error(response?.message || 'Login failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone) => {
    setLoading(true);
    try {
      const response = await authService.register({ name, email, password, phone });
      if (response?.success && response?.token) {
        localStorage.setItem('homehub_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('homehub_token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
