import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/menu/ProductDetailModal';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

// Data
import { DataService } from './services/dataService';
import { Product, Category } from './types';

export const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [prods, cats] = await Promise.all([
        DataService.getProducts(),
        DataService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setIsLoading(false);
    }
    load();
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    navigateTo('tracking');
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 paper-texture selection:bg-dustyPink-300 selection:text-espresso-800">
      {/* Navbar Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          if (!isAdmin) navigateTo('admin');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-3 border-pastelPeach-300 border-t-espresso-600 animate-spin" />
            <p className="font-serif italic text-espresso-700 text-lg">
              Steeping beans and warming ceramics...
            </p>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                onNavigate={navigateTo}
                onOpenProductModal={setSelectedProductForModal}
              />
            )}

            {currentPage === 'menu' && (
              <MenuPage
                products={products}
                categories={categories}
                onOpenProductModal={setSelectedProductForModal}
              />
            )}

            {currentPage === 'checkout' && (
              <CheckoutPage
                onNavigateToTracking={handleNavigateToTracking}
                onNavigateToMenu={() => navigateTo('menu')}
              />
            )}

            {currentPage === 'tracking' && (
              <OrderTrackingPage
                initialOrderId={trackingOrderId}
                onNavigateToMenu={() => navigateTo('menu')}
              />
            )}

            {currentPage === 'reservations' && <ReservationsPage />}

            {currentPage === 'loyalty' && <LoyaltyPage />}

            {currentPage === 'about' && (
              <AboutPage
                onNavigateToMenu={() => navigateTo('menu')}
                onNavigateToReservations={() => navigateTo('reservations')}
              />
            )}

            {currentPage === 'contact' && <ContactPage />}

            {currentPage === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Product Customizer Detail Modal */}
      <ProductDetailModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
      />

      {/* Slide-over Cart Basket Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => navigateTo('checkout')}
        onNavigateToMenu={() => navigateTo('menu')}
      />

      {/* Universal Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
