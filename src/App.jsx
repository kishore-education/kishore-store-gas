import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryCoverBanners } from './components/CategoryCoverBanners';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPage } from './components/ProductDetailPage';
import { OrderDetailsPage } from './components/OrderDetailsPage';
import { OrderModal } from './components/OrderModal';
import { UserProfileModal } from './components/UserProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingActions } from './components/FloatingActions';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';

function MainContent() {
  const { isOrderDetailsOpen, activeDetailPageProduct } = useShop();

  if (isOrderDetailsOpen) {
    return <OrderDetailsPage />;
  }

  if (activeDetailPageProduct) {
    return <ProductDetailPage />;
  }

  return (
    <>
      <Hero />
      <main className="flex-grow">
        <CategoryCoverBanners />
        <ProductGrid />
      </main>
    </>
  );
}

export function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black pb-16 md:pb-0">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic Main Viewport (Order Details vs Dedicated Product Page vs Catalog) */}
        <MainContent />

        {/* Footer */}
        <Footer />

        {/* Floating Call & Share Buttons */}
        <FloatingActions />

        {/* App-like Mobile Bottom Navigation */}
        <MobileBottomNav />

        {/* Modals & Overlays */}
        <OrderModal />
        <UserProfileModal />
        <Toast />

      </div>
    </ShopProvider>
  );
}

export default App;
