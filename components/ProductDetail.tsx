
import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import { Product, StoreSettings } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack?: () => void;
  settings: StoreSettings;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBuyNow, isFavorite, onToggleFavorite, settings }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
      product.hasSizes && product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    if (product.hasSizes && product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
    } else {
        setSelectedSize('');
    }
    setQuantity(1);
  }, [product]);

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    if (product.hasSizes && !selectedSize) {
        alert('Por favor selecciona una variante');
        return;
    }
    for(let i=0; i<quantity; i++) {
        onAddToCart(product, selectedSize);
    }
  };

  const imagesToShow = (product.images && product.images.length > 0) ? product.images : [product.image];
  const currentImage = imagesToShow[currentImageIndex] || product.image;

  // Helper para precio: Sin decimales si es entero
  const formatPrice = (price: number) => price % 1 === 0 ? price : price.toFixed(2);

  return (
    <div className="animate-fade-in bg-white min-h-screen flex flex-col font-sans relative">
        
        {/* --- ÁREA DE IMAGEN INMERSIVA (75% Alto) --- */}
        <div className="fixed top-0 left-0 right-0 h-[75vh] w-full z-0">
            {/* Imagen Full Bleed (object-cover) */}
            <div className="w-full h-full relative">
                 <img 
                    src={currentImage} 
                    alt={product.name} 
                    className={`w-full h-full object-cover transition-opacity duration-500 ${product.isOutOfStock ? 'grayscale opacity-80' : ''}`} 
                />
                
                {/* Degradado superior para que se vean los botones de navegación */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                
                {/* Degradado inferior para transición suave con el panel blanco */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Botones de Acción Superiores (Flotantes) */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 z-50">
                <button 
                    onClick={onToggleFavorite} 
                    className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/20 border border-white/30 shadow-lg active:scale-90 transition-all"
                >
                    <Icon name="Heart" size={22} className={isFavorite ? 'fill-[#F97316] text-[#F97316]' : 'text-white'} />
                </button>
            </div>

            {/* Indicadores de Galería (Dots) */}
            {imagesToShow.length > 1 && (
                <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-10">
                    {imagesToShow.map((_, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer shadow-sm backdrop-blur-sm ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
                        />
                    ))}
                </div>
            )}
        </div>

        {/* --- ESPACIADOR PARA SCROLL --- */}
        {/* Empuja el contenido hacia abajo para revelar la imagen */}
        <div className="h-[65vh] w-full pointer-events-none"></div>

        {/* --- PANEL DE INFORMACIÓN (Hoja Deslizante) --- */}
        <div className="relative z-10 bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] min-h-[40vh] pb-32 flex flex-col animate-slide-up">
            
            {/* Pequeña barra de agarre visual */}
            <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="px-8 pt-4">
                {/* Cabecera del Producto */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-4">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{product.brand}</p>
                        <h1 className="text-3xl font-black text-gray-900 leading-[1.1] tracking-tight">{product.name}</h1>
                    </div>
                    <div className="flex flex-col items-end">
                         <span className="text-3xl font-black text-gray-900 tracking-tighter">${formatPrice(product.price)}</span>
                         {product.originalPrice && (
                             <span className="text-sm text-gray-400 line-through font-medium">${formatPrice(product.originalPrice)}</span>
                         )}
                    </div>
                </div>

                {/* Stock (Sin Rating) */}
                <div className="flex items-center gap-4 mb-6 border-b border-gray-50 pb-6">
                    {product.isOutOfStock ? (
                        <span className="text-red-500 text-xs font-bold uppercase tracking-wide bg-red-50 px-2 py-1 rounded">Agotado</span>
                    ) : (
                        <span className="text-green-600 text-xs font-bold uppercase tracking-wide bg-green-50 px-2 py-1 rounded">En Stock</span>
                    )}
                </div>

                {/* Selección de Variantes (Antes Tallas) */}
                {product.hasSizes && product.sizes && (
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="font-bold text-gray-900 text-sm">Seleccionar Variantes</h3>
                            {/* Guía de tallas eliminada */}
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                            {product.sizes.map(size => (
                                <button 
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    disabled={product.isOutOfStock}
                                    className={`min-w-[64px] h-[64px] rounded-2xl flex items-center justify-center text-sm font-bold transition-all border active:scale-95 ${selectedSize === size && !product.isOutOfStock ? 'bg-black text-white border-black shadow-xl shadow-black/20 scale-105' : 'bg-white text-gray-900 border-gray-100 hover:border-gray-200'} ${product.isOutOfStock ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    style={selectedSize === size && !product.isOutOfStock ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor } : undefined}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Descripción */}
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2">Descripción</h3>
                    <div className={`relative overflow-hidden transition-all duration-300 ${isDescriptionExpanded ? 'max-h-full' : 'max-h-[80px]'}`}>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            {product.description}
                        </p>
                        {!isDescriptionExpanded && (
                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                        )}
                    </div>
                    <button 
                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        className="text-xs font-bold text-black mt-2 underline decoration-gray-300 hover:text-gray-600"
                    >
                        {isDescriptionExpanded ? 'Leer menos' : 'Leer más'}
                    </button>
                </div>

            </div>
        </div>

        {/* --- BARRA INFERIOR FLOTANTE (Acción) --- */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-4 pb-safe z-50 flex items-center gap-4 animate-slide-up">
                
                {/* Contador de Cantidad */}
                <div className="h-[60px] bg-gray-100/80 rounded-[1.5rem] flex items-center px-2 shadow-inner">
                <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="w-10 h-full flex items-center justify-center text-xl text-gray-500 hover:text-black active:scale-75 transition-transform"
                >-</button>
                <span className="w-6 text-center font-bold text-lg text-gray-900">{quantity}</span>
                <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="w-10 h-full flex items-center justify-center text-xl text-gray-500 hover:text-black active:scale-75 transition-transform"
                >+</button>
                </div>

                {/* Botón Comprar */}
                <button 
                onClick={handleAddToCart}
                disabled={product.isOutOfStock}
                className={`flex-1 h-[60px] rounded-[1.5rem] flex items-center justify-center gap-3 font-bold text-white shadow-xl hover:brightness-110 active:scale-[0.98] transition-all text-sm uppercase tracking-wide ${product.isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-black shadow-black/20'}`}
                style={!product.isOutOfStock ? { backgroundColor: settings.primaryColor } : undefined}
                >
                <Icon name="ShoppingBag" size={20} className="stroke-[2.5]" />
                <span className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-medium opacity-80">{product.isOutOfStock ? 'Stock' : 'Añadir'}</span>
                    <span className="text-base">{product.isOutOfStock ? 'Agotado' : `$${formatPrice(product.price * quantity)}`}</span>
                </span>
                </button>
        </div>

    </div>
  );
};
export default ProductDetail;
