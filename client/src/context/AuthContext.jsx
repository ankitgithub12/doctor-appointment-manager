import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../api/services.js';
import { auth as firebaseAuth } from '../lib/firebase.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

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
      let firebaseToken = null;

      try {
        // 1. Try Firebase Authentication first
        const firebaseUserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        firebaseToken = await firebaseUserCredential.user.getIdToken();
      } catch (fbError) {
        // If user not found in Firebase or password invalid, fallback to legacy login
        if (fbError.code === 'auth/user-not-found' || fbError.code === 'auth/invalid-credential') {
          console.log('Firebase auth failed, attempting legacy backend authentication...');
          const response = await authService.loginLegacy({ email, password });
          if (response?.success && response?.token) {
            localStorage.setItem('homehub_token', response.token);
            setToken(response.token);
            setUser(response.user);
            return response.user;
          }
          throw new Error(response?.message || 'Login failed');
        }
        throw new Error(fbError.message || 'Firebase login failed');
      }

      // 2. Log in to backend using Firebase Token
      const response = await authService.login({ firebaseToken });
      if (response?.success && response?.token) {
        localStorage.setItem('homehub_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      }
      throw new Error(response?.message || 'Backend authentication failed');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password, phone, role) => {
    setLoading(true);
    let createdFirebaseUser = null;
    try {
      // 1. Register in Firebase Auth first
      const firebaseUserCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      createdFirebaseUser = firebaseUserCredential.user;
      const firebaseToken = await createdFirebaseUser.getIdToken();

      // 2. Register in backend
      const response = await authService.register({ name, email, phone, role, firebaseToken });
      if (response?.success && response?.token) {
        localStorage.setItem('homehub_token', response.token);
        setToken(response.token);
        setUser(response.user);
        return response.user;
      }
      throw new Error(response?.message || 'Registration failed');
    } catch (error) {
      // Rollback Firebase user if backend registration fails
      if (createdFirebaseUser) {
        try {
          await createdFirebaseUser.delete();
        } catch (deleteError) {
          console.error('Failed to rollback Firebase user registration:', deleteError);
        }
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    localStorage.removeItem('homehub_token');
    setToken(null);
    setUser(null);
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
    setLoading(false);
  };

  // Refresh/Load user profile
  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await authService.getMe();
      if (response?.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshUser,
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
