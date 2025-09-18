// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000;

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refresh: '/auth/refresh',
    profile: '/auth/profile'
  },
  
  // Menu
  menu: {
    items: '/menu/items',
    categories: '/menu/categories',
    item: (id) => `/menu/items/${id}`
  },
  
  // Orders
  orders: {
    create: '/orders',
    list: '/orders',
    detail: (id) => `/orders/${id}`,
    update: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`
  },
  
  // Cart
  cart: {
    get: '/cart',
    add: '/cart/add',
    update: '/cart/update',
    remove: '/cart/remove',
    clear: '/cart/clear'
  },
  
  // Users
  users: {
    list: '/users',
    detail: (id) => `/users/${id}`,
    create: '/users',
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`
  },
  
  // Media
  media: {
    upload: '/media/upload',
    videos: '/media/videos',
    images: '/media/images',
    delete: (id) => `/media/${id}`
  },
  
  // Reviews
  reviews: {
    list: '/reviews',
    create: '/reviews',
    update: (id) => `/reviews/${id}`,
    delete: (id) => `/reviews/${id}`
  },
  
  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    sales: '/analytics/sales',
    users: '/analytics/users',
    products: '/analytics/products'
  },
  
  // Notifications
  notifications: {
    list: '/notifications',
    send: '/notifications/send',
    markRead: (id) => `/notifications/${id}/read`
  }
};

// Request interceptor
const createRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    signal: controller.signal,
    ...options
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    clearTimeout(timeoutId);

    // Handle different response types
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError('Network error', 0, { originalError: error });
  }
};

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// API methods
export const api = {
  // Generic methods
  get: (url, options = {}) => createRequest(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => createRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  }),
  put: (url, data, options = {}) => createRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  }),
  patch: (url, data, options = {}) => createRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  }),
  delete: (url, options = {}) => createRequest(url, { method: 'DELETE', ...options }),

  // Authentication
  auth: {
    login: async (credentials) => {
      const response = await api.post(endpoints.auth.login, credentials);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    },
    
    logout: async () => {
      try {
        await api.post(endpoints.auth.logout);
      } finally {
        localStorage.removeItem('authToken');
      }
    },
    
    register: (userData) => api.post(endpoints.auth.register, userData),
    getProfile: () => api.get(endpoints.auth.profile),
    updateProfile: (data) => api.put(endpoints.auth.profile, data)
  },

  // Menu
  menu: {
    getItems: (params = {}) => api.get(endpoints.menu.items, { params }),
    getItem: (id) => api.get(endpoints.menu.item(id)),
    createItem: (data) => api.post(endpoints.menu.items, data),
    updateItem: (id, data) => api.put(endpoints.menu.item(id), data),
    deleteItem: (id) => api.delete(endpoints.menu.item(id)),
    getCategories: () => api.get(endpoints.menu.categories)
  },

  // Orders
  orders: {
    create: (orderData) => api.post(endpoints.orders.create, orderData),
    getList: (params = {}) => api.get(endpoints.orders.list, { params }),
    getDetail: (id) => api.get(endpoints.orders.detail(id)),
    update: (id, data) => api.put(endpoints.orders.update(id), data),
    cancel: (id) => api.post(endpoints.orders.cancel(id))
  },

  // Cart
  cart: {
    get: () => api.get(endpoints.cart.get),
    addItem: (item) => api.post(endpoints.cart.add, item),
    updateItem: (itemId, data) => api.put(endpoints.cart.update, { itemId, ...data }),
    removeItem: (itemId) => api.delete(endpoints.cart.remove, { data: { itemId } }),
    clear: () => api.delete(endpoints.cart.clear)
  },

  // Users (Admin)
  users: {
    getList: (params = {}) => api.get(endpoints.users.list, { params }),
    getDetail: (id) => api.get(endpoints.users.detail(id)),
    create: (userData) => api.post(endpoints.users.create, userData),
    update: (id, data) => api.put(endpoints.users.update(id), data),
    delete: (id) => api.delete(endpoints.users.delete(id))
  },

  // Media
  media: {
    uploadFile: async (file, type = 'image') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      return createRequest(endpoints.media.upload, {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });
    },
    
    getVideos: (params = {}) => api.get(endpoints.media.videos, { params }),
    getImages: (params = {}) => api.get(endpoints.media.images, { params }),
    deleteMedia: (id) => api.delete(endpoints.media.delete(id))
  },

  // Reviews
  reviews: {
    getList: (params = {}) => api.get(endpoints.reviews.list, { params }),
    create: (reviewData) => api.post(endpoints.reviews.create, reviewData),
    update: (id, data) => api.put(endpoints.reviews.update(id), data),
    delete: (id) => api.delete(endpoints.reviews.delete(id))
  },

  // Analytics
  analytics: {
    getDashboard: (params = {}) => api.get(endpoints.analytics.dashboard, { params }),
    getSales: (params = {}) => api.get(endpoints.analytics.sales, { params }),
    getUsers: (params = {}) => api.get(endpoints.analytics.users, { params }),
    getProducts: (params = {}) => api.get(endpoints.analytics.products, { params })
  },

  // Notifications
  notifications: {
    getList: (params = {}) => api.get(endpoints.notifications.list, { params }),
    send: (notificationData) => api.post(endpoints.notifications.send, notificationData),
    markAsRead: (id) => api.post(endpoints.notifications.markRead(id))
  }
};

// Mock API responses for development
export const mockApi = {
  // Mock data
  mockData: {
    user: {
      id: 1,
      name: 'Admin User',
      email: 'admin@pizza4u.com',
      role: 'admin',
      avatar: 'AU'
    },
    
    menuItems: [
      {
        id: 1,
        name: 'Pizza Margarita',
        category: 'pizzas',
        price: 45,
        description: 'Salsa de tomate, mozzarella fresca y albahaca',
        image: '/pizza-margarita.jpg',
        available: true
      }
      // ... more items
    ],
    
    orders: [
      {
        id: 1001,
        userId: 1,
        items: [],
        total: 95.50,
        status: 'pending',
        createdAt: new Date().toISOString(),
        deliveryAddress: 'Calle Principal 123'
      }
      // ... more orders
    ]
  },

  // Mock methods with delays to simulate network
  delay: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Override API methods for development
  init() {
    if (import.meta.env.MODE === 'development' && !import.meta.env.VITE_USE_REAL_API) {
      // Replace real API calls with mock ones
      api.auth.login = async (credentials) => {
        await this.delay(1000);
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
          const token = 'mock-token-' + Date.now();
          localStorage.setItem('authToken', token);
          return { success: true, token, user: this.mockData.user };
        }
        throw new ApiError('Invalid credentials', 401);
      };

      api.menu.getItems = async () => {
        await this.delay(500);
        return { data: this.mockData.menuItems, total: this.mockData.menuItems.length };
      };

      api.orders.getList = async () => {
        await this.delay(800);
        return { data: this.mockData.orders, total: this.mockData.orders.length };
      };

      // Add more mock implementations as needed
    }
  }
};

// Request/Response interceptors
export const interceptors = {
  request: {
    add: (interceptor) => {
      // Add request interceptor logic
    }
  },
  
  response: {
    add: (interceptor) => {
      // Add response interceptor logic
    }
  }
};

// Initialize mock API if needed
mockApi.init();

export default api