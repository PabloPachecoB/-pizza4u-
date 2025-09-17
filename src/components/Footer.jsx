import React from 'react';

const Footer = ({ variant = 'user' }) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'admin') {
    return (
      <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {currentYear} Pizza4U Admin Panel. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P4U</span>
              </div>
              <span className="text-xl font-display font-bold">Pizza4U</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Las mejores pizzas de la ciudad, hechas con ingredientes frescos y mucho amor. 
              Disfruta de nuestros sabores únicos y nuestra experiencia gastronómica completa.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter text-xl" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <i className="fab fa-youtube text-xl" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#menu" className="text-gray-300 hover:text-white transition-colors">
                  Nuestro Menú
                </a>
              </li>
              <li>
                <a href="#location" className="text-gray-300 hover:text-white transition-colors">
                  Ubicación
                </a>
              </li>
              <li>
                <a href="#videos" className="text-gray-300 hover:text-white transition-colors">
                  Videos
                </a>
              </li>
              <li>
                <a href="#podcasts" className="text-gray-300 hover:text-white transition-colors">
                  Podcasts
                </a>
              </li>
              <li>
                <a href="#news" className="text-gray-300 hover:text-white transition-colors">
                  Noticias
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <i className="fas fa-map-marker-alt text-primary-500" />
                <span className="text-gray-300">
                  Calle Principal 123<br />
                  La Paz, Bolivia
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-phone text-primary-500" />
                <span className="text-gray-300">+591 2 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-primary-500" />
                <span className="text-gray-300">info@pizza4u.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fas fa-clock text-primary-500" />
                <div className="text-gray-300">
                  <div>Lun - Dom</div>
                  <div>11:00 AM - 11:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separador y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Pizza4U. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos de Servicio
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;