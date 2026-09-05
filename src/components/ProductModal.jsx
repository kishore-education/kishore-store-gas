import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, Check, Flame } from 'lucide-react';

export const ProductModal = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isWishlisted,
    setIsCartOpen 
  } = useShop();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const wishlisted = isWishlisted(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-950/70 hover:bg-slate-950 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Showcase */}
        <div className="md:w-1/2 relative bg-slate-950 p-6 flex items-center justify-center">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.title}
            className="max-h-[380px] w-auto object-contain rounded-2xl shadow-xl"
          />
          {quickViewProduct.badge && (
            <span className="absolute top-6 left-6 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-wider">
              {quickViewProduct.badge}
            </span>
          )}
        </div>

        {/* Right Product Info */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-5 text-slate-100 flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-extrabold text-amber-500">
                {quickViewProduct.category}
              </span>
              <div className="flex items-center space-x-1 bg-slate-800 px-2.5 py-1 rounded-full">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{quickViewProduct.rating}</span>
                <span className="text-slate-400">({quickViewProduct.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {quickViewProduct.title}
            </h2>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-extrabold text-amber-400">
                ₹{quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.originalPrice && quickViewProduct.originalPrice !== quickViewProduct.price && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{quickViewProduct.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {quickViewProduct.description}
            </p>

            {/* Features Bullet List */}
            {quickViewProduct.features && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Key Specifications:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {quickViewProduct.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            
            {/* Quantity Selector & Wishlist */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center"
                >
                  -
                </button>
                <span className="font-bold text-amber-400 px-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                  wishlisted
                    ? 'bg-red-600/20 border-red-600 text-red-400'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Main Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs sm:text-sm rounded-xl border border-amber-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
              >
                <span>Buy Now</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
