import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, X, Check, Truck, ShieldAlert, Clock, MapPin, Phone, Hash, Navigation, Loader2, Compass } from 'lucide-react';
import { getAbsolutePinpointLocation } from '../services/locationService';
import { ModernInput, ModernTextArea } from './ModernInput';

export const GasBookingSection = () => {
  const { isGasModalOpen, setIsGasModalOpen, addToCart, products, setIsCartOpen, userProfile, showToast } = useShop();

  const gasProducts = products.filter(p => p.category === 'gas');
  const [selectedProduct, setSelectedProduct] = useState(gasProducts[0] || null);
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [latitude, setLatitude] = useState(userProfile?.latitude || '');
  const [longitude, setLongitude] = useState(userProfile?.longitude || '');
  const [deliverySlot, setDeliverySlot] = useState('express');
  const [quantity, setQuantity] = useState(1);
  const [isLocating, setIsLocating] = useState(false);

  const handleDetectGPS = async () => {
    setIsLocating(true);
    showToast('Pinpointing GPS location...', 'info');

    try {
      const loc = await getAbsolutePinpointLocation({
        onProgress: (acc) => showToast(`Tracking GPS... Accuracy: ±${acc}m`, 'info'),
        targetAccuracyMeters: 15,
        maxWaitMs: 8000
      });

      setAddress(loc.address);
      setLatitude(loc.lat);
      setLongitude(loc.lng);
      showToast(`Location detected (±${loc.accuracy}m radius)!`, 'success');
    } catch (err) {
      showToast(err.message || 'Unable to detect location', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  if (!isGasModalOpen) return null;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    let currentLat = latitude;
    let currentLng = longitude;
    let currentAddr = address;

    // Compulsory GPS Geolocation Enforcement
    if (!currentLat || !currentLng) {
      showToast('GPS Geolocation is compulsory! Auto-detecting location...', 'info');
      try {
        setIsLocating(true);
        const loc = await getAbsolutePinpointLocation({
          onProgress: (acc) => showToast(`Tracking GPS... Accuracy: ±${acc}m`, 'info'),
          targetAccuracyMeters: 15,
          maxWaitMs: 8000
        });

        currentLat = loc.lat;
        currentLng = loc.lng;
        if (!currentAddr) currentAddr = loc.address;

        setLatitude(currentLat);
        setLongitude(currentLng);
        setAddress(currentAddr);
        showToast('GPS Geolocation captured successfully!', 'success');
      } catch (err) {
        showToast('GPS Geolocation is compulsory for delivery! Please enable location permissions.', 'error');
        setIsLocating(false);
        return; // Block booking submit
      } finally {
        setIsLocating(false);
      }
    }

    addToCart(selectedProduct, quantity, {
      phone,
      address: currentAddr,
      latitude: currentLat,
      longitude: currentLng,
      deliverySlot: deliverySlot === 'express' ? 'Express 2-4 Hours' : 'Standard Delivery'
    });

    setIsGasModalOpen(false);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-950/30 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Flame className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">Kishore LPG Gas Refill Express</h2>
              <p className="text-xs text-amber-100 font-medium">Certified Safe Cylinder Refill & Delivery Booking</p>
            </div>
          </div>
          <button
            onClick={() => setIsGasModalOpen(false)}
            className="p-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleBookingSubmit} className="p-6 overflow-y-auto space-y-6 text-slate-100">
          
          {/* Step 1: Select Gas Product */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Select Cylinder Type or Accessory
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gasProducts.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className={`cursor-pointer p-3.5 rounded-2xl border transition-all ${
                    selectedProduct?.id === prod.id
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                      {prod.badge || 'Gas'}
                    </span>
                    {selectedProduct?.id === prod.id && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold line-clamp-1">{prod.title}</h4>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-amber-400">₹{prod.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">{prod.cylinderSize || 'Standard'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Consumer & Delivery Details */}
          <div className="space-y-4 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              2. Delivery & LPG Consumer Info
            </label>

            <div className="space-y-4">
              <ModernInput
                label="Contact Phone"
                icon={Phone}
                required
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onClear={() => setPhone('')}
                placeholder="Contact number"
              />
            </div>

            <ModernTextArea
              label="Home / Business Address"
              icon={MapPin}
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete street address and apartment number"
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
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              <ModernInput
                label="Latitude"
                icon={Compass}
                inputMode="decimal"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                onClear={() => setLatitude('')}
                placeholder="e.g. 13.0827"
              />
              <ModernInput
                label="Longitude"
                icon={Compass}
                inputMode="decimal"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                onClear={() => setLongitude('')}
                placeholder="e.g. 80.2707"
              />
            </div>
          </div>

          {/* Step 3: Delivery Speed & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                3. Preferred Delivery Slot
              </label>
              <select
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="express">⚡ Express 2-4 Hours ($0.00)</option>
                <option value="evening">🌆 Evening Slot (5 PM - 8 PM)</option>
                <option value="tomorrow">📅 Tomorrow Morning (9 AM - 12 PM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quantity (Cylinders)
              </label>
              <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-xl p-1 w-full justify-between">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center text-lg"
                >
                  -
                </button>
                <span className="font-bold text-amber-400">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-slate-900 text-slate-300 font-bold hover:bg-slate-800 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Safety Guarantee Callout */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex items-start space-x-3 text-xs text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400">Guaranteed Weight & Safety Inspection:</span> Every Kishore LPG cylinder comes with an intact tamper-proof seal and is weighed by our certified delivery person in front of you upon arrival.
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Total Refill Price</div>
              <div className="text-2xl font-extrabold text-amber-400">
                ₹{((selectedProduct?.price || 0) * quantity).toLocaleString()}
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold rounded-2xl shadow-xl shadow-red-600/25 transition-all flex items-center space-x-2"
            >
              <Truck className="w-4 h-4" />
              <span>Confirm & Add to Cart</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
