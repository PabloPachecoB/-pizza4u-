import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Button from './Button';

const MapViewer = ({
  center = { lat: -16.5000, lng: -68.1500 }, // La Paz, Bolivia
  zoom = 15,
  height = '400px',
  className = '',
  showDirections = true,
  showInfoWindow = true,
  markers = [],
  onMarkerClick,
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'your-api-key-here'
}) => {
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: true,
    scrollwheel: true,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  // Marcadores por defecto (restaurante)
  const defaultMarkers = [
    {
      id: 'restaurant',
      position: center,
      title: 'Pizza4U - Restaurante',
      description: 'Calle Principal 123, La Paz, Bolivia',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#f97316" stroke="#ea580c" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">P4U</text>
          </svg>
        `),
        scaledSize: { width: 40, height: 40 }
      }
    },
    ...markers
  ];

  const onLoad = useCallback((map) => {
    setMap(map);
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    mapRef.current = null;
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    if (onMarkerClick) {
      onMarkerClick(marker);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no soportada por este navegador');
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(userPos);
        setIsLocating(false);

        // Centrar el mapa en la ubicación del usuario
        if (map) {
          map.panTo(userPos);
          map.setZoom(16);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Información de ubicación no disponible');
            break;
          case error.TIMEOUT:
            setError('Tiempo de espera agotado');
            break;
          default:
            setError('Error desconocido al obtener ubicación');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const getDirections = () => {
    if (userLocation) {
      const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${center.lat},${center.lng}`;
      window.open(directionsUrl, '_blank');
    } else {
      const directionsUrl = `https://www.google.com/maps/dir//${center.lat},${center.lng}`;
      window.open(directionsUrl, '_blank');
    }
  };

  const centerOnRestaurant = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  };

  if (!apiKey || apiKey === 'your-api-key-here') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg p-6 text-center ${className}`} style={{ height }}>
        <i className="fas fa-map-marker-alt text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Mapa no disponible
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Configura tu API key de Google Maps para ver el mapa
        </p>
        <Button variant="outline" onClick={getDirections}>
          Ver en Google Maps
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 mr-2" />
            <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={getCurrentLocation}
          loading={isLocating}
          icon="fas fa-crosshairs"
          title="Mi ubicación"
          className="shadow-lg"
        />
        
        <Button
          variant="secondary"
          size="sm"
          onClick={centerOnRestaurant}
          icon="fas fa-home"
          title="Centrar en restaurante"
          className="shadow-lg"
        />
        
        {showDirections && (
          <Button
            variant="primary"
            size="sm"
            onClick={getDirections}
            icon="fas fa-directions"
            title="Cómo llegar"
            className="shadow-lg"
          />
        )}
      </div>

      {/* Google Map */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoom}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {/* Restaurant and custom markers */}
          {defaultMarkers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
              icon={marker.icon}
              onClick={() => handleMarkerClick(marker)}
            />
          ))}

          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Tu ubicación"
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
                    <circle cx="10" cy="10" r="3" fill="white"/>
                  </svg>
                `),
                scaledSize: { width: 20, height: 20 }
              }}
            />
          )}

          {/* Info Window */}
          {selectedMarker && showInfoWindow && (
            <InfoWindow
              position={selectedMarker.position}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {selectedMarker.title}
                </h3>
                {selectedMarker.description && (
                  <p className="text-gray-600 text-sm mb-2">
                    {selectedMarker.description}
                  </p>
                )}
                {selectedMarker.id === 'restaurant' && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">
                      <p><i className="fas fa-phone mr-1" /> +591 2 123-4567</p>
                      <p><i className="fas fa-clock mr-1" /> Lun-Dom: 11:00-23:00</p>
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={getDirections}
                      icon="fas fa-directions"
                    >
                      Cómo llegar
                    </Button>
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Map Footer */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 text-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Pizza4U - Calle Principal 123, La Paz
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Abierto todos los días de 11:00 AM a 11:00 PM
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;