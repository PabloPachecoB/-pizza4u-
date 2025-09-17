import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

const SupportChat = ({
  isOpen,
  onToggle,
  position = 'bottom-right', // 'bottom-right', 'bottom-left'
  className = ''
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy el asistente de Pizza4U. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('online'); // 'online', 'away', 'offline'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick responses para el bot
  const quickResponses = [
    {
      id: 1,
      text: 'Ver el menú',
      action: () => handleQuickResponse('menu')
    },
    {
      id: 2,
      text: 'Horarios de atención',
      action: () => handleQuickResponse('hours')
    },
    {
      id: 3,
      text: 'Hacer un pedido',
      action: () => handleQuickResponse('order')
    },
    {
      id: 4,
      text: 'Ubicación del restaurante',
      action: () => handleQuickResponse('location')
    }
  ];

  // Respuestas automáticas del bot
  const botResponses = {
    menu: {
      text: 'Puedes ver nuestro completo menú haciendo clic en el botón "Menú" en la parte superior. Tenemos deliciosas pizzas, pastas, ensaladas y más! 🍕',
      type: 'text'
    },
    hours: {
      text: 'Nuestros horarios de atención son:\n\n📅 Lunes a Domingo\n🕐 11:00 AM - 11:00 PM\n\n¡Te esperamos!',
      type: 'text'
    },
    order: {
      text: 'Para hacer un pedido puedes:\n\n1. Explorar nuestro menú\n2. Agregar productos al carrito\n3. Proceder al checkout\n\n¿Te ayudo con algo específico? 🛒',
      type: 'text'
    },
    location: {
      text: 'Nos encontramos en:\n\n📍 Calle Principal 123, La Paz, Bolivia\n📞 +591 2 123-4567\n\n¿Necesitas direcciones para llegar?',
      type: 'text'
    },
    default: {
      text: 'Gracias por tu mensaje. Un miembro de nuestro equipo te responderá pronto. Mientras tanto, ¿hay algo más en lo que pueda ayudarte?',
      type: 'text'
    }
  };

  // Scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus en input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simular respuesta del bot
    setTimeout(() => {
      handleBotResponse(newMessage);
    }, 1000);
  };

  const handleBotResponse = (userMessage) => {
    setIsTyping(true);

    setTimeout(() => {
      const lowerMessage = userMessage.toLowerCase();
      let response = botResponses.default;

      // Detectar intención del mensaje
      if (lowerMessage.includes('menu') || lowerMessage.includes('comida') || lowerMessage.includes('pizza')) {
        response = botResponses.menu;
      } else if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('abierto')) {
        response = botResponses.hours;
      } else if (lowerMessage.includes('pedido') || lowerMessage.includes('orden') || lowerMessage.includes('comprar')) {
        response = botResponses.order;
      } else if (lowerMessage.includes('ubicación') || lowerMessage.includes('dirección') || lowerMessage.includes('donde')) {
        response = botResponses.location;
      }

      const botMessage = {
        id: Date.now(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (type) => {
    const response = botResponses[type];
    if (response) {
      const botMessage = {
        id: Date.now(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4',
    'bottom-left': 'bottom-20 left-4'
  };

  return (
    <>
      {/* Chat Widget */}
      <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
        {/* Chat Window */}
        {isOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 w-80 h-96 mb-4 flex flex-col animate-slide-in">
            {/* Header */}
            <div className="bg-primary-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <i className="fas fa-headset text-sm" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                    chatStatus === 'online' ? 'bg-green-500' : 
                    chatStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Soporte Pizza4U</h3>
                  <p className="text-xs opacity-90">
                    {chatStatus === 'online' ? 'En línea' : 
                     chatStatus === 'away' ? 'Ausente' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-primary-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            {messages.length === 1 && (
              <div className="p-3 border-t dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Respuestas rápidas:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {quickResponses.map((response) => (
                    <button
                      key={response.id}
                      onClick={response.action}
                      className="text-xs p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {response.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  icon="fas fa-paper-plane"
                />
              </div>
            </div>
          </div>
        )}

        {/* Chat Toggle Button */}
        <button
          onClick={onToggle}
          className={`w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          {isOpen ? (
            <i className="fas fa-times text-lg" />
          ) : (
            <div className="relative">
              <i className="fas fa-comments text-lg" />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
          )}
        </button>
      </div>
    </>
  );
};

// Hook para usar el chat de soporte
export const useSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close
  };
};

export default SupportChat;