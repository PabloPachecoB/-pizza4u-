import React, { createContext, useContext, useState } from 'react';
import { useNotifications } from './NotificationContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotifications();

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrador',
          role: 'admin',
          avatar: 'AD'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        
        addNotification({
          type: 'success',
          title: 'Bienvenido',
          message: `Hola ${userData.name}, sesión iniciada correctamente`
        });
        
        return { success: true };
      } else {
        addNotification({
          type: 'error',
          title: 'Error de autenticación',
          message: 'Credenciales incorrectas'
        });
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al conectar con el servidor'
      });
      return { success: false, message: 'Error de conexión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    addNotification({
      type: 'info',
      title: 'Sesión cerrada',
      message: 'Has cerrado sesión correctamente'
    });
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    showLoginModal,
    setShowLoginModal,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};