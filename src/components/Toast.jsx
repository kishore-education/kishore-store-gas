import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Heart, CheckCircle, AlertCircle, Info, Sparkles } from 'lucide-react';

export const Toast = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'cart':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'wishlist':
        return <Heart className="w-5 h-5 text-red-400 fill-red-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle pointer-events-none">
      <div className="flex items-center space-x-3 bg-slate-900/95 border border-slate-700/80 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl max-w-sm">
        <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
          {getIcon()}
        </div>
        <div className="text-xs font-semibold pr-2 leading-tight">
          {toast.message}
        </div>
      </div>
    </div>
  );
};
