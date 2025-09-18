import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data para pedidos
  const mockOrders = [
    {
      id: 'ORD-1001',
      customer: {
        name: 'María González',
        email: 'maria@email.com',
        phone: '+591 7 123-4567',
        address: 'Calle Murillo 123, Zona Centro'
      },
      items: [
        { name: 'Pizza Margarita', quantity: 2, price: 45, total: 90, customizations: { size: 'Mediana', extras: 'Sin cebolla' } },
        { name: 'Coca Cola 355ml', quantity: 2, price: 8, total: 16 }
      ],
      subtotal: 106,
      delivery: 0,
      tax: 10.6,
      total: 116.6,
      status: 'preparing',
      orderType: 'delivery',
      createdAt: '2024-01-15T14:30:00Z',
      estimatedTime: '2024-01-15T15:15:00Z',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      notes: 'Sin cebolla en la pizza',
      assignedTo: 'Chef Mario',
      priority: 'normal'
    },
    {
      id: 'ORD-1002',
      customer: {
        name: 'Carlos Mendoza',
        email: 'carlos@email.com',
        phone: '+591 7 987-6543',
        address: 'Av. 6 de Agosto 456, Zona Sur'
      },
      items: [
        { name: 'Pizza Pepperoni', quantity: 1, price: 52, total: 52 },
        { name: 'Ensalada César', quantity: 1, price: 32, total: 32 }
      ],
      subtotal: 84,
      delivery: 5,
      tax: 8.9,
      total: 97.9,
      status: 'pending',
      orderType: 'delivery',
      createdAt: '2024-01-15T14:45:00Z',
      estimatedTime: '2024-01-15T15:30:00Z',
      paymentMethod: 'card',
      paymentStatus: 'completed',
      priority: 'high'
    },
    {
      id: 'ORD-1003',
      customer: {
        name: 'Ana Torres',
        email: 'ana@email.com',
        phone: '+591 7 555-1234'
      },
      items: [
        { name: 'Pasta Carbonara', quantity: 1, price: 38, total: 38 },
        { name: 'Tiramisu', quantity: 1, price: 25, total: 25 }
      ],
      subtotal: 63,
      delivery: 0,
      tax: 6.3,
      total: 69.3,
      status: 'ready',
      orderType: 'pickup',
      createdAt: '2024-01-15T13:20:00Z',
      estimatedTime: '2024-01-15T14:00:00Z',
      paymentMethod: 'qr',
      paymentStatus: 'completed',
      assignedTo: 'Chef Luis',
      priority: 'normal'
    },
    {
      id: 'ORD-1004',
      customer: {
        name: 'Luis Vega',
        email: 'luis@email.com',
        phone: '+591 7 777-8888',
        address: 'Calle 21 de Calacoto 789, Zona Sur'
      },
      items: [
        { name: 'Pizza Hawaiana', quantity: 1, price: 48, total: 48 },
        { name: 'Agua con Gas', quantity: 2, price: 8, total: 16 }
      ],
      subtotal: 64,
      delivery: 5,
      tax: 6.9,
      total: 75.9,
      status: 'completed',
      orderType: 'delivery',
      createdAt: '2024-01-15T12:30:00Z',
      estimatedTime: '2024-01-15T13:15:00Z',
      completedAt: '2024-01-15T13:12:00Z',
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      deliveryPerson: 'Roberto Martinez',
      priority: 'normal'
    },
    {
      id: 'ORD-1005',
      customer: {
        name: 'Elena Vargas',
        email: 'elena@email.com',
        phone: '+591 7 333-2222',
        address: 'Zona Villa Fátima, Calle 1 #456'
      },
      items: [
        { name: 'Pizza Quattro Stagioni', quantity: 1, price: 58, total: 58 }
      ],
      subtotal: 58,
      delivery: 5,
      tax: 6.3,
      total: 69.3,
      status: 'cancelled',
      orderType: 'delivery',
      createdAt: '2024-01-15T11:45:00Z',
      paymentMethod: 'card',
      paymentStatus: 'refunded',
      cancelReason: 'Cliente no disponible',
      cancelledAt: '2024-01-15T12:15:00Z',
      priority: 'low'
    }
  ];

  const statusOptions = [
    { id: 'all', name: 'Todos', count: 0, color: 'bg-gray-100 text-gray-800' },
    { id: 'pending', name: 'Pendientes', count: 0, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'preparing', name: 'Preparando', count: 0, color: 'bg-blue-100 text-blue-800' },
    { id: 'ready', name: 'Listos', count: 0, color: 'bg-purple-100 text-purple-800' },
    { id: 'completed', name: 'Completados', count: 0, color: 'bg-green-100 text-green-800' },
    { id: 'cancelled', name: 'Cancelados', count: 0, color: 'bg-red-100 text-red-800' }
  ];

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Actualizar contadores de estado
  useEffect(() => {
    statusOptions.forEach(status => {
      if (status.id === 'all') {
        status.count = orders.length;
      } else {
        status.count = orders.filter(order => order.status === status.id).length;
      }
    });
  }, [orders]);

  // Filtrar pedidos
  useEffect(() => {
    let filtered = orders.filter(order => {
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.phone.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount-high':
          return b.total - a.total;
        case 'amount-low':
          return a.total - b.total;
        case 'priority':
          const priorityOrder = { 'high': 3, 'normal': 2, 'low': 1 };
          return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, selectedStatus, searchQuery, sortBy]);

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { name: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: 'fas fa-clock' },
      preparing: { name: 'Preparando', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: 'fas fa-utensils' },
      ready: { name: 'Listo', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: 'fas fa-check' },
      completed: { name: 'Completado', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'fas fa-check-circle' },
      cancelled: { name: 'Cancelado', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: 'fas fa-times-circle' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      high: { name: 'Alta', color: 'text-red-600 dark:text-red-400', icon: 'fas fa-exclamation' },
      normal: { name: 'Normal', color: 'text-gray-600 dark:text-gray-400', icon: 'fas fa-minus' },
      low: { name: 'Baja', color: 'text-green-600 dark:text-green-400', icon: 'fas fa-arrow-down' }
    };
    return priorityMap[priority] || priorityMap.normal;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        if (newStatus === 'completed') {
          updatedOrder.completedAt = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    }));
  };

  const assignOrder = (orderId, assignedTo) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, assignedTo } : order
    ));
  };

  const updateOrderPriority = (orderId, priority) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, priority } : order
    ));
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'completed'
    };
    return flow[currentStatus];
  };

  const canAdvanceStatus = (status) => {
    return ['pending', 'preparing', 'ready'].includes(status);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllOrders = () => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    }
  };

  const handleBulkStatusUpdate = (newStatus) => {
    setOrders(prev => prev.map(order => 
      selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order
    ));
    setSelectedOrders([]);
  };

  const exportOrders = (format) => {
    // Lógica de exportación
    console.log(`Exportando ${filteredOrders.length} pedidos en formato ${format}`);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando pedidos..." />;
  }

  return (
    <>
      <SEO 
        title="Gestión de Pedidos - Admin Pizza4U"
        description="Gestiona todos los pedidos del restaurante"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Pedidos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Administra y actualiza el estado de los pedidos
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-download"
                  onClick={() => exportOrders('excel')}
                >
                  Exportar
                </Button>
                <Button
                  variant="primary"
                  icon="fas fa-plus"
                >
                  Nuevo Pedido
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {statusOptions.slice(1).map((status) => (
              <Card key={status.id} className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {status.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {status.name}
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Search and Bulk Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    placeholder="Buscar por ID, cliente, email o teléfono..."
                    onSearch={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    showSuggestions={false}
                  />
                </div>
                
                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedOrders.length} seleccionados
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('preparing')}
                      icon="fas fa-utensils"
                    >
                      Preparar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('ready')}
                      icon="fas fa-check"
                    >
                      Marcar Listos
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('cancelled')}
                      icon="fas fa-times"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedStatus === status.id
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.name}
                    {status.count > 0 && (
                      <span className="ml-1">({status.count})</span>
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
                  <option value="newest">Más recientes</option>
                  <option value="oldest">Más antiguos</option>
                  <option value="amount-high">Mayor monto</option>
                  <option value="amount-low">Menor monto</option>
                  <option value="priority">Prioridad</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <Card className="p-8 text-center">
              <i className="fas fa-shopping-bag text-4xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No se encontraron pedidos
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Intenta con otros filtros de búsqueda
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === paginatedOrders.length}
                    onChange={handleSelectAllOrders}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pedido
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y dark:divide-gray-700">
                {paginatedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const priorityInfo = getPriorityInfo(order.priority);
                  
                  return (
                    <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                        />
                        
                        <div className="flex-1 cursor-pointer" onClick={() => handleOrderClick(order)}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {order.id}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {order.customer.name} • {formatTime(order.createdAt)}
                                </p>
                              </div>
                              
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                                <i className={`${statusInfo.icon} mr-1`} />
                                {statusInfo.name}
                              </div>
                              
                              <div className={`px-2 py-1 rounded text-xs font-medium ${priorityInfo.color}`}>
                                <i className={`${priorityInfo.icon} mr-1`} />
                                {priorityInfo.name}
                              </div>
                              
                              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300">
                                {order.orderType === 'delivery' ? 'Delivery' : 'Para llevar'}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.total)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {order.paymentMethod === 'cash' ? 'Efectivo' :
                                 order.paymentMethod === 'card' ? 'Tarjeta' :
                                 order.paymentMethod === 'qr' ? 'QR' : 'Transferencia'}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Items:</span>
                              <p className="font-medium">
                                {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                              </p>
                            </div>
                            
                            {order.orderType === 'delivery' && order.customer.address && (
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Dirección:</span>
                                <p className="font-medium">{order.customer.address}</p>
                              </div>
                            )}
                            
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">
                                {order.assignedTo ? 'Asignado a:' : 'Tiempo estimado:'}
                              </span>
                              <p className="font-medium">
                                {order.assignedTo || formatTime(order.estimatedTime)}
                              </p>
                            </div>
                          </div>

                          {order.notes && (
                            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                                <i className="fas fa-sticky-note mr-1" />
                                {order.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          {canAdvanceStatus(order.status) && (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrderStatus(order.id, getNextStatus(order.status));
                              }}
                            >
                              {getNextStatus(order.status) === 'preparing' && 'Comenzar'}
                              {getNextStatus(order.status) === 'ready' && 'Marcar Listo'}
                              {getNextStatus(order.status) === 'completed' && 'Completar'}
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOrderClick(order);
                            }}
                            icon="fas fa-eye"
                          >
                            Ver
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t dark:border-gray-700 flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      icon="fas fa-chevron-left"
                    />
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "primary" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      icon="fas fa-chevron-right"
                    />
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pedido {selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Creado el {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={closeOrderModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
              >
                <i className="fas fa-times text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status and Priority */}
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-lg font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                  <i className={`${getStatusInfo(selectedOrder.status).icon} mr-2`} />
                  {getStatusInfo(selectedOrder.status).name}
                </div>
                
                <div className={`px-3 py-1 rounded font-medium ${getPriorityInfo(selectedOrder.priority).color}`}>
                  <i className={`${getPriorityInfo(selectedOrder.priority).icon} mr-1`} />
                  Prioridad {getPriorityInfo(selectedOrder.priority).name}
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded font-medium text-gray-700 dark:text-gray-300">
                  {selectedOrder.orderType === 'delivery' ? 'Delivery' : 'Para llevar'}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Información del Cliente
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Nombre:</span> {selectedOrder.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                  <p><span className="font-medium">Teléfono:</span> {selectedOrder.customer.phone}</p>
                  {selectedOrder.customer.address && (
                    <p><span className="font-medium">Dirección:</span> {selectedOrder.customer.address}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Productos del Pedido
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                        {item.customizations && (
                          <div className="mt-1">
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <span key={key} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded mr-1">
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Resumen del Pedido
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.delivery > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>{formatCurrency(selectedOrder.delivery)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Impuestos:</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="border-t dark:border-gray-600 pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Información de Pago
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Método: {selectedOrder.paymentMethod === 'cash' ? 'Efectivo' :
                                 selectedOrder.paymentMethod === 'card' ? 'Tarjeta' :
                                 selectedOrder.paymentMethod === 'qr' ? 'QR' : 'Transferencia'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Estado: {selectedOrder.paymentStatus === 'completed' ? 'Completado' :
                                 selectedOrder.paymentStatus === 'pending' ? 'Pendiente' :
                                 selectedOrder.paymentStatus === 'refunded' ? 'Reembolsado' : 'Fallido'}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      selectedOrder.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      selectedOrder.paymentStatus === 'refunded' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {selectedOrder.paymentStatus === 'completed' ? 'Pagado' :
                       selectedOrder.paymentStatus === 'pending' ? 'Pendiente' :
                       selectedOrder.paymentStatus === 'refunded' ? 'Reembolsado' : 'Fallido'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment and Tracking */}
              {selectedOrder.assignedTo && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Asignación
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p><span className="font-medium">Asignado a:</span> {selectedOrder.assignedTo}</p>
                    {selectedOrder.deliveryPerson && (
                      <p><span className="font-medium">Repartidor:</span> {selectedOrder.deliveryPerson}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Notas Especiales
                  </h3>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
                    <p className="text-yellow-800 dark:text-yellow-400">
                      {selectedOrder.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Cancel Reason */}
              {selectedOrder.status === 'cancelled' && selectedOrder.cancelReason && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Motivo de Cancelación
                  </h3>
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4">
                    <p className="text-red-800 dark:text-red-400">
                      {selectedOrder.cancelReason}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-500 mt-1">
                      Cancelado el {formatDate(selectedOrder.cancelledAt)}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t dark:border-gray-700">
                {canAdvanceStatus(selectedOrder.status) && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status));
                      closeOrderModal();
                    }}
                    icon="fas fa-arrow-right"
                  >
                    Avanzar a {getStatusInfo(getNextStatus(selectedOrder.status)).name}
                  </Button>
                )}
                
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                  <Button
                    variant="danger"
                    onClick={() => {
                      const reason = prompt('Motivo de cancelación:');
                      if (reason) {
                        setOrders(prev => prev.map(order => 
                          order.id === selectedOrder.id 
                            ? { ...order, status: 'cancelled', cancelReason: reason, cancelledAt: new Date().toISOString() }
                            : order
                        ));
                        closeOrderModal();
                      }
                    }}
                    icon="fas fa-times"
                  >
                    Cancelar Pedido
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  icon="fas fa-print"
                  onClick={() => window.print()}
                >
                  Imprimir
                </Button>
                
                <Button
                  variant="outline"
                  icon="fas fa-envelope"
                  onClick={() => {
                    window.location.href = `mailto:${selectedOrder.customer.email}?subject=Estado de tu pedido ${selectedOrder.id}`;
                  }}
                >
                  Enviar Email
                </Button>
                
                <Button
                  variant="outline"
                  icon="fas fa-phone"
                  onClick={() => {
                    window.location.href = `tel:${selectedOrder.customer.phone}`;
                  }}
                >
                  Llamar Cliente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;