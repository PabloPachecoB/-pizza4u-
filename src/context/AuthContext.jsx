import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { authService } from '../supabase/client';

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
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Verificar sesión existente al cargar la app
  useEffect(() => {
    checkSession();
    
    // Escuchar cambios de autenticación de Supabase
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (session?.user) {
          // Usuario logueado con Supabase
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email.split('@')[0],
            role: session.user.user_metadata?.role || 'user',
            avatar: session.user.user_metadata?.avatar_url || session.user.email.charAt(0).toUpperCase()
          });
          setIsAuthenticated(true);
        } else {
          // Verificar si hay admin mock
          checkMockAdmin();
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      // Verificar sesión de Supabase
      const { session } = await authService.getCurrentSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email.split('@')[0],
          role: session.user.user_metadata?.role || 'user',
          avatar: session.user.user_metadata?.avatar_url || session.user.email.charAt(0).toUpperCase()
        });
        setIsAuthenticated(true);
      } else {
        // Verificar admin mock
        checkMockAdmin();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      checkMockAdmin();
    } finally {
      setLoading(false);
    }
  };

  const checkMockAdmin = () => {
    // Verificar si hay admin mock guardado
    const mockAdmin = localStorage.getItem('mockAdmin');
    if (mockAdmin) {
      try {
        const userData = JSON.parse(mockAdmin);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('mockAdmin');
      }
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      // Verificar si son credenciales de admin mock
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const userData = {
          id: 'admin-mock',
          username: 'admin',
          name: 'Administrador',
          email: 'admin@pizza4u.com',
          role: 'admin',
          avatar: 'AD'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        
        // Guardar en localStorage
        localStorage.setItem('mockAdmin', JSON.stringify(userData));
        
        addNotification({
          type: 'success',
          title: 'Bienvenido Admin',
          message: 'Has iniciado sesión como administrador'
        });
        
        return { success: true, user: userData };
      }

      // Login real con Supabase
      const { data, error } = await authService.signIn(
        credentials.email || credentials.username,
        credentials.password
      );

      if (error) {
        addNotification({
          type: 'error',
          title: 'Error de autenticación',
          message: error
        });
        return { success: false, error };
      }

      setShowLoginModal(false);
      
      addNotification({
        type: 'success',
        title: 'Bienvenido',
        message: `Hola ${data.user.email}, sesión iniciada correctamente`
      });

      return { success: true, user: data.user };

    } catch (error) {
      console.error('Login error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al conectar con el servidor'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Registro con Supabase
      const { data, error } = await authService.signUp(
        userData.email,
        userData.password,
        {
          name: userData.name,
          role: 'user'
        }
      );

      if (error) {
        addNotification({
          type: 'error',
          title: 'Error de registro',
          message: error
        });
        return { success: false, error };
      }

      addNotification({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Tu cuenta ha sido creada. Revisa tu email para verificarla.'
      });

      return { success: true, data };

    } catch (error) {
      console.error('Register error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al crear la cuenta'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    setLoading(true);
    try {
      const { error } = await authService.resetPassword(email);

      if (error) {
        addNotification({
          type: 'error',
          title: 'Error',
          message: error
        });
        return { success: false, error };
      }

      addNotification({
        type: 'success',
        title: 'Email enviado',
        message: 'Revisa tu bandeja de entrada para restablecer tu contraseña'
      });

      return { success: true };

    } catch (error) {
      console.error('Password reset error:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al enviar email de recuperación'
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // Si es admin mock, solo limpiar localStorage
      if (user?.id === 'admin-mock') {
        localStorage.removeItem('mockAdmin');
      } else {
        // Logout de Supabase
        await authService.signOut();
      }

      setUser(null);
      setIsAuthenticated(false);
      
      addNotification({
        type: 'info',
        title: 'Sesión cerrada',
        message: 'Has cerrado sesión correctamente'
      });

    } catch (error) {
      console.error('Logout error:', error);
      // Forzar logout local aunque falle en servidor
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('mockAdmin');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    showLoginModal,
    setShowLoginModal,
    login,
    register, // ← AGREGADA la función que faltaba
    requestPasswordReset, // ← AGREGADA
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};