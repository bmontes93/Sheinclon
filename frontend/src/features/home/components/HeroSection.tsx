import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] bg-black overflow-hidden">
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
          alt="Fashion Hero"
          className={`w-full h-full object-cover object-center transition-transform duration-[2s] ease-out ${isVisible ? 'scale-105' : 'scale-100'}`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex items-center">
        <div className="max-w-2xl text-white pt-20">
          <div className={`transition-all duration-1000 delay-300 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium tracking-widest uppercase mb-4 backdrop-blur-sm">
              Nueva Colección 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Descubre tu <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                Verdadera Esencia
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg font-light leading-relaxed">
              Explora diseños exclusivos que fusionan elegancia atemporal con las tendencias más audaces del momento.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/products?category=vestidos" // Ajustar link según categorías reales
                className="group relative px-8 py-4 bg-white text-black font-semibold rounded-full overflow-hidden transition-transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative z-10">Explorar Colección</span>
              </Link>
              
              <Link 
                to="/products?sort=newest"
                className="group px-8 py-4 border border-white/30 text-white font-medium rounded-full hover:bg-white/10 backdrop-blur-sm transition-all hover:border-white"
              >
                Ver Novedades
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default HeroSection;
