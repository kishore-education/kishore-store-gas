import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowLeft, CheckCircle, Truck, MapPin, Phone, User, Hash, Zap, Printer, ShieldCheck, Clock, Compass, ExternalLink } from 'lucide-react';

export const OrderDetailsPage = () => {
  const { 
    lastOrder, 
    userProfile, 
    placeInstantReorder, 
    closeOrderDetailsPage,
    closeDetailPage
  } = useShop();

  if (!lastOrder?.product) return null;

  const product = lastOrder.product;
  const orderId = lastOrder.orderId || '';
  const orderDate = lastOrder.date || new Date().toISOString().split('T')[0];
  const totalPrice = product.price * (lastOrder.quantity || 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 animate-fadeIn">
      
      {/* Navigation Header */}
      <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              closeOrderDetailsPage();
              closeDetailPage();
            }}
            className="flex items-center space-x-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Cylinders</span>
          </button>

          <span className="text-xs font-bold text-slate-400">Order #{orderId}</span>
        </div>
      </div>

      {/* Main Order Details Body */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Status Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 border border-emerald-500/30 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              ⚡ Order Confirmed & Dispatched
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Order Receipt #{orderId}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Placed on {orderDate} • ⚡ Express Delivery in 10 Minutes
            </p>
          </div>

          {/* Live Delivery Timeline */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold">
                ✓ Order Confirmed
              </div>
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-bold animate-pulse">
                🚚 Express Dispatched
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 font-semibold">
                🏠 Doorstep Arrival
              </div>
            </div>
          </div>
        </div>

        {/* Cylinder & Price Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
            Ordered Cylinder Item
          </h3>

          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-slate-950 rounded-2xl border border-slate-800 p-2 flex items-center justify-center flex-shrink-0">
              <img
                src={product.image}
                alt={product.title || product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-black text-white truncate">
                {product.title || product.name}
              </h4>
              <div className="text-xs text-slate-400 mt-0.5">
                Size: {product.cylinderSize || 'Standard'} • Quantity: {lastOrder.quantity || 1}
              </div>
              <div className="text-xl font-black text-amber-400 mt-1">
                ₹{totalPrice.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Payment Status</span>
            <span className="text-emerald-400 font-bold flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1" /> Cash / Card on Delivery (₹{totalPrice.toLocaleString()})
            </span>
          </div>
        </div>

        {/* Saved Delivery & Consumer Address Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
            Delivery & LPG Consumer Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center">
                <User className="w-3.5 h-3.5 mr-1 text-amber-400" /> Customer Name
              </span>
              <div className="text-slate-100 font-bold">{userProfile.fullName || 'N/A'}</div>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-medium flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-amber-400" /> Contact Phone
              </span>
              <div className="text-slate-100 font-bold">{userProfile.phone || 'N/A'}</div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-500 font-medium flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-amber-400" /> Complete Delivery Address
              </span>
              <div className="text-slate-100 font-bold">{userProfile.address || 'N/A'}</div>
            </div>

            {/* Geolocation Section */}
            <div className="space-y-1 sm:col-span-2 pt-2 border-t border-slate-800/80">
              <span className="text-slate-500 font-medium flex items-center">
                <Compass className="w-3.5 h-3.5 mr-1 text-amber-400" /> Precise Geolocation Coordinates (Latitude / Longitude)
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-100 font-mono text-xs font-bold bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span>
                  {userProfile.latitude && userProfile.longitude
                    ? `Lat: ${userProfile.latitude} | Lng: ${userProfile.longitude}`
                    : (userProfile.gpsCoords ? `Coords: ${userProfile.gpsCoords}` : 'No GPS coordinates saved')}
                </span>
                {userProfile.mapsUrl && (
                  <a
                    href={userProfile.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-amber-400 hover:text-amber-300 text-[11px] font-sans font-extrabold"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => placeInstantReorder(product)}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-red-600/30 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-5 h-5 fill-slate-950 stroke-slate-950 animate-bounce" />
            <span>REORDER THIS CYLINDER AGAIN IN 1 CLICK</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-2xl border border-slate-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Digital Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
