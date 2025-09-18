import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const SendNotification = () => {
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', 'error', 'promotion'
    audience: 'all', // 'all', 'customers', 'vip', 'new', 'inactive'
    channels: ['web'], // 'web', 'email', 'sms', 'push'
    scheduled: false,
    scheduledDate: '',
    scheduledTime: '',
    actionButton: {
      enabled: false,
      text: '',
      url: ''
    },
    image: '',
    priority: 'normal' // 'low', 'normal', 'high', 'urgent'
  });

  const [sentNotifications, setSentNotifications] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data para notificaciones enviadas
  const mockNotifications = [
    {
      id: 1,
      title: 'Nueva Pizza de Temporada',
      message: 'Prueba nuestra nueva pizza con trufa negra, disponible por tiempo limitado',
      type: 'promotion',
      audience: 'all',
      channels: ['web', 'email'],
      sentAt: '2024-01-15T10:30:00Z',
      status: 'sent',
      recipients: 1247,
      openRate: 68.5,
      clickRate: 12.3
    },
    {
      id: 2,
      title: 'Horarios Extendidos',
      message: 'Ahora abiertos hasta medianoche los fines de semana',
      type: 'info',
      audience: 'customers',
      channels: ['web', 'push'],
      sentAt: '2024-01-12T14:15:00Z',
      status: 'sent',
      recipients: 892,
      openRate: 54.2,
      clickRate: 8.7
    },
    {
      id: 3,
      title: 'Promoción Especial VIP',
      message: '20% de descuento en tu próximo pedido',
      type: 'promotion',
      audience: 'vip',
      channels: ['email', 'sms'],
      sentAt: '2024-01-10T16:45:00Z',
      status: 'sent',
      recipients: 156,
      openRate: 89.1,
      clickRate: 34.6
    }
  ];

  const notificationTypes = [
    { id: 'info', name: 'Información', color: 'bg-blue-100 text-blue-800', icon: 'fas fa-info-circle' },
    { id: 'success', name: 'Éxito', color: 'bg-green-100 text-green-800', icon: 'fas fa-check-circle' },
    { id: 'warning', name: 'Advertencia', color: 'bg-yellow-100 text-yellow-800', icon: 'fas fa-exclamation-triangle' },
    { id: 'error', name: 'Error', color: 'bg-red-100 text-red-800', icon: 'fas fa-exclamation-circle' },
    { id: 'promotion', name: 'Promoción', color: 'bg-purple-100 text-purple-800', icon: 'fas fa-gift' }
  ];

  const audienceOptions = [
    { id: 'all', name: 'Todos los usuarios', description: 'Enviar a toda la base de usuarios', count: 1247 },
    { id: 'customers', name: 'Clientes activos', description: 'Usuarios que han hecho pedidos', count: 892 },
    { id: 'vip', name: 'Clientes VIP', description: 'Clientes frecuentes y de alto valor', count: 156 },
    { id: 'new', name: 'Usuarios nuevos', description: 'Registrados en los últimos 30 días', count: 234 },
    { id: 'inactive', name: 'Usuarios inactivos', description: 'Sin actividad en 60+ días', count: 345 }
  ];

  const channelOptions = [
    { id: 'web', name: 'Notificación Web', description: 'Banner en el sitio web', icon: 'fas fa-globe' },
    { id: 'email', name: 'Email', description: 'Correo electrónico', icon: 'fas fa-envelope' },
    { id: 'sms', name: 'SMS', description: 'Mensaje de texto', icon: 'fas fa-sms' },
    { id: 'push', name: 'Push', description: 'Notificación push móvil', icon: 'fas fa-mobile-alt' }
  ];

  const priorityOptions = [
    { id: 'low', name: 'Baja', color: 'text-gray-600' },
    { id: 'normal', name: 'Normal', color: 'text-blue-600' },
    { id: 'high', name: 'Alta', color: 'text-orange-600' },
    { id: 'urgent', name: 'Urgente', color: 'text-red-600' }
  ];

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setSentNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field, value) => {
    setNotificationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChannelToggle = (channelId) => {
    setNotificationData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(ch => ch !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleActionButtonChange = (field, value) => {
    setNotificationData(prev => ({
      ...prev,
      actionButton: {
        ...prev.actionButton,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!notificationData.title.trim()) {
      errors.push('El título es requerido');
    }
    
    if (!notificationData.message.trim()) {
      errors.push('El mensaje es requerido');
    }
    
    if (notificationData.channels.length === 0) {
      errors.push('Selecciona al menos un canal');
    }
    
    if (notificationData.scheduled) {
      if (!notificationData.scheduledDate || !notificationData.scheduledTime) {
        errors.push('Fecha y hora son requeridas para notificaciones programadas');
      }
    }
    
    if (notificationData.actionButton.enabled) {
      if (!notificationData.actionButton.text.trim() || !notificationData.actionButton.url.trim()) {
        errors.push('Texto y URL son requeridos para el botón de acción');
      }
    }

    return errors;
  };

  const handleSendNotification = async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      alert('Errores:\n' + errors.join('\n'));
      return;
    }

    setIsSending(true);
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newNotification = {
        id: Date.now(),
        ...notificationData,
        sentAt: new Date().toISOString(),
        status: 'sent',
        recipients: audienceOptions.find(a => a.id === notificationData.audience)?.count || 0,
        openRate: Math.random() * 80 + 10, // Simular estadísticas
        clickRate: Math.random() * 30 + 5
      };
      
      setSentNotifications(prev => [newNotification, ...prev]);
      
      // Limpiar formulario
      setNotificationData({
        title: '',
        message: '',
        type: 'info',
        audience: 'all',
        channels: ['web'],
        scheduled: false,
        scheduledDate: '',
        scheduledTime: '',
        actionButton: { enabled: false, text: '', url: '' },
        image: '',
        priority: 'normal'
      });
      
      alert('Notificación enviada exitosamente');
      
    } catch (error) {
      alert('Error al enviar la notificación');
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeInfo = (type) => {
    return notificationTypes.find(t => t.id === type) || notificationTypes[0];
  };

  const NotificationPreview = () => (
    <Card className="p-4 border-2 border-dashed border-primary-300 dark:border-primary-700">
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-full ${getTypeInfo(notificationData.type).color}`}>
          <i className={`${getTypeInfo(notificationData.type).icon} text-sm`} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            {notificationData.title || 'Título de la notificación'}
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {notificationData.message || 'Mensaje de la notificación...'}
          </p>
          {notificationData.actionButton.enabled && notificationData.actionButton.text && (
            <Button
              size="sm"
              variant="primary"
              className="mt-2"
            >
              {notificationData.actionButton.text}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando notificaciones..." />;
  }

  return (
    <>
      <SEO 
        title="Envío de Notificaciones - Admin Pizza4U"
        description="Envía notificaciones a los usuarios del sistema"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Envío de Notificaciones
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Comunícate con tus usuarios a través de diferentes canales
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-chart-bar"
                >
                  Ver Estadísticas
                </Button>
                <Button
                  variant={previewMode ? 'primary' : 'outline'}
                  onClick={() => setPreviewMode(!previewMode)}
                  icon="fas fa-eye"
                >
                  {previewMode ? 'Ocultar' : 'Vista Previa'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Formulario de notificación */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Nueva Notificación
                </h2>

                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={notificationData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Ej: Nueva promoción disponible"
                      maxLength={100}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {notificationData.title.length}/100
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      value={notificationData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Escribe el mensaje de la notificación..."
                      maxLength={500}
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {notificationData.message.length}/500
                    </div>
                  </div>

                  {/* Tipo y Prioridad */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tipo
                      </label>
                      <select
                        value={notificationData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {notificationTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Prioridad
                      </label>
                      <select
                        value={notificationData.priority}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority.id} value={priority.id}>
                            {priority.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Audiencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Audiencia
                    </label>
                    <div className="space-y-2">
                      {audienceOptions.map(audience => (
                        <label key={audience.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="audience"
                            value={audience.id}
                            checked={notificationData.audience === audience.id}
                            onChange={(e) => handleInputChange('audience', e.target.value)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {audience.name}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {audience.count.toLocaleString()} usuarios
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {audience.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Canales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Canales de Envío
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {channelOptions.map(channel => (
                        <label key={channel.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationData.channels.includes(channel.id)}
                            onChange={() => handleChannelToggle(channel.id)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="flex items-center space-x-2">
                              <i className={`${channel.icon} text-gray-600 dark:text-gray-400`} />
                              <span className="font-medium text-gray-900 dark:text-white">
                                {channel.name}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {channel.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Programación */}
                  <div>
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={notificationData.scheduled}
                        onChange={(e) => handleInputChange('scheduled', e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Programar envío
                      </span>
                    </label>

                    {notificationData.scheduled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Fecha
                          </label>
                          <input
                            type="date"
                            value={notificationData.scheduledDate}
                            onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hora
                          </label>
                          <input
                            type="time"
                            value={notificationData.scheduledTime}
                            onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón de Acción */}
                  <div>
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={notificationData.actionButton.enabled}
                        onChange={(e) => handleActionButtonChange('enabled', e.target.checked)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Incluir botón de acción
                      </span>
                    </label>

                    {notificationData.actionButton.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Texto del botón
                          </label>
                          <input
                            type="text"
                            value={notificationData.actionButton.text}
                            onChange={(e) => handleActionButtonChange('text', e.target.value)}
                            placeholder="Ej: Ver promoción"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            URL de destino
                          </label>
                          <input
                            type="url"
                            value={notificationData.actionButton.url}
                            onChange={(e) => handleActionButtonChange('url', e.target.value)}
                            placeholder="https://ejemplo.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setNotificationData({
                        title: '',
                        message: '',
                        type: 'info',
                        audience: 'all',
                        channels: ['web'],
                        scheduled: false,
                        scheduledDate: '',
                        scheduledTime: '',
                        actionButton: { enabled: false, text: '', url: '' },
                        image: '',
                        priority: 'normal'
                      })}
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSendNotification}
                      loading={isSending}
                      disabled={isSending}
                      icon="fas fa-paper-plane"
                    >
                      {notificationData.scheduled ? 'Programar Envío' : 'Enviar Ahora'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Vista Previa */}
              {previewMode && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Vista Previa
                  </h3>
                  <NotificationPreview />
                </div>
              )}

              {/* Notificaciones Enviadas */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notificaciones Recientes
                </h3>

                <div className="space-y-3">
                  {sentNotifications.slice(0, 5).map((notification) => {
                    const typeInfo = getTypeInfo(notification.type);
                    return (
                      <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-start space-x-2 mb-2">
                          <div className={`p-1 rounded ${typeInfo.color}`}>
                            <i className={`${typeInfo.icon} text-xs`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notification.sentAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Enviados:</span>
                            <p className="font-medium">{notification.recipients}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Apertura:</span>
                            <p className="font-medium">{notification.openRate.toFixed(1)}%</p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Clicks:</span>
                            <p className="font-medium">{notification.clickRate.toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {sentNotifications.length > 5 && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      icon="fas fa-eye"
                    >
                      Ver Todas
                    </Button>
                  </div>
                )}
              </Card>

              {/* Estadísticas Rápidas */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Estadísticas del Mes
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Notificaciones enviadas:</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tasa de apertura promedio:</span>
                    <span className="font-semibold">68.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tasa de click promedio:</span>
                    <span className="font-semibold">15.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Usuarios alcanzados:</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendNotification;