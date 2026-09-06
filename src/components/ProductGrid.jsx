import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';
import { Flame, Wrench, Sparkles, Filter } from 'lucide-react';

export const ProductGrid = () => {
  const { products, selectedCategory, setSelectedCategory } = useShop();

  // Filter products based on selectedCategory
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'gas') return product.category !== 'accessories';
    if (selectedCategory === 'accessories') return product.category === 'accessories';
    return product.category === selectedCategory;
  });

  const getCategoryTitle = () => {
    if (selectedCategory === 'gas') return 'LPG Gas Cylinders';
    if (selectedCategory === 'accessories') return 'Gas Accessories & Spare Parts';
    if (selectedCategory === 'total') return 'Total Gas Cylinders';
    if (selectedCategory === 'super') return 'Super Gas Cylinders';
    if (selectedCategory === 'bharath') return 'Bharath Gas Cylinders';
    return 'All Catalog Items';
  };

  return (
    <section id="product-catalog" className="max-w-4xl mx-auto px-4 py-4 space-y-4">
      
      {/* Category Filter Navigation Bar / Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.id === 'accessories' ? (
                <Wrench className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-sky-400'}`} />
              ) : (
                <Flame className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              )}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Catalog Section Title & Counter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
            {getCategoryTitle()}
          </h2>
          {selectedCategory === 'accessories' && (
            <span className="text-[10px] uppercase font-black tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/30">
              🛠️ Accessories
            </span>
          )}
          {(selectedCategory === 'gas' || selectedCategory === 'total' || selectedCategory === 'super' || selectedCategory === 'bharath') && (
            <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
              🔥 Gas Cylinders
            </span>
          )}
        </div>

        <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
          {filteredProducts.length} Items
        </span>
      </div>

      {/* Product Items Grid Layout */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 animate-fadeIn">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-2">
          <Wrench className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-white">No products found in this category</h3>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300"
          >
            Show All Catalog Products
          </button>
        </div>
      )}
    </section>
  );
};
