import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';

const MenuEditor = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-list' },
    { id: 'pizzas', name: 'Pizzas', icon: 'fas fa-pizza-slice' },
    { id: 'pastas', name: 'Pastas', icon: 'fas fa-utensils' },
    { id: 'ensaladas', name: 'Ensaladas', icon: 'fas fa-leaf' },
    { id: 'bebidas', name: 'Bebidas', icon: 'fas fa-glass-cheers' },
    { id: 'postres', name: 'Postres', icon: 'fas fa-ice-cream' }
  ];

  // Mock data para productos
  const mockProducts = [
    {
      id: 1,
      name: 'Pizza Margarita',
      category: 'pizzas',
      price: 45,
      cost: 18,
      image: '/pizza-margarita.jpg',
      description: 'Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva',
      ingredients: ['Masa artesanal', 'Salsa de tomate', 'Mozzarella', 'Albahaca'],
      allergens: ['Gluten', 'Lácteos'],
      available: true,
      featured: true,
      preparationTime: '15-20 min',
      nutritionInfo: { calories: 280, protein: 12, carbs: 35, fat: 10 },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Pizza Pepperoni',
      category: 'pizzas',
      price: 52,
      cost: 22,
      image: '/pizza-pepperoni.jpg',
      description: 'Salsa de tomate, mozzarella y pepperoni premium',
      ingredients: ['Masa artesanal', 'Salsa de tomate', 'Mozzarella', 'Pepperoni'],
      allergens: ['Gluten', 'Lácteos'],
      available: true,
      featured: false,
      preparationTime: '15-20 min',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Pasta Carbonara',
      category: 'pastas',
      price: 38,
      cost: 15,
      image: '/pasta-carbonara.jpg',
      description: 'Pasta fresca con panceta, huevo, parmesano y pimienta negra',
      ingredients: ['Pasta fresca', 'Panceta', 'Huevo', 'Parmesano'],
      allergens: ['Gluten', 'Lácteos', 'Huevos'],
      available: true,
      featured: false,
      preparationTime: '12-15 min',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-08'
    },
    {
      id: 4,
      name: 'Ensalada César',
      category: 'ensaladas',
      price: 32,
      cost: 12,
      image: '/ensalada-cesar.jpg',
      description: 'Lechuga romana, crutones, parmesano y aderezo césar',
      ingredients: ['Lechuga romana', 'Crutones', 'Parmesano', 'Aderezo césar'],
      allergens: ['Gluten', 'Lácteos'],
      available: false,
      featured: false,
      preparationTime: '5-8 min',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-14'
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const calculateMargin = (price, cost) => {
    return (((price - cost) / price) * 100).toFixed(1);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  const toggleProductAvailability = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, available: !product.available }
        : product
    ));
  };

  const toggleFeatured = (productId) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, featured: !product.featured }
        : product
    ));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkToggleAvailability = () => {
    setProducts(prev => prev.map(product => 
      selectedProducts.includes(product.id)
        ? { ...product, available: !product.available }
        : product
    ));
    setSelectedProducts([]);
  };

  const handleBulkToggleFeatured = () => {
    setProducts(prev => prev.map(product => 
      selectedProducts.includes(product.id)
        ? { ...product, featured: !product.featured }
        : product
    ));
    setSelectedProducts([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedProducts.length} productos?`)) {
      setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      setSelectedProducts([]);
    }
  };

  const ProductModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'pizzas',
      price: '',
      cost: '',
      description: '',
      ingredients: [],
      allergens: [],
      preparationTime: '',
      available: true,
      featured: false,
      image: ''
    });

    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price.toString(),
          cost: editingProduct.cost.toString(),
          description: editingProduct.description,
          ingredients: editingProduct.ingredients || [],
          allergens: editingProduct.allergens || [],
          preparationTime: editingProduct.preparationTime || '',
          available: editingProduct.available,
          featured: editingProduct.featured,
          image: editingProduct.image || ''
        });
      }
    }, [editingProduct]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        updatedAt: new Date().toISOString().split('T')[0]
      };

      if (editingProduct) {
        setProducts(prev => prev.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productData }
            : p
        ));
      } else {
        const newProduct = {
          ...productData,
          id: Date.now(),
          createdAt: new Date().toISOString().split('T')[0]
        };
        setProducts(prev => [...prev, newProduct]);
      }

      setShowProductModal(false);
      setEditingProduct(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              onClick={() => setShowProductModal(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price and Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio de Venta (Bs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Costo (Bs.) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                {formData.price && formData.cost && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Margen: {calculateMargin(parseFloat(formData.price), parseFloat(formData.cost))}%
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                required
              />
            </div>

            {/* Preparation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tiempo de Preparación
              </label>
              <input
                type="text"
                value={formData.preparationTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
                placeholder="Ej: 15-20 min"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL de Imagen
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image}
                      alt="Vista previa"
                      className="w-32 h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ingredientes
              </label>
              <textarea
                value={formData.ingredients.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  ingredients: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                }))}
                placeholder="Masa artesanal, Salsa de tomate, Mozzarella..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separa los ingredientes con comas
              </p>
            </div>

            {/* Allergens */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Alérgenos
              </label>
              <textarea
                value={formData.allergens.join(', ')}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  allergens: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                }))}
                placeholder="Gluten, Lácteos, Huevos..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separa los alérgenos con comas
              </p>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Disponible para venta
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Producto destacado
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProductModal(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando productos..." />;
  }

  return (
    <>
      <SEO 
        title="Editor de Menú - Admin Pizza4U"
        description="Gestiona los productos del menú del restaurante"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Editor de Menú
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Gestiona los productos del menú del restaurante
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-download"
                >
                  Exportar Menú
                </Button>
                <Button
                  variant="primary"
                  icon="fas fa-plus"
                  onClick={handleAddProduct}
                >
                  Nuevo Producto
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Search */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    placeholder="Buscar productos..."
                    onSearch={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    showSuggestions={false}
                  />
                </div>
                
                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedProducts.length} seleccionados
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkToggleAvailability}
                      icon="fas fa-toggle-on"
                    >
                      Cambiar Disponibilidad
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkToggleFeatured}
                      icon="fas fa-star"
                    >
                      Cambiar Destacado
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleBulkDelete}
                      icon="fas fa-trash"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
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
                        {products.filter(p => p.category === category.id).length}
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
                  <option value="name">Nombre</option>
                  <option value="price-high">Precio (Mayor a menor)</option>
                  <option value="price-low">Precio (Menor a mayor)</option>
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-utensils text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Intenta con otros términos de búsqueda
              </p>
              <Button
                variant="primary"
                onClick={handleAddProduct}
                icon="fas fa-plus"
              >
                Agregar Primer Producto
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                    
                    {/* Status badges */}
                    <div className="absolute top-2 left-2 space-y-1">
                      {!product.available && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          No disponible
                        </span>
                      )}
                      {product.featured && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 space-y-1">
                      <button
                        onClick={() => toggleProductAvailability(product.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          product.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                        }`}
                        title={product.available ? 'Deshabilitar' : 'Habilitar'}
                      >
                        <i className={`fas ${product.available ? 'fa-check' : 'fa-times'}`} />
                      </button>
                      
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          product.featured ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                        title={product.featured ? 'Quitar destacado' : 'Marcar como destacado'}
                      >
                        <i className="fas fa-star" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
                        {categories.find(cat => cat.id === product.category)?.name}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Costo:</span>
                        <span className="text-gray-900 dark:text-white">
                          {formatCurrency(product.cost)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Margen:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {calculateMargin(product.price, product.cost)}%
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        icon="fas fa-edit"
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        icon="fas fa-trash"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Results summary */}
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            <p>
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && <ProductModal />}
    </>
  );
};

export default MenuEditor;