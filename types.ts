
export interface Product { id: number; name: string; brand: string; price: number; originalPrice?: number; image: string; description: string; sizes: string[]; hasSizes: boolean; category: string; images: string[]; isOnSale?: boolean; isOutOfStock?: boolean; }
export interface CartItem extends Product { selectedSize: string; quantity: number; }
export type ViewState = 'HOME' | 'DETAILS' | 'CART' | 'FAVORITES' | 'PROFILE' | 'ADMIN' | 'TERMS' | 'FAQ' | 'ABOUT';
export interface User { id: string; name: string; email: string; phone?: string; address?: string; avatar: string; role?: 'user' | 'admin'; password?: string; settings: { location: string; } }
export interface Banner { 
    id: number; 
    title: string; 
    subtitle: string; 
    tag: string; 
    image: string; 
    actionType: 'category' | 'product'; 
    actionValue: string; 
    backgroundColor: string; 
    textColor: string; 
}
export interface Category {
    id: string;
    name: string;
    icon: string;
}
export interface DeliveryZone { id: number; name: string; price: number; }
export interface StoreSettings { name: string; slogan: string; logo: string; address: string; phones: string[]; email: string; whatsappNumber?: string; primaryColor: string; secondaryColor: string; currency: string; enableDelivery: boolean; enablePickup: boolean; supabaseUrl?: string; supabaseKey?: string; }
export interface Coupon { id: string; code: string; discountPercentage: number; isActive: boolean; description?: string; }
export interface Order { id: string; date: string; status: 'pending' | 'completed' | 'cancelled'; customer: { name: string; phone: string; address?: string; notes?: string; }; items: CartItem[]; subtotal: number; discount: number; shipping: number; total: number; deliveryMethod: 'delivery' | 'pickup'; }
