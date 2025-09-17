import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';

const Header = ({ 
  variant = 'user', // 'user' | 'admin'
  currentView = 'home',
  onNavigate,
  onAdminClick 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth();
  const { getCartCount, toggleCart } = useCart();

  const userNavItems = [
    { id: 'home', label: 'Inicio', icon: 'fas fa-home' },
    { id: 'menu', label: 'Menú', icon: 'fas fa-utensils' },
    { id: 'location', label: 'Ubicación', icon: 'fas fa-map-marker-alt' },
    { id: 'videos', label: 'Videos', icon: 'fas fa-video' },
    { id: 'images', label: 'Galería', icon: 'fas fa-images' },
    { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast' },
    { id: 'news', label: 'Noticias', icon: 'fas fa-newspaper' }
  ];

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { id: 'orders', label: 'Pedidos', icon: 'fas fa-shopping-bag' },
    { id: 'menu-editor', label: 'Menú', icon: 'fas fa-edit' },
    { id: 'video-upload', label: 'Videos', icon: 'fas fa-video' },
    { id: 'image-upload', label: 'Imágenes', icon: 'fas fa-images' },
    { id: 'users', label: 'Usuarios', icon: 'fas fa-users' },
    { id: 'analytics', label: 'Análisis', icon: 'fas fa-chart-line' },
    { id: 'notifications', label: 'Notificaciones', icon: 'fas fa-bell' }
  ];

  const navItems = variant === 'admin' ? adminNavItems : userNavItems;
  const cartCount = getCartCount();

  const handleNavClick = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId);
    }
    setMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img 
                  src="/src/assets/logo.png" 
                  alt="Pizza4U" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P4U</span>
                </div>
              </div>
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                Pizza4U
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    currentView === item.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
              >
                <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
              </button>

              {/* Cart (solo para vista de usuario) */}
              {variant === 'user' && (
                <button
                  onClick={toggleCart}
                  className="relative p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Carrito"
                >
                  <i className="fas fa-shopping-cart" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Admin Switch (solo para vista de usuario si es admin) */}
              {variant === 'user' && isAuthenticated && user?.role === 'admin' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAdminClick}
                  icon="fas fa-cog"
                >
                  Admin
                </Button>
              )}

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                      </p>
                    </div>
                    <button
                      onClick={handleAuthAction}
                      className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      title="Cerrar sesión"
                    >
                      <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.avatar || user?.name?.charAt(0) || 'U'}
                      </div>
                      <i className="fas fa-sign-out-alt hidden sm:inline" />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAuthAction}
                    icon="fas fa-sign-in-alt"
                  >
                    Iniciar Sesión
                  </Button>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 border-t dark:border-gray-700">
          <nav className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;