
import React from 'react';
import Icon from './Icon';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  onQuickAdd?: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isFavorite, onToggleFavorite, onClick, onQuickAdd }) => {
  const formatPrice = (price: number) => price % 1 === 0 ? price : price.toFixed(2);

  return (
    <div 
      onClick={onClick} 
      className="group flex flex-col gap-4 cursor-pointer animate-fade-in transform transition-all duration-300 hover:-translate-y-1"
    >
      {/* Contenedor de Imagen - Aspect Ratio 3:4 (Portrait) */}
      {/* 'rounded-[2rem]' para bordes muy curvos. 'overflow-hidden' para recortar la imagen en las esquinas */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 rounded-[2rem] overflow-hidden shadow-sm transition-shadow duration-500 group-hover:shadow-xl group-hover:shadow-black/5">
        
        {/* IMAGEN: object-cover para rellenar todo, w-full h-full para tocar los bordes */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
          loading="lazy" 
        />
        
        {/* Overlay Gradiente: Oscurece ligeramente abajo para que el botón blanco resalte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Badges (Etiquetas) */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isOutOfStock && (
                <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                    AGOTADO
                </div>
            )}
            {product.isOnSale && !product.isOutOfStock && (
                <div className="bg-white/90 backdrop-blur-md text-red-600 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                    OFERTA
                </div>
            )}
        </div>

        {/* Botón Favorito (Top Right) */}
        <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e); }} 
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md hover:bg-white transition-all active:scale-90 z-20 shadow-sm"
        >
            <Icon name="Heart" size={18} className={isFavorite ? 'fill-[#F97316] text-[#F97316]' : 'text-gray-900'} />
        </button>

        {/* Botón Añadir Rápido (Bottom Right - Sobre la imagen) */}
        {onQuickAdd && !product.isOutOfStock && (
            <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickAdd(e); }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:scale-110 hover:bg-black hover:text-white active:scale-90 transition-all duration-300 z-20"
            >
                <Icon name="Plus" size={22} strokeWidth={2} />
            </button>
        )}
      </div>

      {/* Información (Fuera de la tarjeta para limpieza visual) */}
      <div className="px-1 space-y-1">
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-gray-900 text-[16px] leading-tight line-clamp-1 group-hover:underline decoration-2 underline-offset-4 decoration-black/20 transition-all">
                {product.name}
            </h3>
        </div>
        
        <div className="flex items-center justify-between">
             <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{product.brand}</p>
             <div className="flex items-center gap-2">
                {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through font-medium">${formatPrice(product.originalPrice)}</span>
                )}
                <span className="font-black text-gray-900 text-[16px]">${formatPrice(product.price)}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
