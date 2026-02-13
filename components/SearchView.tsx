
import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import ProductCard from './ProductCard';
import { Product, StoreSettings, Category } from '../types';

interface SearchViewProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[]; 
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  settings: StoreSettings;
}

const SearchView: React.FC<SearchViewProps> = ({ isOpen, onClose, products, categories, favorites, onToggleFavorite, onProductClick, onQuickAdd, settings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (isOpen) { setTimeout(() => { inputRef.current?.focus(); }, 100); } else { setSearchTerm(''); setSelectedCategory(null); } }, [isOpen]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? (product.category === selectedCategory || product.brand === selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 bg-white">
        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-50 text-gray-900"><Icon name="ArrowLeft" size={24} /></button>
        <div className="flex-1 relative">
            <input ref={inputRef} type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar zapatos..." className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="Search" size={18} /></div>
            {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1 bg-white rounded-full shadow-sm"><Icon name="X" size={12} /></button>}
        </div>
      </div>

      <div className="px-5 py-4 border-b border-gray-50/50">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Filtrar por Categoría</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {categories.map((cat) => (
                <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)} 
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border shrink-0 flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`} 
                    style={selectedCategory === cat.name ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor, color: settings.secondaryColor } : undefined}
                >
                    <Icon name={cat.icon as any} size={14} />
                    {cat.name}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="flex justify-between items-center mb-4"><h2 className="font-bold text-gray-900">{searchTerm || selectedCategory ? `Resultados (${filteredProducts.length})` : 'Búsquedas Populares'}</h2></div>
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">{filteredProducts.map(product => (<ProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onToggleFavorite={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }} onClick={() => { onProductClick(product); onClose(); }} onQuickAdd={(e) => { e.stopPropagation(); const defaultSize = (product.sizes && product.sizes.length > 0) ? product.sizes[0] : ''; onQuickAdd(product, defaultSize); }} />))}</div>
        ) : (
            <div className="flex flex-col items-center justify-center pt-10 opacity-50"><Icon name="SearchX" size={48} className="text-gray-300 mb-2" /><p className="text-gray-500 font-medium">No hay resultados.</p></div>
        )}
      </div>
    </div>
  );
};
export default SearchView;
