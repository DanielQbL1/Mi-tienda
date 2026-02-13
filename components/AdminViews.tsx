
import React, { useRef, useState } from 'react';
import Icon, { ICON_LIST, IconName } from './Icon';
import { Product, Order, Banner, DeliveryZone, Coupon, StoreSettings, Category } from '../types';

const inputClass = "p-3 border border-gray-300 rounded-xl bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent focus:outline-none transition-all shadow-sm";

// --- SUB-COMPONENTS FOR ADMIN DASHBOARD ---

export const OverviewTab: React.FC<{ orders: Order[], settings: StoreSettings }> = ({ orders, settings }) => {
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900">Resumen Mensual</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100"><h3 className="text-blue-600 font-bold text-sm uppercase">Ventas Totales</h3><p className="text-3xl font-bold text-gray-900 mt-2">{settings.currency}{totalSales.toFixed(2)}</p></div>
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100"><h3 className="text-green-600 font-bold text-sm uppercase">Pedidos Totales</h3><p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p></div>
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100"><h3 className="text-purple-600 font-bold text-sm uppercase">Valor Medio</h3><p className="text-3xl font-bold text-gray-900 mt-2">{settings.currency}{(orders.length > 0 ? totalSales / orders.length : 0).toFixed(2)}</p></div>
        </div>
      </div>
    );
};

export const OrdersTab: React.FC<{ orders: Order[], settings: StoreSettings, onSelectOrder: (o: Order) => void, onDeleteOrder: (id: string) => void }> = ({ orders, settings, onSelectOrder, onDeleteOrder }) => (
    <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-900">Pedidos ({orders.length})</h2>
        {orders.length === 0 ? <p className="text-gray-500">Aún no hay pedidos.</p> : (
            <div className="space-y-3">
                {orders.map(order => (
                    <div key={order.id} onClick={() => onSelectOrder(order)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 cursor-pointer hover:bg-gray-50 transition-colors relative group">
                        <div>
                            <div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-900">{order.id}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status === 'completed' ? 'Completado' : order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}</span></div>
                            <p className="text-sm text-gray-600">{order.customer.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right"><p className="text-xl font-bold text-gray-900">{settings.currency}{order.total.toFixed(2)}</p><span className="text-xs text-blue-500 font-bold">Ver Detalles</span></div>
                            <button onClick={(e) => { e.stopPropagation(); onDeleteOrder(order.id); }} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors z-10" title="Eliminar"><Icon name="Trash2" size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

export const ProductsTab: React.FC<{ products: Product[], settings: StoreSettings, onEdit: (p: Product) => void, onDelete: (id: number) => void, onAdd: () => void }> = ({ products, settings, onEdit, onDelete, onAdd }) => (
    <div className="space-y-4 animate-fade-in">
       <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">Productos ({products.length})</h2><button onClick={onAdd} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-black/20"><Icon name="Plus" size={16} /> Añadir</button></div>
       <div className="grid gap-3">{products.map(p => (<div key={p.id} className={`flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative ${p.isOutOfStock ? 'opacity-60' : ''}`}><div className="relative"><img src={p.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" loading="lazy" />{p.isOutOfStock && <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"><span className="text-[10px] font-bold text-white bg-black/70 px-1 py-0.5 rounded">AGOTADO</span></div>}</div><div className="flex-1"><h4 className="font-bold text-gray-900">{p.name}</h4><div className="flex items-center gap-2 text-xs text-gray-500"><span>{p.category}</span>•<span>{settings.currency}{p.price}</span>{p.isOnSale && <span className="text-red-500 font-bold">Oferta</span>}</div></div><div className="flex gap-2 relative z-10"><button type="button" onClick={() => onEdit(p)} className="w-10 h-10 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-100"><Icon name="Edit2" size={18} /></button><button type="button" onClick={() => onDelete(p.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100"><Icon name="Trash2" size={18} /></button></div></div>))}</div>
    </div>
);

export const CategoriesTab: React.FC<{ categories: Category[], onAdd: (c: Category) => void, onDelete: (id: string) => void }> = ({ categories, onAdd, onDelete }) => {
    const [name, setName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState<IconName>('Tag');
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Categorías</h2>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex gap-2 items-center">
                    {/* Icon Trigger */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsIconPickerOpen(!isIconPickerOpen)}
                            className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors"
                        >
                            <Icon name={selectedIcon} size={24} />
                        </button>
                        
                        {/* Icon Picker Popover */}
                        {isIconPickerOpen && (
                            <div className="absolute top-14 left-0 z-50 w-64 h-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-y-auto p-2 grid grid-cols-4 gap-2">
                                {ICON_LIST.map((iconName) => (
                                    <button
                                        key={iconName}
                                        onClick={() => { setSelectedIcon(iconName); setIsIconPickerOpen(false); }}
                                        className={`p-2 rounded-lg flex items-center justify-center hover:bg-gray-50 ${selectedIcon === iconName ? 'bg-black text-white hover:bg-black' : ''}`}
                                    >
                                        <Icon name={iconName} size={20} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <input className={`flex-1 ${inputClass}`} placeholder="Nombre categoría" value={name} onChange={e => setName(e.target.value)} />
                    <button 
                        onClick={() => { 
                            if(name) { 
                                onAdd({ id: Date.now().toString(), name: name, icon: selectedIcon }); 
                                setName(''); 
                                setSelectedIcon('Tag'); 
                            } 
                        }} 
                        className="bg-black text-white px-6 rounded-xl font-bold shadow-lg shadow-black/20"
                    >
                        Añadir
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative group flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                <Icon name={cat.icon as any} size={16} />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">{cat.name}</span>
                        </div>
                        <button 
                            onClick={() => onDelete(cat.id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <Icon name="X" size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ZonesTab: React.FC<{ zones: DeliveryZone[], currency: string, onAdd: (z: {name: string, price: number}) => void, onDelete: (id: number) => void }> = ({ zones, currency, onAdd, onDelete }) => {
    const [form, setForm] = React.useState({ name: '', price: '' });
    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900">Zonas de Entrega</h2>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-2 mb-6"><input className={`flex-[2] ${inputClass}`} placeholder="Nombre Zona" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /><input className={`flex-1 ${inputClass}`} placeholder="Precio" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /><button onClick={() => { if(form.name && form.price) { onAdd({name: form.name, price: Number(form.price)}); setForm({name: '', price: ''}); } }} className="bg-black text-white px-6 rounded-xl font-bold">Añadir</button></div>
                <div className="space-y-2">{zones.map(zone => (<div key={zone.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200"><div><span className="font-bold text-gray-900">{zone.name}</span><span className="ml-2 text-gray-500 text-sm">{currency}{zone.price}</span></div><button type="button" onClick={() => onDelete(zone.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Icon name="Trash2" size={16} /></button></div>))}</div>
            </div>
        </div>
    );
};

export const BannersTab: React.FC<{ banners: Banner[], onAdd: () => void, onEdit: (b: Banner) => void, onDelete: (id: number) => void }> = ({ banners, onAdd, onEdit, onDelete }) => (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">Banners ({banners.length})</h2><button onClick={onAdd} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-black/20"><Icon name="Plus" size={16} /> Añadir</button></div>
        <div className="grid grid-cols-1 gap-4">
            {banners.map(banner => (
                <div key={banner.id} className="rounded-2xl overflow-hidden shadow-sm relative border border-gray-200" style={{ backgroundColor: banner.backgroundColor }}>
                    <div className="p-6 flex justify-between items-center h-40">
                        <div className="flex flex-col z-10 max-w-[60%]">
                            <span className="text-[10px] font-bold uppercase mb-1" style={{ color: banner.textColor, opacity: 0.7 }}>{banner.subtitle || 'Subtítulo'}</span>
                            <h4 className="font-black text-2xl leading-none" style={{ color: banner.textColor }}>{banner.title}</h4>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                             <img src={banner.image} className="w-full h-full object-contain mix-blend-multiply opacity-50" />
                        </div>
                    </div>
                    {/* Controls Overlay */}
                    <div className="absolute top-2 right-2 flex gap-2">
                         <button type="button" onClick={() => onEdit(banner)} className="p-2 bg-white/80 backdrop-blur text-blue-600 rounded-lg shadow-sm hover:bg-white"><Icon name="Edit2" size={16} /></button>
                         <button type="button" onClick={() => onDelete(banner.id)} className="p-2 bg-white/80 backdrop-blur text-red-500 rounded-lg shadow-sm hover:bg-white"><Icon name="Trash2" size={16} /></button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const CouponsTab: React.FC<{ coupons: Coupon[], onAdd: () => void, onEdit: (c: Coupon) => void, onDelete: (id: string) => void, onToggle: (id: string) => void }> = ({ coupons, onAdd, onEdit, onDelete, onToggle }) => (
    <div className="space-y-4 animate-fade-in">
        <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-gray-900">Cupones ({coupons.length})</h2><button onClick={onAdd} className="bg-black text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-black/20"><Icon name="Plus" size={16} /> Crear</button></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{coupons.map(coupon => (<div key={coupon.id} className={`bg-white border p-5 rounded-2xl shadow-sm relative overflow-hidden transition-all ${coupon.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/20'}`}><div className="flex justify-between"><div><h3 className="font-black text-gray-900">{coupon.code}</h3><p className="text-sm text-gray-500">{coupon.description}</p></div><div className="text-right"><span className="block text-2xl font-bold">{coupon.discountPercentage * 100}%</span>{coupon.isActive ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIVO</span> : <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">PAUSADO</span>}</div></div><div className="flex justify-end gap-2 mt-4"><button type="button" onClick={() => onToggle(coupon.id)} className={`p-2 rounded-lg ${coupon.isActive ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}><Icon name={coupon.isActive ? 'Pause' : 'Play'} size={16} /></button><button type="button" onClick={() => onEdit(coupon)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Icon name="Edit2" size={16} /></button><button type="button" onClick={() => onDelete(coupon.id)} className="p-2 bg-red-50 text-red-500 rounded-lg"><Icon name="Trash2" size={16} /></button></div></div>))}</div>
    </div>
);
