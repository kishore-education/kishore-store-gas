import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag } from 'lucide-react';

export const Hero = () => {
  const { 
    lastOrder, 
    openOrderModal,
  } = useShop();

  const lastProduct = lastOrder?.product;

  if (!lastProduct) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black rounded-2xl p-4 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Product Info */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <img
            src={lastProduct.image}
            alt={lastProduct.title || lastProduct.name}
            className="w-14 h-14 object-contain rounded-xl bg-black p-1 border border-neutral-800 flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Previously Ordered</span>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">⚡ 10 Min Delivery</span>
            </div>
            <h3 className="text-sm font-extrabold text-white truncate">
              {lastProduct.title || lastProduct.name}
            </h3>
            <span className="text-base font-black text-amber-400">
              ₹{lastProduct.price?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Order Button */}
        <button
          onClick={() => openOrderModal(lastProduct)}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 flex-shrink-0"
        >
          <ShoppingBag className="w-4 h-4 fill-slate-950 stroke-slate-950" />
          <span>Order Now</span>
        </button>

      </div>
    </div>
  );
};
