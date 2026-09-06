import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:3000/api';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          // You can also add a /me endpoint in backend to fetch current user info
          // const response = await axios.get('/auth/me');
          // setUser(response.data);
          
          // For MVP, just assume token means logged in, decode it if needed
          setUser({ loggedIn: true });
        } catch (error) {
          console.error("Token verification failed", error);
          logout();
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData || { loggedIn: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
