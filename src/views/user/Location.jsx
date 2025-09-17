import React, { useState } from 'react';
import SEO from '../../components/SEO';
import MapViewer from '../../components/MapViewer';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Location = () => {
  const [selectedBranch, setSelectedBranch] = useState(0);

  // Información de las sucursales
  const branches = [
    {
      id: 1,
      name: 'Pizza4U Centro',
      address: 'Calle Principal 123, Centro, La Paz',
      phone: '+591 2 123-4567',
      email: 'centro@pizza4u.com',
      coordinates: { lat: -16.5000, lng: -68.1500 },
      hours: {
        monday: '11:00 - 23:00',
        tuesday: '11:00 - 23:00',
        wednesday: '11:00 - 23:00',
        thursday: '11:00 - 23:00',
        friday: '11:00 - 23:30',
        saturday: '11:00 - 23:30',
        sunday: '11:00 - 23:00'
      },
      services: [
        'Delivery',
        'Para llevar',
        'Comedor',
        'Reservas',
        'Eventos privados'
      ],
      features: [
        'Estacionamiento gratuito',
        'WiFi gratuito',
        'Accesible para discapacitados',
        'Área de juegos para niños',
        'Terraza al aire libre'
      ],
      image: '/restaurant-centro.jpg',
      isMain: true
    },
    {
      id: 2,
      name: 'Pizza4U Zona Sur',
      address: 'Av. Ballivián 456, Zona Sur, La Paz',
      phone: '+591 2 987-6543',
      email: 'zonasur@pizza4u.com',
      coordinates: { lat: -16.5300, lng: -68.1200 },
      hours: {
        monday: '11:00 - 22:30',
        tuesday: '11:00 - 22:30',
        wednesday: '11:00 - 22:30',
        thursday: '11:00 - 22:30',
        friday: '11:00 - 23:00',
        saturday: '11:00 - 23:00',
        sunday: '11:00 - 22:30'
      },
      services: [
        'Delivery',
        'Para llevar',
        'Comedor'
      ],
      features: [
        'Estacionamiento',
        'WiFi gratuito',
        'Área familiar'
      ],
      image: '/restaurant-zonasur.jpg'
    }
  ];

  const currentBranch = branches[selectedBranch];

  // Obtener día actual
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const getCurrentHours = () => {
    const currentDay = getCurrentDay();
    return currentBranch.hours[currentDay];
  };

  const isOpenNow = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const hours = getCurrentHours();
    
    if (!hours || hours === 'Cerrado') return false;
    
    const [openTime, closeTime] = hours.split(' - ');
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openTimeNum = openHour * 100 + openMin;
    const closeTimeNum = closeHour * 100 + closeMin;
    
    return currentTime >= openTimeNum && currentTime <= closeTimeNum;
  };

  const handleGetDirections = () => {
    const { lat, lng } = currentBranch.coordinates;
    const url = `https://www.google.com/maps/dir//${lat},${lng}/@${lat},${lng},17z`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${currentBranch.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${currentBranch.email}`;
  };

  const formatDay = (day) => {
    const days = {
      monday: 'Lunes',
      tuesday: 'Martes',
      wednesday: 'Miércoles',
      thursday: 'Jueves',
      friday: 'Viernes',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day];
  };

  return (
    <>
      <SEO 
        title="Ubicación - Pizza4U"
        description="Encuentra nuestras sucursales en La Paz, Bolivia. Dirección, horarios, teléfonos y cómo llegar a Pizza4U."
        keywords="ubicación, dirección, pizza4u, La Paz, Bolivia, restaurante, sucursales"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Nuestras Ubicaciones
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Visítanos en cualquiera de nuestras sucursales y disfruta de la mejor experiencia gastronómica
            </p>
          </div>

          {/* Branch Selector */}
          {branches.length > 1 && (
            <div className="flex justify-center mb-8">
              <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
                {branches.map((branch, index) => (
                  <button
                    key={branch.id}
                    onClick={() => setSelectedBranch(index)}
                    className={`px-6 py-3 font-medium transition-colors ${
                      selectedBranch === index
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {branch.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="order-2 lg:order-1">
              <Card className="p-0 overflow-hidden">
                <MapViewer
                  center={currentBranch.coordinates}
                  height="500px"
                  markers={[{
                    id: currentBranch.id,
                    position: currentBranch.coordinates,
                    title: currentBranch.name,
                    description: currentBranch.address
                  }]}
                />
              </Card>
            </div>

            {/* Branch Information */}
            <div className="order-1 lg:order-2 space-y-6">
              {/* Main Info */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentBranch.name}
                    </h2>
                    {currentBranch.isMain && (
                      <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                        Sucursal Principal
                      </span>
                    )}
                  </div>
                  
                  <div className={`flex items-center space-x-2 ${
                    isOpenNow() ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      isOpenNow() ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium">
                      {isOpenNow() ? 'Abierto ahora' : 'Cerrado'}
                    </span>
                  </div>
                </div>

                {/* Image */}
                <div className="mb-4">
                  <img
                    src={currentBranch.image}
                    alt={currentBranch.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/placeholder-restaurant.jpg';
                    }}
                  />
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-map-marker-alt text-primary-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dirección</p>
                      <p className="text-gray-600 dark:text-gray-400">{currentBranch.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fas fa-phone text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Teléfono</p>
                      <a 
                        href={`tel:${currentBranch.phone}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {currentBranch.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-primary-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a 
                        href={`mailto:${currentBranch.email}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {currentBranch.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <i className="fas fa-clock text-primary-500 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">
                        Horarios de Atención
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Hoy: {getCurrentHours()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button
                    variant="primary"
                    onClick={handleGetDirections}
                    icon="fas fa-directions"
                    fullWidth
                  >
                    Cómo llegar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCall}
                    icon="fas fa-phone"
                    fullWidth
                  >
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEmail}
                    icon="fas fa-envelope"
                    fullWidth
                  >
                    Email
                  </Button>
                </div>
              </Card>

              {/* Opening Hours */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Horarios Completos
                </h3>
                <div className="space-y-2">
                  {Object.entries(currentBranch.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className={`font-medium ${
                        getCurrentDay() === day ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {formatDay(day)}
                      </span>
                      <span className={`text-sm ${
                        getCurrentDay() === day ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Services */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Servicios Disponibles
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {currentBranch.services.map((service, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500 text-sm" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Comodidades
                </h3>
                <div className="space-y-2">
                  {currentBranch.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <i className="fas fa-star text-yellow-500 text-sm" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shipping-fast text-primary-600 dark:text-primary-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delivery Gratuito
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Delivery gratuito en pedidos mayores a Bs. 50 en un radio de 5km
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-utensils text-green-600 dark:text-green-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reservas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Acepta reservas para grupos grandes y eventos especiales
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-credit-card text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Métodos de Pago
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Efectivo, tarjetas de crédito/débito, QR y transferencias
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Location;