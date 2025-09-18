import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingSpinner from '../LoadingSpinner';

const LazyImage = ({
  src,
  alt = '',
  placeholder = '/placeholder-image.jpg',
  className = '',
  wrapperClassName = '',
  onClick,
  onLoad,
  onError,
  blurDataURL,
  priority = false,
  sizes,
  quality = 75,
  loading = 'lazy',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer para detectar cuando la imagen entra en el viewport
  const handleIntersection = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isVisible) {
      setIsVisible(true);
      setCurrentSrc(src);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    }
  }, [src, isVisible]);

  useEffect(() => {
    if (!priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(handleIntersection, {
        threshold: 0.1,
        rootMargin: '50px'
      });
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setIsError(true);
    setCurrentSrc(placeholder);
    if (onError) onError();
  };

  const imageClasses = `
    transition-all duration-300 ease-in-out
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `.trim();

  return (
    <div 
      className={`relative overflow-hidden ${wrapperClassName}`}
      ref={imgRef}
      onClick={onClick}
    >
      {/* Blur placeholder si está disponible */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
          aria-hidden="true"
        />
      )}

      {/* Loading spinner */}
      {!isLoaded && !isError && isVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <LoadingSpinner size="sm" color="gray" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <i className="fas fa-image text-2xl mb-2" />
          <span className="text-xs">Error al cargar</span>
        </div>
      )}

      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={imageClasses}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        sizes={sizes}
        {...props}
      />
    </div>
  );
};

const LazyImageGallery = ({
  images = [],
  columns = 3,
  gap = 4,
  className = '',
  onImageClick,
  showLightbox = false,
  masonry = false
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (image, index) => {
    if (onImageClick) {
      onImageClick(image, index);
    }
    if (showLightbox) {
      setSelectedImage({ ...image, index });
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (!selectedImage) return;
    
    const currentIndex = selectedImage.index;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    }
    
    setSelectedImage({ ...images[newIndex], index: newIndex });
  };

  // Estilos para diferentes layouts
  const getGridClasses = () => {
    if (masonry) {
      return `columns-1 md:columns-${Math.min(columns, 4)} gap-${gap} space-y-${gap}`;
    }
    return `grid grid-cols-1 md:grid-cols-${Math.min(columns, 4)} gap-${gap}`;
  };

  return (
    <>
      <div className={`${getGridClasses()} ${className}`}>
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className={`${masonry ? 'break-inside-avoid' : ''} cursor-pointer group`}
            onClick={() => handleImageClick(image, index)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <LazyImage
                src={image.src || image.url}
                alt={image.alt || image.title || `Imagen ${index + 1}`}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                wrapperClassName="aspect-square"
                blurDataURL={image.blurDataURL}
              />
              
              {/* Overlay con información */}
              {(image.title || image.description) && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {image.title && (
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                        {image.title}
                      </h3>
                    )}
                    {image.description && (
                      <p className="text-xs opacity-90 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Play icon para videos */}
              {image.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-3 group-hover:bg-opacity-70 transition-all">
                    <i className="fas fa-play text-white text-xl ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {showModal && selectedImage && (
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

          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl p-2 z-10"
          >
            <i className="fas fa-times" />
          </button>

          {/* Image */}
          <div className="max-w-7xl max-h-full p-4 flex flex-col items-center">
            <LazyImage
              src={selectedImage.src || selectedImage.url}
              alt={selectedImage.alt || selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain"
              priority={true}
            />
            
            {/* Image info */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4 text-center text-white max-w-2xl">
                {selectedImage.title && (
                  <h2 className="text-xl font-bold mb-2">{selectedImage.title}</h2>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImage.index + 1} de {images.length}
          </div>
        </div>
      )}
    </>
  );
};

// Hook para precargar imágenes
export const useImagePreloader = (imageSources) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = useCallback(async (sources) => {
    setIsLoading(true);
    const loadPromises = sources.map(src => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, src]));
          resolve(src);
        };
        img.onerror = () => resolve(src);
        img.src = src;
      });
    });

    await Promise.all(loadPromises);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (imageSources && imageSources.length > 0) {
      preloadImages(imageSources);
    }
  }, [imageSources, preloadImages]);

  return { loadedImages, isLoading, preloadImages };
};

// Componente para progressive image loading
export const ProgressiveImage = ({
  src,
  lowQualitySrc,
  alt = '',
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <LazyImage
      src={currentSrc}
      alt={alt}
      className={`${className} ${isLoaded ? '' : 'filter blur-sm'}`}
      {...props}
    />
  );
};

export default LazyImage;
export { LazyImageGallery };