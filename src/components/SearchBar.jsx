import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';
import Button from './Button';

const SearchBar = ({
  placeholder = 'Buscar...',
  value = '',
  onSearch,
  onChange,
  onClear,
  onSuggestionClick,
  debounceMs = 300,
  minChars = 2,
  maxSuggestions = 8,
  showSuggestions = true,
  showHistory = true,
  showCategories = false,
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  autoComplete = true,
  voiceSearch = false,
  advancedFilters = false,
  className = '',
  inputClassName = '',
  isLoading = false,
  error = null,
  size = 'md', // 'sm', 'md', 'lg'
  variant = 'default', // 'default', 'filled', 'outlined'
  disabled = false,
  suggestions = [],
  customSuggestions = null, // Función para obtener sugerencias personalizadas
  highlightQuery = true,
  clearable = true,
  focusOnMount = false,
  onFocus,
  onBlur
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [recentSuggestions, setRecentSuggestions] = useState([]);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const recognitionRef = useRef(null);

  // Configuración de tamaños
  const sizes = {
    sm: {
      input: 'px-3 py-2 text-sm',
      icon: 'text-sm',
      suggestion: 'px-3 py-2 text-sm'
    },
    md: {
      input: 'px-4 py-3 text-base',
      icon: 'text-base',
      suggestion: 'px-4 py-3 text-base'
    },
    lg: {
      input: 'px-6 py-4 text-lg',
      icon: 'text-lg',
      suggestion: 'px-6 py-4 text-lg'
    }
  };

  // Configuración de variantes
  const variants = {
    default: 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600',
    filled: 'bg-gray-50 dark:bg-gray-800 border border-transparent',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600'
  };

  // Cargar historial de búsqueda al montar
  useEffect(() => {
    if (showHistory) {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        try {
          setSearchHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Error loading search history:', error);
        }
      }
    }
  }, [showHistory]);

  // Sincronizar con prop value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Focus automático
  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  // Configurar reconocimiento de voz
  useEffect(() => {
    if (voiceSearch && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleQueryChange(transcript);
        handleSearch(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [voiceSearch]);

  // Búsqueda con debounce
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, debounceMs),
    [onSearch, debounceMs]
  );

  // Obtener sugerencias
  const getSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < minChars) {
      return [];
    }

    // Usar sugerencias personalizadas si están disponibles
    if (customSuggestions) {
      try {
        return await customSuggestions(searchQuery);
      } catch (error) {
        console.error('Error getting custom suggestions:', error);
        return [];
      }
    }

    // Usar sugerencias proporcionadas
    if (suggestions.length > 0) {
      return suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, maxSuggestions);
    }

    // Sugerencias del historial
    if (showHistory) {
      return searchHistory
        .filter(historyItem => 
          historyItem.toLowerCase().includes(searchQuery.toLowerCase()) &&
          historyItem.toLowerCase() !== searchQuery.toLowerCase()
        )
        .slice(0, maxSuggestions);
    }

    return [];
  }, [suggestions, customSuggestions, searchHistory, minChars, maxSuggestions, showHistory]);

  // Actualizar sugerencias cuando cambie la query
  useEffect(() => {
    if (query && isOpen) {
      getSuggestions(query).then(setRecentSuggestions);
    } else {
      setRecentSuggestions([]);
    }
  }, [query, isOpen, getSuggestions]);

  // Manejar cambio en la query
  const handleQueryChange = (newQuery) => {
    setQuery(newQuery);
    setActiveSuggestion(-1);
    
    if (onChange) {
      onChange(newQuery);
    }

    if (newQuery.length >= minChars) {
      debouncedSearch(newQuery);
    }
  };

  // Manejar búsqueda
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    // Agregar al historial
    if (showHistory) {
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(item => item !== searchQuery)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    setIsOpen(false);
    setActiveSuggestion(-1);

    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Manejar teclas
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < recentSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0 && recentSuggestions[activeSuggestion]) {
          const selectedSuggestion = recentSuggestions[activeSuggestion];
          setQuery(selectedSuggestion);
          handleSearch(selectedSuggestion);
        } else {
          handleSearch();
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
        break;
        
      case 'Tab':
        if (isOpen && activeSuggestion >= 0 && recentSuggestions[activeSuggestion]) {
          e.preventDefault();
          setQuery(recentSuggestions[activeSuggestion]);
        }
        break;
    }
  };

  // Manejar click en sugerencia
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  // Limpiar búsqueda
  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    setActiveSuggestion(-1);
    
    if (onClear) {
      onClear();
    }
    
    if (onChange) {
      onChange('');
    }
    
    inputRef.current?.focus();
  };

  // Iniciar búsqueda por voz
  const startVoiceSearch = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  // Resaltar texto de búsqueda
  const highlightText = (text, query) => {
    if (!highlightQuery || !query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 font-medium">
          {part}
        </span>
      ) : part
    );
  };

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Categorías */}
      {showCategories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange?.(category.id)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {category.icon && <i className={`${category.icon} mr-1`} />}
              {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <div className="relative flex items-center">
          {/* Search Icon */}
          <div className={`absolute left-3 pointer-events-none ${sizes[size].icon} text-gray-400`}>
            {isLoading ? (
              <LoadingSpinner size="sm" variant="spinner" color="gray" />
            ) : (
              <i className="fas fa-search" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setIsOpen(true);
              onFocus?.(e);
            }}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full pl-10 pr-12 rounded-lg transition-all duration-200 
              focus:ring-2 focus:ring-primary-500 focus:border-transparent
              ${variants[variant]}
              ${sizes[size].input}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${error ? 'border-red-500 dark:border-red-400' : ''}
              ${inputClassName}
            `}
            autoComplete={autoComplete ? 'on' : 'off'}
          />

          {/* Action Buttons */}
          <div className="absolute right-3 flex items-center space-x-1">
            {/* Clear Button */}
            {clearable && query && (
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Limpiar búsqueda"
              >
                <i className="fas fa-times" />
              </button>
            )}

            {/* Voice Search Button */}
            {voiceSearch && 'webkitSpeechRecognition' in window && (
              <button
                onClick={startVoiceSearch}
                disabled={isListening}
                className={`ml-2 transition-colors ${
                  isListening 
                    ? 'text-red-500 animate-pulse' 
                    : 'text-gray-400 hover:text-primary-500'
                }`}
                title={isListening ? 'Escuchando...' : 'Búsqueda por voz'}
              >
                <i className={`fas ${isListening ? 'fa-microphone' : 'fa-microphone-slash'}`} />
              </button>
            )}

            {/* Advanced Filters Button */}
            {advancedFilters && (
              <button
                className="ml-2 text-gray-400 hover:text-primary-500 transition-colors"
                title="Filtros avanzados"
              >
                <i className="fas fa-sliders-h" />
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Suggestions Dropdown */}
        {isOpen && showSuggestions && (recentSuggestions.length > 0 || (showHistory && searchHistory.length > 0)) && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
          >
            {/* Recent Suggestions */}
            {recentSuggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  Sugerencias
                </div>
                {recentSuggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`
                      w-full text-left transition-colors
                      ${sizes[size].suggestion}
                      ${index === activeSuggestion 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                        : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <i className="fas fa-search mr-3 text-gray-400" />
                    {highlightText(suggestion, query)}
                  </button>
                ))}
              </>
            )}

            {/* Search History */}
            {showHistory && searchHistory.length > 0 && recentSuggestions.length === 0 && (
              <>
                <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  Búsquedas recientes
                </div>
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <button
                    key={`history-${index}`}
                    onClick={() => handleSuggestionClick(historyItem)}
                    className={`
                      w-full text-left transition-colors
                      ${sizes[size].suggestion}
                      ${index === activeSuggestion 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                        : 'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <i className="fas fa-history mr-3 text-gray-400" />
                    {historyItem}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente especializado para búsqueda rápida
export const QuickSearch = ({ onSearch, placeholder = "Búsqueda rápida..." }) => (
  <SearchBar
    placeholder={placeholder}
    onSearch={onSearch}
    size="sm"
    variant="filled"
    showSuggestions={false}
    showHistory={false}
    clearable
    focusOnMount
  />
);

// Componente para búsqueda con filtros
export const FilteredSearch = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onSearch,
  ...props 
}) => (
  <SearchBar
    {...props}
    showCategories
    categories={categories}
    selectedCategory={selectedCategory}
    onCategoryChange={onCategoryChange}
    onSearch={onSearch}
    advancedFilters
  />
);

export default SearchBar;