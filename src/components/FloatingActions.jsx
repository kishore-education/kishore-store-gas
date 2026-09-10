import React, { useState } from 'react';
import { Phone, Share2, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const FloatingActions = () => {
  const { showToast } = useShop();
  const [copied, setCopied] = useState(false);

  const SHARE_URL = 'https://kishore-store-gas.vercel.app/';
  const PHONE_NUMBER = '9894073441';

  const handleShare = async () => {
    const shareData = {
      title: 'Kishore Store Gas',
      text: 'Order Commercial & Domestic Gas Cylinders with 10 Min Express Delivery!',
      url: SHARE_URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully!', 'success');
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      showToast('Store link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Floating Share Button */}
      <div className="group flex items-center gap-2">
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-semibold bg-neutral-900/90 text-white px-2.5 py-1 rounded-md shadow-md backdrop-blur border border-neutral-700 whitespace-nowrap pointer-events-none transform translate-x-1 group-hover:translate-x-0">
          Share Website
        </span>
        <button
          onClick={handleShare}
          aria-label="Share Website"
          className="relative flex items-center justify-center w-12 h-12 md:w-13 md:h-13 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {copied ? (
            <Check className="w-5 h-5 stroke-[2.5]" />
          ) : (
            <Share2 className="w-5 h-5 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* Floating Call Button */}
      <div className="group flex items-center gap-2">
        <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-semibold bg-neutral-900/90 text-white px-2.5 py-1 rounded-md shadow-md backdrop-blur border border-neutral-700 whitespace-nowrap pointer-events-none transform translate-x-1 group-hover:translate-x-0">
          Call {PHONE_NUMBER}
        </span>
        <a
          href={`tel:${PHONE_NUMBER}`}
          aria-label={`Call ${PHONE_NUMBER}`}
          className="relative flex items-center justify-center w-12 h-12 md:w-13 md:h-13 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {/* Subtle pulse effect on call button */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping" style={{ animationDuration: '3s' }} />
          <Phone className="w-5 h-5 relative z-10 fill-current" />
        </a>
      </div>

    </div>
  );
};
