import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import SEO from '../../components/SEO';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FavoriteButton from '../../components/FavoriteButton';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'rating'
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Mock data para el menú
  const menuData = {
    categories: [
      { id: 'all', name: 'Todo', icon: 'fas fa-list' },
      { id: 'pizzas', name: 'Pizzas', icon: 'fas fa-pizza-slice' },
      { id: 'pastas', name: 'Pastas', icon: 'fas fa-utensils' },
      { id: 'ensaladas', name: 'Ensaladas', icon: 'fas fa-leaf' },
      { id: 'bebidas', name: 'Bebidas', icon: 'fas fa-glass-cheers' },
      { id: 'postres', name: 'Postres', icon: 'fas fa-ice-cream' }
    ],
    products: [
      {
        id: 1,
        name: 'Pizza Margarita',
        category: 'pizzas',
        price: 45,
        originalPrice: 50,
        image: '/pizza-margarita.jpg',
        description: 'Salsa de tomate, mozzarella fresca, albahaca y aceite de oliva',
        rating: 4.8,
        reviews: 124,
        isPopular: true,
        ingredients: ['Masa artesanal', 'Salsa de tomate', 'Mozzarella', 'Albahaca'],
        allergens: ['Gluten', 'Lácteos'],
        nutritionInfo: { calories: 280, protein: 12, carbs: 35, fat: 10 },
        preparationTime: '15-20 min',
        sizes: [
          { name: 'Personal', price: 35, description: '20cm' },
          { name: 'Mediana', price: 45, description: '30cm' },
          { name: 'Familiar', price: 60, description: '40cm' }
        ]
      },
      {
        id: 2,
        name: 'Pizza Pepperoni',
        category: 'pizzas',
        price: 52,
        image: '/pizza-pepperoni.jpg',
        description: 'Salsa de tomate, mozzarella y pepperoni premium',
        rating: 4.9,
        reviews: 89,
        isNew: true,
        ingredients: ['Masa artesanal', 'Salsa de tomate', 'Mozzarella', 'Pepperoni'],
        allergens: ['Gluten', 'Lácteos'],
        preparationTime: '15-20 min'
      },
      {
        id: 3,
        name: 'Pasta Carbonara',
        category: 'pastas',
        price: 38,
        image: '/pasta-carbonara.jpg',
        description: 'Pasta fresca con panceta, huevo, parmesano y pimienta negra',
        rating: 4.7,
        reviews: 67,
        ingredients: ['Pasta fresca', 'Panceta', 'Huevo', 'Parmesano'],
        allergens: ['Gluten', 'Lácteos', 'Huevos'],
        preparationTime: '12-15 min'
      },
      {
        id: 4,
        name: 'Ensalada César',
        category: 'ensaladas',
        price: 32,
        image: '/ensalada-cesar.jpg',
        description: 'Lechuga romana, crutones, parmesano y aderezo césar',
        rating: 4.5,
        reviews: 45,
        isVegetarian: true,
        ingredients: ['Lechuga romana', 'Crutones', 'Parmesano', 'Aderezo césar'],
        allergens: ['Gluten', 'Lácteos'],
        preparationTime: '5-8 min'
      },
      {
        id: 5,
        name: 'Coca Cola',
        category: 'bebidas',
        price: 8,
        image: '/coca-cola.jpg',
        description: 'Bebida refrescante 355ml',
        rating: 4.3,
        reviews: 203,
        preparationTime: 'Inmediato'
      },
      {
        id: 6,
        name: 'Tiramisu',
        category: 'postres',
        price: 25,
        image: '/tiramisu.jpg',
        description: 'Postre italiano con café, mascarpone y cacao',
        rating: 4.9,
        reviews: 156,
        ingredients: ['Mascarpone', 'Café', 'Cacao', 'Galletas'],
        allergens: ['Lácteos', 'Huevos', 'Gluten'],
        preparationTime: '5 min'
      }
    ]
  };

  // Filtrar y ordenar productos
  const filteredProducts = menuData.products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price);
  };

  const handleAddToCart = (product, customizations = {}) => {
    addItem(product, 1, customizations);
  };

  const handleFavoriteToggle = async (product) => {
    await toggleFavorite({
      itemId: product.id,
      itemType: 'products',
      isFavorite: !isFavorite(product.id, 'products'),
      itemData: product
    });
  };

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
              {menuData.categories.map((category) => (
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
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-search text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros términos de búsqueda o filtros
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} hover className="overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative aspect-w-16 aspect-h-9">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-food.jpg';
                      }}
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 space-y-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Nuevo
                        </span>
                      )}
                      {product.isPopular && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                      {product.isVegetarian && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                          Vegetariano
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
                        {product.originalPrice && (
                          <span className="text-xs line-through ml-1 opacity-75">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
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

                    {/* Rating and Reviews */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star text-xs ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {product.rating} ({product.reviews} reseñas)
                      </span>
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <i className="fas fa-clock mr-1" />
                        {product.preparationTime}
                      </span>
                      {product.allergens && (
                        <span className="flex items-center">
                          <i className="fas fa-exclamation-triangle mr-1" />
                          Contiene alérgenos
                        </span>
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
                      >
                        Agregar
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
              Mostrando {filteredProducts.length} de {menuData.products.length} productos
            </p>
          </div>
        </div>
      </div>

      {/* Product Detail Modal - would be implemented separately */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal content would go here */}
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
              {/* Detailed product information would be rendered here */}
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Detalles completos del producto aquí...
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                fullWidth
              >
                Agregar al Carrito - {formatPrice(selectedProduct.price)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;