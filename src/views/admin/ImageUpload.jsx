import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';

const ImageUpload = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedImages, setSelectedImages] = useState([]);
  const [showUploader, setShowUploader] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    { id: 'all', name: 'Todas', icon: 'fas fa-images' },
    { id: 'food', name: 'Comida', icon: 'fas fa-utensils' },
    { id: 'restaurant', name: 'Restaurante', icon: 'fas fa-store' },
    { id: 'events', name: 'Eventos', icon: 'fas fa-calendar' },
    { id: 'team', name: 'Equipo', icon: 'fas fa-users' },
    { id: 'process', name: 'Proceso', icon: 'fas fa-cogs' },
    { id: 'marketing', name: 'Marketing', icon: 'fas fa-bullhorn' }
  ];

  // Mock data para imágenes
  const mockImages = [
    {
      id: 1,
      title: 'Pizza Margarita Artesanal',
      description: 'Pizza margarita recién salida del horno',
      category: 'food',
      url: '/gallery/pizza-margarita-1.jpg',
      thumbnail: '/gallery/thumbs/pizza-margarita-1-thumb.jpg',
      uploadDate: '2024-01-15',
      size: '2.4 MB',
      dimensions: '1920x1080',
      format: 'JPG',
      photographer: 'Chef Mario',
      tags: ['pizza', 'margarita', 'artesanal'],
      featured: true,
      published: true,
      likes: 245,
      views: 1534
    },
    {
      id: 2,
      title: 'Interior del Restaurante',
      description: 'Vista del comedor principal',
      category: 'restaurant',
      url: '/gallery/interior-1.jpg',
      thumbnail: '/gallery/thumbs/interior-1-thumb.jpg',
      uploadDate: '2024-01-12',
      size: '3.1 MB',
      dimensions: '1920x1280',
      format: 'JPG',
      photographer: 'Ana Torres',
      tags: ['interior', 'decoración', 'ambiente'],
      featured: false,
      published: true,
      likes: 89,
      views: 567
    },
    {
      id: 3,
      title: 'Equipo de Cocina',
      description: 'Nuestro talentoso equipo trabajando',
      category: 'team',
      url: '/gallery/equipo-cocina-1.jpg',
      thumbnail: '/gallery/thumbs/equipo-cocina-1-thumb.jpg',
      uploadDate: '2024-01-10',
      size: '2.8 MB',
      dimensions: '1920x1080',
      format: 'JPG',
      photographer: 'Luis Mendoza',
      tags: ['equipo', 'cocina', 'chefs'],
      featured: false,
      published: false,
      likes: 67,
      views: 234
    }
  ];

  // Simular carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setImages(mockImages);
      setFilteredImages(mockImages);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar imágenes
  useEffect(() => {
    let filtered = images.filter(image => {
      const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
      const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'popular':
          return b.views - a.views;
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

    setFilteredImages(filtered);
  }, [images, selectedCategory, searchQuery, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleImageSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllImages = () => {
    setSelectedImages(filteredImages.map(img => img.id));
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  const deleteSelectedImages = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedImages.length} imagen(es)?`)) {
      setImages(prev => prev.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    }
  };

  const toggleImageStatus = (imageId, field) => {
    setImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, [field]: !img[field] } : img
    ));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileUpload = (files) => {
    // Simular subida de archivos
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const newImage = {
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: '',
          category: 'food',
          url: URL.createObjectURL(file),
          thumbnail: URL.createObjectURL(file),
          uploadDate: new Date().toISOString().split('T')[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          dimensions: '1920x1080',
          format: file.type.split('/')[1].toUpperCase(),
          photographer: 'Admin',
          tags: [],
          featured: false,
          published: false,
          likes: 0,
          views: 0
        };
        setImages(prev => [newImage, ...prev]);
      }
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando imágenes..." />;
  }

  return (
    <>
      <SEO 
        title="Gestión de Imágenes - Admin Pizza4U"
        description="Administra la galería de imágenes del restaurante"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Imágenes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Administra la galería de imágenes del restaurante
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-download"
                >
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  icon="fas fa-upload"
                  onClick={() => setShowUploader(true)}
                >
                  Subir Imágenes
                </Button>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div
            className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <i className={`fas fa-cloud-upload-alt text-4xl ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Arrastra imágenes aquí para subirlas
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  O haz clic en "Subir Imágenes" para seleccionar archivos
                </p>
              </div>
              <p className="text-sm text-gray-400">
                Formatos soportados: JPG, PNG, WebP • Máximo 10MB por imagen
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="max-w-md">
                <SearchBar
                  placeholder="Buscar imágenes..."
                  onSearch={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  showSuggestions={false}
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <i className={category.icon} />
                    <span>{category.name}</span>
                    {category.id !== 'all' && (
                      <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                        {images.filter(img => img.category === category.id).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguas</option>
                    <option value="popular">Más populares</option>
                    <option value="size">Por tamaño</option>
                    <option value="alphabetical">Alfabético</option>
                  </select>

                  <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`px-3 py-2 text-sm ${
                        viewMode === 'grid'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="fas fa-th" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-3 py-2 text-sm ${
                        viewMode === 'list'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <i className="fas fa-list" />
                    </button>
                  </div>
                </div>

                {/* Selection Actions */}
                {selectedImages.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedImages.length} seleccionada(s)
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Limpiar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={deleteSelectedImages}
                      icon="fas fa-trash"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Images Grid/List */}
          {filteredImages.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-images text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron imágenes
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Sube algunas imágenes para comenzar
              </p>
              <Button
                variant="primary"
                onClick={() => setShowUploader(true)}
                icon="fas fa-upload"
              >
                Subir Primera Imagen
              </Button>
            </Card>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <Card key={image.id} className="overflow-hidden group relative">
                  {/* Selection checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleImageSelection(image.id)}
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                    />
                  </div>

                  {/* Status badges */}
                  <div className="absolute top-2 right-2 z-10 space-y-1">
                    {!image.published && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        Borrador
                      </span>
                    )}
                    {image.featured && (
                      <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Destacada
                      </span>
                    )}
                  </div>

                  <div className="relative aspect-square">
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleImageStatus(image.id, 'featured')}
                          className={`p-2 rounded-full ${
                            image.featured ? 'bg-yellow-500' : 'bg-white bg-opacity-20'
                          } text-white hover:bg-opacity-80`}
                          title={image.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                        >
                          <i className="fas fa-star" />
                        </button>
                        
                        <button
                          onClick={() => toggleImageStatus(image.id, 'published')}
                          className={`p-2 rounded-full ${
                            image.published ? 'bg-green-500' : 'bg-red-500'
                          } text-white hover:bg-opacity-80`}
                          title={image.published ? 'Despublicar' : 'Publicar'}
                        >
                          <i className={`fas ${image.published ? 'fa-eye' : 'fa-eye-slash'}`} />
                        </button>
                        
                        <button
                          className="p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-80"
                          title="Ver detalles"
                        >
                          <i className="fas fa-edit" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                      {image.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {formatDate(image.uploadDate)} • {image.size}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{image.dimensions}</span>
                      <span>{image.views} vistas</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-3">
              {filteredImages.map((image) => (
                <Card key={image.id} className="p-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => handleImageSelection(image.id)}
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                    />
                    
                    <img
                      src={image.thumbnail}
                      alt={image.title}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {image.title}
                        </h4>
                        {image.featured && (
                          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs px-2 py-1 rounded">
                            Destacada
                          </span>
                        )}
                        {!image.published && (
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded">
                            Borrador
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {image.description || 'Sin descripción'}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formatDate(image.uploadDate)}</span>
                        <span>{image.size}</span>
                        <span>{image.dimensions}</span>
                        <span>{image.views} vistas</span>
                        <span>{image.likes} likes</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleImageStatus(image.id, 'featured')}
                        icon="fas fa-star"
                        className={image.featured ? 'text-yellow-500' : ''}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleImageStatus(image.id, 'published')}
                        icon={`fas ${image.published ? 'fa-eye' : 'fa-eye-slash'}`}
                        className={image.published ? 'text-green-500' : 'text-red-500'}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon="fas fa-edit"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Bulk Actions */}
          {filteredImages.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectedImages.length === filteredImages.length ? clearSelection : selectAllImages}
                >
                  {selectedImages.length === filteredImages.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {filteredImages.length} de {images.length} imágenes
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageUpload;