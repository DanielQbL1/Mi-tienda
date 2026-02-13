
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, CartItem, User, StoreSettings, DeliveryZone, Order, Banner, Coupon, Category } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, DEFAULT_SETTINGS, INITIAL_ZONES, INITIAL_BANNERS, INITIAL_COUPONS } from '../constants';
import { loadStoreFromSupabase, supabase as defaultSupabase } from '../supabaseStore';
import { createClient } from '@supabase/supabase-js';

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e instanceof Error) {
        console.warn('LocalStorage error:', e.message);
    }
  }
};

const getInitialState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`shoespots_${key}`);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    // Migration Logic
    if (key === 'categories' && Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map((c: string, idx: number) => ({ id: Date.now().toString() + idx, name: c, icon: 'Tag' })) as any;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

interface StoreContextType {
  products: Product[]; categories: Category[]; settings: StoreSettings; deliveryZones: DeliveryZone[]; orders: Order[]; banners: Banner[]; coupons: Coupon[]; cart: CartItem[]; favorites: number[]; user: User | null; isLoading: boolean; toastMessage: string | null;
  setProducts: (p: Product[]) => void; setCategories: (c: Category[]) => void; setSettings: (s: StoreSettings) => void; setDeliveryZones: (z: DeliveryZone[]) => void; setBanners: (b: Banner[]) => void; setCoupons: (c: Coupon[]) => void; setOrders: (o: Order[]) => void;
  addToCart: (product: Product, size: string) => void; removeFromCart: (id: number, size: string) => void; updateCartQuantity: (id: number, size: string, delta: number) => void; clearCart: () => void; toggleFavorite: (id: number) => void; 
  loginUser: (email: string, pass: string) => Promise<boolean>; 
  registerUser: (name: string, email: string, pass: string) => Promise<boolean>; 
  logout: () => void; 
  updateUser: (user: User) => Promise<void>; 
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE ---
  // IMPORTANTE: Inicializamos con arrays vacíos para NO mostrar datos "mock" antes de leer la DB.
  const [products, setProductsState] = useState<Product[]>(() => getInitialState('products', []));
  const [categories, setCategoriesState] = useState<Category[]>(() => getInitialState('categories', []));
  const [settings, setSettingsState] = useState<StoreSettings>(() => getInitialState('settings', DEFAULT_SETTINGS)); // Settings sí puede tener default para colores
  const [deliveryZones, setDeliveryZonesState] = useState<DeliveryZone[]>(() => getInitialState('zones', []));
  const [orders, setOrdersState] = useState<Order[]>(() => getInitialState('orders', []));
  const [banners, setBannersState] = useState<Banner[]>(() => getInitialState('banners', []));
  const [coupons, setCouponsState] = useState<Coupon[]>(() => getInitialState('coupons', []));
  
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState('cart', []));
  const [favorites, setFavorites] = useState<number[]>(() => getInitialState('favs', []));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to retrieve the correct Supabase Client
  const getClient = () => {
      let client = defaultSupabase;
      const cleanDefaultUrl = (DEFAULT_SETTINGS.supabaseUrl || "").replace(/\/$/, "");
      const cleanCurrentUrl = (settings.supabaseUrl || "").replace(/\/$/, "");
      if (cleanCurrentUrl && settings.supabaseKey && (cleanCurrentUrl !== cleanDefaultUrl || settings.supabaseKey !== DEFAULT_SETTINGS.supabaseKey)) { 
          client = createClient(cleanCurrentUrl, settings.supabaseKey); 
      }
      return client;
  };

  useEffect(() => safeSetItem('shoespots_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => safeSetItem('shoespots_favs', JSON.stringify(favorites)), [favorites]);
  
  // --- SYNC ON LOAD ---
  useEffect(() => {
    let mounted = true;
    async function syncData() {
      try {
        setIsLoading(true);
        const data = await loadStoreFromSupabase();
        
        if (mounted) {
            if (data) {
                // Si hay datos en DB, los usamos
                setProductsState(data.products || []);
                // Migration handling for categories from cloud
                const cloudCats = data.categories || [];
                if (cloudCats.length > 0 && typeof cloudCats[0] === 'string') {
                    setCategoriesState(cloudCats.map((c: string, i: number) => ({ id: i.toString(), name: c, icon: 'Tag' })));
                } else {
                    setCategoriesState(cloudCats);
                }
                setSettingsState(data.settings || DEFAULT_SETTINGS);
                setDeliveryZonesState(data.zones || []);
                setBannersState(data.banners || []);
                setCouponsState(data.coupons || []);
                setOrdersState(data.orders || []);
                persistToLocal(data);
            } else if (defaultSupabase) {
                // Si la DB está vacía o retorna null (primera vez o error de fila no encontrada),
                // realizamos el SEEDING (sembrado) con los datos constantes y actualizamos el estado.
                const seedData = {
                    id: 1, 
                    products: INITIAL_PRODUCTS, 
                    categories: INITIAL_CATEGORIES, 
                    settings: DEFAULT_SETTINGS,
                    zones: INITIAL_ZONES, 
                    banners: INITIAL_BANNERS, 
                    coupons: INITIAL_COUPONS, 
                    orders: [],
                    updated_at: new Date().toISOString()
                };
                
                // Actualizamos el estado visual inmediatamente para no mostrar pantalla blanca
                setProductsState(INITIAL_PRODUCTS);
                setCategoriesState(INITIAL_CATEGORIES);
                setSettingsState(DEFAULT_SETTINGS);
                setDeliveryZonesState(INITIAL_ZONES);
                setBannersState(INITIAL_BANNERS);
                setCouponsState(INITIAL_COUPONS);
                
                try { await defaultSupabase.from('store_data').upsert(seedData); } catch (err) {}
            }
        }
      } catch (err) {
        console.error("Error syncing data:", err);
      } finally { 
        if (mounted) setIsLoading(false); 
      }
    }
    syncData();
    return () => { mounted = false; };
  }, []);

  const persistToLocal = (data: any) => {
      safeSetItem('shoespots_products', JSON.stringify(data.products || []));
      safeSetItem('shoespots_categories', JSON.stringify(data.categories || []));
      safeSetItem('shoespots_settings', JSON.stringify(data.settings || DEFAULT_SETTINGS));
      safeSetItem('shoespots_zones', JSON.stringify(data.zones || []));
      safeSetItem('shoespots_banners', JSON.stringify(data.banners || []));
      safeSetItem('shoespots_coupons', JSON.stringify(data.coupons || []));
      safeSetItem('shoespots_orders', JSON.stringify(data.orders || []));
  };

  const showToast = useCallback((msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000); }, []);

  // --- ADMIN SAVING LOGIC (store_data) ---
  const saveGlobalState = async (field: string, data: any) => {
      safeSetItem(`shoespots_${field}`, JSON.stringify(data));
      const client = getClient();
      if (client) { 
          try { 
              const updateObj: any = { id: 1 }; 
              const dbField = field === 'deliveryZones' ? 'zones' : field; 
              updateObj[dbField] = data; 
              updateObj.updated_at = new Date().toISOString(); 
              await client.from('store_data').upsert(updateObj); 
          } catch (e) { console.error("Cloud Save Error:", e); } 
      }
  };

  const setProducts = useCallback((val: Product[]) => { setProductsState(val); saveGlobalState('products', val); }, [settings]);
  const setCategories = useCallback((val: Category[]) => { setCategoriesState(val); saveGlobalState('categories', val); }, [settings]);
  const setSettings = useCallback((val: StoreSettings) => { setSettingsState(val); saveGlobalState('settings', val); }, [settings]);
  const setDeliveryZones = useCallback((val: DeliveryZone[]) => { setDeliveryZonesState(val); saveGlobalState('zones', val); }, [settings]);
  const setBanners = useCallback((val: Banner[]) => { setBannersState(val); saveGlobalState('banners', val); }, [settings]);
  const setCoupons = useCallback((val: Coupon[]) => { setCouponsState(val); saveGlobalState('coupons', val); }, [settings]);
  const setOrders = useCallback((val: Order[]) => { setOrdersState(val); saveGlobalState('orders', val); }, [settings]);

  // --- CART LOGIC ---
  const addToCart = useCallback((product: Product, size: string) => { setCart(prev => { const existing = prev.find(item => item.id === product.id && item.selectedSize === size); if (existing) { return prev.map(item => item.id === product.id && item.selectedSize === size ? { ...item, quantity: item.quantity + 1 } : item); } return [...prev, { ...product, selectedSize: size, quantity: 1 }]; }); showToast('Añadido a la bolsa'); }, [showToast]);
  const removeFromCart = useCallback((id: number, size: string) => { setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === size))); }, []);
  const updateCartQuantity = useCallback((id: number, size: string, delta: number) => { setCart(prev => prev.map(item => (item.id === id && item.selectedSize === size) ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)); }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const toggleFavorite = useCallback((id: number) => { setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); }, []);

  // --- USER AUTHENTICATION & SYNC (app_users) ---
  
  const loginUser = useCallback(async (email: string, pass: string) => {
      // 1. Admin Check
      if (email === 'admin' && pass === 'admin') {
          setUser({ id: 'admin', name: 'Administrador', email: 'admin@shoespot.com', role: 'admin', avatar: 'https://cdn-icons-png.flaticon.com/512/2942/2942813.png', settings: { location: 'Admin HQ' } });
          showToast('Bienvenido Admin');
          return true;
      }
      // 2. Supabase Check
      const client = getClient();
      if(client) {
          try {
              const { data, error } = await client.from('app_users').select('*').eq('email', email).eq('password', pass).single();
              if(data && !error) {
                  setUser(data);
                  showToast(`Bienvenido ${data.name}`);
                  return true;
              }
          } catch(e) {}
      }
      // 3. Fallback Local
      const usersDbStr = localStorage.getItem('shoespots_users_db');
      if (usersDbStr) {
          const users = JSON.parse(usersDbStr);
          const localUser = users.find((u: User) => u.email === email && u.password === pass);
          if (localUser) { setUser(localUser); showToast(`Bienvenido ${localUser.name}`); return true; }
      }
      return false;
  }, [settings, showToast]);

  const registerUser = useCallback(async (name: string, email: string, pass: string) => {
      const newUser: User = { 
          id: Date.now().toString(), 
          name, email, password: pass, role: 'user', 
          avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', 
          settings: { location: 'La Habana' } 
      };
      
      const client = getClient();
      let savedToCloud = false;

      if(client) {
          try {
              // Check existing email
              const { data: exist } = await client.from('app_users').select('id').eq('email', email).single();
              if(exist) return false; 
              
              // Insert
              const { error } = await client.from('app_users').insert(newUser);
              if(!error) savedToCloud = true;
          } catch(e) { console.error("Register Error", e); }
      }

      // Check Local duplicate if cloud didn't run
      const usersDbStr = localStorage.getItem('shoespots_users_db');
      const users = usersDbStr ? JSON.parse(usersDbStr) : [];
      if (!savedToCloud && users.some((u: User) => u.email === email)) return false;

      // Update Local State for immediate feedback
      users.push(newUser);
      localStorage.setItem('shoespots_users_db', JSON.stringify(users));
      setUser(newUser);
      showToast('Cuenta creada con éxito');
      return true;
  }, [settings, showToast]);

  const updateUser = useCallback(async (updatedUser: User) => {
      setUser(updatedUser);
      const client = getClient();
      if(client && updatedUser.role !== 'admin') {
          try { 
              await client.from('app_users').update(updatedUser).eq('id', updatedUser.id); 
          } catch(e) { console.error("Update User Error", e); }
      }
      // Sync Local
      const usersDbStr = localStorage.getItem('shoespots_users_db');
      if(usersDbStr) {
          const users = JSON.parse(usersDbStr);
          const newUsers = users.map((u: User) => u.email === updatedUser.email ? updatedUser : u);
          localStorage.setItem('shoespots_users_db', JSON.stringify(newUsers));
      }
      showToast('Perfil actualizado');
  }, [settings, showToast]);

  const logout = useCallback(() => { setUser(null); showToast('Sesión cerrada'); }, [showToast]);

  return (
    <StoreContext.Provider value={{
        products, categories, settings, deliveryZones, orders, banners, coupons,
        cart, favorites, user, isLoading, toastMessage,
        setProducts, setCategories, setSettings, setDeliveryZones, setBanners, setCoupons, setOrders,
        addToCart, removeFromCart, updateCartQuantity, clearCart, toggleFavorite,
        loginUser, registerUser, logout, updateUser, showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
