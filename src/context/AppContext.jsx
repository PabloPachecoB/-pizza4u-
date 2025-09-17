import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('website'); // 'website' | 'admin'
  const [currentAdminView, setCurrentAdminView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value = {
    // Vista actual
    currentView,
    setCurrentView,
    
    // Vista admin actual
    currentAdminView,
    setCurrentAdminView,
    
    // Estado del sidebar
    sidebarOpen,
    setSidebarOpen,
    
    // Funciones de navegación
    switchToWebsite: () => setCurrentView('website'),
    switchToAdmin: () => setCurrentView('admin'),
    navigateAdmin: (view) => setCurrentAdminView(view),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};