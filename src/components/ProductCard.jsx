import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { openOrderModal, openDetailPage } = useShop();

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 flex flex-col justify-between space-y-3 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all group">
      
      {/* Product Image - Tapping opens detail page */}
      <div 
        onClick={() => openDetailPage(product)}
        className="relative aspect-square w-full bg-black rounded-xl p-2 flex items-center justify-center cursor-pointer overflow-hidden border border-neutral-900"
      >
        <span className="absolute top-2 left-2 z-10 text-[9px] font-black text-emerald-400 bg-black/90 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30 shadow-sm flex items-center space-x-0.5">
          <span>⚡ 10 MIN</span>
        </span>
        <img
          src={product.image}
          alt={product.title || product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Details - Tapping opens detail page */}
      <div 
        onClick={() => openDetailPage(product)}
        className="space-y-1 cursor-pointer"
      >
        <h3 className="font-extrabold text-white text-sm truncate group-hover:text-amber-400 transition-colors">
          {product.title || product.name}
        </h3>
        <div className="text-base font-black text-amber-400">
          ₹{product.price.toLocaleString()}
        </div>
      </div>

      {/* Order Button - Opens Order Modal with user details & payment selection */}
      <button
        onClick={() => openOrderModal(product)}
        className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1"
      >
        <ShoppingBag className="w-4 h-4 text-slate-950 fill-slate-950" />
        <span>Order</span>
      </button>

    </div>
  );
};
