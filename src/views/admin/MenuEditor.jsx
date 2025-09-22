import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useProducts } from '../../context/ProductsContext'; // ← INTEGRACIÓN CONTEXT
import { useNotifications } from '../../context/NotificationContext';

const MenuEditor = () => {
  // Context integration - reemplaza estado local
  const { 
    products, 
    loading, 
    categories,
    createProduct, 
    updateProduct, 
    deleteProduct, 
    toggleProductAvailability,
    searchProducts,
    getProductsByCategory 
  } = useProducts();

  const { addNotification } = useNotifications();

  // Estados locales solo para UI
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Categorías con todas las del context más "all"
  const allCategories = [
    { id: 'all', name: 'Todos', icon: 'fas fa-list' },
    ...categories.map(cat => ({
      id: cat,
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      icon: getCategoryIcon(cat)
    }))
  ];

  function getCategoryIcon(category) {
    const icons = {
      pizzas: 'fas fa-pizza-slice',
      pastas: 'fas fa-utensils',
      ensaladas: 'fas fa-leaf',
      bebidas: 'fas fa-glass-cheers',
      postres: 'fas fa-ice-cream',
      entradas: 'fas fa-appetizer'
    };
    return icons[category] || 'fas fa-utensils';
  }

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    let filtered = [...products];

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = getProductsByCategory(selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = searchProducts(searchQuery);
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, sortBy, searchProducts, getProductsByCategory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const calculateMargin = (price, cost) => {
    if (!cost) return '0.0';
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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        // El context ya maneja las notificaciones
        setSelectedProducts(prev => prev.filter(id => id !== productId));
      }
    }
  };

  const handleToggleAvailability = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      await toggleProductAvailability(productId, !product.available);
    }
  };

  const handleToggleFeatured = async (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      await updateProduct(productId, { featured: !product.featured });
    }
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

  const handleBulkToggleAvailability = async () => {
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      if (product) {
        await toggleProductAvailability(productId, !product.available);
      }
    }
    setSelectedProducts([]);
  };

  const handleBulkToggleFeatured = async () => {
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId);
      if (product) {
        await updateProduct(productId, { featured: !product.featured });
      }
    }
    setSelectedProducts([]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedProducts.length} productos?`)) {
      for (const productId of selectedProducts) {
        await deleteProduct(productId);
      }
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
      image_url: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          category: editingProduct.category || 'pizzas',
          price: editingProduct.price?.toString() || '',
          cost: editingProduct.cost?.toString() || '',
          description: editingProduct.description || '',
          ingredients: editingProduct.ingredients || [],
          allergens: editingProduct.allergens || [],
          preparationTime: editingProduct.preparation_time || '',
          available: editingProduct.available ?? true,
          featured: editingProduct.featured ?? false,
          image_url: editingProduct.image_url || ''
        });
      } else {
        // Reset form for new product
        setFormData({
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
          image_url: ''
        });
      }
    }, [editingProduct]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        description: formData.description,
        image_url: formData.image_url || null,
        available: formData.available,
        featured: formData.featured,
        preparation_time: formData.preparationTime || null,
        ingredients: formData.ingredients,
        allergens: formData.allergens
      };

      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result.success) {
        setShowProductModal(false);
        setEditingProduct(null);
      }
      
      setIsSubmitting(false);
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
              disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
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
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Costo (Bs.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isSubmitting}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
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
                disabled={isSubmitting}
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {editingProduct ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
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
                {allCategories.map((category) => (
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

              {/* Sort and Select All */}
              <div className="flex items-center justify-between">
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

                {filteredProducts.length > 0 && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === filteredProducts.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Seleccionar todos
                    </span>
                  </label>
                )}
              </div>
            </div>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-utensils text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {products.length === 0 ? 'No hay productos' : 'No se encontraron productos'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {products.length === 0 
                  ? 'Comienza agregando tu primer producto al menú'
                  : 'Intenta con otros términos de búsqueda'
                }
              </p>
              <Button
                variant="primary"
                onClick={handleAddProduct}
                icon="fas fa-plus"
              >
                {products.length === 0 ? 'Agregar Primer Producto' : 'Nuevo Producto'}
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative group">
                    {/* Selection checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>

                    <img
                      src={product.image_url || '/placeholder-food.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                    
                    {/* Status badges */}
                    <div className="absolute top-2 right-2 space-y-1">
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

                    {/* Quick Actions */}
                    <div className="absolute bottom-2 right-2 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleAvailability(product.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                          product.available ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                        }`}
                        title={product.available ? 'Deshabilitar' : 'Habilitar'}
                      >
                        <i className={`fas ${product.available ? 'fa-check' : 'fa-times'}`} />
                      </button>
                      
                      <button
                        onClick={() => handleToggleFeatured(product.id)}
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
                        {product.category}
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
                      {product.cost && (
                        <>
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
                        </>
                      )}
                      {product.preparation_time && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tiempo:</span>
                          <span className="text-gray-900 dark:text-white">
                            {product.preparation_time}
                          </span>
                        </div>
                      )}
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