
import React from 'react';
import Icon from './Icon';
import { StoreSettings } from '../types';

interface HeaderProps {
  onBack?: () => void;
  title?: string;
  showSearch?: boolean; 
  onSearchClick?: () => void;
  onMenuClick?: () => void;
  settings?: StoreSettings;
}

const Header: React.FC<HeaderProps> = ({ onBack, title, onMenuClick, settings }) => {
  return (
    <header className="sticky top-0 z-40 px-6 pt-5 pb-3 bg-white/80 backdrop-blur-xl flex items-center justify-between transition-all duration-300 border-b border-gray-50/50 supports-[backdrop-filter]:bg-white/60">
      
      {/* Left: Action Button */}
      <div className="flex-shrink-0 z-20 w-10">
        {onBack ? (
          <button 
            onClick={onBack} 
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 text-gray-900 hover:bg-gray-50 transition-all active:scale-95"
          >
            <Icon name="ArrowLeft" size={20} strokeWidth={2} />
          </button>
        ) : (
          <button 
            onClick={onMenuClick} 
            className="group w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-gray-50 transition-colors"
          >
            <span className="w-5 h-0.5 bg-gray-900 rounded-full transition-all group-hover:w-6"></span>
            <span className="w-4 h-0.5 bg-gray-900 rounded-full transition-all group-hover:w-6"></span>
          </button>
        )}
      </div>

      {/* Center: Branding or Title */}
      <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
         <div className="pt-2 pointer-events-auto">
            {title ? (
                <h1 className="text-sm font-black text-gray-900 tracking-widest uppercase font-sans animate-fade-in">{title}</h1>
            ) : (
                <div className="flex items-center gap-3 animate-fade-in select-none group cursor-pointer">
                    {/* Logo Visual */}
                    {settings?.logo ? (
                         <img 
                            src={settings.logo} 
                            alt={settings.name} 
                            className="h-8 w-auto object-contain" 
                        />
                    ) : (
                        <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md transform -rotate-6 transition-transform group-hover:rotate-0"
                            style={{ backgroundColor: settings?.primaryColor || '#000' }}
                        >
                            {settings?.name?.substring(0,1) || 'S'}
                        </div>
                    )}
                    
                    {/* Text Logo */}
                    <span className="font-black text-xl text-gray-900 tracking-tighter italic uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {settings?.name || 'SHOESPOT'}
                    </span>
                </div>
            )}
         </div>
      </div>

      {/* Right: Spacer */}
      <div className="w-10 flex-shrink-0" />
    </header>
  );
};

export default Header;
