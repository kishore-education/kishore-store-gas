import React from 'react';
import { useShop } from '../context/ShopContext';
import { Home, User, Package, ShoppingBag } from 'lucide-react';

export const MobileBottomNav = () => {
  const { 
    setIsProfileModalOpen, 
    openOrderModal,
    openOrderDetailsPage,
    closeDetailPage,
    closeOrderDetailsPage,
    lastOrder,
  } = useShop();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-xl border-t border-neutral-800/90 px-4 py-2 flex items-center justify-around shadow-2xl">
      
      {/* Home / Catalog */}
      <button
        onClick={() => {
          closeDetailPage();
          closeOrderDetailsPage();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center text-slate-400 hover:text-amber-400 py-1"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Cylinders</span>
      </button>

      {/* Profile & Saved Address */}
      <button
        onClick={() => setIsProfileModalOpen(true)}
        className="flex flex-col items-center text-slate-400 hover:text-amber-400 py-1"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Address</span>
      </button>

      {/* Center ORDER Button */}
      <button
        onClick={() => openOrderModal(lastOrder?.product)}
        className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-500 text-slate-950 font-extrabold text-xs rounded-full shadow-lg shadow-red-600/30 -translate-y-3"
      >
        <ShoppingBag className="w-4 h-4 fill-slate-950 stroke-slate-950" />
        <span>Order</span>
      </button>

      {/* Order Details View */}
      <button
        onClick={openOrderDetailsPage}
        className="flex flex-col items-center text-slate-400 hover:text-amber-400 py-1"
      >
        <Package className="w-5 h-5 text-amber-400" />
        <span className="text-[10px] font-bold mt-1 text-amber-400">Order Details</span>
      </button>

    </div>
  );
};
