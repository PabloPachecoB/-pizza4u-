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
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'masonry'
  const [showLightbox, setShowLightbox] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  // Mock data para imágenes
  const imageData = {
    categories: [
      { id: 'all', name: 'Todas', icon: 'fas fa-list' },
      { id: 'pizzas', name: 'Pizzas', icon: 'fas fa-pizza-slice' },
      { id: 'restaurant', name: 'Restaurante', icon: 'fas fa-utensils' },
      { id: 'team', name: 'Equipo', icon: 'fas fa-users' },
      { id: 'events', name: 'Eventos', icon: 'fas fa-calendar' },
      { id: 'ingredients', name: 'Ingredientes', icon: 'fas fa-leaf' }
    ],
    images: [
      {
        id: 1,
        title: 'Pizza Margarita Artesanal',
        description: 'Nuestra pizza más popular con mozzarella fresca, tomate y albahaca',
        category: 'pizzas',
        url: '/gallery/pizza-margarita-1.jpg',
        thumbnail: '/gallery/thumbs/pizza-margarita-1.jpg',
        width: 1200,
        height: 800,
        size: 245678,
        uploadDate: '2024-01-15',
        photographer: 'Carlos Mendoza',
        tags: ['pizza', 'margarita', 'mozzarella', 'albahaca'],
        featured: true,
        likes: 156,
        views: 2340
      },
      {
        id: 2,
        title: 'Interior del Restaurante',
        description: 'Ambiente acogedor y familiar en nuestra sucursal principal',
        category: 'restaurant',
        url: '/gallery/restaurant-interior-1.jpg',
        thumbnail: '/gallery/thumbs/restaurant-interior-1.jpg',
        width: 1600,
        height: 1067,
        size: 892345,
        uploadDate: '2024-01-14',
        photographer: 'Ana Gutierrez',
        tags: ['restaurante', 'interior', 'ambiente', 'decoracion'],
        featured: false,
        likes: 89,
        views: 1456
      },
      {
        id: 3,
        title: 'Nuestro Chef Principal',
        description: 'Marco Rivera, chef con 15 años de experiencia en cocina italiana',
        category: 'team',
        url: '/gallery/chef-marco.jpg',
        thumbnail: '/gallery/thumbs/chef-marco.jpg',
        width: 800,
        height: 1200,
        size: 456789,
        uploadDate: '2024-01-13',
        photographer: 'Luis Torres',
        tags: ['chef', 'equipo', 'cocina', 'profesional'],
        featured: true,
        likes: 203,
        views: 3421
      },
      {
        id: 4,
        title: 'Ingredientes Frescos',
        description: 'Seleccionamos solo los mejores ingredientes para nuestras pizzas',
        category: 'ingredients',
        url: '/gallery/fresh-ingredients.jpg',
        thumbnail: '/gallery/thumbs/fresh-ingredients.jpg',
        width: 1400,
        height: 933,
        size: 678912,
        uploadDate: '2024-01-12',
        photographer: 'Maria Silva',
        tags: ['ingredientes', 'frescos', 'calidad', 'verduras'],
        featured: false,
        likes: 124,
        views: 1876
      },
      {
        id: 5,
        title: 'Evento Noche Italiana',
        description: 'Memorable noche italiana con música en vivo y platos especiales',
        category: 'events',
        url: '/gallery/italian-night.jpg',
        thumbnail: '/gallery/thumbs/italian-night.jpg',
        width: 1920,
        height: 1280,
        size: 1234567,
        uploadDate: '2024-01-10',
        photographer: 'Pedro Vargas',
        tags: ['evento', 'italiana', 'musica', 'especial'],
        featured: true,
        likes: 267,
        views: 4567
      },
      {
        id: 6,
        title: 'Pizza Pepperoni Premium',
        description: 'Pepperoni de la más alta calidad sobre base de tomate y mozzarella',
        category: 'pizzas',
        url: '/gallery/pizza-pepperoni.jpg',
        thumbnail: '/gallery/thumbs/pizza-pepperoni.jpg',
        width: 1300,
        height: 867,
        size: 567890,
        uploadDate: '2024-01-09',
        photographer: 'Carlos Mendoza',
        tags: ['pizza', 'pepperoni', 'premium', 'calidad'],
        featured: false,
        likes: 178,
        views: 2890
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const navigateImage = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <SEO 
        title="Galería de Imágenes - Pizza4U"
        description="Explora nuestra galería de imágenes con fotos de nuestras deliciosas pizzas, restaurante, equipo y eventos especiales."
        keywords="galería, fotos, imágenes, pizzas, restaurante, equipo, eventos"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Galería de Imágenes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre el mundo visual de Pizza4U a través de nuestras fotografías
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
                    <div className="relative">
                      <img
                        src={image.thumbnail}
                        alt={image.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <i className="fas fa-search-plus text-2xl mb-2" />
                          <p className="text-sm">Ver imagen</p>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Destacada
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
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {image.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {image.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatViews(image.views)} vistas</span>
                        <span>{image.likes} me gusta</span>
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
              </select>

              {/* View Mode */}
              <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-th" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'masonry'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-th-large" />
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
                ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6' 
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            }`}>
              {filteredImages.map((image) => (
                <Card 
                  key={image.id} 
                  hover 
                  className={`overflow-hidden cursor-pointer group ${
                    viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''
                  }`}
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
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <i className="fas fa-search-plus text-xl mb-1" />
                        <p className="text-xs">Ver imagen</p>
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
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm line-clamp-1">
                      {image.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                      {image.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatViews(image.views)} vistas</span>
                      <span>{image.likes} ❤️</span>
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
            onClick={() => navigateImage('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-2xl p-2 z-10"
          >
            <i className="fas fa-chevron-left" />
          </button>
          
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 text-2xl p-2 z-10"
          >
            <i className="fas fa-chevron-right" />
          </button>

          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl p-2 z-10"
          >
            <i className="fas fa-times" />
          </button>

          {/* Image Container */}
          <div className="max-w-6xl max-h-full mx-4 flex flex-col">
            <div className="flex-1 flex items-center justify-center mb-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = selectedImage.thumbnail;
                }}
              />
            </div>

            {/* Image Info */}
            <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{selectedImage.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{selectedImage.description}</p>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <FavoriteButton
                    itemId={selectedImage.id}
                    itemType="images"
                    isFavorite={isFavorite(selectedImage.id, 'images')}
                    onToggle={() => handleFavoriteToggle(selectedImage)}
                    variant="button"
                    className="bg-white bg-opacity-20 hover:bg-opacity-30"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadImage(selectedImage)}
                    icon="fas fa-download"
                    className="text-white hover:bg-white hover:bg-opacity-20"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-300">
                <div>
                  <span className="block text-gray-400">Fotógrafo</span>
                  <span>{selectedImage.photographer}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Fecha</span>
                  <span>{formatDate(selectedImage.uploadDate)}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Dimensiones</span>
                  <span>{selectedImage.width} x {selectedImage.height}</span>
                </div>
                <div>
                  <span className="block text-gray-400">Tamaño</span>
                  <span>{formatFileSize(selectedImage.size)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Images;