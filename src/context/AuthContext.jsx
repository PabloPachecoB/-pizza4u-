import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { authService, supabase, profileService } from '../supabase/client';

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
          // Usuario logueado con Supabase - obtener datos completos del perfil
          await loadUserProfile(session.user);
        } else {
          // No hay sesión activa
          setLoading(false);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Cargar datos completos del perfil desde la base de datos
  const loadUserProfile = async (supabaseUser) => {
    try {
      // Intentar obtener datos del perfil desde la tabla 'profiles'
      const { data: profile, error } = await profileService.getProfile(supabaseUser.id);

      if (error || !profile) {
        console.log('Profile not found, using auth data:', error);
        // Si no hay perfil en la tabla, usar datos básicos de auth
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
          role: 'user', // role por defecto
          avatar: supabaseUser.email.charAt(0).toUpperCase()
        });
      } else {
        // Usar datos del perfil de la base de datos
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role || 'user',
          phone: profile.phone,
          avatar: profile.name ? profile.name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase(),
          created_at: profile.created_at
        });
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback a datos básicos si falla
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.name || supabaseUser.email.split('@')[0],
        role: 'user',
        avatar: supabaseUser.email.charAt(0).toUpperCase()
      });
      setIsAuthenticated(true);
    }
  };

  const checkSession = async () => {
    try {
      // Verificar admin mock primero (más rápido)
      const mockAdmin = localStorage.getItem('mockAdmin');
      if (mockAdmin) {
        try {
          const userData = JSON.parse(mockAdmin);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          return;
        } catch (error) {
          localStorage.removeItem('mockAdmin');
        }
      }

      // Verificar sesión de Supabase
      const { session } = await authService.getCurrentSession();
      
      if (session?.user) {
        await loadUserProfile(session.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
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
        
        return { success: true, user: userData, isAdmin: true };
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

      // Cargar perfil completo del usuario
      await loadUserProfile(data.user);

      setShowLoginModal(false);
      
      // Verificar si el usuario es admin para mensaje personalizado
      const { data: profile } = await profileService.getProfile(data.user.id);
      const isAdmin = profile?.role === 'admin';

      addNotification({
        type: 'success',
        title: isAdmin ? 'Bienvenido Administrador' : 'Bienvenido',
        message: isAdmin 
          ? 'Acceso al panel administrativo concedido' 
          : `Hola ${data.user.email}, sesión iniciada correctamente`
      });

      return { success: true, user: data.user, isAdmin };

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