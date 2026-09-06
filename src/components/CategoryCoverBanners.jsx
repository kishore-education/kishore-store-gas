import React from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, Wrench, Sparkles } from 'lucide-react';

export const CategoryCoverBanners = () => {
  const { products, selectedCategory, setSelectedCategory } = useShop();

  const gasProducts = products.filter(p => p.category !== 'accessories');
  const accProducts = products.filter(p => p.category === 'accessories');

  const firstGasProduct = gasProducts[0];
  const firstAccProduct = accProducts[0];

  const gasCoverImage = firstGasProduct?.image || 'https://i.ibb.co/d6vR1tc/image.png';
  const accCoverImage = firstAccProduct?.image || 'https://i.ibb.co/TxD087d4/gas-Pipe.png';

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const catalogEl = document.getElementById('product-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4 pt-4 pb-2 space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Categories</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-semibold">Tap cover image to view products</span>
      </div>

      {/* 2 Pure Image Category Cover Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Category Cover Image Card 1: LPG Gas Cylinders */}
        <div
          onClick={() => handleSelectCategory('gas')}
          className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer aspect-[4/3] bg-slate-950 p-4 flex flex-col justify-between items-center ${
            selectedCategory === 'gas' || selectedCategory === 'total' || selectedCategory === 'super' || selectedCategory === 'bharath'
              ? 'border-amber-500 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/20'
              : 'border-slate-800 hover:border-amber-500/60'
          }`}
        >
          {/* Main Cover Image Only */}
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              src={gasCoverImage}
              alt="Gas Cylinders Category"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Minimal Floating Label Pill */}
          <div className="absolute bottom-2.5 inset-x-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 py-1.5 px-3 rounded-2xl flex items-center justify-between group-hover:border-amber-500/50 transition-colors">
            <span className="text-xs font-black text-white truncate flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span>Gas Cylinders</span>
            </span>
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
              {gasProducts.length}
            </span>
          </div>
        </div>

        {/* Category Cover Image Card 2: Accessories */}
        <div
          onClick={() => handleSelectCategory('accessories')}
          className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer aspect-[4/3] bg-slate-950 p-4 flex flex-col justify-between items-center ${
            selectedCategory === 'accessories'
              ? 'border-sky-500 shadow-xl shadow-sky-500/10 ring-2 ring-sky-500/20'
              : 'border-slate-800 hover:border-sky-500/60'
          }`}
        >
          {/* Main Cover Image Only */}
          <div className="w-full h-full flex items-center justify-center p-2">
            <img
              src={accCoverImage}
              alt="Accessories Category"
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Minimal Floating Label Pill */}
          <div className="absolute bottom-2.5 inset-x-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/90 py-1.5 px-3 rounded-2xl flex items-center justify-between group-hover:border-sky-500/50 transition-colors">
            <span className="text-xs font-black text-white truncate flex items-center space-x-1">
              <Wrench className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span>Accessories</span>
            </span>
            <span className="text-[10px] font-black text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md">
              {accProducts.length}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCoverBanners;
