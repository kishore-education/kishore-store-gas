import React from 'react';
import { useShop } from '../context/ShopContext';
import { Flame, Wrench, ArrowRight, Sparkles } from 'lucide-react';

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
          <span>Product Categories</span>
        </h2>
        <span className="text-[11px] text-slate-500 font-semibold">Tap category cover to view list</span>
      </div>

      {/* 2 Main Category Cover Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Cover Card 1: LPG Gas Cylinders */}
        <div
          onClick={() => handleSelectCategory('gas')}
          className={`group relative overflow-hidden rounded-3xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'gas' || selectedCategory === 'total' || selectedCategory === 'super' || selectedCategory === 'bharath'
              ? 'border-amber-500/90 shadow-xl shadow-amber-500/10 bg-slate-900'
              : 'border-slate-800/90 bg-slate-950 hover:border-slate-700'
          }`}
        >
          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider">
                <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                <span>Gas Refills</span>
              </span>
              <span className="text-[10px] font-extrabold text-amber-400 bg-black px-2 py-0.5 rounded-full border border-amber-500/30">
                {gasProducts.length} Items
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors truncate">
              LPG Gas Cylinders
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              Total Gas, Super Gas & Bharath Gas refills (5kg to 19kg).
            </p>

            <div className="pt-1 flex items-center space-x-1 text-xs font-black text-amber-400 group-hover:text-amber-300">
              <span>Show Cylinders</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* First Product Cover Image Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-2xl p-2 border border-slate-800 flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img
              src={gasCoverImage}
              alt="LPG Gas Cylinder Cover"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Cover Card 2: Gas Accessories */}
        <div
          onClick={() => handleSelectCategory('accessories')}
          className={`group relative overflow-hidden rounded-3xl border p-4 sm:p-5 transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 ${
            selectedCategory === 'accessories'
              ? 'border-sky-500/90 shadow-xl shadow-sky-500/10 bg-slate-900'
              : 'border-slate-800/90 bg-slate-950 hover:border-slate-700'
          }`}
        >
          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-black uppercase tracking-wider">
                <Wrench className="w-3 h-3 text-sky-400" />
                <span>Accessories</span>
              </span>
              <span className="text-[10px] font-extrabold text-sky-400 bg-black px-2 py-0.5 rounded-full border border-sky-500/30">
                {accProducts.length} Items
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white group-hover:text-sky-400 transition-colors truncate">
              Gas Accessories
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              High-pressure hose pipes, regulators & stove support rings.
            </p>

            <div className="pt-1 flex items-center space-x-1 text-xs font-black text-sky-400 group-hover:text-sky-300">
              <span>Show Accessories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* First Product Cover Image Container */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-2xl p-2 border border-slate-800 flex-shrink-0 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img
              src={accCoverImage}
              alt="Gas Accessories Cover"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CategoryCoverBanners;
