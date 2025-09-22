import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AppProvider } from './context/AppContext';
import { ProductsProvider } from './context/ProductsContext'; // ← NUEVO
import { VideosProvider } from './context/VideosContext';     // ← NUEVO

// Components
import SEO from './components/SEO';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy-loaded views
const HomeView = React.lazy(() => import('./views/user/Home'));
const MenuView = React.lazy(() => import('./views/user/Menu'));
const LocationView = React.lazy(() => import('./views/user/Location'));
const VideosView = React.lazy(() => import('./views/user/Videos'));
const ImagesView = React.lazy(() => import('./views/user/Images'));
const PodcastsView = React.lazy(() => import('./views/user/Podcasts'));
const CartView = React.lazy(() => import('./views/user/Cart'));
const CheckoutView = React.lazy(() => import('./views/user/Checkout'));
const FavoritesView = React.lazy(() => import('./views/user/Favorites'));
const OrderHistoryView = React.lazy(() => import('./views/user/OrderHistory'));
const NewsView = React.lazy(() => import('./views/user/News'));

// Admin views (lazy-loaded)
const AdminDashboard = React.lazy(() => import('./views/admin/Dashboard'));
const AdminOrders = React.lazy(() => import('./views/admin/Orders'));
const AdminMenuEditor = React.lazy(() => import('./views/admin/MenuEditor'));
const AdminVideoUpload = React.lazy(() => import('./views/admin/VideoUpload'));
const AdminImageUpload = React.lazy(() => import('./views/admin/ImageUpload'));
const AdminUserManagement = React.lazy(() => import('./views/admin/UserManagement'));
const AdminAnalytics = React.lazy(() => import('./views/admin/Analytics'));
const AdminContentScheduler = React.lazy(() => import('./views/admin/ContentScheduler'));
const AdminSendNotification = React.lazy(() => import('./views/admin/SendNotification'));

// Layout components
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CartSidebar from './components/CartSidebar';

// Protected Route Component - CORREGIDO
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'user:', user); // Debug
  
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Main App Layout
const AppLayout = ({ children, variant = 'user' }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header variant={variant} />
      <main className="pt-16">
        {children}
      </main>
      <Footer variant={variant} />
      <LoginModal />
      <CartSidebar />
    </div>
  );
};

// User Routes Component
const UserRoutes = () => (
  <AppLayout variant="user">
    <Routes>
      <Route path="/" element={<HomeView />} />
      <Route path="/menu" element={<MenuView />} />
      <Route path="/location" element={<LocationView />} />
      <Route path="/videos" element={<VideosView />} />
      <Route path="/images" element={<ImagesView />} />
      <Route path="/podcasts" element={<PodcastsView />} />
      <Route path="/cart" element={<CartView />} />
      <Route path="/checkout" element={<CheckoutView />} />
      <Route path="/favorites" element={<FavoritesView />} />
      <Route path="/orders" element={<OrderHistoryView />} />
      <Route path="/news" element={<NewsView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AppLayout>
);

// Admin Routes Component - SIMPLIFICADO para debug
const AdminRoutes = () => (
  <AppLayout variant="admin">
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/menu" element={<AdminMenuEditor />} />
      <Route path="/videos" element={<AdminVideoUpload />} />
      <Route path="/images" element={<AdminImageUpload />} />
      <Route path="/users" element={<AdminUserManagement />} />
      <Route path="/analytics" element={<AdminAnalytics />} />
      <Route path="/scheduler" element={<AdminContentScheduler />} />
      <Route path="/notifications" element={<AdminSendNotification />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AppLayout>
);

// Debug Component para verificar autenticación
const AuthDebug = () => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('AuthDebug - isAuthenticated:', isAuthenticated, 'user:', user);
  
  return null;
};

// Main App Component - CON NUEVOS PROVIDERS
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ProductsProvider>    {/* ← NUEVO PROVIDER */}
            <VideosProvider>    {/* ← NUEVO PROVIDER */}
              <CartProvider>
                <FavoritesProvider>
                  <AppProvider>
                    <Router>
                      <SEO />
                      <AuthDebug />
                      <div id="app" className="antialiased">
                        <Suspense fallback={<LoadingSpinner size="lg" variant="spinner" fullScreen />}>
                          <Routes>
                            {/* User Routes */}
                            <Route path="/*" element={<UserRoutes />} />
                            
                            {/* Admin Routes - SIN ProtectedRoute por ahora para debug */}
                            <Route path="/admin/*" element={<AdminRoutes />} />
                          </Routes>
                        </Suspense>
                      </div>
                    </Router>
                  </AppProvider>
                </FavoritesProvider>
              </CartProvider>
            </VideosProvider>
          </ProductsProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;