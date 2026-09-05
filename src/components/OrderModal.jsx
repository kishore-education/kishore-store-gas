import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Phone, MapPin, Hash, CreditCard, Truck, Sparkles, CheckCircle, Flame, Navigation, Loader2, Compass } from 'lucide-react';
import { getAbsolutePinpointLocation } from '../services/locationService';
import { ModernInput, ModernTextArea } from './ModernInput';

export const OrderModal = () => {
  const { 
    orderModalProduct, 
    closeOrderModal, 
    userProfile, 
    saveUserProfile,
    placeInstantReorder,
    showToast
  } = useShop();

  const [form, setForm] = useState(userProfile);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [quantity, setQuantity] = useState(1);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setForm(userProfile);
    }
  }, [userProfile, orderModalProduct]);

  if (!orderModalProduct) return null;

  const product = orderModalProduct;
  const totalPrice = product.price * quantity;

  // Pinpoint GPS Location Detector
  const handleDetectGPS = async () => {
    setIsLocating(true);
    showToast('Pinpointing high-accuracy GPS location...', 'info');

    try {
      const loc = await getAbsolutePinpointLocation({
        onProgress: (acc) => {
          showToast(`Tracking GPS... Current accuracy: ±${acc}m`, 'info');
        },
        targetAccuracyMeters: 15,
        maxWaitMs: 8000
      });

      setForm(prev => ({
        ...prev,
        address: loc.address,
        mapsUrl: loc.mapsUrl,
        gpsCoords: loc.gpsCoords,
        latitude: loc.lat,
        longitude: loc.lng
      }));

      showToast(`Pinpoint Location Detected (±${loc.accuracy}m radius)!`, 'success');
    } catch (err) {
      console.error('GPS Error:', err);
      showToast(err.message || 'Unable to detect location. Please check browser permissions.', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let currentForm = { ...form };

    // Compulsory GPS Geolocation Enforcement
    if (!currentForm.latitude || !currentForm.longitude) {
      showToast('GPS Geolocation is compulsory for delivery! Auto-detecting location...', 'info');
      try {
        setIsLocating(true);
        const loc = await getAbsolutePinpointLocation({
          onProgress: (acc) => showToast(`Tracking GPS... Accuracy: ±${acc}m`, 'info'),
          targetAccuracyMeters: 15,
          maxWaitMs: 8000
        });

        currentForm = {
          ...currentForm,
          address: currentForm.address || loc.address,
          mapsUrl: loc.mapsUrl,
          gpsCoords: loc.gpsCoords,
          latitude: loc.lat,
          longitude: loc.lng
        };
        setForm(currentForm);
        showToast('GPS Geolocation captured successfully!', 'success');
      } catch (err) {
        showToast('GPS Geolocation is compulsory for delivery! Please enable location access.', 'error');
        setIsLocating(false);
        return; // Block order placement
      } finally {
        setIsLocating(false);
      }
    }

    saveUserProfile(currentForm);
    placeInstantReorder(product, quantity, paymentMethod, currentForm);
    closeOrderModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-neutral-100">
        
        {/* Header */}
        <div className="bg-black px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Order Gas Cylinder</h3>
              <p className="text-xs text-neutral-400">Verify delivery address & choose payment</p>
            </div>
          </div>

          <button
            onClick={closeOrderModal}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Product Summary Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={product.image}
                alt={product.title || product.name}
                className="w-14 h-14 object-contain rounded-xl bg-slate-900 p-1 border border-slate-800"
              />
              <div>
                <h4 className="text-sm font-extrabold text-white">{product.title || product.name}</h4>
                <div className="text-xs text-amber-400 font-bold">₹{product.price.toLocaleString()} per unit</div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-slate-950 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center text-sm"
              >
                -
              </button>
              <span className="font-bold text-amber-400 text-xs px-1">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-slate-950 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Section 1: Customer Details */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              1. Delivery & Customer Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ModernInput
                label="Full Name"
                icon={User}
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                onClear={() => setForm({ ...form, fullName: '' })}
                placeholder="Full name"
                autoComplete="name"
                enterKeyHint="next"
              />

              <ModernInput
                label="Contact Phone"
                icon={Phone}
                required
                type="tel"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                onClear={() => setForm({ ...form, phone: '' })}
                placeholder="Mobile phone"
                autoComplete="tel"
                enterKeyHint="next"
              />
            </div>

            <ModernTextArea
              label="Delivery Address"
              icon={MapPin}
              required
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Door number, street name, landmark"
              rightElement={
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={isLocating}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>{isLocating ? 'Locating...' : '📍 Detect GPS'}</span>
                </button>
              }
            />

            {/* Geolocation: Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80">
              <ModernInput
                label="Latitude"
                icon={Compass}
                inputMode="decimal"
                value={form.latitude}
                onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                onClear={() => setForm({ ...form, latitude: '' })}
                placeholder="e.g. 13.0827"
              />
              <ModernInput
                label="Longitude"
                icon={Compass}
                inputMode="decimal"
                value={form.longitude}
                onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                onClear={() => setForm({ ...form, longitude: '' })}
                placeholder="e.g. 80.2707"
              />
            </div>
          </div>

          {/* Section 2: Payment Method Options */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              2. Select Payment Option
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'cod'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Truck className="w-5 h-5 text-emerald-400" />
                  {paymentMethod === 'cod' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-400">Pay when delivered</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'upi'
                    ? 'bg-sky-500/10 border-sky-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  {paymentMethod === 'upi' && <CheckCircle className="w-4 h-4 text-sky-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">UPI / QR Pay</div>
                  <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  paymentMethod === 'card'
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  {paymentMethod === 'card' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100">Card Payment</div>
                  <div className="text-[10px] text-slate-400">Credit or Debit Card</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Total Due Amount</div>
              <div className="text-xl font-black text-amber-400">₹{totalPrice.toLocaleString()}</div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition-all"
            >
              Confirm Order (₹{totalPrice.toLocaleString()})
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
