import React from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, Wrench, ArrowRight, Sparkles } from 'lucide-react';

export const CategoryCoverBanners = () => {
  const { products, selectedCategory, setSelectedCategory } = useShop();

  const gasCount = products.filter(p => p.category !== 'accessories').length;
  const accCount = products.filter(p => p.category === 'accessories').length;

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
          <span>Product Categories</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-semibold">Tap cover to filter products</span>
      </div>

      {/* 2 Main Category Cover Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Cover Card 1: LPG Gas Cylinders */}
        <div
          onClick={() => handleSelectCategory('gas')}
          className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${
            selectedCategory === 'gas' || selectedCategory === 'total' || selectedCategory === 'super' || selectedCategory === 'bharath'
              ? 'border-amber-500/90 shadow-xl shadow-amber-500/10 bg-gradient-to-r from-red-950/90 via-slate-950 to-black'
              : 'border-slate-800/90 bg-slate-950 hover:border-slate-700'
          }`}
        >
          {/* Subtle Cover Image & Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-950/70 via-slate-950/90 to-black/90 z-10" />
          <img
            src="https://i.ibb.co/d6vR1tc/image.png"
            alt="LPG Gas Cylinders"
            className="absolute -right-2 -bottom-2 w-32 h-32 object-contain opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500 pointer-events-none"
          />

          {/* Card Body */}
          <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-between h-full min-h-[145px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                  <span>Gas Refills & Cylinders</span>
                </span>
                <span className="text-[10px] font-extrabold text-amber-400 bg-black/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {gasCount} Items
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                LPG Gas Cylinders
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Total Gas, Super Gas & Bharath Gas refills in 5kg, 12kg, 17kg & 19kg.
              </p>
            </div>

            <div className="mt-3 flex items-center space-x-1 text-xs font-black text-amber-400 group-hover:text-amber-300">
              <span>Show Gas Cylinders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Cover Card 2: Gas Accessories */}
        <div
          onClick={() => handleSelectCategory('accessories')}
          className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${
            selectedCategory === 'accessories'
              ? 'border-sky-500/90 shadow-xl shadow-sky-500/10 bg-gradient-to-r from-sky-950/90 via-slate-950 to-black'
              : 'border-slate-800/90 bg-slate-950 hover:border-slate-700'
          }`}
        >
          {/* Subtle Cover Image & Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/70 via-slate-950/90 to-black/90 z-10" />
          <img
            src="https://i.ibb.co/TxD087d4/gas-Pipe.png"
            alt="Gas Accessories"
            className="absolute -right-2 -bottom-2 w-32 h-32 object-contain opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500 pointer-events-none"
          />

          {/* Card Body */}
          <div className="relative z-20 p-4 sm:p-5 flex flex-col justify-between h-full min-h-[145px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-black uppercase tracking-wider">
                  <Wrench className="w-3 h-3 text-sky-400" />
                  <span>Fittings & Accessories</span>
                </span>
                <span className="text-[10px] font-extrabold text-sky-400 bg-black/70 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {accCount} Items
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-sky-400 transition-colors">
                Gas Accessories
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                High-pressure steel hose pipes, safety regulators & heat-resistant stove rings.
              </p>
            </div>

            <div className="mt-3 flex items-center space-x-1 text-xs font-black text-sky-400 group-hover:text-sky-300">
              <span>Show Accessories List</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCoverBanners;
