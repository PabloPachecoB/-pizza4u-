import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsChart from '../../components/StatsChart';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d'); // '1d', '7d', '30d', '90d'

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data para estadísticas
  const stats = {
    overview: {
      totalOrders: 1247,
      totalRevenue: 89650,
      activeUsers: 456,
      avgOrderValue: 72,
      orderGrowth: 12.5,
      revenueGrowth: 18.3,
      userGrowth: 8.7,
      avgGrowth: 5.2
    },
    recentOrders: [
      {
        id: '#ORD-1001',
        customer: 'María González',
        items: 'Pizza Margarita x2, Coca Cola x1',
        total: 98,
        status: 'completed',
        time: '10 min ago'
      },
      {
        id: '#ORD-1002',
        customer: 'Carlos Mendoza',
        items: 'Pizza Pepperoni x1, Ensalada César x1',
        total: 84,
        status: 'preparing',
        time: '15 min ago'
      },
      {
        id: '#ORD-1003',
        customer: 'Ana Torres',
        items: 'Pasta Carbonara x1, Tiramisu x1',
        total: 63,
        status: 'delivered',
        time: '25 min ago'
      },
      {
        id: '#ORD-1004',
        customer: 'Luis Vega',
        items: 'Pizza Hawaiana x1, Bebida x2',
        total: 64,
        status: 'pending',
        time: '32 min ago'
      }
    ],
    topProducts: [
      { name: 'Pizza Margarita', sales: 156, revenue: 7020, trend: '+12%' },
      { name: 'Pizza Pepperoni', sales: 142, revenue: 7384, trend: '+8%' },
      { name: 'Pasta Carbonara', sales: 89, revenue: 3382, trend: '+15%' },
      { name: 'Ensalada César', sales: 67, revenue: 2144, trend: '+5%' },
      { name: 'Tiramisu', sales: 45, revenue: 1125, trend: '+22%' }
    ],
    chartData: {
      sales: [
        { name: 'Lun', ventas: 65, pedidos: 12 },
        { name: 'Mar', ventas: 78, pedidos: 15 },
        { name: 'Mié', ventas: 90, pedidos: 18 },
        { name: 'Jue', ventas: 81, pedidos: 16 },
        { name: 'Vie', ventas: 95, pedidos: 20 },
        { name: 'Sáb', ventas: 120, pedidos: 25 },
        { name: 'Dom', ventas: 110, pedidos: 22 }
      ],
      revenue: [
        { name: 'Ene', ingresos: 12500 },
        { name: 'Feb', ingresos: 14200 },
        { name: 'Mar', ingresos: 13800 },
        { name: 'Abr', ingresos: 15600 },
        { name: 'May', ingresos: 17200 },
        { name: 'Jun', ingresos: 16800 }
      ]
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      preparing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      completed: 'Completado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return texts[status] || status;
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando dashboard..." />;
  }

  return (
    <>
      <SEO 
        title="Dashboard - Admin Pizza4U"
        description="Panel de administración de Pizza4U"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Resumen general del negocio
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="1d">Último día</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="90d">Últimos 90 días</option>
                </select>
                
                <Button
                  variant="primary"
                  icon="fas fa-plus"
                  onClick={() => navigate('/admin/menu')}
                >
                  Nuevo Producto
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Pedidos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.totalOrders.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <i className="fas fa-arrow-up mr-1" />
                    +{stats.overview.orderGrowth}%
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <i className="fas fa-shopping-bag text-blue-600 dark:text-blue-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.overview.totalRevenue)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <i className="fas fa-arrow-up mr-1" />
                    +{stats.overview.revenueGrowth}%
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <i className="fas fa-dollar-sign text-green-600 dark:text-green-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Usuarios Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.overview.activeUsers}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <i className="fas fa-arrow-up mr-1" />
                    +{stats.overview.userGrowth}%
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <i className="fas fa-users text-purple-600 dark:text-purple-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ticket Promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.overview.avgOrderValue)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    <i className="fas fa-arrow-up mr-1" />
                    +{stats.overview.avgGrowth}%
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                  <i className="fas fa-chart-line text-orange-600 dark:text-orange-400 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatsChart
              data={stats.chartData.sales}
              type="line"
              title="Ventas por Día"
              subtitle="Pedidos y ventas de la semana"
              height={300}
            />
            
            <StatsChart
              data={stats.chartData.revenue}
              type="bar"
              title="Ingresos Mensuales"
              subtitle="Evolución de ingresos por mes"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pedidos Recientes
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/orders')}
                  icon="fas fa-eye"
                >
                  Ver Todos
                </Button>
              </div>

              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.id}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {order.items}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Productos Más Vendidos
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin/analytics')}
                  icon="fas fa-chart-bar"
                >
                  Ver Análisis
                </Button>
              </div>

              <div className="space-y-3">
                {stats.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.sales} ventas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {product.trend}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/orders')}
                icon="fas fa-shopping-bag"
                fullWidth
                className="p-4 h-auto flex-col space-y-2"
              >
                <span>Gestionar Pedidos</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/menu')}
                icon="fas fa-utensils"
                fullWidth
                className="p-4 h-auto flex-col space-y-2"
              >
                <span>Editar Menú</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/users')}
                icon="fas fa-users"
                fullWidth
                className="p-4 h-auto flex-col space-y-2"
              >
                <span>Usuarios</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/admin/analytics')}
                icon="fas fa-chart-line"
                fullWidth
                className="p-4 h-auto flex-col space-y-2"
              >
                <span>Análisis</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;