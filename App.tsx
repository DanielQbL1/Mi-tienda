import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import ProfileView from './components/ProfileView';
import FavoritesView from './components/FavoritesView';
import SearchView from './components/SearchView';
import AuthView from './components/AuthView';
import AdminDashboard from './components/AdminDashboard';
import SideMenu from './components/SideMenu';
import StaticPage from './components/StaticPage';
import Icon from './components/Icon';
import { ViewState, Product, Order } from './types';
import { StoreProvider, useStore } from './components/StoreContext';

const AppContent: React.FC = () => {
  const { 
      user, settings, products, categories, cart, favorites, 
      orders, banners, coupons, deliveryZones,
      logout, updateUser, toggleFavorite, addToCart, 
      removeFromCart, updateCartQuantity, setOrders, clearCart,
      toastMessage, showToast
  } = useStore();

  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Dark mode handler
  useEffect(() => { document.documentElement.classList.remove('dark'); }, []);

  // Auth Wrapper
  const handleRequireAuth = (action: () => void) => {
      if (user) { action(); } else { setPendingAction(() => action); setIsAuthOpen(true); }
  };

  const handleLoginSuccess = (u: any) => {
      setIsAuthOpen(false);
      if (u.role === 'admin' || u.email === 'admin' || user?.role === 'admin') {
          setCurrentView('ADMIN');
      } else if (pendingAction) {
          pendingAction();
          setPendingAction(null);
      }
  };

  const handleAddToCartAuth = (p: Product, s: string) => {
      handleRequireAuth(() => addToCart(p, s));
  };

  const handleToggleFavoriteAuth = (id: number) => {
      handleRequireAuth(() => toggleFavorite(id));
  };

  const handleProductClick = (p: Product) => {
      setSelectedProduct(p);
      setCurrentView('DETAILS');
      window.scrollTo(0, 0);
  };

  const handlePlaceOrder = (order: Order) => {
      setOrders([order, ...orders]);
      clearCart();
      showToast('¡Pedido realizado con éxito!');
  };

  if (currentView === 'ADMIN' && user?.role === 'admin') {
      return <AdminDashboard onLogout={() => { logout(); setCurrentView('HOME'); }} />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex justify-center font-sans">
      <div className="w-full max-w-7xl bg-white h-full min-h-screen relative shadow-xl overflow-x-hidden transition-all duration-300">
        
        {isAuthOpen && <AuthView onLogin={handleLoginSuccess} onClose={() => setIsAuthOpen(false)} settings={settings} />}
        
        <SideMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            user={user} 
            onLoginClick={() => setIsAuthOpen(true)} 
            onNavigate={(view) => { setCurrentView(view); setIsMenuOpen(false); }} 
            settings={settings} 
        />

        {/* Header Global visible en Home, Cart, Favorites, Profile, etc. Oculto solo en Detalles */}
        {currentView !== 'DETAILS' && (
            <Header 
                title={currentView === 'CART' ? 'Mi Bolsa' : undefined} 
                showSearch={currentView === 'HOME'} 
                onSearchClick={() => setIsSearchOpen(true)} 
                onMenuClick={() => setIsMenuOpen(true)} 
                settings={settings} 
            />
        )}

        {currentView === 'DETAILS' && (
            <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between pointer-events-none">
                <button 
                    aria-label="Volver"
                    onClick={() => setCurrentView('HOME')} 
                    className="pointer-events-auto w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <Icon name="ArrowLeft" size={24} className="text-gray-900" />
                </button>
            </div>
        )}
        
        <main className="min-h-screen bg-white">
            {currentView === 'HOME' && (
                <HomeView 
                    products={products} 
                    categories={categories} 
                    banners={banners} 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavoriteAuth} 
                    onProductClick={handleProductClick} 
                    onQuickAdd={handleAddToCartAuth} 
                    settings={settings} 
                />
            )}
            
            {currentView === 'DETAILS' && selectedProduct && (
                <ProductDetail 
                    product={selectedProduct} 
                    onAddToCart={handleAddToCartAuth} 
                    onBuyNow={() => {}} 
                    isFavorite={favorites.includes(selectedProduct.id)} 
                    onToggleFavorite={() => handleToggleFavoriteAuth(selectedProduct.id)} 
                    settings={settings} 
                />
            )}
            
            {currentView === 'CART' && (
                <CartView 
                    cart={cart} 
                    user={user} 
                    deliveryZones={deliveryZones} 
                    settings={settings} 
                    coupons={coupons} 
                    onRemove={removeFromCart} 
                    onUpdateQuantity={updateCartQuantity} 
                    onPlaceOrder={handlePlaceOrder} 
                />
            )}
            
            {currentView === 'FAVORITES' && (
                <FavoritesView 
                    products={products} 
                    favorites={favorites} 
                    onToggleFavorite={handleToggleFavoriteAuth} 
                    onProductClick={handleProductClick} 
                    onQuickAdd={handleAddToCartAuth} 
                    onGoHome={() => setCurrentView('HOME')} 
                    settings={settings} 
                />
            )}
            
            {currentView === 'PROFILE' && (
                <ProfileView 
                    user={user!} 
                    onLogout={() => { logout(); setCurrentView('HOME'); }} 
                    onUpdateUser={updateUser} 
                    orders={orders} 
                    coupons={coupons} 
                    settings={settings} 
                    onNavigate={setCurrentView} 
                />
            )}
            
            {(currentView === 'TERMS' || currentView === 'FAQ' || currentView === 'ABOUT') && (
                <StaticPage type={currentView} settings={settings} />
            )}
        </main>

        <SearchView 
            isOpen={isSearchOpen} 
            onClose={() => setIsSearchOpen(false)} 
            products={products} 
            categories={categories} 
            favorites={favorites} 
            onToggleFavorite={handleToggleFavoriteAuth} 
            onProductClick={handleProductClick} 
            onQuickAdd={handleAddToCartAuth} 
            settings={settings} 
        />

        {toastMessage && (
            <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl z-[70] animate-fade-in flex items-center gap-3 w-[90%] max-w-[400px]">
                <span className="text-sm font-medium">{toastMessage}</span>
            </div>
        )}

        {currentView !== 'DETAILS' && (
            <BottomNav 
                currentView={currentView} 
                onChangeView={setCurrentView} 
                cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
                isLoggedIn={!!user} 
                settings={settings} 
            />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => (
    <StoreProvider>
        <AppContent />
    </StoreProvider>
);

export default App;