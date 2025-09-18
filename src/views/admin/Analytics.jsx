import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsChart from '../../components/StatsChart';
import LoadingSpinner from '../../components/LoadingSpinner';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mock data para analytics
  const analyticsData = {
    overview: {
      totalRevenue: 156780,
      totalOrders: 2847,
      avgOrderValue: 55.12,
      customerRetention: 68.4,
      revenueGrowth: 15.3,
      orderGrowth: 12.8,
      avgGrowth: 8.7,
      retentionGrowth: 5.2
    },
    
    revenueData: [
      { name: 'Ene', ingresos: 12500, pedidos: 245, clientes: 189 },
      { name: 'Feb', ingresos: 14200, pedidos: 278, clientes: 201 },
      { name: 'Mar', ingresos: 13800, pedidos: 265, clientes: 195 },
      { name: 'Abr', ingresos: 15600, pedidos: 298, clientes: 223 },
      { name: 'May', ingresos: 17200, pedidos: 334, clientes: 245 },
      { name: 'Jun', ingresos: 16800, pedidos: 312, clientes: 234 }
    ],

    salesByCategory: [
      { name: 'Pizzas', value: 45, revenue: 71820 },
      { name: 'Pastas', value: 25, revenue: 39195 },
      { name: 'Ensaladas', value: 15, revenue: 23517 },
      { name: 'Bebidas', value: 10, revenue: 15678 },
      { name: 'Postres', value: 5, revenue: 7839 }
    ],

    topProducts: [
      { name: 'Pizza Margarita', sales: 423, revenue: 19035, growth: '+12%' },
      { name: 'Pizza Pepperoni', sales: 387, revenue: 20124, growth: '+8%' },
      { name: 'Pasta Carbonara', sales: 234, revenue: 8892, growth: '+15%' },
      { name: 'Pizza Hawaiana', sales: 198, revenue: 9504, growth: '+5%' },
      { name: 'Ensalada César', sales: 156, revenue: 4992, growth: '+22%' }
    ],

    customerSegments: [
      { name: 'Nuevos Clientes', value: 35, count: 287 },
      { name: 'Clientes Recurrentes', value: 45, count: 369 },
      { name: 'Clientes VIP', value: 20, count: 164 }
    ],

    ordersByHour: [
      { name: '11:00', pedidos: 8 },
      { name: '12:00', pedidos: 15 },
      { name: '13:00', pedidos: 25 },
      { name: '14:00', pedidos: 18 },
      { name: '15:00', pedidos: 12 },
      { name: '16:00', pedidos: 8 },
      { name: '17:00', pedidos: 10 },
      { name: '18:00', pedidos: 16 },
      { name: '19:00', pedidos: 28 },
      { name: '20:00', pedidos: 35 },
      { name: '21:00', pedidos: 32 },
      { name: '22:00', pedidos: 22 }
    ],

    deliveryStats: {
      avgDeliveryTime: 32,
      onTimeDelivery: 87,
      deliveryRadius: 5.2,
      deliveryRevenue: 67890
    },

    paymentMethods: [
      { name: 'Efectivo', value: 45, amount: 70551 },
      { name: 'Tarjeta', value: 35, amount: 54873 },
      { name: 'QR', value: 15, amount: 23517 },
      { name: 'Transferencia', value: 5, amount: 7839 }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const MetricCard = ({ title, value, change, icon, color, format = 'currency' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {format === 'currency' ? formatCurrency(value) : 
             format === 'percentage' ? formatPercentage(value) :
             format === 'number' ? value.toLocaleString() : value}
          </p>
          <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            <i className={`fas ${change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`} />
            {Math.abs(change).toFixed(1)}% vs mes anterior
          </p>
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <i className={`${icon} text-xl`} />
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando analytics..." />;
  }

  return (
    <>
      <SEO 
        title="Analytics - Admin Pizza4U"
        description="Análisis detallado del negocio y estadísticas"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Análisis detallado del rendimiento del negocio
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="7d">Últimos 7 días</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="90d">Últimos 3 meses</option>
                  <option value="1y">Último año</option>
                </select>
                
                <Button
                  variant="outline"
                  icon="fas fa-download"
                >
                  Exportar Reporte
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Ingresos Totales"
              value={analyticsData.overview.totalRevenue}
              change={analyticsData.overview.revenueGrowth}
              icon="fas fa-dollar-sign"
              color="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              format="currency"
            />
            
            <MetricCard
              title="Total de Pedidos"
              value={analyticsData.overview.totalOrders}
              change={analyticsData.overview.orderGrowth}
              icon="fas fa-shopping-bag"
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              format="number"
            />
            
            <MetricCard
              title="Ticket Promedio"
              value={analyticsData.overview.avgOrderValue}
              change={analyticsData.overview.avgGrowth}
              icon="fas fa-chart-line"
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              format="currency"
            />
            
            <MetricCard
              title="Retención de Clientes"
              value={analyticsData.overview.customerRetention}
              change={analyticsData.overview.retentionGrowth}
              icon="fas fa-users"
              color="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              format="percentage"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatsChart
              data={analyticsData.revenueData}
              type="line"
              title="Tendencia de Ingresos"
              subtitle="Ingresos y pedidos por mes"
              height={300}
            />
            
            <StatsChart
              data={analyticsData.salesByCategory}
              type="pie"
              title="Ventas por Categoría"
              subtitle="Distribución de ingresos por categoría"
              height={300}
            />
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <StatsChart
              data={analyticsData.ordersByHour}
              type="bar"
              title="Pedidos por Hora"
              subtitle="Distribución de pedidos durante el día"
              height={300}
            />
            
            <StatsChart
              data={analyticsData.customerSegments}
              type="pie"
              title="Segmentación de Clientes"
              subtitle="Distribución de tipos de clientes"
              height={300}
            />
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Products */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Productos Más Vendidos
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  icon="fas fa-external-link-alt"
                >
                  Ver Detalles
                </Button>
              </div>

              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.sales} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(product.revenue)}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {product.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Statistics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Estadísticas de Delivery
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <i className="fas fa-clock text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Tiempo Promedio
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tiempo de entrega
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {analyticsData.deliveryStats.avgDeliveryTime} min
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <i className="fas fa-check-circle text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Entregas a Tiempo
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cumplimiento de horarios
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatPercentage(analyticsData.deliveryStats.onTimeDelivery)}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                      <i className="fas fa-map-marker-alt text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Radio de Entrega
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Área de cobertura
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {analyticsData.deliveryStats.deliveryRadius} km
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                      <i className="fas fa-dollar-sign text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Ingresos Delivery
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total del período
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(analyticsData.deliveryStats.deliveryRevenue)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Métodos de Pago
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analyticsData.paymentMethods.map((method) => (
                <div key={method.name} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {formatPercentage(method.value)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {method.name}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(method.amount)}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Export and Actions */}
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              variant="outline"
              icon="fas fa-file-pdf"
            >
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              icon="fas fa-file-excel"
            >
              Exportar Excel
            </Button>
            <Button
              variant="primary"
              icon="fas fa-share"
            >
              Compartir Reporte
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;