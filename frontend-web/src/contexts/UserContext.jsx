import { createContext, useContext, useState, useEffect } from 'react';
import { profileService } from '@/services/api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await profileService.getCurrentUser();

      if (response.success && response.data) {
        const userData = {
          id: response.data.id,
          username: response.data.username,
          displayName: response.data.displayName,
          totalXp: response.data.totalXp,
          level: response.data.level
        };
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');

    if (storedUserData && authToken) {
      try {
        setUser(JSON.parse(storedUserData));
        setLoading(false);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        fetchUser();
      }
    } else if (authToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
