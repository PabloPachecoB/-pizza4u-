import { format, parseISO, isValid, differenceInDays, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

// ===================
// DATE UTILITIES
// ===================

export const dateUtils = {
  /**
   * Format a date to a readable string
   * @param {string|Date} date - Date to format
   * @param {string} formatStr - Format string
   * @returns {string} Formatted date
   */
  format: (date, formatStr = 'dd/MM/yyyy') => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Fecha inválida';
      return format(dateObj, formatStr, { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  },

  /**
   * Get relative time string (hace 2 horas, ayer, etc.)
   */
  timeAgo: (date) => {
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return 'Fecha inválida';

      if (isToday(dateObj)) {
        return `Hoy ${format(dateObj, 'HH:mm')}`;
      }
      
      if (isYesterday(dateObj)) {
        return `Ayer ${format(dateObj, 'HH:mm')}`;
      }

      const daysDiff = differenceInDays(new Date(), dateObj);
      
      if (daysDiff < 7) {
        return `Hace ${daysDiff} días`;
      }
      
      return format(dateObj, 'dd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  },

  /**
   * Check if date is within business hours
   */
  isBusinessHours: (date = new Date()) => {
    const hour = date.getHours();
    const day = date.getDay();
    
    // Monday to Sunday: 11:00 - 23:00
    return day >= 0 && day <= 6 && hour >= 11 && hour < 23;
  }
};

// ===================
// STRING UTILITIES
// ===================

export const stringUtils = {
  /**
   * Capitalize first letter of each word
   */
  titleCase: (str) => {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str, length = 100, suffix = '...') => {
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + suffix;
  },

  /**
   * Remove special characters and spaces for URL-friendly strings
   */
  slugify: (str) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  /**
   * Generate random string
   */
  randomString: (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Extract initials from name
   */
  getInitials: (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }
};

// ===================
// NUMBER UTILITIES
// ===================

export const numberUtils = {
  /**
   * Format currency for Bolivia
   */
  formatCurrency: (amount, currency = 'BOB') => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  },

  /**
   * Format large numbers with K, M notation
   */
  formatCompact: (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  },

  /**
   * Calculate percentage
   */
  percentage: (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  },

  /**
   * Generate random number in range
   */
  randomInRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Round to specific decimal places
   */
  roundTo: (num, decimals = 2) => {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
};

// ===================
// VALIDATION UTILITIES
// ===================

export const validationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate phone number (Bolivia format)
   */
  isValidPhone: (phone) => {
    const phoneRegex = /^(\+591|591)?[-.\s]?[67]\d{7}$/;
    return phoneRegex.test(phone);
  },

  /**
   * Validate password strength
   */
  validatePassword: (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      errors: {
        minLength: password.length < minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumbers: !hasNumbers,
        hasSpecialChar: !hasSpecialChar
      },
      strength: [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length
    };
  },

  /**
   * Validate required fields
   */
  validateRequired: (fields) => {
    const errors = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors[key] = 'Este campo es requerido';
      }
    });
    return errors;
  }
};

// ===================
// ARRAY UTILITIES
// ===================

export const arrayUtils = {
  /**
   * Remove duplicates from array
   */
  unique: (arr, key = null) => {
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }
    return [...new Set(arr)];
  },

  /**
   * Group array by key
   */
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const group = item[key];
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {});
  },

  /**
   * Sort array by multiple keys
   */
  sortBy: (arr, keys) => {
    return arr.sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
      }
      return 0;
    });
  },

  /**
   * Shuffle array
   */
  shuffle: (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  },

  /**
   * Chunk array into smaller arrays
   */
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }
};

// ===================
// OBJECT UTILITIES
// ===================

export const objectUtils = {
  /**
   * Deep clone object
   */
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Check if object is empty
   */
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  /**
   * Pick specific keys from object
   */
  pick: (obj, keys) => {
    const result = {};
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  /**
   * Omit specific keys from object
   */
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  /**
   * Flatten nested object
   */
  flatten: (obj, prefix = '') => {
    const flattened = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, objectUtils.flatten(value, newKey));
      } else {
        flattened[newKey] = value;
      }
    });
    return flattened;
  }
};

// ===================
// LOCAL STORAGE UTILITIES
// ===================

export const storageUtils = {
  /**
   * Set item in localStorage with error handling
   */
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  /**
   * Get item from localStorage with error handling
   */
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   */
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  /**
   * Clear all localStorage
   */
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// ===================
// FILE UTILITIES
// ===================

export const fileUtils = {
  /**
   * Format file size
   */
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  /**
   * Get file extension
   */
  getExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  /**
   * Check if file is image
   */
  isImage: (file) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return imageTypes.includes(file.type);
  },

  /**
   * Check if file is video
   */
  isVideo: (file) => {
    const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    return videoTypes.includes(file.type);
  },

  /**
   * Convert file to base64
   */
  toBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
};

// ===================
// URL UTILITIES
// ===================

export const urlUtils = {
  /**
   * Get query parameters from URL
   */
  getQueryParams: (url = window.location.href) => {
    const params = {};
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  },

  /**
   * Build URL with query parameters
   */
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, value);
      }
    });
    return url.toString();
  },

  /**
   * Check if URL is valid
   */
  isValidUrl: (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }
};

// ===================
// DEBOUNCE UTILITY
// ===================

export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// ===================
// THROTTLE UTILITY
// ===================

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===================
// DEVICE UTILITIES
// ===================

export const deviceUtils = {
  /**
   * Check if device is mobile
   */
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  /**
   * Check if device is tablet
   */
  isTablet: () => {
    return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
  },

  /**
   * Get device type
   */
  getDeviceType: () => {
    if (deviceUtils.isMobile()) return 'mobile';
    if (deviceUtils.isTablet()) return 'tablet';
    return 'desktop';
  },

  /**
   * Check if device supports touch
   */
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
};

// ===================
// COLOR UTILITIES
// ===================

export const colorUtils = {
  /**
   * Convert hex to RGB
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  /**
   * Generate random color
   */
  randomColor: () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  },

  /**
   * Check if color is light
   */
  isLight: (color) => {
    const rgb = colorUtils.hexToRgb(color);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
  }
};

// ===================
// EXPORT ALL UTILITIES
// ===================

export default {
  dateUtils,
  stringUtils,
  numberUtils,
  validationUtils,
  arrayUtils,
  objectUtils,
  storageUtils,
  fileUtils,
  urlUtils,
  deviceUtils,
  colorUtils,
  debounce,
  throttle
};