import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { useFavorites } from '../../context/FavoritesContext';
import SEO from '../../components/SEO';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FavoriteButton from '../../components/FavoriteButton';

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular', 'duration'
  const [showPlayer, setShowPlayer] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // Mock data para videos
  const videoData = {
    categories: [
      { id: 'all', name: 'Todos', icon: 'fas fa-list' },
      { id: 'cooking', name: 'Cocina', icon: 'fas fa-utensils' },
      { id: 'behind-scenes', name: 'Detrás de cámaras', icon: 'fas fa-camera' },
      { id: 'reviews', name: 'Reseñas', icon: 'fas fa-star' },
      { id: 'tutorials', name: 'Tutoriales', icon: 'fas fa-graduation-cap' },
      { id: 'events', name: 'Eventos', icon: 'fas fa-calendar' }
    ],
    videos: [
      {
        id: 1,
        title: 'Cómo hacemos nuestra Pizza Margarita',
        description: 'Descubre el proceso artesanal detrás de nuestra pizza más popular. Desde la preparación de la masa hasta el horneado perfecto.',
        category: 'cooking',
        duration: '5:32',
        views: 15420,
        likes: 1203,
        thumbnail: '/video-thumb-1.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-15',
        tags: ['pizza', 'margarita', 'cocina', 'artesanal'],
        featured: true
      },
      {
        id: 2,
        title: 'Un día en Pizza4U - Detrás de cámaras',
        description: 'Acompáñanos en un día típico en nuestro restaurante. Conoce a nuestro equipo y ve cómo preparamos todo para brindarte la mejor experiencia.',
        category: 'behind-scenes',
        duration: '8:15',
        views: 9876,
        likes: 654,
        thumbnail: '/video-thumb-2.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-10',
        tags: ['equipo', 'restaurant', 'día'],
        featured: false
      },
      {
        id: 3,
        title: 'Reseña: Pizza Pepperoni Premium',
        description: 'Un cliente prueba nuestra nueva pizza de pepperoni premium y nos cuenta su experiencia. ¿Será su nueva favorita?',
        category: 'reviews',
        duration: '3:45',
        views: 7234,
        likes: 892,
        thumbnail: '/video-thumb-3.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-08',
        tags: ['pepperoni', 'reseña', 'cliente'],
        featured: false
      },
      {
        id: 4,
        title: 'Tutorial: Masa de pizza perfecta en casa',
        description: 'Aprende a hacer la masa de pizza perfecta en tu casa con nuestros secretos profesionales. ¡Sorprende a tu familia!',
        category: 'tutorials',
        duration: '12:20',
        views: 23456,
        likes: 2103,
        thumbnail: '/video-thumb-4.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-05',
        tags: ['tutorial', 'masa', 'casa', 'diy'],
        featured: true
      },
      {
        id: 5,
        title: 'Evento especial: Noche italiana',
        description: 'Revive nuestra noche italiana especial con música en vivo, platos tradicionales y mucha diversión.',
        category: 'events',
        duration: '6:48',
        views: 5432,
        likes: 456,
        thumbnail: '/video-thumb-5.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-03',
        tags: ['evento', 'italiana', 'música'],
        featured: false
      },
      {
        id: 6,
        title: 'Los ingredientes hacen la diferencia',
        description: 'Conoce la calidad de nuestros ingredientes y por qué elegimos solo los mejores proveedores locales.',
        category: 'cooking',
        duration: '4:30',
        views: 11234,
        likes: 987,
        thumbnail: '/video-thumb-6.jpg',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadDate: '2024-01-01',
        tags: ['ingredientes', 'calidad', 'proveedores'],
        featured: false
      }
    ]
  };

  // Filtrar y ordenar videos
  const filteredVideos = videoData.videos
    .filter(video => {
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'popular':
          return b.views - a.views;
        case 'duration':
          const aDuration = a.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          const bDuration = b.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          return aDuration - bDuration;
        case 'newest':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

  const featuredVideos = videoData.videos.filter(video => video.featured);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowPlayer(true);
  };

  const handleFavoriteToggle = async (video) => {
    await toggleFavorite({
      itemId: video.id,
      itemType: 'videos',
      isFavorite: !isFavorite(video.id, 'videos'),
      itemData: video
    });
  };

  const closeVideoPlayer = () => {
    setShowPlayer(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <SEO 
        title="Videos - Pizza4U"
        description="Descubre cómo preparamos nuestras deliciosas pizzas, conoce a nuestro equipo y aprende recetas en nuestros videos exclusivos."
        keywords="videos, cocina, pizza, tutoriales, behind the scenes, recetas"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Nuestros Videos
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre el mundo detrás de Pizza4U con nuestros videos exclusivos
            </p>
          </div>

          {/* Featured Videos */}
          {featuredVideos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Videos Destacados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredVideos.slice(0, 2).map((video) => (
                  <Card key={video.id} hover className="overflow-hidden cursor-pointer" onClick={() => handleVideoClick(video)}>
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-video.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-white bg-opacity-90 rounded-full p-4">
                          <i className="fas fa-play text-gray-700 text-2xl ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          itemId={video.id}
                          itemType="videos"
                          isFavorite={isFavorite(video.id, 'videos')}
                          onToggle={() => handleFavoriteToggle(video)}
                          variant="button"
                          className="bg-white bg-opacity-90 hover:bg-opacity-100"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{formatViews(video.views)} visualizaciones</span>
                        <span>{formatDate(video.uploadDate)}</span>
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
                placeholder="Buscar videos..."
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showSuggestions={false}
                className="w-full"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {videoData.categories.map((category) => (
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
                <option value="oldest">Más antiguos</option>
                <option value="popular">Más populares</option>
                <option value="duration">Por duración</option>
              </select>
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-video text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron videos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card 
                  key={video.id} 
                  hover 
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-video.jpg';
                      }}
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <i className="fas fa-play text-gray-700 text-lg ml-1" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        {videoData.categories.find(cat => cat.id === video.category)?.name}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2">
                      <FavoriteButton
                        itemId={video.id}
                        itemType="videos"
                        isFavorite={isFavorite(video.id, 'videos')}
                        onToggle={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(video);
                        }}
                        variant="button"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center">
                        <i className="fas fa-eye mr-1" />
                        {formatViews(video.views)}
                      </span>
                      <span className="flex items-center">
                        <i className="fas fa-heart mr-1" />
                        {video.likes}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(video.uploadDate)}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {video.tags.slice(0, 3).map((tag, index) => (
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
              Mostrando {filteredVideos.length} de {videoData.videos.length} videos
            </p>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate mr-4">
                {selectedVideo.title}
              </h2>
              <button
                onClick={closeVideoPlayer}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video">
              <ReactPlayer
                url={selectedVideo.videoUrl}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 }
                  }
                }}
              />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatViews(selectedVideo.views)} visualizaciones</span>
                  <span>{selectedVideo.likes} me gusta</span>
                  <span>{formatDate(selectedVideo.uploadDate)}</span>
                </div>
                <FavoriteButton
                  itemId={selectedVideo.id}
                  itemType="videos"
                  isFavorite={isFavorite(selectedVideo.id, 'videos')}
                  onToggle={() => handleFavoriteToggle(selectedVideo)}
                  variant="text"
                  showLabel
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Videos;