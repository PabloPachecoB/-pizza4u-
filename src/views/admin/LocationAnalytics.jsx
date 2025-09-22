// src/views/admin/LocationAnalytics.jsx
import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatsChart from '../../components/StatsChart';
import MapViewer from '../../components/MapViewer';
import locationAnalytics from '../../services/locationAnalytics';

const LocationAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [mapData, setMapData] = useState([]);
  const [browserStats, setBrowserStats] = useState(null);
  const [businessInsights, setBusinessInsights] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all'); // 'all', '30d', '7d', '1d'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview'); // 'overview', 'map', 'insights', 'export'

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeRange]);

  const loadAnalyticsData = () => {
    setIsLoading(true);
    
    try {
      let data;
      
      if (selectedTimeRange !== 'all') {
        const days = {
          '1d': 1,
          '7d': 7,
          '30d': 30
        };
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days[selectedTimeRange]);
        const endDate = new Date();
        
        const filteredData = locationAnalytics.getDataByDateRange(
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        // Crear instancia temporal con datos filtrados
        const tempService = {
          getAllData: () => filteredData,
          getLocationStats: locationAnalytics.getLocationStats,
          getMapData: locationAnalytics.getMapData,
          getBrowserStats: locationAnalytics.getBrowserStats,
          getBusinessInsights: locationAnalytics.getBusinessInsights
        };
        
        // Bind methods to temp service
        Object.setPrototypeOf(tempService, locationAnalytics);
        data = tempService;
      } else {
        data = locationAnalytics;
      }

      const locationStats = data.getLocationStats();
      const mapLocations = data.getMapData();
      const browserData = data.getBrowserStats();
      const insights = data.getBusinessInsights();

      setStats(locationStats);
      setMapData(mapLocations);
      setBrowserStats(browserData);
      setBusinessInsights(insights);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = (format) => {
    try {
      const data = locationAnalytics.exportData(format);
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizza4u-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error al exportar datos');
    }
  };

  const handleCleanOldData = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar datos antiguos (>90 días)?')) {
      const result = locationAnalytics.cleanOldData(90);
      alert(`Se eliminaron ${result.removed} registros. Quedan ${result.remaining} registros.`);
      loadAnalyticsData();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: 'fas fa-chart-line' },
    { id: 'map', name: 'Mapa', icon: 'fas fa-map-marked-alt' },
    { id: 'insights', name: 'Insights', icon: 'fas fa-lightbulb' },
    { id: 'export', name: 'Exportar', icon: 'fas fa-download' }
  ];

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando analytics de ubicación..." />;
  }

  return (
    <>
      <SEO 
        title="Analytics de Ubicación - Admin Pizza4U"
        description="Análisis detallado de las ubicaciones de visitantes del sitio web"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  <i className="fas fa-map-marker-alt text-primary-500 mr-3" />
                  Analytics de Ubicación
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Análisis de visitantes por ubicación geográfica
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">Todo el tiempo</option>
                  <option value="30d">Últimos 30 días</option>
                  <option value="7d">Últimos 7 días</option>
                  <option value="1d">Último día</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Visitantes
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalVisits.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <i className="fas fa-users text-blue-600 dark:text-blue-400 text-xl" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ubicaciones Únicas
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.uniqueLocations}
                      </p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <i className="fas fa-map-marker-alt text-green-600 dark:text-green-400 text-xl" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Países
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Object.keys(stats.countries).length}
                      </p>
                    </div>
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                      <i className="fas fa-globe text-purple-600 dark:text-purple-400 text-xl" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ciudades
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Object.keys(stats.cities).length}
                      </p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                      <i className="fas fa-city text-orange-600 dark:text-orange-400 text-xl" />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Países
                  </h3>
                  <div className="space-y-3">
                    {stats.topCountries.slice(0, 5).map((country, index) => (
                      <div key={country.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {country.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {country.count}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({country.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Cities */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top Ciudades
                  </h3>
                  <div className="space-y-3">
                    {stats.topCities.slice(0, 5).map((city, index) => (
                      <div key={city.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {city.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {city.count}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            ({city.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Browser Stats */}
              {browserStats && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Navegadores
                    </h3>
                    <div className="space-y-2">
                      {browserStats.browsers.slice(0, 5).map((browser) => (
                        <div key={browser.name} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{browser.name}</span>
                          <span className="font-medium">{browser.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Idiomas
                    </h3>
                    <div className="space-y-2">
                      {browserStats.languages.slice(0, 5).map((language) => (
                        <div key={language.name} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{language.name}</span>
                          <span className="font-medium">{language.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Plataformas
                    </h3>
                    <div className="space-y-2">
                      {browserStats.platforms.slice(0, 5).map((platform) => (
                        <div key={platform.name} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">{platform.name}</span>
                          <span className="font-medium">{platform.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* Recent Visits */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Visitas Recientes
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Coordenadas
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Precisión
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {stats.recentVisits.slice(0, 10).map((visit) => (
                        <tr key={visit.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatDate(visit.timestamp)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {visit.location}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                            {visit.coordinates}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                            ±{Math.round(visit.accuracy)}m
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              visit.isIPLocation 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {visit.isIPLocation ? 'IP' : 'GPS'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Map Tab */}
          {selectedTab === 'map' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Mapa de Visitantes
                </h3>
                <div className="h-96">
                  <MapViewer
                    center={{ lat: -16.5, lng: -68.15 }} // La Paz, Bolivia
                    height="100%"
                    markers={mapData.map(location => ({
                      id: `${location.latitude}-${location.longitude}`,
                      position: { lat: location.latitude, lng: location.longitude },
                      title: `${location.city}, ${location.country}`,
                      description: `${location.count} visita${location.count !== 1 ? 's' : ''}`
                    }))}
                    showHeatmap={true}
                  />
                </div>
              </Card>

              {/* Location Summary */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen de Ubicaciones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mapData.slice(0, 9).map((location, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {location.city}, {location.country}
                        </h4>
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-2 py-1 rounded text-sm font-medium">
                          {location.count}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                        <p>Coordenadas: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                        <p>Última visita: {formatDate(location.lastVisit)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Business Insights Tab */}
          {selectedTab === 'insights' && businessInsights && (
            <div className="space-y-6">
              {/* Market Penetration */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-chart-pie text-primary-500 mr-2" />
                  Penetración de Mercado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {businessInsights.marketPenetration.bolivianPercentage}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Visitantes Bolivianos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {businessInsights.marketPenetration.internationalPercentage}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Visitantes Internacionales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {businessInsights.uniqueLocations}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Ubicaciones Únicas</div>
                  </div>
                </div>
              </Card>

              {/* Expansion Recommendations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-store text-primary-500 mr-2" />
                  Recomendaciones de Expansión
                </h3>
                <div className="space-y-4">
                  {businessInsights.expansionRecommendations.length > 0 ? (
                    businessInsights.expansionRecommendations.map((rec, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                        rec.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                        'border-green-500 bg-green-50 dark:bg-green-900/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {rec.location}
                          </h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                            'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          }`}>
                            Prioridad {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rec.reason}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Tipo: {rec.type === 'high_demand_city' ? 'Ciudad con alta demanda' : 'Cluster de ubicaciones'}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No hay suficientes datos para generar recomendaciones de expansión.
                      <br />
                      <small>Se necesitan al menos 10 visitas por ubicación.</small>
                    </p>
                  )}
                </div>
              </Card>

              {/* Top Markets */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-trophy text-primary-500 mr-2" />
                  Principales Mercados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {businessInsights.topMarkets.map((market, index) => (
                    <div key={index} className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {market.name}
                          </h4>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {market.count} visitas
                      </div>
                      <div className="text-sm text-primary-700 dark:text-primary-300">
                        {market.percentage}% del total
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visit Patterns */}
              {businessInsights.visitPatterns && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    <i className="fas fa-clock text-primary-500 mr-2" />
                    Patrones de Visitas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Horas Pico</h4>
                      <div className="space-y-2">
                        {businessInsights.visitPatterns.peakHours.map((hour, index) => (
                          <div key={hour.hour} className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              {hour.hour}:00 - {hour.hour + 1}:00
                            </span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-primary-500 h-2 rounded-full"
                                  style={{ 
                                    width: `${(hour.visits / businessInsights.visitPatterns.peakHours[0].visits) * 100}%` 
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium">{hour.visits}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Distribución por Hora</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p>Mayor actividad: {businessInsights.visitPatterns.peakHours[0].hour}:00</p>
                        <p>Visitas en hora pico: {businessInsights.visitPatterns.peakHours[0].visits}</p>
                        <p>
                          Recomendación: Considera promociones especiales durante las 
                          {businessInsights.visitPatterns.peakHours[0].hour < 12 ? ' mañanas' : 
                           businessInsights.visitPatterns.peakHours[0].hour < 18 ? ' tardes' : ' noches'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Export Tab */}
          {selectedTab === 'export' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-download text-primary-500 mr-2" />
                  Exportar Datos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Formatos Disponibles</h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => handleExportData('json')}
                        icon="fas fa-file-code"
                        fullWidth
                      >
                        Exportar como JSON
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExportData('csv')}
                        icon="fas fa-file-csv"
                        fullWidth
                      >
                        Exportar como CSV
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Administración de Datos</h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={handleCleanOldData}
                        icon="fas fa-broom"
                        fullWidth
                      >
                        Limpiar Datos Antiguos
                      </Button>
                      <Button
                        variant="outline"
                        onClick={loadAnalyticsData}
                        icon="fas fa-sync-alt"
                        fullWidth
                      >
                        Actualizar Datos
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    <i className="fas fa-info-circle mr-2" />
                    Información sobre los Datos
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Los datos se almacenan localmente en el navegador</li>
                    <li>• Para un análisis más robusto, considera implementar una base de datos</li>
                    <li>• Los datos incluyen ubicación geográfica, información del navegador y patrones de visita</li>
                    <li>• Se respeta la privacidad del usuario y se requiere consentimiento para la geolocalización</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <i className="fas fa-chart-bar text-primary-500 mr-2" />
                  Estadísticas de Almacenamiento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stats ? stats.totalVisits : 0}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Total Registros</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((JSON.stringify(locationAnalytics.getAllData()).length / 1024))}KB
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Tamaño de Datos</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {locationAnalytics.getAllData().length > 0 
                        ? Math.round((new Date() - new Date(locationAnalytics.getAllData()[0].timestamp)) / (1000 * 60 * 60 * 24))
                        : 0}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Días de Datos</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationAnalytics;