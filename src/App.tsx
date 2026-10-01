import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CinematicIntroScene } from './components/3d/CinematicIntroScene';
import { HeroSection } from './components/home/HeroSection';
import { FeaturedPieces } from './components/home/FeaturedPieces';
import { CollectionsBento } from './components/home/CollectionsBento';
import { CraftsmanshipStory } from './components/home/CraftsmanshipStory';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { ProductDetails } from './components/pdp/ProductDetails';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmation } from './components/checkout/OrderConfirmation';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { UserAccountView } from './components/account/UserAccountView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { SearchOverlay } from './components/search/SearchOverlay';

const MainLayout: React.FC = () => {
  const { activeView, showCinematicIntro } = useShop();

  if (showCinematicIntro) {
    return <CinematicIntroScene />;
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-[#e2e4ea] flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      {/* Sticky Navigation */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <FeaturedPieces />
            <CollectionsBento />
            <CraftsmanshipStory />
          </>
        )}

        {activeView === 'catalog' && <ProductCatalog />}
        {activeView === 'pdp' && <ProductDetails />}
        {activeView === 'checkout' && <CheckoutPage />}
        {activeView === 'confirmation' && <OrderConfirmation />}
        {activeView === 'tracking' && <OrderTrackingView />}
        {(activeView === 'account' || activeView === 'wishlist') && <UserAccountView />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <AuthModal />
      <SearchOverlay />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainLayout />
    </ShopProvider>
  );
}
