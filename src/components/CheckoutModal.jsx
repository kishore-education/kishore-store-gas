import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, CheckCircle, CreditCard, ShieldCheck, Truck, ArrowRight, Printer, Sparkles, MapPin } from 'lucide-react';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    totalCost,
    subtotal,
    shippingCost,
    taxCost,
    clearCart,
    userProfile,
    lastOrder,
    checkoutStepOverride,
    setCheckoutStepOverride
  } = useShop();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    email: '',
    phone: userProfile?.phone || '',
    street: userProfile?.address || '',
    city: '',
    zip: '',
    paymentMethod: 'cod'
  });

  const [orderNumber, setOrderNumber] = useState('');

  // Sync userProfile changes and handle instant step override
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        fullName: userProfile.fullName || prev.fullName,
        phone: userProfile.phone || prev.phone,
        street: userProfile.address || prev.street
      }));
    }
  }, [userProfile]);

  useEffect(() => {
    if (isCheckoutOpen) {
      if (checkoutStepOverride) {
        setStep(checkoutStepOverride);
        setOrderNumber(lastOrder?.orderId || ('KSG-' + Math.floor(100000 + Math.random() * 900000)));
      } else {
        setStep(1);
      }
    }
  }, [isCheckoutOpen, checkoutStepOverride, lastOrder]);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      const generatedId = 'KSG-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedId);
      setStep(3);
    }
  };

  const handleFinish = () => {
    clearCart();
    setCheckoutStepOverride(null);
    setIsCheckoutOpen(false);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              {step < 3 ? step : '✓'}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {step === 1 && 'Step 1: Shipping & Delivery Info'}
                {step === 2 && 'Step 2: Payment Method'}
                {step === 3 && 'Order Confirmed & Digital Receipt'}
              </h3>
              <p className="text-xs text-slate-400">
                {step < 3 ? 'Kishore LPG Cylinder Delivery' : `Order Ref: #${orderNumber}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCheckoutStepOverride(null);
              setIsCheckoutOpen(false);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {step < 3 && (
          <div className="bg-slate-950/60 px-6 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className={step >= 1 ? 'text-amber-400 font-bold' : ''}>1. Address</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-amber-400 font-bold' : ''}>2. Payment</span>
            <span>&rarr;</span>
            <span>3. Receipt</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-100">
          
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Delivery Address</label>
                <textarea
                  required
                  rows={2}
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Total Payment Amount</div>
                  <div className="text-xl font-extrabold text-amber-400">₹{totalCost.toFixed(2)}</div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-xl transition-all flex items-center space-x-2"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Payment Option
              </label>

              <div className="space-y-3">
                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    formData.paymentMethod === 'cod'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Truck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-sm font-bold">Cash on Delivery (COD)</div>
                      <div className="text-xs text-slate-400">Pay when cylinder is delivered to doorstep</div>
                    </div>
                  </div>
                  {formData.paymentMethod === 'cod' && <CheckCircle className="w-5 h-5 text-amber-400" />}
                </div>

                <div
                  onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    formData.paymentMethod === 'upi'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-6 h-6 text-sky-400" />
                    <div>
                      <div className="text-sm font-bold">Instant UPI / PhonePe / GPay</div>
                      <div className="text-xs text-slate-400">Pay instantly via mobile QR code</div>
                    </div>
                  </div>
                  {formData.paymentMethod === 'upi' && <CheckCircle className="w-5 h-5 text-amber-400" />}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping & Tax</span>
                  <span className="text-white font-bold">₹{(shippingCost + taxCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-amber-400">
                  <span>Total Due Now</span>
                  <span>₹{totalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  &larr; Back to Address
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-amber-500 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Order</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white">Order Confirmed!</h2>
                <p className="text-xs text-amber-400 font-bold mt-1">
                  ⚡ 1-Click Refill Order Saved to Browser
                </p>
              </div>

              {/* Order Status Timeline */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-left space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span>Order Ref: #{orderNumber}</span>
                  <span className="text-emerald-400">Status: Dispatched</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2 border-t border-slate-800">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                    1. Confirmed
                  </div>
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold animate-pulse">
                    2. Dispatched
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
                    3. Delivered
                  </div>
                </div>
              </div>

              {/* Saved Delivery Address Receipt Card */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-1.5">
                <div className="font-bold text-slate-300 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1" />
                  Delivering To Saved Address:
                </div>
                <div className="text-slate-300 font-semibold">{formData.fullName} ({formData.phone})</div>
                <div className="text-slate-400">{formData.street}</div>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-amber-400 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
