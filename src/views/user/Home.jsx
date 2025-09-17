import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';
import SEO from '../../components/SEO';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import FavoriteButton from '../../components/FavoriteButton';

const Home = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Mock data para la página de inicio
  const heroSlides = [
    {
      id: 1,
      title: 'Las Mejores Pizzas Artesanales',
      subtitle: 'Hechas con ingredientes frescos y mucho amor',
      description: 'Descubre nuestros sabores únicos y disfruta de la auténtica experiencia italiana en cada bocado.',
      image: '/hero-slide-1.jpg',
      buttonText: 'Ver Menú',
      buttonAction: () => navigate('/menu'),
      buttonIcon: 'fas fa-utensils'
    },
    {
      id: 2,
      title: 'Delivery Gratuito',
      subtitle: 'En pedidos mayores a Bs. 50',
      description: 'Disfruta de nuestras deliciosas pizzas en la comodidad de tu hogar con envío gratuito.',
      image: '/hero-slide-2.jpg',
      buttonText: 'Ordenar Ahora',
      buttonAction: () => navigate('/menu'),
      buttonIcon: 'fas fa-shipping-fast'
    },
    {
      id: 3,
      title: 'Ambiente Acogedor',
      subtitle: 'Perfecto para toda la familia',
      description: 'Ven a disfrutar de nuestro ambiente familiar con terraza al aire libre y área de juegos para niños.',
      image: '/hero-slide-3.jpg',
      buttonText: 'Nuestra Ubicación',
      buttonAction: () => navigate('/location'),
      buttonIcon: 'fas fa-map-marker-alt'
    }
  ];

  const features = [
    {
      icon: 'fas fa-pizza-slice',
      title: 'Pizzas Artesanales',
      description: 'Masa preparada diariamente con recetas tradicionales italianas',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Ingredientes Frescos',
      description: 'Productos locales de la mejor calidad, seleccionados cuidadosamente',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: 'fas fa-shipping-fast',
      title: 'Delivery Rápido',
      description: 'Entregas en 30-45 minutos, garantizando frescura y calidad',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: 'fas fa-users',
      title: 'Ambiente Familiar',
      description: 'Espacio acogedor con área de juegos y terraza al aire libre',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    }
  ];

  const popularProducts = [
    {
      id: 1,
      name: 'Pizza Margarita',
      price: 45,
      originalPrice: 50,
      image: '/pizza-margarita.jpg',
      description: 'Tomate, mozzarella fresca, albahaca y aceite de oliva',
      rating: 4.8,
      reviews: 124,
      isPopular: true,
      preparationTime: '15-20 min',
      tags: ['Clásica', 'Vegetariana']
    },
    {
      id: 2,
      name: 'Pizza Pepperoni Premium',
      price: 52,
      image: '/pizza-pepperoni.jpg',
      description: 'Pepperoni italiano, mozzarella y salsa especial',
      rating: 4.9,
      reviews: 89,
      isNew: true,
      preparationTime: '15-20 min',
      tags: ['Premium', 'Favorita']
    },
    {
      id: 3,
      name: 'Pizza Quattro Stagioni',
      price: 58,
      image: '/pizza-quattro.jpg',
      description: 'Jamón, champiñones, alcachofas, aceitunas y mozzarella',
      rating: 4.7,
      reviews: 67,
      preparationTime: '18-22 min',
      tags: ['Gourmet', 'Completa']
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'María González',
      avatar: '/avatar-1.jpg',
      rating: 5,
      comment: '¡La mejor pizza de La Paz! El servicio es excelente y el ambiente muy acogedor.',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Carlos Mendoza',
      avatar: '/avatar-2.jpg',
      rating: 5,
      comment: 'Delivery súper rápido y las pizzas llegan calientes. La Margarita es mi favorita.',
      date: '2024-01-12'
    },
    {
      id: 3,
      name: 'Ana Torres',
      avatar: '/avatar-3.jpg',
      rating: 4,
      comment: 'Excelente calidad de ingredientes. Perfecto para ir en familia.',
      date: '2024-01-10'
    }
  ];

  const recentNews = [
    {
      id: 1,
      title: 'Nueva Pizza de Temporada',
      summary: 'Descubre nuestra nueva pizza con ingredientes de temporada',
      image: '/news-1.jpg',
      date: '2024-01-15',
      category: 'Menú'
    },
    {
      id: 2,
      title: 'Noche Italiana Especial',
      summary: 'Únete a nuestra noche temática con música en vivo',
      image: '/news-2.jpg',
      date: '2024-01-12',
      category: 'Eventos'
    },
    {
      id: 3,
      title: 'Nuevo Horario Extendido',
      summary: 'Ahora abiertos hasta las 23:30 los fines de semana',
      image: '/news-3.jpg',
      date: '2024-01-10',
      category: 'Información'
    }
  ];

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-cambio de slides del hero
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length, loading]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long'
    });
  };

  const handleAddToCart = (product) => {
    addItem(product);
  };

  const handleToggleFavorite = (product) => {
    toggleFavorite({
      itemId: product.id,
      itemType: 'products',
      isFavorite: !isFavorite(product.id, 'products'),
      itemData: product
    });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando..." />;
  }

  return (
    <>
      <SEO 
        title="Pizza4U - Las mejores pizzas artesanales de La Paz"
        description="Disfruta de las mejores pizzas artesanales de La Paz, Bolivia. Ingredientes frescos, ambiente familiar y delivery gratuito. ¡Ordena ahora!"
        keywords="pizza, restaurante, La Paz, delivery, artesanal, italiana, familia"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section con Carousel */}
        <section className="relative h-screen overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-hero.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
                      {slide.description}
                    </p>
                    <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                      <Button
                        size="lg"
                        variant="primary"
                        onClick={slide.buttonAction}
                        icon={slide.buttonIcon}
                        className="bg-white text-primary-600 hover:bg-gray-100 shadow-xl"
                      >
                        {slide.buttonText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
          >
            <i className="fas fa-chevron-left" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200"
          >
            <i className="fas fa-chevron-right" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 right-8 text-white animate-bounce">
            <i className="fas fa-chevron-down text-2xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué elegirnos?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Descubre las razones que nos convierten en tu pizzería favorita
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  hover
                  className="p-6 text-center transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${feature.icon} text-2xl ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Nuestras Especialidades
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Las pizzas más populares que no puedes dejar de probar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularProducts.map((product) => (
                <Card key={product.id} hover className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder-pizza.jpg';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 space-y-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Nuevo
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-4 right-4">
                      <FavoriteButton
                        itemId={product.id}
                        itemType="products"
                        isFavorite={isFavorite(product.id, 'products')}
                        onToggle={() => handleToggleFavorite(product)}
                        variant="button"
                        className="bg-white/90 hover:bg-white shadow-lg"
                      />
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-black/75 text-white px-3 py-1 rounded-lg">
                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-sm line-through ml-2 opacity-75">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.rating} ({product.reviews} reseñas)
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate('/menu')}
                        icon="fas fa-eye"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(product)}
                        icon="fas fa-plus"
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
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

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experiencias reales de personas que han disfrutado nuestras pizzas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=f97316&color=fff`;
                      }}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <div className="flex text-yellow-400">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-xs" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 italic mb-4">
                    "{testimonial.comment}"
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {formatDate(testimonial.date)}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Recent News Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Últimas Noticias
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Mantente al día con nuestras novedades y eventos especiales
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentNews.map((news) => (
                <Card key={news.id} hover className="overflow-hidden cursor-pointer">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-news.jpg';
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                        {news.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {formatDate(news.date)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {news.summary}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/news')}
                icon="fas fa-newspaper"
              >
                Ver Todas las Noticias
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              ¿Listo para ordenar?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              No esperes más y disfruta de nuestras deliciosas pizzas. 
              ¡El sabor auténtico te está esperando!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
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
                {window.innerWidth < 640 ? 'Llamar' : 'Llamar Ahora'}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;