import React, { useState } from 'react';

// Importar componentes de layout
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Importar secciones del sitio web
import HeroSection from '../components/website/HeroSection';
import MenuSection from '../components/website/MenuSection';
import AboutSection from '../components/website/AboutSection';
import ContactSection from '../components/website/ContactSection';


const WebsiteView = ({ onSwitchToAdmin }) => {
  const [currentSection, setCurrentSection] = useState('inicio');

  // Configuración de navegación
  const navigationItems = [
    { id: 'inicio', label: 'Inicio', href: '#inicio' },
    { id: 'menu', label: 'Menú', href: '#menu' },
    { id: 'nosotros', label: 'Nosotros', href: '#nosotros' },
    { id: 'contacto', label: 'Contacto', href: '#contacto' }
  ];

  // Función para navegar suavemente a una sección
  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="website-view">
      {/* Header fijo */}
      <Header
        variant="website"
        fixed={true}
        navigationItems={navigationItems}
        currentSection={currentSection}
        onNavigate={scrollToSection}
        onAdminClick={onSwitchToAdmin}
      />

      {/* Contenido principal */}
      <main className="pt-20">
        <HeroSection />
        <MenuSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer variant="website" />

      {/* Botón flotante de acción */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2">
          <i className="fas fa-phone"></i>
          <span className="hidden sm:inline">Ordenar</span>
        </button>
      </div>
    </div>
  );
};

export default WebsiteView;