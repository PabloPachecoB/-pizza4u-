import React, { useState, useEffect } from 'react';
import SEO from '../../components/SEO';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const roles = [
    { id: 'all', name: 'Todos los roles', count: 0 },
    { id: 'admin', name: 'Administradores', count: 0 },
    { id: 'manager', name: 'Gerentes', count: 0 },
    { id: 'staff', name: 'Personal', count: 0 },
    { id: 'customer', name: 'Clientes', count: 0 }
  ];

  const statusOptions = [
    { id: 'all', name: 'Todos los estados' },
    { id: 'active', name: 'Activos' },
    { id: 'inactive', name: 'Inactivos' },
    { id: 'suspended', name: 'Suspendidos' },
    { id: 'pending', name: 'Pendientes' }
  ];

  // Mock data para usuarios
  const mockUsers = [
    {
      id: 1,
      name: 'Carlos Mendoza',
      email: 'carlos@pizza4u.com',
      phone: '+591 7 123-4567',
      role: 'admin',
      status: 'active',
      avatar: '/avatars/carlos.jpg',
      createdAt: '2024-01-01T10:00:00Z',
      lastLogin: '2024-01-15T14:30:00Z',
      orders: 0,
      totalSpent: 0,
      location: 'La Paz, Bolivia',
      verified: true
    },
    {
      id: 2,
      name: 'Ana Torres',
      email: 'ana.torres@gmail.com',
      phone: '+591 7 987-6543',
      role: 'customer',
      status: 'active',
      avatar: '/avatars/ana.jpg',
      createdAt: '2024-01-05T15:20:00Z',
      lastLogin: '2024-01-14T18:45:00Z',
      orders: 23,
      totalSpent: 1250.50,
      location: 'La Paz, Bolivia',
      verified: true
    },
    {
      id: 3,
      name: 'Luis Vega',
      email: 'luis.vega@hotmail.com',
      phone: '+591 7 555-1234',
      role: 'customer',
      status: 'active',
      avatar: '/avatars/luis.jpg',
      createdAt: '2024-01-08T09:15:00Z',
      lastLogin: '2024-01-15T12:20:00Z',
      orders: 8,
      totalSpent: 456.75,
      location: 'El Alto, Bolivia',
      verified: false
    },
    {
      id: 4,
      name: 'María González',
      email: 'maria@pizza4u.com',
      phone: '+591 7 777-8888',
      role: 'manager',
      status: 'active',
      avatar: '/avatars/maria.jpg',
      createdAt: '2024-01-02T11:30:00Z',
      lastLogin: '2024-01-15T13:10:00Z',
      orders: 0,
      totalSpent: 0,
      location: 'La Paz, Bolivia',
      verified: true
    },
    {
      id: 5,
      name: 'Pedro Ramirez',
      email: 'pedro.ramirez@gmail.com',
      phone: '+591 7 333-2222',
      role: 'customer',
      status: 'suspended',
      avatar: '/avatars/pedro.jpg',
      createdAt: '2024-01-10T16:45:00Z',
      lastLogin: '2024-01-12T10:30:00Z',
      orders: 15,
      totalSpent: 890.25,
      location: 'La Paz, Bolivia',
      verified: true
    },
    {
      id: 6,
      name: 'Elena Vargas',
      email: 'elena.vargas@yahoo.com',
      phone: '+591 7 444-5555',
      role: 'customer',
      status: 'pending',
      avatar: '/avatars/elena.jpg',
      createdAt: '2024-01-12T20:00:00Z',
      lastLogin: null,
      orders: 0,
      totalSpent: 0,
      location: 'Cochabamba, Bolivia',
      verified: false
    },
    {
      id: 7,
      name: 'Roberto Silva',
      email: 'roberto@pizza4u.com',
      phone: '+591 7 666-7777',
      role: 'staff',
      status: 'active',
      avatar: '/avatars/roberto.jpg',
      createdAt: '2024-01-03T14:20:00Z',
      lastLogin: '2024-01-15T08:00:00Z',
      orders: 0,
      totalSpent: 0,
      location: 'La Paz, Bolivia',
      verified: true
    }
  ];

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filtrar usuarios
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.phone.includes(searchQuery);
      return matchesRole && matchesStatus && matchesSearch;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'orders':
          return b.orders - a.orders;
        case 'spent':
          return b.totalSpent - a.totalSpent;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredUsers(filtered);
  }, [users, selectedRole, selectedStatus, searchQuery, sortBy]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleInfo = (role) => {
    const roleMap = {
      admin: { name: 'Administrador', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: 'fas fa-crown' },
      manager: { name: 'Gerente', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: 'fas fa-user-tie' },
      staff: { name: 'Personal', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: 'fas fa-user-cog' },
      customer: { name: 'Cliente', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'fas fa-user' }
    };
    return roleMap[role] || roleMap.customer;
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      active: { name: 'Activo', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: 'fas fa-check-circle' },
      inactive: { name: 'Inactivo', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: 'fas fa-pause-circle' },
      suspended: { name: 'Suspendido', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: 'fas fa-ban' },
      pending: { name: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: 'fas fa-clock' }
    };
    return statusMap[status] || statusMap.active;
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setEditingUser(null);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id)
        ? { ...user, status: newStatus }
        : user
    ));
    setSelectedUsers([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedUsers.length} usuarios?`)) {
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
  };

  // Estadísticas
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    customers: users.filter(u => u.role === 'customer').length,
    admins: users.filter(u => u.role === 'admin').length,
    totalSpent: users.reduce((sum, u) => sum + u.totalSpent, 0),
    totalOrders: users.reduce((sum, u) => sum + u.orders, 0)
  };

  const UserModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      role: 'customer',
      status: 'active',
      location: '',
      verified: false
    });

    useEffect(() => {
      if (editingUser || selectedUser) {
        const user = editingUser || selectedUser;
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          location: user.location || '',
          verified: user.verified
        });
      }
    }, [editingUser, selectedUser]);

    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (editingUser) {
        setUsers(prev => prev.map(u => 
          u.id === editingUser.id 
            ? { ...u, ...formData, updatedAt: new Date().toISOString() }
            : u
        ));
      } else if (!selectedUser) {
        const newUser = {
          ...formData,
          id: Date.now(),
          avatar: null,
          createdAt: new Date().toISOString(),
          lastLogin: null,
          orders: 0,
          totalSpent: 0
        };
        setUsers(prev => [...prev, newUser]);
      }

      closeUserModal();
    };

    const isViewOnly = selectedUser && !editingUser;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isViewOnly ? 'Detalles del Usuario' : 
               editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <button
              onClick={closeUserModal}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
            >
              <i className="fas fa-times text-xl" />
            </button>
          </div>

          {isViewOnly ? (
            // View Mode
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono:
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ubicación:
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.location}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rol:
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleInfo(selectedUser.role).color}`}>
                    {getRoleInfo(selectedUser.role).name}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado:
                  </label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(selectedUser.status).color}`}>
                    {getStatusInfo(selectedUser.status).name}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pedidos:
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedUser.orders}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total gastado:
                  </label>
                  <p className="text-gray-900 dark:text-white">{formatCurrency(selectedUser.totalSpent)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Registrado:
                  </label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Último acceso:
                  </label>
                  <p className="text-gray-900 dark:text-white">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={() => handleEditUser(selectedUser)}
                  icon="fas fa-edit"
                >
                  Editar Usuario
                </Button>
                {selectedUser.role === 'customer' && (
                  <Button
                    variant="outline"
                    icon="fas fa-receipt"
                  >
                    Ver Pedidos
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Edit/Create Mode
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre completo *
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
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="customer">Cliente</option>
                    <option value="staff">Personal</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estado *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData(prev => ({ ...prev, verified: e.target.checked }))}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Usuario verificado
                  </span>
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeUserModal}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  {editingUser ? 'Actualizar' : 'Crear'} Usuario
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Cargando usuarios..." />;
  }

  return (
    <>
      <SEO 
        title="Gestión de Usuarios - Admin Pizza4U"
        description="Administra usuarios, roles y permisos del sistema"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Gestión de Usuarios
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Administra usuarios, roles y permisos del sistema
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  icon="fas fa-download"
                >
                  Exportar Usuarios
                </Button>
                <Button
                  variant="primary"
                  icon="fas fa-plus"
                  onClick={handleAddUser}
                >
                  Nuevo Usuario
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Usuarios
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <i className="fas fa-users text-blue-600 dark:text-blue-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Usuarios Activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.active}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <i className="fas fa-user-check text-green-600 dark:text-green-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Pedidos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <i className="fas fa-shopping-bag text-purple-600 dark:text-purple-400 text-xl" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ingresos Clientes
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalSpent)}
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                  <i className="fas fa-dollar-sign text-orange-600 dark:text-orange-400 text-xl" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-6 mb-6">
            <div className="space-y-4">
              {/* Search and Bulk Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex-1 max-w-md">
                  <SearchBar
                    placeholder="Buscar por nombre, email o teléfono..."
                    onSearch={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    showSuggestions={false}
                  />
                </div>
                
                {selectedUsers.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUsers.length} seleccionados
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange('active')}
                      icon="fas fa-check"
                    >
                      Activar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkStatusChange('suspended')}
                      icon="fas fa-ban"
                    >
                      Suspender
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

              {/* Role and Status Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">
                    Rol:
                  </span>
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedRole === role.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {role.name}
                      {role.id !== 'all' && (
                        <span className="ml-1">
                          ({users.filter(u => u.role === role.id).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Estado:
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {statusOptions.map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>

                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ordenar:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                    <option value="name">Nombre A-Z</option>
                    <option value="email">Email A-Z</option>
                    <option value="orders">Más pedidos</option>
                    <option value="spent">Más gastado</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Pedidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Gastado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Último Acceso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((user) => {
                    const roleInfo = getRoleInfo(user.role);
                    const statusInfo = getStatusInfo(user.status);
                    
                    return (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectUser(user.id);
                            }}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name}
                                {user.verified && (
                                  <i className="fas fa-check-circle text-blue-500 ml-1" title="Verificado" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.email}
                              </div>
                              <div className="text-xs text-gray-400">
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                            <i className={`${roleInfo.icon} mr-1`} />
                            {roleInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <i className={`${statusInfo.icon} mr-1`} />
                            {statusInfo.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(user.totalSpent)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.lastLogin)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditUser(user);
                              }}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <i className="fas fa-edit" />
                            </button>
                            {user.status === 'active' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'suspended');
                                }}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                title="Suspender"
                              >
                                <i className="fas fa-ban" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateUserStatus(user.id, 'active');
                                }}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                title="Activar"
                              >
                                <i className="fas fa-check" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-users text-4xl text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Intenta con otros filtros de búsqueda
                </p>
              </div>
            )}
          </Card>

          {/* Results summary */}
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            <p>
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </p>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showUserModal && <UserModal />}
    </>
  );
};

export default UserManagement;