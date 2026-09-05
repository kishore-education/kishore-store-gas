import React from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, MapPin, Package } from 'lucide-react';

export const Navbar = () => {
  const { 
    setIsProfileModalOpen,
    openOrderDetailsPage,
    closeDetailPage,
    closeOrderDetailsPage,
    userProfile,
  } = useShop();

  return (
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-neutral-800/90 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo - Tapping returns to catalog */}
        <div 
          onClick={() => {
            closeDetailPage();
            closeOrderDetailsPage();
          }}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-white tracking-tight leading-none">
              Kishore <span className="gradient-text">Gas</span>
            </span>
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center mt-0.5">
              ⚡ 10 MIN DELIVERY
            </span>
          </div>
        </div>

        {/* Saved Address & Order Details Button */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-full border border-neutral-800 text-xs font-semibold max-w-[140px] sm:max-w-xs truncate"
            title="Edit Saved Address"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate text-[11px]">{userProfile.address || 'Set Address'}</span>
          </button>

          <button
            onClick={openOrderDetailsPage}
            className="flex items-center space-x-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold rounded-full border border-neutral-800 text-xs transition-colors"
            title="View Recent Order Details"
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Order Details</span>
          </button>

        </div>

      </div>
    </header>
  );
};
