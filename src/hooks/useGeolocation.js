// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState({
    coordinates: null,
    address: null,
    city: null,
    country: null,
    countryCode: null,
    region: null,
    loading: true,
    error: null,
    permission: null
  });

  // API key para LocationIQ (puedes usar cualquier servicio de geocodificación)
  const LOCATIONIQ_API_KEY = 'tu_api_key_aqui';

  // Función para obtener ubicación por IP como fallback
  const getLocationByIP = async () => {
    try {
      // Usando ipapi.co como servicio gratuito
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        coordinates: {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: null
        },
        address: `${data.city}, ${data.region}, ${data.country_name}`,
        city: data.city,
        region: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        timezone: data.timezone,
        isp: data.org,
        method: 'ip'
      };
    } catch (error) {
      throw new Error('No se pudo obtener ubicación por IP');
    }
  };

  // Función para geocodificación inversa
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      
      return {
        address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        region: data.address?.state,
        country: data.address?.country,
        countryCode: data.address?.country_code
      };
    } catch (error) {
      // Fallback simple si no tenemos API key
      return {
        address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        city: 'Desconocida',
        region: 'Desconocida',
        country: 'Desconocido',
        countryCode: 'UN'
      };
    }
  };

  // Función principal para obtener ubicación
  const getCurrentLocation = async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));

    // Verificar si geolocation está disponible
    if (!navigator.geolocation) {
      try {
        const ipLocation = await getLocationByIP();
        setLocation({
          ...ipLocation,
          loading: false,
          error: null,
          permission: 'unavailable'
        });
        return ipLocation;
      } catch (error) {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Geolocalización no disponible',
          permission: 'unavailable'
        }));
        return null;
      }
    }

    // Intentar obtener ubicación precisa del navegador
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Obtener información de dirección
      const addressInfo = await reverseGeocode(latitude, longitude);
      
      const locationData = {
        coordinates: { latitude, longitude, accuracy },
        ...addressInfo,
        method: 'gps',
        loading: false,
        error: null,
        permission: 'granted'
      };

      setLocation(locationData);
      return locationData;

    } catch (error) {
      console.warn('Error obteniendo ubicación GPS:', error);
      
      // Fallback a ubicación por IP
      try {
        const ipLocation = await getLocationByIP();
        setLocation({
          ...ipLocation,
          loading: false,
          error: null,
          permission: error.code === 1 ? 'denied' : 'unavailable'
        });
        return ipLocation;
      } catch (ipError) {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'No se pudo obtener la ubicación',
          permission: error.code === 1 ? 'denied' : 'unavailable'
        }));
        return null;
      }
    }
  };

  // Obtener ubicación al montar el componente
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...location,
    refetch: getCurrentLocation
  };
};

export default useGeolocation;