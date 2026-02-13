
import React from 'react';
import Icon from './Icon';
import { ViewState, StoreSettings } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  cartCount: number;
  isLoggedIn: boolean;
  settings: StoreSettings;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, cartCount, isLoggedIn, settings }) => {
  const NavItem = ({ view, icon }: { view: ViewState, icon: any }) => {
    const isActive = currentView === view;
    // Usamos el color primario de la configuración o el naranja por defecto si no carga
    const activeColor = settings?.primaryColor || '#F97316';
    
    return (
      <button 
        onClick={() => onChangeView(view)} 
        className="relative p-2 flex flex-col items-center"
      >
        <Icon 
            name={icon} 
            size={24} 
            className={`transition-colors duration-300 ${isActive ? '' : 'text-gray-300'}`}
            // Aplicamos color dinámico inline para el estado activo
            style={{ color: isActive ? activeColor : undefined }}
            strokeWidth={isActive ? 2.5 : 2}
        />
        {view === 'CART' && cartCount > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 py-4 px-6 pb-safe flex justify-around items-center z-50 rounded-t-[2rem] shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
        <NavItem view="HOME" icon="Home" />
        <NavItem view="FAVORITES" icon="Heart" />
        <NavItem view="CART" icon="ShoppingBag" />
        {isLoggedIn && (
            <NavItem view="PROFILE" icon="User" />
        )}
    </nav>
  );
};

export default BottomNav;
