// src/context/GeolocationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const GeolocationContext = createContext();

export const useGeolocation = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};

export const GeolocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Función para obtener información adicional de la ubicación usando una API
  const getLocationInfo = async (lat, lon) => {
    try {
      // Usar API gratuita de geocodificación reversa
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`
      );
      const data = await response.json();
      
      return {
        country: data.countryName || 'Desconocido',
        countryCode: data.countryCode || 'XX',
        state: data.principalSubdivision || 'Desconocido',
        city: data.city || data.locality || 'Desconocido',
        address: data.localityInfo?.administrative?.[2]?.name || '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        full: data
      };
    } catch (error) {
      console.warn('Error getting location info:', error);
      return {
        country: 'Desconocido',
        countryCode: 'XX',
        state: 'Desconocido',
        city: 'Desconocido',
        address: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  };

  // Función para obtener la ubicación del usuario
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por este navegador');
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutos
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Obtener información adicional de la ubicación
          const locationInfo = await getLocationInfo(latitude, longitude);
          
          const locationData = {
            latitude,
            longitude,
            accuracy,
            timestamp: new Date().toISOString(),
            ...locationInfo
          };

          setLocation(locationData);
          setPermissionStatus('granted');
          
          // Guardar la ubicación para analytics
          await saveLocationData(locationData);
        } catch (error) {
          console.error('Error processing location:', error);
          setError('Error al procesar la ubicación');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permisos de ubicación denegados';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación';
            break;
        }
        setError(errorMessage);
        setPermissionStatus('denied');
        setLoading(false);
      },
      options
    );
  };

  // Función para guardar los datos de ubicación para analytics
  const saveLocationData = async (locationData) => {
    try {
      // Obtener datos del navegador y dispositivo
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const platform = navigator.platform;
      const screen = {
        width: window.screen.width,
        height: window.screen.height,
        colorDepth: window.screen.colorDepth
      };

      const analyticsData = {
        id: Date.now() + Math.random(),
        timestamp: locationData.timestamp,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          country: locationData.country,
          countryCode: locationData.countryCode,
          state: locationData.state,
          city: locationData.city,
          address: locationData.address,
          timezone: locationData.timezone
        },
        browser: {
          userAgent,
          language,
          platform,
          screen,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        },
        session: {
          referrer: document.referrer,
          url: window.location.href,
          sessionId: getOrCreateSessionId()
        }
      };

      // Guardar en localStorage (en producción esto debería ir a una base de datos)
      const existingData = JSON.parse(localStorage.getItem('pizza4u_analytics') || '[]');
      existingData.push(analyticsData);
      
      // Mantener solo los últimos 1000 registros para no sobrecargar localStorage
      if (existingData.length > 1000) {
        existingData.splice(0, existingData.length - 1000);
      }
      
      localStorage.setItem('pizza4u_analytics', JSON.stringify(existingData));

      // Aquí también podrías enviar los datos a tu backend
      // await sendAnalyticsToServer(analyticsData);
      
    } catch (error) {
      console.error('Error saving location data:', error);
    }
  };

  // Función para obtener o crear un ID de sesión
  const getOrCreateSessionId = () => {
    let sessionId = sessionStorage.getItem('pizza4u_session');
    if (!sessionId) {
      sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('pizza4u_session', sessionId);
    }
    return sessionId;
  };

  // Función para solicitar permisos de ubicación
  const requestLocation = async () => {
    try {
      // Verificar si ya tenemos permisos
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        if (permission.state === 'granted') {
          getCurrentLocation();
        } else if (permission.state === 'prompt') {
          getCurrentLocation();
        }
      } else {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      getCurrentLocation();
    }
  };

  // Función para obtener ubicación aproximada por IP (fallback)
  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const locationData = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 10000, // Menos precisión
          timestamp: new Date().toISOString(),
          country: data.country_name || 'Desconocido',
          countryCode: data.country_code || 'XX',
          state: data.region || 'Desconocido',
          city: data.city || 'Desconocido',
          address: '',
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          isIPLocation: true
        };
        
        setLocation(locationData);
        await saveLocationData(locationData);
      }
    } catch (error) {
      console.warn('Error getting location by IP:', error);
    }
  };

  // Efecto para obtener ubicación al cargar
  useEffect(() => {
    const initLocation = async () => {
      // Verificar si el usuario ya dio permisos anteriormente
      const hasLocationData = localStorage.getItem('pizza4u_analytics');
      
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setPermissionStatus(permission.state);
          
          if (permission.state === 'granted') {
            getCurrentLocation();
          } else {
            // Usar ubicación por IP como fallback
            await getLocationByIP();
            setLoading(false);
          }
        } catch (error) {
          await getLocationByIP();
          setLoading(false);
        }
      } else {
        await getLocationByIP();
        setLoading(false);
      }
    };

    initLocation();
  }, []);

  const value = {
    location,
    error,
    loading,
    permissionStatus,
    getCurrentLocation,
    requestLocation,
    getLocationByIP
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};