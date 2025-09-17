import React, { useState, useEffect } from 'react';
import Button from './Button';

const NotificationBanner = ({
  notifications = [],
  position = 'top', // 'top' | 'bottom'
  autoRotate = true,
  rotationInterval = 5000,
  showControls = true,
  dismissible = true,
  persistent = false,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Filtrar notificaciones no desestimadas
  const visibleNotifications = notifications.filter(
    notification => !dismissedIds.has(notification.id)
  );

  const currentNotification = visibleNotifications[currentIndex];

  // Auto rotación
  useEffect(() => {
    if (!autoRotate || visibleNotifications.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % visibleNotifications.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotationInterval, visibleNotifications.length, isPaused]);

  // Reset index si se queda fuera de rango
  useEffect(() => {
    if (currentIndex >= visibleNotifications.length && visibleNotifications.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, visibleNotifications.length]);

  // Cargar notificaciones desestimadas del localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('dismissedNotifications');
    if (dismissed) {
      try {
        setDismissedIds(new Set(JSON.parse(dismissed)));
      } catch (error) {
        console.error('Error loading dismissed notifications:', error);
      }
    }
  }, []);

  const handleDismiss = (notificationId) => {
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(notificationId);
    setDismissedIds(newDismissed);
    
    // Guardar en localStorage
    localStorage.setItem('dismissedNotifications', JSON.stringify([...newDismissed]));
    
    // Si era la última notificación, ocultar el banner
    if (visibleNotifications.length === 1) {
      setIsVisible(false);
    }
  };

  const handleNext = () => {
    if (visibleNotifications.length > 1) {
      setCurrentIndex(prev => (prev + 1) % visibleNotifications.length);
    }
  };

  const handlePrevious = () => {
    if (visibleNotifications.length > 1) {
      setCurrentIndex(prev => 
        prev === 0 ? visibleNotifications.length - 1 : prev - 1
      );
    }
  };

  const getNotificationStyles = (type) => {
    const styles = {
      info: 'bg-blue-600 border-blue-700',
      success: 'bg-green-600 border-green-700',
      warning: 'bg-yellow-600 border-yellow-700',
      error: 'bg-red-600 border-red-700',
      promotion: 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-700',
      announcement: 'bg-indigo-600 border-indigo-700'
    };
    return styles[type] || styles.info;
  };

  const getIcon = (type) => {
    const icons = {
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
      error: 'fas fa-exclamation-circle',
      promotion: 'fas fa-gift',
      announcement: 'fas fa-bullhorn'
    };
    return icons[type] || icons.info;
  };

  if (!isVisible || visibleNotifications.length === 0 || !currentNotification) {
    return null;
  }

  const positionClasses = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  return (
    <div
      className={`fixed left-0 right-0 z-40 ${positionClasses} ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`${getNotificationStyles(currentNotification.type)} text-white shadow-lg border-b-2 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Content */}
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Icon */}
              <div className="flex-shrink-0">
                <i className={`${getIcon(currentNotification.type)} text-lg`} />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                {currentNotification.title && (
                  <p className="font-semibold text-sm sm:text-base truncate">
                    {currentNotification.title}
                  </p>
                )}
                <p className={`${currentNotification.title ? 'text-sm' : 'text-sm sm:text-base'} opacity-90 ${currentNotification.title ? '' : 'truncate'}`}>
                  {currentNotification.message}
                </p>
              </div>

              {/* CTA Button */}
              {currentNotification.action && (
                <div className="flex-shrink-0 hidden sm:block">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={currentNotification.action.onClick}
                    className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                  >
                    {currentNotification.action.label}
                  </Button>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Navigation */}
              {showControls && visibleNotifications.length > 1 && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={handlePrevious}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Anterior"
                  >
                    <i className="fas fa-chevron-left text-sm" />
                  </button>
                  
                  <span className="text-xs opacity-75 px-2">
                    {currentIndex + 1}/{visibleNotifications.length}
                  </span>
                  
                  <button
                    onClick={handleNext}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    title="Siguiente"
                  >
                    <i className="fas fa-chevron-right text-sm" />
                  </button>
                </div>
              )}

              {/* Pause/Play */}
              {showControls && autoRotate && visibleNotifications.length > 1 && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  title={isPaused ? 'Reanudar' : 'Pausar'}
                >
                  <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'} text-sm`} />
                </button>
              )}

              {/* Dismiss */}
              {dismissible && !persistent && (
                <button
                  onClick={() => handleDismiss(currentNotification.id)}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  title="Cerrar"
                >
                  <i className="fas fa-times text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile CTA */}
          {currentNotification.action && (
            <div className="pb-3 sm:hidden">
              <Button
                size="sm"
                variant="secondary"
                onClick={currentNotification.action.onClick}
                fullWidth
                className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
              >
                {currentNotification.action.label}
              </Button>
            </div>
          )}

          {/* Progress indicator */}
          {autoRotate && visibleNotifications.length > 1 && !isPaused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white bg-opacity-30">
              <div 
                className="h-full bg-white transition-all linear"
                style={{
                  width: '100%',
                  animation: `progressBar ${rotationInterval}ms linear infinite`
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// Hook para usar notificaciones del banner
export const useNotificationBanner = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      type: 'info',
      ...notification
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };
};

export default NotificationBanner;