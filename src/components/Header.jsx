import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from './Button';

const Header = ({ variant = 'user' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth();
  const { getCartCount, toggleCart } = useCart();

  // Configuración de navegación según la variante
  const navigationConfig = {
    user: [
      { id: 'home', label: 'Inicio', icon: 'fas fa-home', path: '/' },
      { id: 'menu', label: 'Menú', icon: 'fas fa-utensils', path: '/menu' },
      { id: 'location', label: 'Ubicación', icon: 'fas fa-map-marker-alt', path: '/location' },
      { id: 'videos', label: 'Videos', icon: 'fas fa-video', path: '/videos' },
      { id: 'images', label: 'Galería', icon: 'fas fa-images', path: '/images' },
      { id: 'podcasts', label: 'Podcasts', icon: 'fas fa-podcast', path: '/podcasts' },
      { id: 'news', label: 'Noticias', icon: 'fas fa-newspaper', path: '/news' }
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', path: '/admin' },
      { id: 'orders', label: 'Pedidos', icon: 'fas fa-shopping-bag', path: '/admin/orders' },
      { id: 'menu-editor', label: 'Menú', icon: 'fas fa-edit', path: '/admin/menu' },
      { id: 'video-upload', label: 'Videos', icon: 'fas fa-video', path: '/admin/videos' },
      { id: 'image-upload', label: 'Imágenes', icon: 'fas fa-images', path: '/admin/images' },
      { id: 'users', label: 'Usuarios', icon: 'fas fa-users', path: '/admin/users' },
      { id: 'analytics', label: 'Análisis', icon: 'fas fa-chart-line', path: '/admin/analytics' },
      { id: 'notifications', label: 'Notificaciones', icon: 'fas fa-bell', path: '/admin/notifications' }
    ]
  };

  const navItems = navigationConfig[variant] || navigationConfig.user;
  const cartCount = getCartCount();

  // Detectar scroll para efectos visuales
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-menu-button')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setShowLoginModal(true);
    }
    setUserMenuOpen(false);
  };

  const switchToAdmin = () => {
    navigate('/admin');
    setUserMenuOpen(false);
  };

  const switchToUser = () => {
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
            : 'bg-white dark:bg-gray-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('/')}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="flex-shrink-0">
                  <img 
                    src="/src/assets/logo.png" 
                    alt="Pizza4U" 
                    className="h-10 w-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-10 w-10 bg-primary-500 rounded-lg items-center justify-center">
                    <span className="text-white font-bold text-lg">P4U</span>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                    Pizza4U
                  </span>
                  {variant === 'admin' && (
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                      Panel Administrativo
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActivePath(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                title={isDark ? 'Modo claro' : 'Modo oscuro'}
              >
                <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} />
              </button>

              {/* Cart (solo para vista de usuario) */}
              {variant === 'user' && (
                <button
                  onClick={toggleCart}
                  className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  title="Carrito de compras"
                >
                  <i className="fas fa-shopping-cart" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Admin Access Button - SIEMPRE VISIBLE */}
              <div className="block">
                {isAuthenticated && user?.role === 'admin' ? (
                  // Usuario admin logueado
                  variant === 'user' ? (
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={switchToAdmin}
                      icon="fas fa-cog"
                      className="pizza-btn-primary"
                    >
                      ADMIN
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={switchToUser}
                      icon="fas fa-store"
                    >
                      Sitio Web
                    </Button>
                  )
                ) : (
    // Acceso directo al admin (sin estar logueado)
    <Button
      variant="secondary"
      size="md"
      onClick={() => navigate('/admin')}
      icon="fas fa-cog"
      className="pizza-btn-primary"
    >
      ADMIN
    </Button>
  )}
</div>

              {/* User Menu */}
              <div className="relative user-menu">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </p>
                    </div>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="user-menu-button flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.avatar || user?.name?.charAt(0) || 'U'}
                      </div>
                      <i className={`fas fa-chevron-down text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1">
                        <div className="px-4 py-2 border-b dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                        </div>
                        
                        {variant === 'user' && (
                          <>
                            <button
                              onClick={() => handleNavigation('/favorites')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <i className="fas fa-heart" />
                              <span>Favoritos</span>
                            </button>
                            <button
                              onClick={() => handleNavigation('/orders')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                            >
                              <i className="fas fa-receipt" />
                              <span>Mis Pedidos</span>
                            </button>
                          </>
                        )}
                        
                        {user?.role === 'admin' && (
                          <button
                            onClick={variant === 'user' ? switchToAdmin : switchToUser}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                          >
                            <i className={`fas ${variant === 'user' ? 'fa-cog' : 'fa-store'}`} />
                            <span>{variant === 'user' ? 'Panel Admin' : 'Sitio Web'}</span>
                          </button>
                        )}
                        
                        <div className="border-t dark:border-gray-700 mt-1 pt-1">
                          <button
                            onClick={handleAuthAction}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                          >
                            <i className="fas fa-sign-out-alt" />
                            <span>Cerrar Sesión</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAuthAction}
                    icon="fas fa-sign-in-alt"
                  >
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                    <span className="sm:hidden">Login</span>
                  </Button>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-button md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
                  <span className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 mt-1 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`bg-current h-0.5 w-6 rounded-full transition-all duration-300 mt-1 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-menu md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Mobile Admin/User Switch */}
                {isAuthenticated && user?.role === 'admin' && (
                  <button
                    onClick={variant === 'user' ? switchToAdmin : switchToUser}
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <i className={`fas ${variant === 'user' ? 'fa-cog' : 'fa-store'}`} />
                    <span>{variant === 'user' ? 'Panel Admin' : 'Sitio Web'}</span>
                  </button>
                )}

            </nav>
          </div>
        </div>
      </header>

      {/* Spacer para fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;