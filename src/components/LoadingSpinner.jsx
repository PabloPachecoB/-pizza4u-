import React from 'react';

const LoadingSpinner = ({
  size = 'md',
  variant = 'spinner', // 'spinner', 'dots', 'bars', 'pulse', 'bouncing'
  color = 'primary', // 'primary', 'secondary', 'white', 'gray', 'custom'
  text = null,
  overlay = false,
  fullScreen = false,
  className = '',
  customColor = null,
  speed = 'normal' // 'slow', 'normal', 'fast'
}) => {
  // Configuración de tamaños
  const sizes = {
    xs: {
      spinner: 'w-4 h-4',
      dots: 'w-1 h-1',
      bars: 'w-1 h-3',
      pulse: 'w-4 h-4',
      bouncing: 'w-2 h-2',
      text: 'text-xs'
    },
    sm: {
      spinner: 'w-6 h-6',
      dots: 'w-1.5 h-1.5',
      bars: 'w-1.5 h-4',
      pulse: 'w-6 h-6',
      bouncing: 'w-3 h-3',
      text: 'text-sm'
    },
    md: {
      spinner: 'w-8 h-8',
      dots: 'w-2 h-2',
      bars: 'w-2 h-6',
      pulse: 'w-8 h-8',
      bouncing: 'w-4 h-4',
      text: 'text-base'
    },
    lg: {
      spinner: 'w-12 h-12',
      dots: 'w-3 h-3',
      bars: 'w-3 h-8',
      pulse: 'w-12 h-12',
      bouncing: 'w-6 h-6',
      text: 'text-lg'
    },
    xl: {
      spinner: 'w-16 h-16',
      dots: 'w-4 h-4',
      bars: 'w-4 h-12',
      pulse: 'w-16 h-16',
      bouncing: 'w-8 h-8',
      text: 'text-xl'
    }
  };

  // Configuración de colores
  const colors = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    white: 'text-white',
    gray: 'text-gray-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500'
  };

  // Configuración de velocidades
  const speeds = {
    slow: 'duration-1000',
    normal: 'duration-700',
    fast: 'duration-500'
  };

  const getColorClass = () => {
    if (customColor) {
      return '';
    }
    return colors[color] || colors.primary;
  };

  const getSpeedClass = () => {
    return speeds[speed] || speeds.normal;
  };

  const getSizeClass = () => {
    return sizes[size]?.[variant] || sizes.md[variant];
  };

  const getTextSizeClass = () => {
    return sizes[size]?.text || sizes.md.text;
  };

  // Componente Spinner clásico
  const SpinnerComponent = () => (
    <svg
      className={`animate-spin ${getSizeClass()} ${getColorClass()} ${getSpeedClass()}`}
      style={customColor ? { color: customColor } : {}}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Componente Dots (puntos)
  const DotsComponent = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${getSizeClass()} ${getColorClass()} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1s',
            ...(customColor ? { backgroundColor: customColor } : {})
          }}
        />
      ))}
    </div>
  );

  // Componente Bars (barras)
  const BarsComponent = () => (
    <div className="flex space-x-1">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className={`${getSizeClass()} ${getColorClass()} animate-pulse`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1.2s',
            ...(customColor ? { backgroundColor: customColor } : {})
          }}
        />
      ))}
    </div>
  );

  // Componente Pulse
  const PulseComponent = () => (
    <div
      className={`${getSizeClass()} ${getColorClass()} rounded-full animate-ping`}
      style={customColor ? { backgroundColor: customColor } : {}}
    />
  );

  // Componente Bouncing (rebotes)
  const BouncingComponent = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${getSizeClass()} ${getColorClass()} rounded-full`}
          style={{
            animation: `bounce 1.4s ease-in-out ${index * 0.16}s infinite`,
            ...(customColor ? { backgroundColor: customColor } : {})
          }}
        />
      ))}
    </div>
  );

  // Seleccionar componente según variante
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsComponent />;
      case 'bars':
        return <BarsComponent />;
      case 'pulse':
        return <PulseComponent />;
      case 'bouncing':
        return <BouncingComponent />;
      case 'spinner':
      default:
        return <SpinnerComponent />;
    }
  };

  // Contenido del loader
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {renderSpinner()}
      {text && (
        <p className={`${getTextSizeClass()} font-medium ${getColorClass()}`}>
          {text}
        </p>
      )}
    </div>
  );

  // Si es overlay de pantalla completa
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
        {content}
      </div>
    );
  }

  // Si es overlay simple
  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  // Loader simple
  return content;
};

// Componentes especializados para casos comunes
export const ButtonSpinner = ({ size = 'sm', color = 'white' }) => (
  <LoadingSpinner
    size={size}
    variant="spinner"
    color={color}
    className="mr-2"
  />
);

export const PageLoader = ({ text = 'Cargando...', variant = 'spinner' }) => (
  <LoadingSpinner
    size="lg"
    variant={variant}
    text={text}
    fullScreen
    color="primary"
  />
);

export const CardLoader = ({ text = null, variant = 'pulse' }) => (
  <LoadingSpinner
    size="md"
    variant={variant}
    text={text}
    overlay
    color="gray"
    className="p-8"
  />
);

export const InlineLoader = ({ size = 'sm', variant = 'spinner', color = 'primary' }) => (
  <LoadingSpinner
    size={size}
    variant={variant}
    color={color}
    className="inline-flex"
  />
);

// Hook personalizado para estados de carga
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    LoadingSpinner: (props) => isLoading ? <LoadingSpinner {...props} /> : null
  };
};

// Componente para mostrar skeleton loading
export const SkeletonLoader = ({ 
  lines = 3, 
  width = '100%', 
  height = '1rem',
  className = '',
  animated = true 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`bg-gray-300 dark:bg-gray-700 rounded ${animated ? 'animate-pulse' : ''}`}
        style={{
          width: Array.isArray(width) ? width[index] || width[0] : width,
          height: Array.isArray(height) ? height[index] || height[0] : height
        }}
      />
    ))}
  </div>
);

// Componente para loading states con retry
export const LoadingWithRetry = ({
  isLoading,
  error,
  onRetry,
  loadingProps = {},
  children
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-500 text-center">
          <i className="fas fa-exclamation-triangle text-3xl mb-2" />
          <p className="font-medium">Error al cargar</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <i className="fas fa-redo mr-2" />
            Reintentar
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner overlay {...loadingProps} />;
  }

  return children;
};

export default LoadingSpinner;