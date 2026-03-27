/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function ProductItem({ product, addToCartHandler }) {
  // Calculer le prix réduit si discount existe
  const discount = Number(product.discount) || 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount 
    ? (product.price * (1 - discount / 100)).toFixed(2)
    : product.price;

  // Calculer le stock total
  const getTotalStock = () => {
    if (!product.colors || product.colors.length === 0) return 0;
    return product.colors.reduce((total, color) => {
      return total + color.sizes.reduce((sum, size) => sum + size.countInStock, 0);
    }, 0);
  };

  const totalStock = getTotalStock();
  const isOutOfStock = totalStock === 0;

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-white to-[#F5EFE7] shadow-md hover:shadow-2xl hover:shadow-[#9D8B6F]/30 transition-all duration-500">
      
      {/* Badge de réduction */}
      {hasDiscount && !isOutOfStock && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white 
                        px-3 py-1.5 rounded-full text-xs font-bold 
                        shadow-lg 
                        animate-pulse">
            -{discount}%
          </div>
        </div>
      )}

      {/* Badge Épuisé */}
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white 
                        px-3 py-1.5 rounded-full text-xs font-bold 
                        shadow-lg uppercase">
            Sold Out
          </div>
        </div>
      )}
      
      {/* Accents dorés aux coins */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#9D8B6F]/50 rounded-tl-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#9D8B6F]/50 rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#9D8B6F]/50 rounded-bl-xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#9D8B6F]/50 rounded-br-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* IMAGE + ACTIONS */}
      <div className="relative overflow-hidden">
        <Link href={`/product/${product.slug}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`h-44 sm:h-52 w-full object-cover transition duration-700 group-hover:scale-110 group-hover:brightness-95 ${isOutOfStock ? 'opacity-60 grayscale' : ''}`}
          />
        </Link>

        {/* Overlay dégradé subtil au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A4D3A]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* ACTIONS OVERLAY */}
        <div className="absolute right-3 bottom-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="rounded-full bg-white/95 backdrop-blur-sm p-2.5 shadow-lg hover:bg-[#F5EFE7] hover:scale-110 transition-all duration-300 border border-[#C9B99A]/40"
          >
            <EyeIcon className="h-4 w-4 text-[#3D3021]" />
          </Link>
          {!isOutOfStock && (
            <button
              onClick={() => addToCartHandler(product)}
              className="rounded-full bg-[#6B5635]/95 backdrop-blur-sm p-2.5 shadow-lg hover:bg-[#5A4D3A] hover:scale-110 transition-all duration-300"
            >
              <ShoppingCartIcon className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* TEXTE */}
      <div className="p-3 sm:p-4 text-center bg-gradient-to-b from-transparent to-[#F5EFE7]/60">
        <h3 className="text-sm sm:text-base font-normal text-[#2D2416] tracking-wide leading-tight mb-2 min-h-[2rem] flex items-center justify-center">
          {product.name}
        </h3>
        
        {/* Séparateur décoratif */}
        <div className="w-8 h-[2px] mx-auto mb-2 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
        
        {/* PRIX - hauteur fixe pour garder la même taille */}
        <div className="flex flex-col items-center justify-center gap-1 min-h-[3.5rem]">
          {hasDiscount ? (
            <>
              {/* Prix original barré */}
              <p className="text-xs sm:text-sm text-[#6B5635] line-through opacity-70">
                {product.price} <span className="text-xs">DT</span>
              </p>
              {/* Prix réduit */}
              <p className="text-lg sm:text-xl font-bold text-red-600 tracking-wide">
                {discountedPrice} <span className="text-sm">DT</span>
              </p>
            </>
          ) : (
            <p className="text-base sm:text-lg font-medium text-[#3D3021] tracking-wide">
              {product.price} <span className="text-sm">DT</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}