import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext'; // ← NUEVO IMPORT
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import SEO from '../../components/SEO';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FavoriteButton from '../../components/FavoriteButton';
import LoadingSpinner from '../../components/LoadingSpinner';

const Menu = () => {
  // ← REEMPLAZADO: datos mock por context
  const {
    products,
    loading,
    categories,
    getProductsByCategory,
    searchProducts
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'rating'
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Categorías con íconos
  const categoryData = [
    { id: 'all', name: 'Todo', icon: 'fas fa-list' },
    { id: 'pizzas', name: 'Pizzas', icon: 'fas fa-pizza-slice' },
    { id: 'pastas', name: 'Pastas', icon: 'fas fa-utensils' },
    { id: 'ensaladas', name: 'Ensaladas', icon: 'fas fa-leaf' },
    { id: 'bebidas', name: 'Bebidas', icon: 'fas fa-glass-cheers' },
    { id: 'postres', name: 'Postres', icon: 'fas fa-ice-cream' }
  ];

  // ← ACTUALIZADO: Filtrar y ordenar productos desde context
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

    // Filtrar por precio
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, priceRange, sortBy, getProductsByCategory, searchProducts]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  const handleAddToCart = (product, customizations = {}) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || '/placeholder-food.jpg',
      category: product.category,
      description: product.description
    }, 1, customizations);
  };

  const handleFavoriteToggle = async (product) => {
    await toggleFavorite({
      itemId: product.id,
      itemType: 'products',
      isFavorite: !isFavorite(product.id, 'products'),
      itemData: product
    });
  };

  // Mostrar loading mientras cargan productos
  if (loading) {
    return <LoadingSpinner fullScreen text="Cargando menú..." />;
  }

  return (
    <>
      <SEO 
        title="Menú - Pizza4U"
        description="Descubre nuestro delicioso menú de pizzas artesanales, pastas, ensaladas y más. Los mejores sabores de La Paz."
        keywords="menu, pizza, pasta, ensalada, comida, restaurante, La Paz"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Nuestro Menú
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Descubre nuestras deliciosas creaciones hechas con ingredientes frescos y mucho amor
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                placeholder="Buscar productos..."
                onSearch={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showSuggestions={false}
                className="w-full"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={`fas fa-filter ${showFilters ? 'fa-times' : ''}`}
              >
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ordenar por
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="name">Nombre</option>
                      <option value="price">Precio</option>
                      <option value="rating">Valoración</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rango de Precio: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setSelectedCategory('all');
                        setSearchQuery('');
                        setSortBy('name');
                        setPriceRange([0, 100]);
                      }}
                      icon="fas fa-undo"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Categories */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categoryData.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <i className={category.icon} />
                  <span>{category.name}</span>
                  <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
                    {category.id === 'all' 
                      ? products.length 
                      : products.filter(p => p.category === category.id).length
                    }
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {products.length === 0 ? 'Menú en construcción' : 'No se encontraron productos'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {products.length === 0 
                  ? 'Estamos preparando deliciosas opciones para ti. ¡Vuelve pronto!'
                  : 'Intenta con otros términos de búsqueda o filtros'
                }
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} hover className="overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={product.image_url || '/placeholder-food.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 space-y-2">
                      {product.featured && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Destacado
                        </span>
                      )}
                      {!product.available && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          No disponible
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-2 right-2">
                      <FavoriteButton
                        itemId={product.id}
                        itemType="products"
                        isFavorite={isFavorite(product.id, 'products')}
                        onToggle={() => handleFavoriteToggle(product)}
                        variant="button"
                        className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      />
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded-lg">
                        <span className="font-bold">{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {product.category}
                      </span>
                      {product.featured && (
                        <i className="fas fa-star text-yellow-500" title="Producto destacado" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1"
                        icon="fas fa-eye"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        icon="fas fa-plus"
                        disabled={!product.available}
                      >
                        {product.available ? 'Agregar' : 'No disponible'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Results Summary */}
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <p>
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
            {selectedCategory !== 'all' && (
              <p className="text-sm">
                en la categoría "{categoryData.find(c => c.id === selectedCategory)?.name}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProduct.name}
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fas fa-times text-xl" />
                </button>
              </div>

              {/* Product Image */}
              <img
                src={selectedProduct.image_url || '/placeholder-food.jpg'}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
                onError={(e) => {
                  e.target.src = '/placeholder-food.jpg';
                }}
              />

              {/* Product Details */}
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedProduct.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    {selectedProduct.category}
                  </span>
                </div>

                <Button
                  variant="primary"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  fullWidth
                  icon="fas fa-plus"
                  disabled={!selectedProduct.available}
                >
                  {selectedProduct.available 
                    ? `Agregar al Carrito - ${formatPrice(selectedProduct.price)}`
                    : 'Producto no disponible'
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;