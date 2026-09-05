import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
      <div className="max-w-4xl mx-auto px-4">
        &copy; {new Date().getFullYear()} Kishore Gas • ⚡ 10 Min Express Delivery
      </div>
    </footer>
  );
};
