import React from 'react';
import { ShopProvider } from './context/ShopContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-sky-500 selection:text-white font-sans antialiased">
        <Header />
        <main className="flex-1">
          <Hero />
          <ProductGrid />
        </main>
        <Footer />

        {/* Global Drawers & Modals */}
        <ProductDetailModal />
        <CartDrawer />
        <WishlistDrawer />
        <CheckoutModal />
        <OrderConfirmationModal />
        <OrderTrackingModal />
        <SizeGuideModal />
        <ToastContainer />
      </div>
    </ShopProvider>
  );
};

export default App;
