import React, { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import SEO from '../../components/SEO';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FavoriteButton from '../../components/FavoriteButton';

const Images = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'masonry'
  const [showLightbox, setShowLightbox] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  // Mock data para imágenes
  const imageData = {
    categories: [
      { id: 'all', name: 'Todas', icon: 'fas fa-images' },
      { id: 'food', name: 'Comida', icon: 'fas fa-utensils' },
      { id: 'restaurant', name: 'Restaurante', icon: 'fas fa-store' },
      { id: 'events', name: 'Eventos', icon: 'fas fa-calendar' },
      { id: 'team', name: 'Equipo', icon: 'fas fa-users' },
      { id: 'process', name: 'Proceso', icon: 'fas fa-cogs' }
    ],
    images: [
      {
        id: 1,
        title: 'Pizza Margarita Artesanal',
        description: 'Nuestra clásica pizza margarita recién salida del horno con ingredientes frescos',
        category: 'food',
        url: '/public/pizzaMargarita.jpg',
        thumbnail: '/public/pizzaMargarita.jpg',
        uploadDate: '2024-01-15',
        photographer: 'Chef Mario',
        tags: ['pizza', 'margarita', 'artesanal', 'italiano'],
        featured: true,
        likes: 245,
        views: 1534
      },
      {
        id: 2,
        title: 'Interior del Restaurante',
        description: 'Vista panorámica de nuestro acogedor comedor con decoración italiana',
        category: 'restaurant',
        url: '/public/hero-slide-3.jpg',
        thumbnail: '/public/hero-slide-3.jpg',
        uploadDate: '2024-01-12',
        photographer: 'Ana Torres',
        tags: ['interior', 'decoración', 'ambiente', 'comodidad'],
        featured: false,
        likes: 89,
        views: 567
      },
      {
        id: 3,
        title: 'Pasta Carbonara Premium',
        description: 'Deliciosa pasta carbonara con ingredientes premium y presentación elegante',
        category: 'food',
        url: '/public/pasta-carbonara.jpg',
        thumbnail: '/public/pasta-carbonara.jpg',
        uploadDate: '2024-01-10',
        photographer: 'Chef Mario',
        tags: ['pasta', 'carbonara', 'premium', 'cremosa'],
        featured: true,
        likes: 178,
        views: 892
      },
      {
        id: 4,
        title: 'Noche Italiana Especial',
        description: 'Fotos del evento especial "Noche Italiana" con música en vivo',
        category: 'events',
        url: '/public/noche-italiana.jpg',
        thumbnail: '/public/noche-italiana.jpg',
        uploadDate: '2024-01-08',
        photographer: 'Luis Mendoza',
        tags: ['evento', 'noche italiana', 'música', 'celebración'],
        featured: false,
        likes: 134,
        views: 445
      },
      {
        id: 5,
        title: 'Equipo de Cocina',
        description: 'Nuestro talentoso equipo de cocina preparando las mejores pizzas',
        category: 'team',
        url: '/public/equipo-cocina.jpg',
        thumbnail: '/public/equipo-cocina.jpg',
        uploadDate: '2024-01-05',
        photographer: 'Ana Torres',
        tags: ['equipo', 'cocina', 'chefs', 'profesionales'],
        featured: false,
        likes: 67,
        views: 234
      },
      {
        id: 6,
        title: 'Preparación de Masa',
        description: 'El proceso artesanal de preparación de nuestra masa de pizza',
        category: 'process',
        url: '/public/masa.jpg',
        thumbnail: '/public/masa.jpg',
        uploadDate: '2024-01-03',
        photographer: 'Chef Mario',
        tags: ['masa', 'preparación', 'artesanal', 'proceso'],
        featured: true,
        likes: 201,
        views: 678
      },
      {
        id: 7,
        title: 'Ensalada César Fresca',
        description: 'Ensalada césar con ingredientes frescos y aderezo casero',
        category: 'food',
        url: '/public/ensalada-cesar.jpg',
        thumbnail: '/public/ensalada-cesar.jpg',
        uploadDate: '2024-01-01',
        photographer: 'Ana Torres',
        tags: ['ensalada', 'césar', 'fresca', 'saludable'],
        featured: false,
        likes: 98,
        views: 345
      },
      {
        id: 8,
        title: 'Terraza Al Aire Libre',
        description: 'Nuestra hermosa terraza para disfrutar al aire libre',
        category: 'restaurant',
        url: '/public/terraza.jpg',
        thumbnail: '/public/terraza.jpg',
        uploadDate: '2023-12-28',
        photographer: 'Luis Mendoza',
        tags: ['terraza', 'aire libre', 'ambiente', 'relajante'],
        featured: false,
        likes: 123,
        views: 456
      }
    ]
  };

  // Filtrar y ordenar imágenes
  const filteredImages = imageData.images
    .filter(image => {
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

  const featuredImages = imageData.images.filter(image => image.featured);

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

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowLightbox(true);
  };

  const handleFavoriteToggle = async (image) => {
    await toggleFavorite({
      itemId: image.id,
      itemType: 'images',
      isFavorite: !isFavorite(image.id, 'images'),
      itemData: image
    });
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedImage(null);
  };

  const navigateLightbox = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <>
      <SEO 
        title="Galería - Pizza4U"
        description="Explora nuestra galería de imágenes con deliciosas pizzas, ambiente acogedor y momentos especiales en Pizza4U."
        keywords="galería, imágenes, pizza, restaurante, comida, ambiente, eventos"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Galería de Imágenes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre el mundo visual de Pizza4U a través de nuestras imágenes
            </p>
          </div>

          {/* Featured Images */}
          {featuredImages.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Imágenes Destacadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredImages.slice(0, 3).map((image) => (
                  <Card 
                    key={image.id} 
                    hover 
                    className="overflow-hidden cursor-pointer group"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="relative aspect-w-16 aspect-h-12">
                      <img
                        src={image.thumbnail}
                        alt={image.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3">
                          <i className="fas fa-search-plus text-gray-700 text-lg" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Destacada
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <FavoriteButton
                          itemId={image.id}
                          itemType="images"
                          isFavorite={isFavorite(image.id, 'images')}
                          onToggle={() => handleFavoriteToggle(image)}
                          variant="button"
                          className="bg-white bg-opacity-90 hover:bg-opacity-100"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {image.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {image.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>{image.likes} me gusta</span>
                        <span>{formatDate(image.uploadDate)}</span>
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
                placeholder="Buscar imágenes..."
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showSuggestions={false}
                className="w-full"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {imageData.categories.map((category) => (
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

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="popular">Más populares</option>
                <option value="views">Más vistas</option>
                <option value="alphabetical">Alfabético</option>
              </select>

              {/* View Mode */}
              <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-th mr-2" />
                  Cuadrícula
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-4 py-2 text-sm transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-th-large mr-2" />
                  Mosaico
                </button>
              </div>
            </div>
          </div>

          {/* Images Grid */}
          {filteredImages.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-images text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron imágenes
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </Card>
          ) : (
            <div className={`${
              viewMode === 'masonry' 
                ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6' 
                : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            }`}>
              {filteredImages.map((image) => (
                <Card 
                  key={image.id} 
                  hover 
                  className={`overflow-hidden cursor-pointer group ${viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}`}
                  onClick={() => handleImageClick(image)}
                >
                  <div className="relative">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white bg-opacity-90 rounded-full p-3">
                        <i className="fas fa-search-plus text-gray-700" />
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded">
                        {imageData.categories.find(cat => cat.id === image.category)?.name}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2">
                      <FavoriteButton
                        itemId={image.id}
                        itemType="images"
                        isFavorite={isFavorite(image.id, 'images')}
                        onToggle={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(image);
                        }}
                        variant="button"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      />
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between text-white text-xs">
                      <span className="bg-black bg-opacity-50 px-2 py-1 rounded">
                        <i className="fas fa-heart mr-1" />
                        {image.likes}
                      </span>
                      <span className="bg-black bg-opacity-50 px-2 py-1 rounded">
                        <i className="fas fa-eye mr-1" />
                        {formatViews(image.views)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {image.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {image.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Por {image.photographer}</span>
                      <span>{formatDate(image.uploadDate)}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 2).map((tag, index) => (
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
              Mostrando {filteredImages.length} de {imageData.images.length} imágenes
            </p>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          {/* Navigation */}
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-2xl p-2"
          >
            <i className="fas fa-chevron-left" />
          </button>
          
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-2xl p-2"
          >
            <i className="fas fa-chevron-right" />
          </button>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl p-2"
          >
            <i className="fas fa-times" />
          </button>

          {/* Image Container */}
          <div className="max-w-7xl max-h-full p-4 flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => {
                e.target.src = selectedImage.thumbnail;
              }}
            />
            
            {/* Image Info */}
            <div className="mt-4 text-center text-white max-w-2xl">
              <h2 className="text-xl font-bold mb-2">{selectedImage.title}</h2>
              <p className="text-gray-300 mb-2">{selectedImage.description}</p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span>Por {selectedImage.photographer}</span>
                <span>{formatDate(selectedImage.uploadDate)}</span>
                <span>{selectedImage.likes} me gusta</span>
                <span>{formatViews(selectedImage.views)} vistas</span>
              </div>
            </div>
          </div>

          {/* Keyboard Navigation Hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
            Usa las flechas del teclado para navegar • ESC para cerrar
          </div>
        </div>
      )}
    </>
  );
};

export default Images;