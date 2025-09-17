import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/helpers';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Detectar preferencia del sistema
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Inicializar tema desde localStorage o sistema
  const [theme, setTheme] = useState(() => {
    const savedTheme = storageUtils.get('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    return getSystemTheme();
  });

  const [isSystemTheme, setIsSystemTheme] = useState(() => {
    return !storageUtils.get('theme');
  });

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases anteriores
    root.classList.remove('light', 'dark');
    
    // Aplicar nueva clase
    root.classList.add(theme);
    
    // Actualizar meta theme-color para móviles
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#f97316');
    }
    
    // Guardar en localStorage si no es tema del sistema
    if (!isSystemTheme) {
      storageUtils.set('theme', theme);
    }
  }, [theme, isSystemTheme]);

  // Escuchar cambios en preferencia del sistema
  useEffect(() => {
    if (!isSystemTheme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [isSystemTheme]);

  // Toggle entre light y dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsSystemTheme(false);
    storageUtils.set('theme', newTheme);
  };

  // Establecer tema específico
  const setSpecificTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      setIsSystemTheme(false);
      storageUtils.set('theme', newTheme);
    }
  };

  // Usar tema del sistema
  const useSystemTheme = () => {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
    setIsSystemTheme(true);
    storageUtils.remove('theme');
  };

  // Obtener colores CSS actuales
  const getThemeColors = () => {
    if (typeof window === 'undefined') return {};
    
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      primary: computedStyle.getPropertyValue('--color-primary').trim(),
      background: computedStyle.getPropertyValue('--color-background').trim(),
      text: computedStyle.getPropertyValue('--color-text').trim(),
      border: computedStyle.getPropertyValue('--color-border').trim(),
    };
  };

  // Estado de preferencias
  const preferences = {
    theme,
    isSystemTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    systemTheme: getSystemTheme(),
    supportsSystemTheme: typeof window !== 'undefined' && window.matchMedia,
  };

  // Métodos para componentes
  const methods = {
    toggleTheme,
    setTheme: setSpecificTheme,
    useSystemTheme,
    getThemeColors,
  };

  // Utilidades para clases CSS
  const utils = {
    // Generar clases condicionales basadas en tema
    themeClasses: (lightClasses = '', darkClasses = '') => {
      return theme === 'light' ? lightClasses : darkClasses;
    },
    
    // Classes para elementos que necesitan comportamiento específico por tema
    adaptiveClasses: {
      background: 'bg-white dark:bg-gray-900',
      backgroundSecondary: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-900 dark:text-white',
      textSecondary: 'text-gray-600 dark:text-gray-400',
      textMuted: 'text-gray-500 dark:text-gray-500',
      border: 'border-gray-200 dark:border-gray-700',
      borderLight: 'border-gray-100 dark:border-gray-800',
      input: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white',
      card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      hover: 'hover:bg-gray-50 dark:hover:bg-gray-800',
      focus: 'focus:ring-primary-500 focus:border-primary-500',
    }
  };

  // Analytics para theme usage (opcional)
  const trackThemeChange = (newTheme, method = 'toggle') => {
    // Aquí podrías enviar analytics si necesitas
    if (process.env.NODE_ENV === 'development') {
      console.log(`Theme changed to: ${newTheme} via ${method}`);
    }
  };

  // Efectos para analytics
  useEffect(() => {
    trackThemeChange(theme, isSystemTheme ? 'system' : 'manual');
  }, [theme]);

  const value = {
    ...preferences,
    ...methods,
    ...utils,
    
    // Backward compatibility
    isDarkMode: theme === 'dark',
    isLightMode: theme === 'light',
    currentTheme: theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// HOC para componentes que necesitan tema
export const withTheme = (Component) => {
  return function ThemedComponent(props) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};

// Hook personalizado para clases CSS adaptativas
export const useThemeClasses = () => {
  const { adaptiveClasses, themeClasses } = useTheme();
  return { adaptiveClasses, themeClasses };
};

export default ThemeContext;