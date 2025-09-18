import React, { useState, useEffect } from 'react';
import PodcastPlayer from '../../components/PodcastPlayer';
import Button from '../../components/Button';

const Podcasts = () => {
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data de podcasts (puedes reemplazar con datos reales de tu API)
  const mockPodcasts = [
    {
      id: 1,
      title: 'Pizza4U - Historia de Nuestra Empresa',
      author: 'Equipo Pizza4U',
      description: 'Descubre cómo nació Pizza4U y nuestra pasión por crear las mejores pizzas de La Paz.',
      cover: '/podcast-cover-1.jpg',
      url: '/audio/podcast-1.mp3', // Reemplaza con URLs reales
      duration: '15:30',
      category: 'empresa',
      publishedAt: '2025-01-15'
    },
    {
      id: 2,
      title: 'Los Secretos de la Pizza Perfecta',
      author: 'Chef Mario',
      description: 'Nuestro chef principal comparte los secretos detrás de nuestras recetas especiales.',
      cover: '/podcast-cover-2.jpg',
      url: '/audio/podcast-2.mp3',
      duration: '22:45',
      category: 'recetas',
      publishedAt: '2025-01-10'
    },
    {
      id: 3,
      title: 'Ingredientes Frescos: De la Granja a tu Pizza',
      author: 'Ana Rodríguez',
      description: 'Conoce a nuestros proveedores locales y cómo seleccionamos los mejores ingredientes.',
      cover: '/podcast-cover-3.jpg',
      url: '/audio/podcast-3.mp3',
      duration: '18:20',
      category: 'ingredientes',
      publishedAt: '2025-01-05'
    },
    {
      id: 4,
      title: 'Tradición Italiana en Bolivia',
      author: 'Giuseppe Antonelli',
      description: 'La fusión de la tradición italiana con los sabores bolivianos en nuestras pizzas.',
      cover: '/podcast-cover-4.jpg',
      url: '/audio/podcast-4.mp3',
      duration: '25:15',
      category: 'cultura',
      publishedAt: '2025-01-01'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-list' },
    { id: 'empresa', name: 'Empresa', icon: 'fas fa-building' },
    { id: 'recetas', name: 'Recetas', icon: 'fas fa-utensils' },
    { id: 'ingredientes', name: 'Ingredientes', icon: 'fas fa-leaf' },
    { id: 'cultura', name: 'Cultura', icon: 'fas fa-globe' }
  ];

  useEffect(() => {
    // Simular carga de datos
    const loadPodcasts = async () => {
      setLoading(true);
      // Aquí podrías hacer una llamada a tu API
      // const response = await api.podcasts.getList();
      // setPodcasts(response.data);
      
      // Por ahora usamos datos mock
      setTimeout(() => {
        setPodcasts(mockPodcasts);
        setLoading(false);
      }, 1000);
    };

    loadPodcasts();
  }, []);

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Cargando podcasts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          <i className="fas fa-podcast text-primary-500 mr-3" />
          Podcasts Pizza4U
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
          Escucha nuestros podcasts exclusivos sobre la historia, recetas y secretos detrás de Pizza4U. 
          Conoce más sobre nuestra pasión por crear las mejores pizzas de La Paz.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar podcasts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <i className={`${category.icon} mr-2`} />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Podcast List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {filteredPodcasts.length} podcast{filteredPodcasts.length !== 1 ? 's' : ''} encontrado{filteredPodcasts.length !== 1 ? 's' : ''}
          </h2>
          
          {filteredPodcasts.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-podcast text-4xl text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No se encontraron podcasts con esos criterios
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPodcasts.map(podcast => (
                <div
                  key={podcast.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPodcast?.id === podcast.id ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setSelectedPodcast(podcast)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Cover */}
                    <div className="flex-shrink-0">
                      <img
                        src={podcast.cover || '/placeholder-podcast.jpg'}
                        alt={podcast.title}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-podcast.jpg';
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {podcast.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {podcast.author} • {podcast.duration}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {podcast.description}
                          </p>
                        </div>
                        
                        <div className="flex-shrink-0 ml-4">
                          <Button
                            variant={selectedPodcast?.id === podcast.id ? "primary" : "outline"}
                            size="sm"
                            icon={selectedPodcast?.id === podcast.id ? "fas fa-pause" : "fas fa-play"}
                          >
                            {selectedPodcast?.id === podcast.id ? 'Seleccionado' : 'Reproducir'}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                          {categories.find(cat => cat.id === podcast.category)?.name || podcast.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(podcast.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Player Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <PodcastPlayer
              podcast={selectedPodcast}
              showPlaylist={false}
              className="mb-6"
            />
            
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                <i className="fas fa-info-circle text-primary-500 mr-2" />
                Sobre nuestros podcasts
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <i className="fas fa-microphone text-primary-500 mr-2" />
                  Nuevos episodios cada semana
                </p>
                <p>
                  <i className="fas fa-clock text-primary-500 mr-2" />
                  Duración promedio: 20 minutos
                </p>
                <p>
                  <i className="fas fa-headphones text-primary-500 mr-2" />
                  Disponible en alta calidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Podcasts;