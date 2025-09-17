import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import StatsChart from '../../components/StatsChart';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Períodos disponibles
  const periods = [
    { id: 'today', label: 'Hoy' },
    { id: 'week', label: 'Esta semana' },
    { id: 'month', label: 'Este mes' },
    { id: 'year', label: 'Este año' }
  ];

  // Mock data para el dashboard
  const mockData = {
    stats: {
      todayOrders: 42,
      todayRevenue: 2150.75,
      monthlyOrders: 1289,
      monthlyRevenue: 67890.25,
      activeUsers: 3456,
      averageOrderValue: 51.25
    },
    recentOrders: [
      {
        id: 1001,
        customerName: 'Ana García',
        items: 3,
        total: 89.50,
        status: 'preparing',
        time: '10 min',
        delivery: 'delivery'
      },
      {
        id: 1002,
        customerName: 'Carlos López',
        items: 2,
        total: 45.25,
        status: 'ready',
        time: '2 min',
        delivery: 'pickup'
      },
      {
        id: 1003,
        customerName: 'María Rodríguez',
        items: 1,
        total: 38.00,
        status: 'delivered',
        time: '45 min',
        delivery: 'delivery'
      },
      {
        id: 1004,
        customerName: 'José Martínez',
        items: 4,
        total: 125.75,
        status: 'confirmed',
        time: '5 min',
        delivery: 'delivery'
      }
    ],
    salesData: [
      { name: 'Lun', ventas: 1200, pedidos: 24 },
      { name: 'Mar', ventas: 1900, pedidos: 38 },
      { name: 'Mié', ventas: 3000, pedidos: 60 },
      { name: 'Jue', ventas: 2800, pedidos: 56 },
      { name: 'Vie', ventas: 3900, pedidos: 78 },
      { name: 'Sáb', ventas: 4800, pedidos: 96 },
      { name: 'Dom', ventas: 3200, pedidos: 64 }
    ],
    popularProducts: [
      {
        id: 1,
        name: 'Pizza Margarita',
        sales: 156,
        revenue: 7020,
        image: '/pizza-margarita.jpg',
        trend: 'up'
      },
      {
        id: 2,
        name: 'Pizza Pepperoni',
        sales: 134,
        revenue: 6968,
        image: '/pizza-pepperoni.jpg',
        trend: 'up'
      },
      {
        id: 3,
        name: 'Pasta Carbonara',
        sales: 89,
        revenue: 3382,
        image: '/pasta-carbonara.jpg',
        trend: 'down'
      },
      {
        id: 4,
        name: 'Ensalada César',
        sales: 67,
        revenue: 2144,
        image: '/ensalada-cesar.jpg',
        trend: 'stable'
      }
    ],
    notifications: [
      {
        id: 1,
        type: 'order',
        message: 'Nuevo pedido #1001 recibido',
        time: '2 min',
        read: false
      },
      {
        id: 2,
        type: 'stock',
        message: 'Stock bajo: Mozzarella (5 kg restantes)',
        time: '15 min',
        read: false
      },
      {
        id: 3,
        type: 'review',
        message: 'Nueva reseña 5 estrellas de Ana García',
        time: '1 hora',
        read: true
      }
    ]
  };

  useEffect(() => {
    // Simular carga de datos
    setLoading(true);
    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getOrderStatusConfig = (status) => {
    const configs = {
      confirmed: { label: 'Confirmado', color: 'bg-blue-100 text-blue-800', icon: 'fas fa-clock' },
      preparing: { label: 'Preparando', color: 'bg-yellow-100 text-yellow-800', icon: 'fas fa-utensils' },
      ready: { label: 'Listo', color: 'bg-green-100 text-green-800', icon: 'fas fa-check' },
      delivered: { label: 'Entregado', color: 'bg-gray-100 text-gray-800', icon: 'fas fa-check-double' }
    };
    return configs[status] || configs.confirmed;
  };

  const getTrendIcon = (trend) => {
    const icons = {
      up: 'fas fa-arrow-up text-green-500',
      down: 'fas fa-arrow-down text-red-500',
      stable: 'fas fa-minus text-gray-500'
    };
    return icons[trend] || icons.stable;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Dashboard - Admin Pizza4U"
        description="Panel de administración de Pizza4U"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Resumen de tu restaurante
              </p>
            </div>
            
            {/* Period Selector */}
            <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden mt-4 sm:mt-0">
              {periods.map((period) => (
                <button
                  key={period.id}
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === period.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <i className="fas fa-shopping-bag text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pedidos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.stats.todayOrders}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <i className="fas fa-dollar-sign text-green-600 dark:text-green-400 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ingresos Hoy</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(dashboardData?.stats.todayRevenue)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <i className="fas fa-users text-purple-600 dark:text-purple-400 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dashboardData?.stats.activeUsers?.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <i className="fas fa-chart-line text-orange-600 dark:text-orange-400 text-xl" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Valor Promedio</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(dashboardData?.stats.averageOrderValue)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-2">
              <StatsChart
                title="Ventas de la Semana"
                subtitle="Ingresos y pedidos por día"
                data={dashboardData?.salesData}
                type="line"
                height={300}
              />
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pedidos Recientes
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                  icon="fas fa-external-link-alt"
                >
                  Ver Todos
                </Button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.recentOrders.map((order) => {
                  const statusConfig = getOrderStatusConfig(order.status);
                  return (
                    <div key={order.id} className="flex items-center justify-between py-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            #{order.id}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${statusConfig.color}`}>
                            <i className={`${statusConfig.icon} mr-1`} />
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {order.customerName} • {order.items} items • {order.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.delivery === 'delivery' ? 'Delivery' : 'Retiro'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Popular Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Productos Populares
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/analytics')}
                  icon="fas fa-chart-bar"
                >
                  Analytics
                </Button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.popularProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.sales} vendidos • {formatCurrency(product.revenue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <i className={getTrendIcon(product.trend)} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notificaciones
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/notifications')}
                  icon="fas fa-bell"
                >
                  Ver Todas
                </Button>
              </div>
              
              <div className="space-y-3">
                {dashboardData?.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className={`p-1 rounded-full ${
                      notification.type === 'order' ? 'bg-green-100 text-green-600' :
                      notification.type === 'stock' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <i className={`text-xs ${
                        notification.type === 'order' ? 'fas fa-shopping-bag' :
                        notification.type === 'stock' ? 'fas fa-exclamation-triangle' :
                        'fas fa-star'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/menu')}
                icon="fas fa-utensils"
                className="h-20 flex-col"
              >
                <span className="mt-2">Gestionar Menú</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/orders')}
                icon="fas fa-shopping-bag"
                className="h-20 flex-col"
              >
                <span className="mt-2">Ver Pedidos</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users')}
                icon="fas fa-users"
                className="h-20 flex-col"
              >
                <span className="mt-2">Usuarios</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
                icon="fas fa-chart-line"
                className="h-20 flex-col"
              >
                <span className="mt-2">Reportes</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;