import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Tag, ArrowRight, Truck, ShoppingBag, Flame, Sparkles, Check } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingCost,
    taxCost,
    totalCost,
    freeShippingThreshold,
    isFreeShippingEligible,
    appliedPromo,
    applyPromo,
    removePromo,
    setIsCheckoutOpen
  } = useShop();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0 cursor-pointer" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-extrabold text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                {cart.length} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

              {/* Free Shipping Progress Indicator */}
          <div className="bg-slate-950/90 px-5 py-3 border-b border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center">
                <Truck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                {isFreeShippingEligible ? (
                  <strong className="text-emerald-400 font-bold">You unlocked FREE Express Shipping!</strong>
                ) : (
                  <span>Add <strong className="text-amber-400">₹{amountNeededForFreeShipping.toLocaleString()}</strong> for FREE Shipping</span>
                )}
              </span>
              <span className="font-bold text-slate-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex gap-3.5 items-center relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain p-1 rounded-xl border border-slate-800 bg-slate-900"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">{item.title}</h4>

                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className="text-sm font-extrabold text-amber-400">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        (₹{item.price.toLocaleString()} each)
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.options)}
                          className="w-6 h-6 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-200 px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.options)}
                          className="w-6 h-6 text-slate-400 hover:text-white flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.options)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold">Your cart is currently empty</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Start Shopping Now
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
              
              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{appliedPromo.code} Applied ({appliedPromo.label})</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-slate-400 hover:text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo Code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white uppercase placeholder-normal focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="font-bold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-white">
                    {shippingCost === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingCost.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="font-bold text-white">₹{taxCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                  <span>Total Amount</span>
                  <span className="text-amber-400 text-lg">₹{totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
