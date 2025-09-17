import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../../components/SEO';
import Button from '../../components/Button';
import Card from '../../components/Card';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'fas fa-utensils',
      title: 'Menú Delicioso',
      description: 'Descubre nuestras pizzas artesanales con ingredientes frescos y sabores únicos.',
      action: () => navigate('/menu'),
      color: 'text-orange-500'
    },
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Ubicación',
      description: 'Encuéntranos en el corazón de La Paz y disfruta de nuestro ambiente acogedor.',
      action: () => navigate('/location'),
      color: 'text-blue-500'
    },
    {
      icon: 'fas fa-video',
      title: 'Videos',
      description: 'Mira cómo preparamos nuestras pizzas y conoce nuestro proceso artesanal.',
      action: () => navigate('/videos'),
      color: 'text-purple-500'
    },
    {
      icon: 'fas fa-images',
      title: 'Galería',
      description: 'Explora nuestra galería de imágenes y déjate tentar por nuestros platos.',
      action: () => navigate('/images'),
      color: 'text-green-500'
    },
    {
      icon: 'fas fa-podcast',
      title: 'Podcasts',
      description: 'Escucha historias sobre gastronomía y conoce los secretos de la cocina.',
      action: () => navigate('/podcasts'),
      color: 'text-red-500'
    },
    {
      icon: 'fas fa-newspaper',
      title: 'Noticias',
      description: 'Mantente al día con nuestras últimas novedades y promociones especiales.',
      action: () => navigate('/news'),
      color: 'text-indigo-500'
    }
  ];

  const popularItems = [
    {
      id: 1,
      name: 'Pizza Margarita',
      price: 45,
      image: '/pizza-margarita.jpg',
      description: 'Tomate, mozzarella y albahaca fresca'
    },
    {
      id: 2,
      name: 'Pizza Pepperoni',
      price: 52,
      image: '/pizza-pepperoni.jpg',
      description: 'Pepperoni, mozzarella y salsa de tomate'
    },
    {
      id: 3,
      name: 'Pizza Hawaiana',
      price: 48,
      image: '/pizza-hawaiana.jpg',
      description: 'Jamón, piña y mozzarella'
    }
  ];

  return (
    <>
      <SEO 
        title="Pizza4U - Inicio"
        description="Bienvenido a Pizza4U, las mejores pizzas artesanales de La Paz. Descubre nuestro menú, ubicación, videos y más."
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute inset-0 bg-hero-pattern"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in">
              Bienvenido a Pizza4U
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Las mejores pizzas artesanales de La Paz, hechas con ingredientes frescos y mucho amor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/menu')}
                icon="fas fa-utensils"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Ver Menú
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/location')}
                icon="fas fa-map-marker-alt"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Nuestra Ubicación
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Descubre Nuestra Experiencia
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Explora todo lo que Pizza4U tiene para ofrecerte
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  hover
                  className="p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300"
                  onClick={feature.action}
                >
                  <div className={`inline-flex p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-4 ${feature.color}`}>
                    <i className={`${feature.icon} text-2xl`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {feature.description}
                  </p>
                  <Button variant="ghost" size="sm" icon="fas fa-arrow-right">
                    Explorar
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Items Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Nuestras Pizzas Más Populares
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Prueba nuestras especialidades favoritas de los clientes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularItems.map((item) => (
                <Card key={item.id} hover className="overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-pizza.jpg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        Bs. {item.price}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/menu')}
                        icon="fas fa-plus"
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/menu')}
                icon="fas fa-utensils"
              >
                Ver Menú Completo
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              ¿Listo para ordenar?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Haz tu pedido ahora y disfruta de nuestras deliciosas pizzas en la comodidad de tu hogar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/menu')}
                icon="fas fa-shopping-cart"
                className="bg-white text-primary-600 hover:bg-gray-100"
              >
                Ordenar Ahora
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/location')}
                icon="fas fa-phone"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Llamar Ahora
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;