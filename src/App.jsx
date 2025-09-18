import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AppProvider } from './context/AppContext';

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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
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

// Admin Routes Component
const AdminRoutes = () => (
  <AppLayout variant="admin">
    <Routes>
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute>
          <AdminOrders />
        </ProtectedRoute>
      } />
      <Route path="/admin/menu" element={
        <ProtectedRoute>
          <AdminMenuEditor />
        </ProtectedRoute>
      } />
      <Route path="/admin/videos" element={
        <ProtectedRoute>
          <AdminVideoUpload />
        </ProtectedRoute>
      } />
      <Route path="/admin/images" element={
        <ProtectedRoute>
          <AdminImageUpload />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AdminUserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute>
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      <Route path="/admin/scheduler" element={
        <ProtectedRoute>
          <AdminContentScheduler />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute>
          <AdminSendNotification />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  </AppLayout>
);

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <AppProvider>
                <Router>
                  <SEO />
                  <div id="app" className="antialiased">
                    <Suspense fallback={<LoadingSpinner size="lg" variant="spinner" fullScreen />}>
                      <Routes>
                        {/* User Routes */}
                        <Route path="/*" element={<UserRoutes />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/*" element={<AdminRoutes />} />
                      </Routes>
                    </Suspense>
                  </div>
                </Router>
              </AppProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;