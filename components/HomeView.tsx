
import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { Product, Banner, StoreSettings, Category } from '../types';
import Icon from './Icon';

interface HomeViewProps {
  products: Product[];
  categories: Category[]; // Updated to Category[]
  banners: Banner[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product, size: string) => void;
  settings: StoreSettings;
}

const HomeView: React.FC<HomeViewProps> = ({ products, categories, banners, favorites, onToggleFavorite, onProductClick, onQuickAdd, settings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategory ? (p.category === selectedCategory || p.brand === selectedCategory) : true;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBannerClick = (banner: Banner) => {
    if (banner.actionType === 'product') {
        const product = products.find(p => p.id.toString() === banner.actionValue);
        if (product) {
            onProductClick(product);
        }
    } else {
        // Redirigir a categoría
        setSelectedCategory(banner.actionValue);
        // Scroll hacia los productos
        window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-24 animate-fade-in min-h-screen bg-white">
      
      {/* Search Bar Area */}
      <div className="px-5 pt-2 pb-6 bg-[#F8F8F8] rounded-b-[2.5rem]">
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon name="Search" size={20} />
            </div>
            <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-medium text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 border-l border-gray-200 pl-3">
                <Icon name="BarChart2" size={20} className="rotate-90" />
            </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Hero Banner (Movido Arriba) */}
        <div className="px-5 mb-10">
            <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-5">
            {banners.map((banner) => (
                <div key={banner.id} className="snap-center shrink-0 w-full relative cursor-pointer group" onClick={() => handleBannerClick(banner)}>
                    <div 
                        className={`relative h-[220px] w-full rounded-[2.5rem] overflow-hidden flex flex-row items-center justify-between p-8 shadow-sm transition-transform active:scale-[0.98]`} 
                        style={{ backgroundColor: banner.backgroundColor }} // Uso dinámico del color
                    >
                        <div className="z-10 flex flex-col items-start justify-center h-full max-w-[55%]">
                            {banner.subtitle && (
                                <span className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60" style={{ color: banner.textColor }}>{banner.subtitle}</span>
                            )}
                            <h2 
                                className="text-3xl font-black leading-[0.9] mb-6 whitespace-pre-line tracking-tight"
                                style={{ color: banner.textColor }} // Uso dinámico del color
                            >
                                {banner.title}
                            </h2>
                            <button className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 group-hover:gap-3 transition-all">
                                Comprar <Icon name="ArrowRight" size={14} />
                            </button>
                        </div>
                        <div className="absolute right-[-30px] top-0 bottom-0 w-[60%] flex items-center justify-center">
                            <img 
                                src={banner.image} 
                                className="w-full h-full object-contain mix-blend-multiply scale-125 drop-shadow-2xl -rotate-12 group-hover:-rotate-6 transition-transform duration-500" 
                            />
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>

        {/* Categories (Movido Abajo) */}
        <div className="px-5 mb-10">
            <div className="flex justify-between items-center gap-4 overflow-x-auto no-scrollbar pb-2">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className="flex flex-col items-center gap-2 min-w-[64px] group"
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${!selectedCategory ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 group-hover:border-gray-200'}`} style={!selectedCategory ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor } : {}}>
                        <Icon name="List" size={24} />
                    </div>
                    <span className={`text-[11px] font-bold tracking-wide ${!selectedCategory ? 'text-gray-900' : 'text-gray-400'}`}>Todo</span>
                </button>

                {categories.map((cat) => (
                    <button 
                        key={cat.id} 
                        onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)} 
                        className="flex flex-col items-center gap-2 min-w-[64px] group"
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${selectedCategory === cat.name ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 group-hover:border-gray-200'}`} style={selectedCategory === cat.name ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor } : {}}>
                            <Icon name={cat.icon as any} size={24} />
                        </div>
                        <span className={`text-[11px] font-bold tracking-wide ${selectedCategory === cat.name ? 'text-gray-900' : 'text-gray-400'}`}>{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Product Grid */}
        <div className="px-5">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {selectedCategory ? selectedCategory : 'Destacados'}
                </h2>
                <button onClick={() => setSelectedCategory(null)} className="text-xs text-gray-400 font-bold hover:text-black transition-colors">Ver Todo</button>
            </div>
            
            {displayedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-12 pb-10">
                {displayedProducts.map((product) => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        isFavorite={favorites.includes(product.id)} 
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
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Icon name="SearchX" size={48} className="mb-4 opacity-20" />
                    <p className="text-sm font-medium">No se encontraron productos.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
export default HomeView;
