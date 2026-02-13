
import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { Product, StoreSettings, Order, Banner, DeliveryZone, Coupon, Category } from '../types';
import JSZip from 'jszip';
import { SOURCE_FILES } from './SourceCodes';
import { useStore } from './StoreContext';
import { OverviewTab, OrdersTab, ProductsTab, CategoriesTab, ZonesTab, BannersTab, CouponsTab } from './AdminViews';

// HTML Template for download
const INDEX_HTML = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="ShoeSpot - Calzado Premium" />
    <title>ShoeSpot</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>body{font-family:'Inter',sans-serif;background-color:#f9fafb}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}</style>
    <script type="importmap">{"imports":{"lucide-react":"https://esm.sh/lucide-react@^0.562.0","react":"https://esm.sh/react@^19.2.3","react/":"https://esm.sh/react@^19.2.3/","react-dom/":"https://esm.sh/react-dom@^19.2.3/","jszip":"https://esm.sh/jszip@3.10.1","@supabase/supabase-js":"https://esm.sh/@supabase/supabase-js@2"}}</script>
  </head>
  <body><div id="root"></div><script type="module" src="./index.tsx"></script></body>
</html>`;

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'OVERVIEW' | 'ORDERS' | 'PRODUCTS' | 'CATEGORIES' | 'BANNERS' | 'COUPONS' | 'SETTINGS' | 'ZONES';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
      settings, products, categories, orders, banners, deliveryZones, coupons,
      setSettings, setProducts, setCategories, setBanners, setDeliveryZones, setCoupons, setOrders
  } = useStore();

  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [isDownloading, setIsDownloading] = useState(false);
  
  // -- Local UI State for Modals --
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState<Product | null>(null);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});
  const [sizesInput, setSizesInput] = useState('');
  
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isEditingBanner, setIsEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({});

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isEditingCoupon, setIsEditingCoupon] = useState<Coupon | null>(null);
  const [couponForm, setCouponForm] = useState<Partial<Coupon>>({});

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const productFileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---

  const handleDownloadWeb = async () => {
    if (!window.confirm("¿Descargar código fuente?")) return;
    setIsDownloading(true);
    try {
        const zip = new JSZip();
        zip.file("index.html", INDEX_HTML);
        const timestamp = Date.now();
        const constantsContent = `
import { Product, Banner, StoreSettings, DeliveryZone, Coupon } from './types';
export const DATA_VERSION = ${timestamp};
export const INITIAL_CATEGORIES: any[] = ${JSON.stringify(categories, null, 2)};
export const DEFAULT_SETTINGS: StoreSettings = ${JSON.stringify(settings, null, 2)};
export const INITIAL_ZONES: DeliveryZone[] = ${JSON.stringify(deliveryZones, null, 2)};
export const INITIAL_COUPONS: Coupon[] = ${JSON.stringify(coupons, null, 2)};
export const INITIAL_BANNERS: Banner[] = ${JSON.stringify(banners, null, 2)};
export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;
        zip.file("constants.ts", constantsContent);
        Object.entries(SOURCE_FILES).forEach(([filename, content]) => { zip.file(filename, content); });
        const content = await zip.generateAsync({ type: "blob" });
        
        const url = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = url;
        link.download = `shoespot-v${timestamp}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Error al generar ZIP.");
    } finally {
        setIsDownloading(false);
    }
  };

  const handleSaveProduct = () => {
    if (!prodForm.name || !prodForm.price) return alert('Nombre y Precio son obligatorios');
    const finalSizes = sizesInput.split(',').map(s => s.trim()).filter(s => s !== '');
    
    // Default to first category if not set
    const defaultCategory = categories.length > 0 ? categories[0].name : 'Todo';
    const selectedCat = prodForm.category || defaultCategory;

    const newProduct: Product = {
      id: prodForm.id || Date.now(),
      name: prodForm.name || '',
      brand: prodForm.brand || '',
      price: Number(prodForm.price),
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      image: prodForm.image || 'https://via.placeholder.com/300',
      description: prodForm.description || '',
      sizes: finalSizes.length > 0 ? finalSizes : ['Estándar'],
      hasSizes: prodForm.hasSizes ?? true, 
      category: selectedCat,
      images: prodForm.images || [], 
      isOnSale: prodForm.isOnSale || false,
      isOutOfStock: prodForm.isOutOfStock || false
    };
    if (isEditingProduct) setProducts(products.map(p => p.id === isEditingProduct.id ? newProduct : p));
    else setProducts([...products, newProduct]);
    setIsProductModalOpen(false); setIsEditingProduct(null); setProdForm({});
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const file = e.target.files?.[0];
    if (file) { 
        const reader = new FileReader(); 
        reader.onloadend = () => { 
            const result = reader.result as string; 
            if (isMain) {
                setProdForm(prev => ({ ...prev, image: result }));
            } else {
                setProdForm(prev => ({ ...prev, images: [...(prev.images || []), result] })); 
            }
        }; 
        reader.readAsDataURL(file); 
    }
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
      setProdForm(prev => {
          const newImages = [...(prev.images || [])];
          newImages.splice(index, 1);
          return { ...prev, images: newImages };
      });
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all shadow-sm";

  const renderSettings = () => (
    <div className="space-y-6 animate-fade-in pb-20">
      <h2 className="text-2xl font-bold text-gray-900">Configuración Tienda</h2>
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        {/* LOGO */}
        <div className="flex justify-center py-4">
            <div className="relative group cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                    {settings.logo ? <img src={settings.logo} className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400 font-bold text-center p-2">Subir<br/>Logo</span>}
                </div>
                <input type="file" ref={logoInputRef} hidden onChange={(e) => { const f = e.target.files?.[0]; if(f){ const r=new FileReader(); r.onloadend=()=>setSettings({...settings, logo: r.result as string}); r.readAsDataURL(f); } }} />
                <div className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full shadow-md"><Icon name="Camera" size={16} /></div>
            </div>
        </div>
        
        {/* APPEARANCE */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="PaintBucket" size={16} /> Apariencia
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">Color Primario (Marca)</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm p-0"
                        />
                        <input
                            type="text"
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                            className={`${inputClass} uppercase font-mono`}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Botones, iconos activos y destacados.</p>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">Color Secundario (Fondo/Texto)</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white shadow-sm p-0"
                        />
                        <input
                            type="text"
                            value={settings.secondaryColor}
                            onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                            className={`${inputClass} uppercase font-mono`}
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Contrastes y elementos secundarios.</p>
                </div>
            </div>
        </div>

        {/* OPERATION */}
        <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="Settings" size={16} /> Operativa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Moneda</label>
                    <input type="text" value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})} className={inputClass} placeholder="$" />
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white transition-colors cursor-pointer" onClick={() => setSettings({...settings, enableDelivery: !settings.enableDelivery})}>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center ${settings.enableDelivery ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                        {settings.enableDelivery && <Icon name="Check" size={12} />}
                     </div>
                     <span className="text-xs font-bold text-gray-700">Habilitar Envíos</span>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-white transition-colors cursor-pointer" onClick={() => setSettings({...settings, enablePickup: !settings.enablePickup})}>
                     <div className={`w-5 h-5 rounded border flex items-center justify-center ${settings.enablePickup ? 'bg-black border-black text-white' : 'bg-white border-gray-300'}`}>
                        {settings.enablePickup && <Icon name="Check" size={12} />}
                     </div>
                     <span className="text-xs font-bold text-gray-700">Habilitar Recogida</span>
                </div>
            </div>
        </div>

        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1">Nombre Tienda</label><input type="text" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className={inputClass}/></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1">Eslogan</label><input type="text" value={settings.slogan} onChange={(e) => setSettings({...settings, slogan: e.target.value})} className={inputClass}/></div>
        </div>
        
        <div><label className="block text-xs font-bold text-gray-600 mb-1">WhatsApp Pedidos</label><input type="text" value={settings.whatsappNumber || ''} onChange={(e) => setSettings({...settings, whatsappNumber: e.target.value})} className={inputClass} placeholder="5355555555"/></div>
        
        <div><label className="block text-xs font-bold text-gray-600 mb-1">Dirección Física</label><textarea value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} className={inputClass} rows={2}/></div>

        {/* SUPABASE */}
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-4">
            <h3 className="font-bold text-sm text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-2"><Icon name="Zap" size={16} /> Base de Datos (Supabase)</h3>
            <p className="text-xs text-blue-700 mb-2">Para conectar con tu propia base de datos, ingresa las credenciales. Si se dejan vacías, se usará el almacenamiento local temporal.</p>
            <input type="text" value={settings.supabaseUrl || ''} onChange={(e) => setSettings({...settings, supabaseUrl: e.target.value})} className="w-full p-3 border border-blue-200 rounded-xl bg-white text-black placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Project URL" />
            <input type="password" value={settings.supabaseKey || ''} onChange={(e) => setSettings({...settings, supabaseKey: e.target.value})} className="w-full p-3 border border-blue-200 rounded-xl bg-white text-black placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Anon Public Key" />
        </div>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div><h1 className="text-xl font-bold text-gray-900">Panel Admin</h1><p className="text-xs text-gray-500">Gestionando {settings.name}</p></div>
        <button onClick={onLogout} className="text-red-500 font-bold text-xs hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Salir</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
         <div className="w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col py-4 overflow-y-auto">
            <div className="flex-1">
                {[{ id: 'OVERVIEW', icon: 'BarChart2', label: 'Resumen' }, { id: 'ORDERS', icon: 'ShoppingBag', label: 'Pedidos' }, { id: 'PRODUCTS', icon: 'Package', label: 'Productos' }, { id: 'CATEGORIES', icon: 'List', label: 'Categorías' }, { id: 'BANNERS', icon: 'Star', label: 'Banners' }, { id: 'ZONES', icon: 'Map', label: 'Zonas' }, { id: 'COUPONS', icon: 'Tag', label: 'Cupones' }, { id: 'SETTINGS', icon: 'Settings', label: 'Ajustes' }].map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`flex items-center gap-3 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors w-full ${activeTab === item.id ? 'text-black border-r-4 border-black bg-gray-50' : 'text-gray-400'}`}>
                        <Icon name={item.icon as any} size={20} className={activeTab === item.id ? "fill-current" : ""} />
                        <span className="hidden md:block font-bold text-sm">{item.label}</span>
                    </button>
                ))}
            </div>
            {/* Download Button Removed from here */}
         </div>

         <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'OVERVIEW' && <OverviewTab orders={orders} settings={settings} />}
            {activeTab === 'ORDERS' && <OrdersTab orders={orders} settings={settings} onSelectOrder={setSelectedOrder} onDeleteOrder={(id) => setOrders(orders.filter(o => o.id !== id))} />}
            {activeTab === 'PRODUCTS' && <ProductsTab products={products} settings={settings} onEdit={(p) => { setIsEditingProduct(p); setProdForm({...p}); setSizesInput(p.sizes.join(', ')); setIsProductModalOpen(true); }} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} onAdd={() => { setIsEditingProduct(null); setProdForm({images: [], hasSizes: true, category: categories.length > 0 ? categories[0].name : 'Todo'}); setSizesInput('38, 39, 40'); setIsProductModalOpen(true); }} />}
            {activeTab === 'CATEGORIES' && <CategoriesTab categories={categories} onAdd={(c) => setCategories([...categories, c])} onDelete={(id) => setCategories(categories.filter(cat => cat.id !== id))} />}
            {activeTab === 'ZONES' && <ZonesTab zones={deliveryZones} currency={settings.currency} onAdd={(z) => setDeliveryZones([...deliveryZones, {id: Date.now(), ...z}])} onDelete={(id) => setDeliveryZones(deliveryZones.filter(z => z.id !== id))} />}
            {activeTab === 'COUPONS' && <CouponsTab coupons={coupons} onAdd={() => { setIsEditingCoupon(null); setCouponForm({isActive: true}); setIsCouponModalOpen(true); }} onEdit={(c) => { setIsEditingCoupon(c); setCouponForm(c); setIsCouponModalOpen(true); }} onDelete={(id) => setCoupons(coupons.filter(c => c.id !== id))} onToggle={(id) => setCoupons(coupons.map(c => c.id === id ? {...c, isActive: !c.isActive} : c))} />}
            {activeTab === 'SETTINGS' && renderSettings()}
            {activeTab === 'BANNERS' && <BannersTab banners={banners} onAdd={() => { setIsEditingBanner(null); setBannerForm({ backgroundColor: '#FFF7ED', textColor: '#000000', actionType: 'category', actionValue: categories.length > 0 ? categories[0].name : 'Todo' }); setIsBannerModalOpen(true); }} onEdit={(b) => { setIsEditingBanner(b); setBannerForm(b); setIsBannerModalOpen(true); }} onDelete={(id) => setBanners(banners.filter(b => b.id !== id))} />}
         </div>
      </div>

      {/* --- MODALS --- */}
      {/* Product Modal */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">{isEditingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                  <div className="space-y-5">
                      
                      {/* Main Image Upload */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Foto Principal</label>
                        <div className="flex justify-center mb-4">
                            <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 border-2 border-dashed border-gray-300 flex items-center justify-center" onClick={() => productFileInputRef.current?.click()}>
                                {prodForm.image ? <img src={prodForm.image} className="w-full h-full object-contain" /> : <div className="flex flex-col items-center justify-center h-full text-gray-400"><Icon name="Camera" size={24} /><span className="text-xs mt-2 font-bold">Principal</span></div>}
                            </div>
                            <input type="file" ref={productFileInputRef} hidden onChange={(e) => handleProductImageUpload(e, true)} />
                        </div>
                      </div>

                      {/* Gallery Upload */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">Galería de Fotos</label>
                          <div className="grid grid-cols-4 gap-2">
                              {prodForm.images?.map((img, idx) => (
                                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50 group">
                                      <img src={img} className="w-full h-full object-cover" />
                                      <button 
                                        onClick={() => removeGalleryImage(idx)} 
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                          <Icon name="X" size={12} />
                                      </button>
                                  </div>
                              ))}
                              <button 
                                onClick={() => galleryInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-colors"
                              >
                                  <Icon name="Plus" size={20} />
                              </button>
                          </div>
                          <input type="file" ref={galleryInputRef} hidden onChange={(e) => handleProductImageUpload(e, false)} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <input className={inputClass} placeholder="Nombre" value={prodForm.name || ''} onChange={e => setProdForm({...prodForm, name: e.target.value})}/>
                          <input className={inputClass} placeholder="Marca" value={prodForm.brand || ''} onChange={e => setProdForm({...prodForm, brand: e.target.value})}/>
                      </div>
                      
                      <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">Activar Variantes</span>
                              <input type="checkbox" checked={prodForm.hasSizes ?? true} onChange={e => setProdForm({...prodForm, hasSizes: e.target.checked})} className="w-5 h-5 accent-black" />
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">En Oferta</span>
                              <input type="checkbox" checked={prodForm.isOnSale ?? false} onChange={e => setProdForm({...prodForm, isOnSale: e.target.checked})} className="w-5 h-5 accent-black" />
                          </div>
                          <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-gray-700">Agotado</span>
                              <input type="checkbox" checked={prodForm.isOutOfStock ?? false} onChange={e => setProdForm({...prodForm, isOutOfStock: e.target.checked})} className="w-5 h-5 accent-black" />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-xs font-bold text-gray-500">Precio</label>
                              <input className={inputClass} type="number" value={prodForm.price || ''} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})}/>
                          </div>
                          {prodForm.isOnSale && (
                            <div>
                                <label className="text-xs font-bold text-gray-500">Precio Original</label>
                                <input className={inputClass} type="number" value={prodForm.originalPrice || ''} onChange={e => setProdForm({...prodForm, originalPrice: Number(e.target.value)})}/>
                            </div>
                          )}
                      </div>

                      <select className={inputClass} value={prodForm.category || ''} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                      
                      <textarea className={inputClass} placeholder="Descripción del producto..." rows={3} value={prodForm.description || ''} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                      
                      {prodForm.hasSizes && (
                          <div>
                              <label className="text-xs font-bold text-gray-500 mb-1 block">Variantes (Colores, Tallas, etc.)</label>
                              <input className={inputClass} placeholder="Ej: Rojo, Azul, 40, 41 (separado por comas)" value={sizesInput} onChange={e => setSizesInput(e.target.value)}/>
                          </div>
                      )}

                      <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                          <button onClick={() => setIsProductModalOpen(false)} className="flex-1 py-3.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancelar</button>
                          <button onClick={handleSaveProduct} className="flex-1 py-3.5 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-black/20">Guardar</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Detailed Banner Modal */}
      {isBannerModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">{isEditingBanner ? 'Editar Banner' : 'Nuevo Banner'}</h3>
                  <div className="space-y-4">
                      
                      {/* Banner Image */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">Imagen del Banner</label>
                        <div className="relative w-full h-40 bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 border-2 border-dashed border-gray-300 flex items-center justify-center" onClick={() => bannerFileInputRef.current?.click()}>
                            {bannerForm.image ? (
                                <img src={bannerForm.image} className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Icon name="Camera" size={24} />
                                    <span className="text-xs mt-2 font-bold">Subir Imagen</span>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={bannerFileInputRef} hidden onChange={handleBannerImageUpload} />
                      </div>

                      {/* Texts */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                          <textarea className={inputClass} placeholder="Título Principal (Usa Enter para salto de línea)" rows={2} value={bannerForm.title || ''} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Subtítulo</label>
                            <input className={inputClass} placeholder="Ej: Nueva Temporada" value={bannerForm.subtitle || ''} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Etiqueta (Badge)</label>
                            <input className={inputClass} placeholder="Ej: NUEVO" value={bannerForm.tag || ''} onChange={e => setBannerForm({...bannerForm, tag: e.target.value})} />
                          </div>
                      </div>

                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Color de Fondo</label>
                              <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-2 bg-white">
                                  <input type="color" value={bannerForm.backgroundColor || '#ffffff'} onChange={e => setBannerForm({...bannerForm, backgroundColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
                                  <span className="text-xs text-gray-500">{bannerForm.backgroundColor}</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Color de Texto</label>
                              <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-2 bg-white">
                                  <input type="color" value={bannerForm.textColor || '#000000'} onChange={e => setBannerForm({...bannerForm, textColor: e.target.value})} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
                                  <span className="text-xs text-gray-500">{bannerForm.textColor}</span>
                              </div>
                          </div>
                      </div>

                      {/* Action Type & Value */}
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Acción</label>
                              <select 
                                  className={inputClass} 
                                  value={bannerForm.actionType || 'category'} 
                                  onChange={e => setBannerForm({...bannerForm, actionType: e.target.value as 'category' | 'product', actionValue: ''})}
                              >
                                  <option value="category">Categoría</option>
                                  <option value="product">Producto</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Destino</label>
                              <select 
                                  className={inputClass} 
                                  value={bannerForm.actionValue || ''} 
                                  onChange={e => setBannerForm({...bannerForm, actionValue: e.target.value})}
                              >
                                  <option value="">Seleccionar...</option>
                                  {bannerForm.actionType === 'product' ? (
                                      products.map(p => <option key={p.id} value={p.id.toString()}>{p.name}</option>)
                                  ) : (
                                      <>
                                          <option value="Todo">Todo</option>
                                          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                      </>
                                  )}
                              </select>
                          </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                          <button onClick={() => setIsBannerModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">Cancelar</button>
                          <button 
                            onClick={() => { 
                                if(!bannerForm.title) return alert("El título es obligatorio");
                                if(!bannerForm.actionValue) return alert("Debe seleccionar un destino");
                                const newBanner: Banner = {
                                    id: bannerForm.id || Date.now(), 
                                    title: bannerForm.title, 
                                    subtitle: bannerForm.subtitle || '', 
                                    tag: bannerForm.tag || '', 
                                    image: bannerForm.image || 'https://via.placeholder.com/600', 
                                    actionType: bannerForm.actionType || 'category',
                                    actionValue: bannerForm.actionValue, 
                                    backgroundColor: bannerForm.backgroundColor || '#FFF7ED', 
                                    textColor: bannerForm.textColor || '#000000'
                                }; 
                                if(isEditingBanner) setBanners(banners.map(b => b.id === isEditingBanner.id ? newBanner : b)); 
                                else setBanners([...banners, newBanner]); 
                                setIsBannerModalOpen(false); 
                            }} 
                            className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-900"
                        >
                            Guardar Banner
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Simplified Coupon Modal */}
      {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-slide-up"><h3 className="text-xl font-bold mb-4">{isEditingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}</h3><input className={`${inputClass} mb-3 uppercase`} placeholder="CÓDIGO" value={couponForm.code || ''} onChange={e => setCouponForm({...couponForm, code: e.target.value})}/><input className={`${inputClass} mb-3`} type="number" step="0.01" placeholder="Descuento (0.10)" value={couponForm.discountPercentage || ''} onChange={e => setCouponForm({...couponForm, discountPercentage: Number(e.target.value)})}/><div className="flex gap-3"><button onClick={() => setIsCouponModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button><button onClick={() => { if(!couponForm.code) return; const newC = {id: couponForm.id || Date.now().toString(), code: couponForm.code.toUpperCase(), discountPercentage: Number(couponForm.discountPercentage), isActive: true, description: ''}; if(isEditingCoupon) setCoupons(coupons.map(c => c.id === isEditingCoupon.id ? newC : c)); else setCoupons([...coupons, newC]); setIsCouponModalOpen(false); }} className="flex-1 py-3 bg-black text-white rounded-xl font-bold">Guardar</button></div></div>
          </div>
      )}

      {/* Order Details */}
      {selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 animate-slide-up">
                  <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Pedido {selectedOrder.id}</h3><button onClick={() => setSelectedOrder(null)}><Icon name="X" size={20}/></button></div>
                  <div className="mb-4 text-sm"><p><strong>Cliente:</strong> {selectedOrder.customer.name}</p><p><strong>Tel:</strong> {selectedOrder.customer.phone}</p><p><strong>Total:</strong> {settings.currency}{selectedOrder.total}</p></div>
                  <div className="flex gap-2"><button onClick={() => { setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'completed'} : o)); setSelectedOrder(null); }} className="flex-1 bg-green-600 text-white py-2 rounded-lg">Completar</button><button onClick={() => { setOrders(orders.map(o => o.id === selectedOrder.id ? {...o, status: 'cancelled'} : o)); setSelectedOrder(null); }} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg">Cancelar</button></div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
