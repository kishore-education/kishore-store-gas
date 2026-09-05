import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const ProductDetailPage = () => {
  const { 
    activeDetailPageProduct, 
    closeDetailPage, 
    openOrderModal,
    userProfile,
    lastOrder
  } = useShop();

  const [quantity, setQuantity] = useState(1);

  if (!activeDetailPageProduct) return null;

  const product = activeDetailPageProduct;
  const isLastOrdered = lastOrder?.product?.id === product.id;

  return (
    <div className="min-h-screen bg-black text-neutral-100 pb-20 animate-fadeIn">
      
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-neutral-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={closeDetailPage}
            className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-neutral-900 px-3.5 py-2 rounded-xl border border-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Cylinders</span>
          </button>

          <span className="text-xs text-neutral-400 font-bold">Details</span>
        </div>
      </div>

      {/* Main Dedicated Product Container */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Large Image Viewport */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-8 flex items-center justify-center relative aspect-square shadow-2xl">
            <img
              src={product.image}
              alt={product.title || product.name}
              className="w-full h-full object-contain max-h-[360px]"
            />
            {isLastOrdered && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black rounded-full uppercase tracking-wider flex items-center space-x-1">
                <span>Lastly Ordered Cylinder</span>
              </span>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            
            <div>
              <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center">
                {isLastOrdered && <RotateCcw className="w-3.5 h-3.5 mr-1" />}
                {isLastOrdered ? 'Your Default LPG Cylinder' : 'Kishore Certified LPG Refill'}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {product.title || product.name}
              </h1>
              
              <div className="flex items-baseline space-x-3 mt-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-400">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  In Stock & Ready to Dispatch
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
              {product.description}
            </p>

            {/* Safety Bullet Points */}
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>100% Weight Checked & Leak Safety Inspected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Guaranteed ⚡ <strong>10 Minute Express Delivery</strong> to <strong>{userProfile.address}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Official Safety Lock Seal Intact</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 pt-2">
              <span className="text-xs font-bold text-neutral-400">Quantity:</span>
              <div className="flex items-center space-x-3 bg-black border border-neutral-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 font-bold hover:bg-neutral-800 flex items-center justify-center text-base"
                >
                  -
                </button>
                <span className="font-bold text-amber-400 px-3">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-neutral-900 text-neutral-300 font-bold hover:bg-neutral-800 flex items-center justify-center text-base"
                >
                  +
                </button>
              </div>
            </div>

            {/* Order Action Button */}
            <div className="pt-4 border-t border-neutral-800">
              <button
                onClick={() => openOrderModal(product)}
                className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-black font-black text-base rounded-2xl shadow-xl shadow-red-600/30 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5 fill-black stroke-black" />
                <span>Order Cylinder (₹{(product.price * quantity).toLocaleString()})</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
