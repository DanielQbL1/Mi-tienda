
import React, { useState, useRef } from 'react';
import Icon from './Icon';
import { User, Order, Coupon, StoreSettings, ViewState } from '../types';

interface ProfileViewProps { user: User; onLogout: () => void; onUpdateUser: (updatedUser: User) => Promise<void> | void; orders: Order[]; coupons: Coupon[]; settings: StoreSettings; onNavigate: (view: ViewState) => void; }

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdateUser, orders, coupons, settings, onNavigate }) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [editedName, setEditedName] = useState(user.name); 
  const [editedEmail, setEditedEmail] = useState(user.email); 
  const [editedPhone, setEditedPhone] = useState(user.phone || ''); 
  const [editedAddress, setEditedAddress] = useState(user.address || ''); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const myOrders = orders.filter(o => o.customer.name === user.name || (user.phone && o.customer.phone === user.phone));
  myOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleSaveProfile = async () => { 
      const updatedUser = { ...user, name: editedName, email: editedEmail, phone: editedPhone, address: editedAddress }; 
      await onUpdateUser(updatedUser); // This now calls Supabase in StoreContext
      setIsEditing(false); 
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => { 
      const file = event.target.files?.[0]; 
      if (file) { 
          const reader = new FileReader(); 
          reader.onloadend = () => { 
              const updatedUser = { ...user, avatar: reader.result as string }; 
              onUpdateUser(updatedUser); 
          }; 
          reader.readAsDataURL(file); 
      } 
  };
  
  const getStatusColor = (status: string) => { switch(status) { case 'completed': return 'bg-green-100 text-green-700'; case 'cancelled': return 'bg-red-100 text-red-700'; default: return 'bg-yellow-100 text-yellow-700'; } };
  const getStatusText = (status: string) => { switch(status) { case 'completed': return 'Completado'; case 'cancelled': return 'Cancelado'; default: return 'Pendiente'; } };
  
  return ( 
      <div className="pb-24 px-5 animate-fade-in"> 
          <div className="flex flex-col items-center pt-8 pb-6"> 
              <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}> 
                  <img src={user.avatar} alt="Profile" className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover transition-transform group-hover:scale-105" /> 
                  <div className="absolute bottom-0 right-0 bg-black text-white p-2.5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:rotate-12" style={{ backgroundColor: settings.primaryColor }}><Icon name="Camera" size={16} /></div> 
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} /> 
              </div> 
              {isEditing ? ( 
                  <div className="w-full max-w-sm space-y-3 animate-fade-in bg-white p-6 rounded-2xl shadow-lg border border-gray-100"> 
                      <h3 className="text-center font-bold mb-2">Editar Perfil</h3> 
                      <div><label className="text-xs font-bold text-gray-500 ml-1">Nombre</label><input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 font-medium text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" /></div> 
                      <div><label className="text-xs font-bold text-gray-500 ml-1">Email</label><input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-600 focus:ring-2 focus:ring-black focus:outline-none" /></div> 
                      <div><label className="text-xs font-bold text-gray-500 ml-1">Teléfono</label><input type="tel" value={editedPhone} placeholder="+53..." onChange={(e) => setEditedPhone(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" /></div> 
                      <div><label className="text-xs font-bold text-gray-500 ml-1">Dirección (para envíos)</label><textarea value={editedAddress} placeholder="Calle, #, Municipio..." onChange={(e) => setEditedAddress(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-black focus:outline-none" rows={2} /></div> 
                      <div className="flex gap-2 justify-center mt-4 pt-2 border-t border-gray-100"><button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold hover:bg-gray-200">Cancelar</button><button onClick={handleSaveProfile} className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800" style={{ backgroundColor: settings.primaryColor }}>Guardar</button></div> 
                  </div> 
              ) : ( 
                  <div className="text-center"><h2 className="text-2xl font-bold text-gray-900">{user.name}</h2><p className="text-gray-500 text-sm font-medium mb-3">{user.email}</p><button onClick={() => setIsEditing(true)} className="text-xs font-bold bg-gray-100 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">Editar Perfil</button></div> 
              )} 
          </div> 
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Ajustes</h3> 
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100 mb-6"> 
              <div className="w-full flex items-center justify-between p-4 border-b border-gray-50"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Icon name="MapPin" size={20} /></div><div className="flex-1"><span className="font-semibold text-gray-700 text-sm block">Mi Dirección</span><span className="text-xs text-gray-400 line-clamp-1">{user.address || 'No configurada'}</span></div></div>{user.address && <Icon name="CheckCircle" size={18} className="text-green-500" />}</div> 
              <div className="w-full flex items-center justify-between p-4"><div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Icon name="Phone" size={20} /></div><div><span className="font-semibold text-gray-700 text-sm block">Teléfono</span><span className="text-xs text-gray-400">{user.phone || 'No configurado'}</span></div></div></div> 
          </div> 
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1 flex items-center gap-2">Mis Pedidos <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{myOrders.length}</span></h3> 
          <div className="space-y-3 mb-6"> 
              {myOrders.length > 0 ? ( 
                  myOrders.map(order => ( 
                      <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center transition-all hover:border-gray-300"> 
                          <div> 
                              <div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-900 text-sm">{order.id}</span><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span></div> 
                              <p className="text-xs text-gray-400 font-medium">{new Date(order.date).toLocaleDateString()}</p> 
                          </div> 
                          <div className="text-right"> 
                              <span className="block font-bold text-gray-900">{settings.currency}{order.total.toFixed(2)}</span> 
                              <span className="text-[10px] text-gray-500">{order.items.length} artículo{order.items.length !== 1 ? 's' : ''}</span> 
                          </div> 
                      </div> 
                  )) 
              ) : ( 
                  <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100 border-dashed"> 
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><Icon name="ShoppingBag" size={20} className="text-gray-300" /></div> 
                      <p className="text-gray-500 text-sm font-medium">Aún no has realizado pedidos.</p> 
                  </div> 
              )} 
          </div> 
          <button onClick={onLogout} className="w-full mt-8 text-red-500 font-bold py-4 rounded-2xl bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"><Icon name="LogOut" size={20} /> Cerrar Sesión</button> 
          <p className="text-center text-gray-400 text-[10px] mt-6 font-medium">ShoeSpot App v2.1.0</p> 
      </div> 
  );
};
export default ProfileView;
