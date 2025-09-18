import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import VideoUploader from '../../components/VideoUploader';
import LoadingSpinner from '../../components/LoadingSpinner';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-list' },
    { id: 'cooking', name: 'Cocina', icon: 'fas fa-utensils' },
    { id: 'behind-scenes', name: 'Detrás de cámaras', icon: 'fas fa-camera' },
    { id: 'reviews', name: 'Reseñas', icon: 'fas fa-star' },
    { id: 'tutorials', name: 'Tutoriales', icon: 'fas fa-graduation-cap' },
    { id: 'events', name: 'Eventos', icon: 'fas fa-calendar' }
  ];

  // Mock data para videos
  const mockVideos = [
    {
      id: 1,
      title: 'Cómo hacemos nuestra Pizza Margarita',
      description: 'Descubre el proceso artesanal detrás de nuestra pizza más popular.',
      category: 'cooking',
      duration: '5:32',
      views: 15420,
      likes: 1203,
      thumbnail: '/video-thumb-1.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      uploadDate: '2024-01-15',
      status: 'published',
      featured: true,
      tags: ['pizza', 'margarita', 'cocina', 'artesanal'],
      author: 'Admin'
    },
    {
      id: 2,
      title: 'Un día en Pizza4U - Detrás de cámaras',
      description: 'Acompáñanos en un día típico en nuestro restaurante.',
      category: 'behind-scenes',
      duration: '8:15',
      views: 9876,
      likes: 654,
      thumbnail: '/video-thumb-2.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      uploadDate: '2024-01-10',
      status: 'published',
      featured: false,
      tags: ['equipo', 'restaurante', 'día'],
      author: 'Admin'
    },
    {
      id: 3,
      title: 'Tutorial: Masa de pizza perfecta en casa',
      description: 'Aprende a hacer la masa de pizza perfecta en tu casa.',
      category: 'tutorials',
      duration: '12:20',
      views: 23456,
      likes: 2103,
      thumbnail: '/video-thumb-3.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      uploadDate: '2024-01-05',
      status: 'draft',
      featured: true,
      tags: ['tutorial', 'masa', 'casa', 'diy'],
      author: 'Chef Mario'
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideos(mockVideos);
      setFilteredVideos(mockVideos);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar videos
  useEffect(() => {
    let filtered = videos.filter(video => {
      const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'popular':
          return b.views - a.views;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.uploadDate) - new Date(a.uploadDate);
      }
    });

    setFilteredVideos(filtered);
  }, [videos, selectedCategory, searchQuery, sortBy]);

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

  const getStatusInfo = (status) => {
    const statusMap = {
      published: { name: 'Publicado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'fas fa-check-circle' },
      draft: { name: 'Borrador', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: 'fas fa-edit' },
      processing: { name: 'Procesando', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: 'fas fa-spinner fa-spin' },
      archived: { name: 'Archivado', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400', icon: 'fas fa-archive' }
    };
    return statusMap[status] || statusMap.draft;
  };

  const handleUploadVideo = async (uploadedVideos) => {
    // Simular procesamiento de video
    const newVideos = Array.isArray(uploadedVideos) ? uploadedVideos : [uploadedVideos];
    
    newVideos.forEach(video => {
      const newVideo = {
        id: Date.now() + Math.random(),
        title: video.name || 'Video sin título',
        description: '',
        category: 'cooking',
        duration: video.duration ? formatDuration(video.duration) : '0:00',
        views: 0,
        likes: 0,
        thumbnail: video.thumbnail,
        videoUrl: video.url,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
        featured: false,
        tags: [],
        author: 'Admin'
      };
      
      setVideos(prev => [newVideo, ...prev]);
      
      // Simular que termina el procesamiento después de 3 segundos
      setTimeout(() => {
        setVideos(prev => prev.map(v => 
          v.id === newVideo.id 
            ? { ...v, status: 'draft' }
            : v
        ));
      }, 3000);
    });
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este video?')) {
      setVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };

  const updateVideoStatus = (videoId, newStatus) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, status: newStatus } : video
    ));
  };

  const toggleFeatured = (videoId) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId ? { ...video, featured: !video.featured } : video
    ));
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const VideoModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      category: 'cooking',
      tags: '',
      featured: false
    });

    useEffect(() => {
      if (editingVideo) {
        setFormData({
          title: editingVideo.title,
          description: editingVideo.description,
          category: editingVideo.category,
          tags: editingVideo.tags.join(', '),
          featured: editingVideo.featured
        });
      }
    }, [editingVideo]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const videoData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingVideo) {
        setVideos(prev => prev.map(v => 
          v.id === editingVideo.id 
            ? { ...v, ...videoData }
            : v
        ));
      }

      setShowUploadModal(false);
      setEditingVideo(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingVideo ? 'Editar Video' : 'Subir Nuevo Video'}
            </h2>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          <div className="p-6">
            {!editingVideo && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Subir Videos
                </h3>
                <VideoUploader
                  onUpload={handleUploadVideo}
                  multiple={true}
                  maxFiles={5}
                  maxSizeMB={500}
                />
              </div>
            )}

            {editingVideo && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {categories.filter(cat => cat.id !== 'all').map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="pizza, cocina, tutorial"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Video destacado
                    </span>
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando videos..." />;
  }

  return (
    <>
      <SEO 
        title="Gestión de Videos - Admin Pizza4U"
        description="Administra los videos del restaurante"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Videos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Administra y organiza el contenido de video
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-download"
                >
                  Exportar Lista
                </Button>
                <Button
                  variant="primary"
                  icon="fas fa-upload"
                  onClick={() => setShowUploadModal(true)}
                >
                  Subir Videos
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="max-w-md">
                <SearchBar
                  placeholder="Buscar videos..."
                  onSearch={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  showSuggestions={false}
                />
              </div>

              {/* Category Filter */}
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
                        {videos.filter(v => v.category === category.id).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ordenar por:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="popular">Más populares</option>
                  <option value="alphabetical">Alfabético</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-video text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron videos
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Comienza subiendo tu primer video
              </p>
              <Button
                variant="primary"
                onClick={() => setShowUploadModal(true)}
                icon="fas fa-upload"
              >
                Subir Video
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => {
                const statusInfo = getStatusInfo(video.status);
                return (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-video.jpg';
                        }}
                      />
                      
                      {/* Duration */}
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>

                      {/* Status and Featured badges */}
                      <div className="absolute top-2 left-2 space-y-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
                          <i className={`${statusInfo.icon} mr-1`} />
                          {statusInfo.name}
                        </span>
                        {video.featured && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded block">
                            Destacado
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-2 right-2 space-y-1">
                        <button
                          onClick={() => toggleFeatured(video.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            video.featured ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
                          }`}
                          title={video.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                        >
                          <i className="fas fa-star" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {video.title}
                        </h3>
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                          {categories.find(cat => cat.id === video.category)?.name}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {video.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>{formatViews(video.views)} vistas</span>
                        <span>{video.likes} me gusta</span>
                        <span>Por {video.author}</span>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Subido el {formatDate(video.uploadDate)}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingVideo(video);
                            setShowUploadModal(true);
                          }}
                          icon="fas fa-edit"
                          className="flex-1"
                        >
                          Editar
                        </Button>
                        
                        {video.status === 'draft' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => updateVideoStatus(video.id, 'published')}
                            icon="fas fa-upload"
                          >
                            Publicar
                          </Button>
                        )}
                        
                        {video.status === 'published' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateVideoStatus(video.id, 'archived')}
                            icon="fas fa-archive"
                          >
                            Archivar
                          </Button>
                        )}
                        
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id)}
                          icon="fas fa-trash"
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Results summary */}
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            <p>
              Mostrando {filteredVideos.length} de {videos.length} videos
            </p>
          </div>
        </div>
      </div>

      {/* Upload/Edit Modal */}
      {showUploadModal && <VideoModal />}
    </>
  );
};

export default VideoUpload;