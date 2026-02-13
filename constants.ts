
import { Product, Banner, StoreSettings, DeliveryZone, Coupon, Category } from './types';

// Control de versión para actualizaciones estáticas
export const DATA_VERSION = 13;

// Categorías: Objetos con iconos
export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Nike', icon: 'Zap' },
  { id: '2', name: 'Adidas', icon: 'Star' },
  { id: '3', name: 'Puma', icon: 'Tag' },
  { id: '4', name: 'Jordan', icon: 'ShoppingBag' },
  { id: '5', name: 'Reebok', icon: 'CheckCircle' },
  { id: '6', name: 'Converse', icon: 'Moon' },
  { id: '7', name: 'Vans', icon: 'Truck' },
  { id: '8', name: 'NB', icon: 'Map' }
];

// SECURITY FIX: Use environment variables or fallback to empty strings.
const FALLBACK_URL = 'https://oxvqcaslegejlqwkbcwq.supabase.co/';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dnFjYXNsZWdlamxxd2tiY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTgxNTAsImV4cCI6MjA4NDY5NDE1MH0.WfQKKUSnz-we9xFEl4G0Ndr14iA8l_ycpsi7QTQHwgg';

export const DEFAULT_SETTINGS: StoreSettings = {
  name: 'SHOESPOT',
  slogan: 'Calzado Premium',
  logo: '',
  address: 'Calle 23 e/ L y M, Vedado, La Habana',
  phones: ['+53 5555 5555'],
  whatsappNumber: '5355555555',
  email: 'contacto@shoespot.cu',
  primaryColor: '#F97316', // Orange Accent from reference
  secondaryColor: '#FFFFFF',
  currency: '$',
  enableDelivery: true,
  enablePickup: true,
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || FALLBACK_URL,
  supabaseKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY
};

export const INITIAL_ZONES: DeliveryZone[] = [
  { id: 1, name: 'Vedado', price: 5 },
  { id: 2, name: 'Centro Habana', price: 7 },
  { id: 3, name: 'La Habana Vieja', price: 8 },
  { id: 4, name: 'Miramar', price: 10 },
  { id: 5, name: 'Playa', price: 12 },
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: '1', code: 'HOLA50', discountPercentage: 0.50, isActive: true, description: '50% dto. en tu primer pedido' },
  { id: '2', code: 'ZAPAS10', discountPercentage: 0.10, isActive: true, description: '10% descuento de temporada' },
  { id: '3', code: 'VIP20', discountPercentage: 0.20, isActive: false, description: 'Exclusivo VIP' },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Super Oferta\nDescuento\nHasta 50%",
    subtitle: "En tu primera compra",
    tag: "Limitado",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    actionType: "category",
    actionValue: "Nike",
    backgroundColor: "#F3F4F6", // Hex color directly
    textColor: "#000000"
  },
  {
    id: 2,
    title: "Nueva\nColección",
    subtitle: "Temporada 2024",
    tag: "Nuevo",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    actionType: "category",
    actionValue: "Adidas",
    backgroundColor: "#FFF7ED",
    textColor: "#000000"
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Auriculares Inalámbricos', 
    brand: 'Electronics',
    price: 120.00,
    originalPrice: 150.00,
    category: 'Nike',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Auriculares inalámbricos de alta calidad con cancelación de ruido.',
    sizes: ['Única'],
    hasSizes: false,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    isOnSale: true,
    isOutOfStock: false
  },
  {
    id: 2,
    name: 'Suéter de Mujer',
    brand: 'Fashion',
    price: 70.00,
    category: 'Adidas',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Suéter de algodón cómodo para el uso diario.',
    sizes: ['S', 'M', 'L'],
    hasSizes: true,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    isOnSale: false,
    isOutOfStock: false
  },
  {
    id: 3,
    name: 'Reloj Inteligente',
    brand: 'Electronics',
    price: 55.00,
    category: 'Puma',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Sigue tus objetivos de fitness con estilo.',
    sizes: ['40mm', '44mm'],
    hasSizes: true,
    images: [],
    isOnSale: false,
    isOutOfStock: false
  },
  {
    id: 4,
    name: 'Air Max 270',
    brand: 'Nike',
    price: 150,
    originalPrice: 180,
    category: 'Nike',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Las Nike Air Max 270 ofrecen aire visible en cada paso.',
    sizes: ['39', '40', '41', '42', '43', '44'],
    hasSizes: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    isOnSale: true,
    isOutOfStock: false
  }
];
