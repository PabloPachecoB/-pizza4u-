import React, { useState, useRef } from 'react';
import Button from './Button';

const VideoUploader = ({
  onUpload,
  onRemove,
  multiple = false,
  maxFiles = 3,
  maxSizeMB = 100,
  acceptedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  existingVideos = [],
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewVideos, setPreviewVideos] = useState(existingVideos || []);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no válido. Tipos permitidos: ${acceptedTypes.join(', ')}`);
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`El archivo es muy grande. Tamaño máximo: ${maxSizeMB}MB`);
    }
    return true;
  };

  const createVideoPreview = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const url = URL.createObjectURL(file);

      video.addEventListener('loadedmetadata', () => {
        // Crear thumbnail del primer frame
        canvas.width = 320;
        canvas.height = (video.videoHeight / video.videoWidth) * 320;
        video.currentTime = 1; // Ir al segundo 1 para mejor thumbnail
      });

      video.addEventListener('seeked', () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
        
        resolve({
          id: Date.now() + Math.random(),
          file,
          url,
          thumbnail,
          name: file.name,
          size: file.size,
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          isNew: true
        });

        URL.revokeObjectURL(url);
      });

      video.src = url;
    });
  };

  const handleFiles = async (files) => {
    if (disabled || uploading) return;

    const fileArray = Array.from(files);
    const totalFiles = previewVideos.length + fileArray.length;

    if (!multiple && fileArray.length > 1) {
      alert('Solo se permite un archivo');
      return;
    }

    if (totalFiles > maxFiles) {
      alert(`Máximo ${maxFiles} videos permitidos`);
      return;
    }

    try {
      setUploading(true);
      const newPreviews = [];

      for (const file of fileArray) {
        validateFile(file);
        
        // Simular progreso de upload
        const fileId = Date.now() + Math.random();
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Simular progreso
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 100) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: Math.min(currentProgress + 10, 100) };
          });
        }, 200);

        const preview = await createVideoPreview(file);
        preview.uploadId = fileId;
        newPreviews.push(preview);

        // Completar progreso
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 1000);
        }, 2000);
      }

      const updatedPreviews = [...previewVideos, ...newPreviews];
      setPreviewVideos(updatedPreviews);

      if (onUpload) {
        await onUpload(multiple ? newPreviews : newPreviews[0]);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setTimeout(() => setUploading(false), 2500);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragging && !disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  };

  const handleRemoveVideo = async (videoId) => {
    if (disabled || uploading) return;

    try {
      const videoToRemove = previewVideos.find(video => video.id === videoId);
      const updatedPreviews = previewVideos.filter(video => video.id !== videoId);
      
      setPreviewVideos(updatedPreviews);

      if (onRemove && videoToRemove) {
        await onRemove(videoToRemove);
      }

      // Limpiar URL si existe
      if (videoToRemove?.url && videoToRemove.isNew) {
        URL.revokeObjectURL(videoToRemove.url);
      }
    } catch (error) {
      console.error('Error removing video:', error);
      alert('Error al eliminar el video');
    }
  };

  const openFileDialog = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || uploading}
        />

        <div className="space-y-4">
          <div className={`text-4xl ${isDragging ? 'text-primary-500' : 'text-gray-400'}`}>
            {uploading ? (
              <i className="fas fa-spinner fa-spin" />
            ) : (
              <i className="fas fa-video" />
            )}
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {uploading ? 'Subiendo videos...' : 'Subir videos'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Arrastra y suelta videos aquí, o haz clic para seleccionar
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              Máximo {maxFiles} archivos • {maxSizeMB}MB por archivo • {acceptedTypes.join(', ')}
            </p>
          </div>

          {!uploading && (
            <Button
              variant="primary"
              size="sm"
              icon="fas fa-plus"
              disabled={disabled}
            >
              Seleccionar Videos
            </Button>
          )}
        </div>
      </div>

      {/* Preview Grid */}
      {previewVideos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewVideos.map((video) => {
            const progress = uploadProgress[video.uploadId];
            const isUploading = progress !== undefined;

            return (
              <div key={video.id} className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                {/* Video Thumbnail */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="fas fa-video text-4xl text-gray-400" />
                    </div>
                  )}
                  
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <i className="fas fa-play text-gray-700 text-lg ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white truncate mb-2">
                    {video.name || 'Video sin título'}
                  </h4>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {video.size && (
                      <p>Tamaño: {formatFileSize(video.size)}</p>
                    )}
                    {video.width && video.height && (
                      <p>Resolución: {video.width}x{video.height}</p>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Subiendo...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo(video.id);
                  }}
                  disabled={disabled || isUploading}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                  title="Eliminar video"
                >
                  <i className="fas fa-trash text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Status */}
      {uploading && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center">
            <i className="fas fa-upload text-blue-500 mr-2" />
            <span className="text-blue-700 dark:text-blue-400 text-sm">
              Procesando videos... Esto puede tomar unos momentos.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;