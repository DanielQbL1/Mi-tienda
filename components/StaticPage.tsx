
import React from 'react';
import { StoreSettings } from '../types';

interface StaticPageProps {
  type: 'TERMS' | 'FAQ' | 'ABOUT';
  settings?: StoreSettings;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, settings }) => {
  const storeName = settings?.name || 'ShoeSpot';
  const storeAddress = settings?.address || 'La Habana, Cuba';

  const renderContent = () => {
    switch (type) {
      case 'TERMS':
        return (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">1. Aceptación de los Términos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Al acceder y utilizar este sitio web ({storeName}), aceptas estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.</p>
            </section>
            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">2. Compras y Pagos</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Todos los precios están en la moneda local. Nos reservamos el derecho de rechazar cualquier pedido que realices con nosotros. Podemos, a nuestra discreción, limitar o cancelar las cantidades compradas por persona.</p>
            </section>
            <section>
              <h3 className="font-bold text-lg text-gray-900 mb-2">3. Envíos y Devoluciones</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Los tiempos de envío son estimados. Las devoluciones se aceptan dentro de los 30 días posteriores a la compra, siempre que el producto esté en su estado original.</p>
            </section>
          </div>
        );
      case 'FAQ':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">¿Cuánto tarda el envío?</h3>
              <p className="text-gray-600 text-xs leading-relaxed">Los envíos dentro de La Habana suelen tardar entre 24 y 48 horas.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">¿Dónde está la tienda física?</h3>
              <p className="text-gray-600 text-xs leading-relaxed">Estamos ubicados en: <br/><strong>{storeAddress}</strong></p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">¿Aceptan devoluciones?</h3>
              <p className="text-gray-600 text-xs leading-relaxed">Sí, aceptamos devoluciones por defectos de fábrica dentro de los primeros 7 días.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">¿Cómo puedo pagar?</h3>
              <p className="text-gray-600 text-xs leading-relaxed">Aceptamos pagos en efectivo al momento de la entrega o transferencia bancaria.</p>
            </div>
          </div>
        );
      case 'ABOUT':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-black rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-black/20" style={{ backgroundColor: settings?.primaryColor }}>
                {settings?.logo ? (
                    <img src={settings.logo} className="w-full h-full object-cover rounded-3xl" alt="Logo" />
                ) : (
                    <span className="text-white font-bold text-3xl" style={{ color: settings?.secondaryColor }}>{storeName.substring(0,2).toUpperCase()}</span>
                )}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed px-4">
              Somos <strong>{storeName}</strong>, tu destino número uno para el calzado más exclusivo y moderno en Cuba. Fundada en 2024, nuestra misión es traer las mejores marcas mundiales directamente a tus pies.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left mx-4">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Visítanos en</span>
                <p className="text-sm font-medium text-gray-800">{storeAddress}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 px-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="block text-2xl font-bold text-gray-900 mb-1">100%</span>
                    <span className="text-xs text-gray-500 font-medium uppercase">Originales</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <span className="block text-2xl font-bold text-gray-900 mb-1">24h</span>
                    <span className="text-xs text-gray-500 font-medium uppercase">Soporte</span>
                </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const getTitle = () => {
      switch(type) {
          case 'TERMS': return 'Términos y Condiciones';
          case 'FAQ': return 'Preguntas Frecuentes';
          case 'ABOUT': return 'Acerca de Nosotros';
      }
  }

  return (
    <div className="px-5 py-8 animate-fade-in pb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{getTitle()}</h2>
      {renderContent()}
    </div>
  );
};

export default StaticPage;
