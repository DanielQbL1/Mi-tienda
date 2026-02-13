
import React, { useState } from 'react';
import Icon from './Icon';
import { CartItem, DeliveryZone, StoreSettings, Order, Coupon, User } from '../types';

interface CartViewProps {
  cart: CartItem[];
  user: User | null;
  deliveryZones: DeliveryZone[];
  settings: StoreSettings;
  coupons: Coupon[];
  onRemove: (id: number, size: string) => void;
  onUpdateQuantity: (id: number, size: string, delta: number) => void;
  onPlaceOrder: (order: Order) => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, user, settings, onRemove, onUpdateQuantity, onPlaceOrder, deliveryZones, coupons }) => {
  const [couponCode, setCouponCode] = useState('');
  
  // Calculate Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Simplified for visual match

  const formatPrice = (price: number) => price % 1 === 0 ? price : price.toFixed(2);

  const handleCheckout = () => {
      // Mock order for demo
      const newOrder: Order = {
        id: `#ORD-${Math.floor(Math.random() * 10000)}`, date: new Date().toISOString(), status: 'pending',
        customer: { name: user?.name || 'Invitado', phone: user?.phone || '', address: user?.address || '' },
        items: cart, subtotal: subtotal, discount: 0, shipping: 0, total: total, deliveryMethod: 'delivery'
      };
      onPlaceOrder(newOrder);
  };

  if (cart.length === 0) return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <Icon name="ShoppingBag" size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Tu bolsa está vacía</h2>
          <p className="text-gray-400 text-sm mt-1 mb-6 text-center">Agrega algunos productos para comenzar</p>
      </div>
  );

  return (
    <div className="pb-32 px-5 pt-2 animate-fade-in min-h-screen bg-[#F8F8F8]">
      {/* List Items */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={`${item.id}-${item.selectedSize}`} className="bg-white p-3 rounded-[1.5rem] flex items-center gap-4 shadow-sm border border-gray-50">
            {/* Image */}
            <div className="w-20 h-20 bg-[#F4F4F4] rounded-[1rem] flex-shrink-0 flex items-center justify-center p-2">
                <img src={item.image} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                    <p className="text-gray-400 text-xs">{item.brand}</p>
                    {item.hasSizes && <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded">Variante: {item.selectedSize}</span>}
                </div>
                <div className="font-bold text-gray-900">${formatPrice(item.price)}</div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2">
                <button onClick={() => onRemove(item.id, item.selectedSize)} className="text-[#F97316]">
                    <Icon name="Trash2" size={16} />
                </button>
                <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                    <button onClick={() => onUpdateQuantity(item.id, item.selectedSize, -1)} className="w-5 h-5 flex items-center justify-center font-bold text-gray-600">-</button>
                    <span className="text-xs font-bold text-gray-900">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, item.selectedSize, 1)} className="w-5 h-5 flex items-center justify-center font-bold text-gray-600">+</button>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="mb-6 relative">
          <input 
            type="text" 
            placeholder="Código de descuento" 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full bg-white rounded-[1.2rem] py-4 pl-6 pr-20 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none shadow-sm"
          />
          <button className="absolute right-2 top-2 bottom-2 text-[#F97316] font-bold text-xs px-4 hover:bg-orange-50 rounded-xl transition-colors">
              Aplicar
          </button>
      </div>

      {/* Summary */}
      <div className="space-y-3 mb-8 px-2">
          <div className="flex justify-between text-gray-400 text-sm">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">${formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm border-b border-gray-100 pb-3">
              <span>Total</span>
              <span className="font-bold text-gray-900">${formatPrice(total)}</span>
          </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={handleCheckout}
        className="w-full bg-[#F97316] text-white font-bold py-4 rounded-[1.5rem] shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-colors"
      >
        Pagar
      </button>
    </div>
  );
};
export default CartView;
