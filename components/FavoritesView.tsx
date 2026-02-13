
import React from 'react';
import ProductCard from './ProductCard';
import Icon from './Icon';
import { Product, StoreSettings } from '../types';

interface FavoritesViewProps {
  products: Product[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  onGoHome: () => void;
  settings: StoreSettings;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  products, 
  favorites, 
  onToggleFavorite, 
  onProductClick, 
  onQuickAdd,
  onGoHome,
  settings 
}) => {
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Icon name="Heart" size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes guardados</h2>
        <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed">
          Guarda tus zapatos favoritos para no perderlos de vista.
        </p>
        <button 
          onClick={onGoHome}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
          style={{ backgroundColor: settings.primaryColor, color: settings.secondaryColor }}
        >
          Explorar Tienda
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 px-5 pt-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
        Mis Guardados <span className="text-gray-400 text-lg font-medium ml-1">({favoriteProducts.length})</span>
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
        {favoriteProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            isFavorite={true} 
            onToggleFavorite={(e) => { 
                e.stopPropagation(); 
                onToggleFavorite(product.id); 
            }} 
            onClick={() => onProductClick(product)} 
            onQuickAdd={(e) => { 
                e.stopPropagation(); 
                const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : ''; 
                onQuickAdd(product, defaultSize); 
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
