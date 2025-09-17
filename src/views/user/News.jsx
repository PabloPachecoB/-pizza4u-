import React, { useState, useEffect } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import SEO from '../../components/SEO';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import LoadingSpinner from '../../components/LoadingSpinner';
import FavoriteButton from '../../components/FavoriteButton';

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data para noticias
  const newsData = {
    categories: [
      { id: 'all', name: 'Todas', icon: 'fas fa-list', count: 25 },
      { id: 'announcements', name: 'Anuncios', icon: 'fas fa-bullhorn', count: 8 },
      { id: 'new-products', name: 'Nuevos Productos', icon: 'fas fa-plus-circle', count: 6 },
      { id: 'events', name: 'Eventos', icon: 'fas fa-calendar', count: 4 },
      { id: 'promotions', name: 'Promociones', icon: 'fas fa-tag', count: 5 },
      { id: 'community', name: 'Comunidad', icon: 'fas fa-users', count: 2 }
    ],
    articles: [
      {
        id: 1,
        title: 'Nueva Pizza de Temporada: Trufa Negra y Arúgula',
        excerpt: 'Presentamos nuestra última creación: una exquisita pizza con trufa negra italiana, arúgula fresca y parmesano añejado.',
        content: `
          <p>Nos complace anunciar nuestra nueva pizza de temporada que combina los sabores más refinados de la gastronomía italiana.</p>
          
          <h3>Ingredientes Premium</h3>
          <p>Esta pizza especial incluye:</p>
          <ul>
            <li>Trufa negra auténtica de Umbría, Italia</li>
            <li>Arúgula fresca del valle de Cochabamba</li>
            <li>Parmesano Reggiano añejado 24 meses</li>
            <li>Mozzarella di bufala importada</li>
            <li>Base de aceite de oliva extra virgen</li>
          </ul>
          
          <h3>Disponibilidad Limitada</h3>
          <p>Esta pizza especial estará disponible solo durante los meses de enero y febrero, debido a la temporada de la trufa negra.</p>
          
          <p>Precio especial de lanzamiento: Bs. 89 (precio regular: Bs. 110)</p>
        `,
        category: 'new-products',
        author: 'Chef Mario Rossi',
        authorAvatar: '/chef-mario.jpg',
        publishDate: '2024-01-15T10:30:00Z',
        readTime: '3 min',
        image: '/news/pizza-trufa-negra.jpg',
        tags: ['pizza', 'trufa', 'temporada', 'gourmet'],
        featured: true,
        views: 2847,
        likes: 156,
        shares: 23
      },
      {
        id: 2,
        title: 'Horarios Extendidos los Fines de Semana',
        excerpt: 'A partir del 20 de enero, Pizza4U estará abierto hasta medianoche los viernes y sábados para servir mejor a nuestros clientes.',
        content: `
          <p>Debido a la gran demanda de nuestros clientes, hemos decidido extender nuestros horarios de atención durante los fines de semana.</p>
          
          <h3>Nuevos Horarios</h3>
          <ul>
            <li><strong>Viernes:</strong> 11:00 AM - 12:00 AM</li>
            <li><strong>Sábado:</strong> 11:00 AM - 12:00 AM</li>
            <li><strong>Domingo:</strong> 11:00 AM - 11:00 PM (sin cambios)</li>
          </ul>
          
          <h3>Servicios Disponibles</h3>
          <p>Durante las horas extendidas, todos nuestros servicios estarán disponibles:</p>
          <ul>
            <li>Comedor completo</li>
            <li>Delivery hasta las 11:30 PM</li>
            <li>Para llevar hasta las 12:00 AM</li>
            <li>Menú completo disponible</li>
          </ul>
          
          <p>¡Ahora podrás disfrutar de nuestras pizzas hasta más tarde!</p>
        `,
        category: 'announcements',
        author: 'Gerencia Pizza4U',
        authorAvatar: '/team/gerencia.jpg',
        publishDate: '2024-01-12T14:15:00Z',
        readTime: '2 min',
        image: '/news/horarios-extendidos.jpg',
        tags: ['horarios', 'servicio', 'fin de semana'],
        featured: false,
        views: 1543,
        likes: 89,
        shares: 12
      },
      {
        id: 3,
        title: 'Workshop de Pizza Casera - Aprende de los Expertos',
        excerpt: 'Únete a nuestro workshop exclusivo el 27 de enero y aprende los secretos de la auténtica pizza italiana de la mano de nuestros chefs.',
        content: `
          <p>¿Siempre quisiste aprender a hacer pizza como un profesional? ¡Esta es tu oportunidad!</p>
          
          <h3>Detalles del Workshop</h3>
          <ul>
            <li><strong>Fecha:</strong> Sábado 27 de enero, 2024</li>
            <li><strong>Hora:</strong> 3:00 PM - 7:00 PM</li>
            <li><strong>Lugar:</strong> Pizza4U Centro</li>
            <li><strong>Cupos:</strong> Limitados a 12 personas</li>
            <li><strong>Precio:</strong> Bs. 180 por persona</li>
          </ul>
          
          <h3>¿Qué Aprenderás?</h3>
          <ul>
            <li>Preparación de masa madre auténtica</li>
            <li>Técnicas de amasado profesional</li>
            <li>Selección y preparación de salsas</li>
            <li>Combinaciones de ingredientes perfectas</li>
            <li>Uso del horno de leña</li>
            <li>Presentación y servicio</li>
          </ul>
          
          <h3>Incluye</h3>
          <ul>
            <li>Todos los ingredientes</li>
            <li>Delantal Pizza4U de regalo</li>
            <li>Recetario con 10 pizzas clásicas</li>
            <li>Cena: tu pizza + bebida + postre</li>
            <li>Certificado de participación</li>
          </ul>
          
          <p><strong>¡Reserva tu lugar ahora!</strong> Llama al (2) 123-4567 o visítanos en el restaurante.</p>
        `,
        category: 'events',
        author: 'Equipo Educativo',
        authorAvatar: '/team/educativo.jpg',
        publishDate: '2024-01-10T16:45:00Z',
        readTime: '4 min',
        image: '/news/workshop-pizza.jpg',
        tags: ['workshop', 'educación', 'pizza casera', 'evento'],
        featured: true,
        views: 3251,
        likes: 198,
        shares: 45
      },
      {
        id: 4,
        title: 'Promoción Familiar: 2x1 en Pizzas Medianas',
        excerpt: 'Todos los miércoles de enero, aprovecha nuestra promoción familiar: 2 pizzas medianas por el precio de 1.',
        content: `
          <p>¡La promoción que toda familia esperaba! Cada miércoles de enero, ven con tu familia y disfruta de nuestras deliciosas pizzas con increíble descuento.</p>
          
          <h3>Detalles de la Promoción</h3>
          <ul>
            <li><strong>Válido:</strong> Todos los miércoles de enero 2024</li>
            <li><strong>Horario:</strong> Todo el día (11:00 AM - 11:00 PM)</li>
            <li><strong>Aplica para:</strong> Pizzas medianas (30cm)</li>
            <li><strong>Modalidad:</strong> Para comedor y delivery</li>
          </ul>
          
          <h3>Pizzas Incluidas</h3>
          <p>Todas nuestras pizzas medianas participan:</p>
          <ul>
            <li>Margarita - Bs. 45</li>
            <li>Pepperoni - Bs. 52</li>
            <li>Hawaiana - Bs. 48</li>
            <li>Quattro Stagioni - Bs. 58</li>
            <li>Vegetariana - Bs. 46</li>
            <li>Y muchas más...</li>
          </ul>
          
          <h3>Términos y Condiciones</h3>
          <ul>
            <li>Las pizzas pueden ser de diferentes sabores</li>
            <li>Se cobra el precio de la pizza más cara</li>
            <li>No acumulable con otras promociones</li>
            <li>Válido para un máximo de 4 pizzas por mesa</li>
          </ul>
          
          <p>¡No te pierdas esta increíble oportunidad de disfrutar en familia!</p>
        `,
        category: 'promotions',
        author: 'Marketing Pizza4U',
        authorAvatar: '/team/marketing.jpg',
        publishDate: '2024-01-08T11:20:00Z',
        readTime: '3 min',
        image: '/news/promocion-2x1.jpg',
        tags: ['promoción', 'familia', '2x1', 'miércoles'],
        featured: false,
        views: 4127,
        likes: 312,
        shares: 89
      },
      {
        id: 5,
        title: 'Nueva Línea de Bebidas Artesanales',
        excerpt: 'Complementa tu pizza con nuestras nuevas bebidas artesanales: limonadas, aguas saborizadas y tés helados únicos.',
        content: `
          <p>Expandimos nuestra carta de bebidas con opciones artesanales que complementan perfectamente nuestras pizzas.</p>
          
          <h3>Nuevas Bebidas</h3>
          
          <h4>Limonadas Artesanales</h4>
          <ul>
            <li><strong>Limonada Clásica:</strong> Bs. 12</li>
            <li><strong>Limonada de Menta:</strong> Bs. 14</li>
            <li><strong>Limonada de Jengibre:</strong> Bs. 15</li>
            <li><strong>Limonada de Maracuyá:</strong> Bs. 16</li>
          </ul>
          
          <h4>Aguas Saborizadas</h4>
          <ul>
            <li><strong>Agua de Pepino y Lima:</strong> Bs. 10</li>
            <li><strong>Agua de Sandía:</strong> Bs. 12</li>
            <li><strong>Agua de Mango:</strong> Bs. 13</li>
          </ul>
          
          <h4>Tés Helados</h4>
          <ul>
            <li><strong>Té Verde con Limón:</strong> Bs. 11</li>
            <li><strong>Té de Durazno:</strong> Bs. 13</li>
            <li><strong>Té Chai Helado:</strong> Bs. 14</li>
          </ul>
          
          <p>Todas nuestras bebidas están hechas con ingredientes naturales y sin conservantes artificiales.</p>
        `,
        category: 'new-products',
        author: 'Chef de Bebidas',
        authorAvatar: '/team/chef-bebidas.jpg',
        publishDate: '2024-01-05T13:30:00Z',
        readTime: '2 min',
        image: '/news/bebidas-artesanales.jpg',
        tags: ['bebidas', 'artesanal', 'natural', 'nuevo'],
        featured: false,
        views: 987,
        likes: 67,
        shares: 15
      },
      {
        id: 6,
        title: 'Pizza4U Apoya a la Comunidad Local',
        excerpt: 'Conoce nuestro programa de responsabilidad social y cómo estamos ayudando a las familias más necesitadas de La Paz.',
        content: `
          <p>En Pizza4U creemos en retribuir a la comunidad que nos ha acogido con tanto cariño durante estos años.</p>
          
          <h3>Programa "Pizza Solidaria"</h3>
          <p>Cada viernes, donamos 50 pizzas a familias en situación vulnerable identificadas por organizaciones sociales locales.</p>
          
          <h3>Alianzas Estratégicas</h3>
          <ul>
            <li><strong>Fundación Niños con Futuro:</strong> Donación mensual de pizzas para sus programas</li>
            <li><strong>Hogar de Ancianos San José:</strong> Cenas especiales cada 15 días</li>
            <li><strong>Centro de Salud Villa Fátima:</strong> Almuerzos para el personal médico</li>
          </ul>
          
          <h3>¿Cómo Puedes Participar?</h3>
          <ul>
            <li>Por cada pizza que compres, nosotros donamos Bs. 1</li>
            <li>Puedes redondear tu cuenta para donación</li>
            <li>Compra "Pizza Solidaria" directamente (Bs. 25)</li>
          </ul>
          
          <h3>Resultados 2023</h3>
          <ul>
            <li>2,500 pizzas donadas</li>
            <li>150 familias beneficiadas</li>
            <li>Bs. 25,000 en donaciones</li>
          </ul>
          
          <p>¡Juntos podemos hacer la diferencia en nuestra comunidad!</p>
        `,
        category: 'community',
        author: 'Responsabilidad Social',
        authorAvatar: '/team/social.jpg',
        publishDate: '2024-01-03T09:15:00Z',
        readTime: '4 min',
        image: '/news/pizza-solidaria.jpg',
        tags: ['comunidad', 'solidaridad', 'donación', 'responsabilidad social'],
        featured: false,
        views: 1876,
        likes: 234,
        shares: 67
      }
    ]
  };

  // Filtrar y ordenar artículos
  const filteredArticles = newsData.articles
    .filter(article => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.publishDate) - new Date(b.publishDate);
        case 'popular':
          return b.views - a.views;
        case 'newest':
        default:
          return new Date(b.publishDate) - new Date(a.publishDate);
      }
    });

  const featuredArticles = newsData.articles.filter(article => article.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleFavoriteToggle = async (article) => {
    await toggleFavorite({
      itemId: article.id,
      itemType: 'news',
      isFavorite: !isFavorite(article.id, 'news'),
      itemData: article
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando noticias..." />
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Noticias - Pizza4U"
        description="Mantente al día con las últimas noticias, promociones y eventos de Pizza4U. Nuevos productos, horarios y más."
        keywords="noticias, Pizza4U, promociones, eventos, nuevos productos, anuncios"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Noticias y Actualizaciones
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Mantente al día con las últimas novedades de Pizza4U
            </p>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Noticias Destacadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredArticles.slice(0, 2).map((article) => (
                  <Card 
                    key={article.id} 
                    hover 
                    className="overflow-hidden cursor-pointer group"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-news.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Destacada
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <FavoriteButton
                          itemId={article.id}
                          itemType="news"
                          isFavorite={isFavorite(article.id, 'news')}
                          onToggle={() => handleFavoriteToggle(article)}
                          variant="button"
                          className="bg-white bg-opacity-90 hover:bg-opacity-100"
                        />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-2 py-1 rounded-full text-xs font-medium">
                          {newsData.categories.find(cat => cat.id === article.category)?.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(article.publishDate)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                          <span><i className="fas fa-eye mr-1" />{formatViews(article.views)}</span>
                          <span><i className="fas fa-heart mr-1" />{article.likes}</span>
                          <span><i className="fas fa-clock mr-1" />{article.readTime}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <img
                            src={article.authorAvatar}
                            alt={article.author}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                              e.target.src = '/placeholder-avatar.jpg';
                            }}
                          />
                          <span className="text-gray-600 dark:text-gray-400">{article.author}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Buscar noticias..."
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showSuggestions={false}
                className="w-full"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {newsData.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <i className={category.icon} />
                  <span>{category.name}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex justify-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguas</option>
                <option value="popular">Más populares</option>
              </select>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-newspaper text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron noticias
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card 
                  key={article.id} 
                  hover 
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-news.jpg';
                      }}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {newsData.categories.find(cat => cat.id === article.category)?.name}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3">
                      <FavoriteButton
                        itemId={article.id}
                        itemType="news"
                        isFavorite={isFavorite(article.id, 'news')}
                        onToggle={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(article);
                        }}
                        variant="button"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{formatDate(article.publishDate)}</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    {/* Stats and Author */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                        <span><i className="fas fa-eye mr-1" />{formatViews(article.views)}</span>
                        <span><i className="fas fa-heart mr-1" />{article.likes}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <img
                          src={article.authorAvatar}
                          alt={article.author}
                          className="w-4 h-4 rounded-full"
                          onError={(e) => {
                            e.target.src = '/placeholder-avatar.jpg';
                          }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {article.author.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <p>
              Mostrando {filteredArticles.length} de {newsData.articles.length} noticias
            </p>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 px-2 py-1 rounded-full text-sm font-medium">
                    {newsData.categories.find(cat => cat.id === selectedArticle.category)?.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedArticle.publishDate)}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
                >
                  <i className="fas fa-times text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Article Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedArticle.title}
                </h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedArticle.authorAvatar}
                      alt={selectedArticle.author}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        e.target.src = '/placeholder-avatar.jpg';
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedArticle.author}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedArticle.readTime} de lectura
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                      <span><i className="fas fa-eye mr-1" />{formatViews(selectedArticle.views)}</span>
                      <span><i className="fas fa-heart mr-1" />{selectedArticle.likes}</span>
                    </div>
                    
                    <FavoriteButton
                      itemId={selectedArticle.id}
                      itemType="news"
                      isFavorite={isFavorite(selectedArticle.id, 'news')}
                      onToggle={() => handleFavoriteToggle(selectedArticle)}
                      variant="text"
                      showLabel
                    />
                  </div>
                </div>
              </div>

              {/* Article Image */}
              <div className="mb-6">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-news.jpg';
                  }}
                />
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />

              {/* Article Footer */}
              <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Compartir: {selectedArticle.shares} veces
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" icon="fab fa-facebook">
                      Facebook
                    </Button>
                    <Button size="sm" variant="outline" icon="fab fa-twitter">
                      Twitter
                    </Button>
                    <Button size="sm" variant="outline" icon="fab fa-whatsapp">
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;