import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';

export const ProductGrid = () => {
  const { products } = useShop();

  return (
    <section id="product-catalog" className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Select Gas Cylinder
        </h2>
        <span className="text-xs text-slate-400 font-medium">
          {products.length} Available
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
