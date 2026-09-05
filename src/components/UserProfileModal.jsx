import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, Phone, MapPin, Hash, Save, CheckCircle, Navigation, Loader2 } from 'lucide-react';
import { getAbsolutePinpointLocation } from '../services/locationService';

export const UserProfileModal = () => {
  const { isProfileModalOpen, setIsProfileModalOpen, userProfile, saveUserProfile, showToast } = useShop();

  const [form, setForm] = useState(userProfile);
  const [isLocating, setIsLocating] = useState(false);

  if (!isProfileModalOpen) return null;

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
        gpsCoords: loc.gpsCoords
      }));

      showToast(`Pinpoint Location Detected (±${loc.accuracy}m radius)!`, 'success');
    } catch (err) {
      console.error('GPS Error:', err);
      showToast(err.message || 'Unable to detect location. Please allow location permissions.', 'error');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile(form);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100">
        
        {/* Header */}
        <div className="bg-black px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Your Delivery Details</h3>
              <p className="text-xs text-neutral-400">Saved in browser for 1-Tap Reorders</p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-amber-500" /> Full Name
            </label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center">
              <Phone className="w-3.5 h-3.5 mr-1 text-amber-500" /> Contact Phone
            </label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="Your phone number"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-400 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500" /> Delivery Address
              </label>

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
                <span>{isLocating ? 'Locating...' : '📍 Detect My GPS Location'}</span>
              </button>
            </div>

            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
              placeholder="Door number, street name, landmark, area"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center">
              <Hash className="w-3.5 h-3.5 mr-1 text-amber-500" /> LPG Connection / Consumer ID
            </label>
            <input
              type="text"
              required
              value={form.consumerId}
              onChange={(e) => setForm({ ...form, consumerId: e.target.value })}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              placeholder="e.g. KSG-984210"
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-xs text-amber-200 flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              These details are saved safely in your mobile browser. You won't have to re-enter your address every time you order!
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Details to Browser</span>
          </button>
        </form>

      </div>
    </div>
  );
};
