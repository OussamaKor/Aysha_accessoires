import axios from 'axios';
import Image from 'next/image';
import { useContext, useMemo } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { 
  SparklesIcon,
} from '@heroicons/react/24/outline';

/* ---------- CATEGORY LABELS ---------- */
const CATEGORY_LABELS = {
  'boucles-oreilles': 'Boucles d\'oreilles',
  'colliers': 'Colliers',
  'chokers': 'Chokers',
  'gourmettes': 'Gourmettes',
  'bracelets': 'Bracelets',
  'bagues': 'Bagues',
  'sacs': 'Sacs',
  'foulards': 'Foulards',
  'parures': 'Parures',
  'portefeuilles': 'Portefeuilles',
  'lunettes': 'Lunettes',
  'bracelets-cheville': 'Bracelets de cheville',
};

/* ---------- CATEGORY ICONS ---------- */
const CATEGORY_ICONS = {
  'boucles-oreilles': SparklesIcon,
  'colliers': SparklesIcon,
  'chokers': SparklesIcon,
  'gourmettes': SparklesIcon,
  'bracelets': SparklesIcon,
  'bagues': SparklesIcon,
  'sacs': SparklesIcon,
  'foulards': SparklesIcon,
  'parures': SparklesIcon,
  'portefeuilles': SparklesIcon,
  'lunettes': SparklesIcon,
  'bracelets-cheville': SparklesIcon,
};

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  /* ---------- GROUP PRODUCTS BY CATEGORY ---------- */
  const productsByCategory = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.category] = acc[product.category] || [];
      acc[product.category].push(product);
      return acc;
    }, {});
  }, [products]);

  /* ---------- AVAILABLE CATEGORIES ---------- */
  const availableCategories = useMemo(() => {
    return Object.keys(productsByCategory);
  }, [productsByCategory]);

  /* ---------- CART ---------- */
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page" availableCategories={availableCategories}>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8]">

        {/* ---------- HERO / CAROUSEL ---------- */}
        <div className="relative w-full h-[53vh] sm:h-[50vh] md:h-[55vh] overflow-hidden">

          {/* IMAGE PRINCIPALE */}
          <Image
            src="/images/profile_aysha.png"
            alt="Aysha Bijoux"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay gradient en bas uniquement */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* CONTENU - Bas de page */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-8 sm:pb-12 px-4">

            {/* Main title avec fond subtil */}
            <div className="mb-3 sm:mb-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl 
                            font-serif italic font-light tracking-wide
                            bg-gradient-to-r from-white via-[#F5E6D3] to-[#D4C4A8]
                            bg-clip-text text-transparent
                            mb-2
                            drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Aysha Accessoires
              </h1>
              <div className="h-[1px] w-48 mx-auto bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>
            </div>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg 
                        text-white/95 font-light tracking-[0.25em] uppercase
                        mb-2 sm:mb-3
                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Bijouterie Fine
            </p>

            {/* Description */}
            <p className="text-xs sm:text-sm 
                        text-white/90 font-light leading-relaxed
                        mb-5 sm:mb-6 max-w-md
                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Des créations précieuses qui subliment chaque instant de votre quotidien
            </p>

            {/* CTA Button */}
            <a 
              href="#collection" 
              className="group relative inline-flex items-center justify-center gap-2
                       px-6 sm:px-8 py-2.5 sm:py-3
                       text-xs sm:text-sm tracking-[0.2em] uppercase
                       text-white font-medium
                       bg-transparent
                       border-2 border-white/80
                       rounded-full
                       hover:bg-white/10 hover:border-white
                       hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)]
                       transition-all duration-300
                       transform hover:scale-105
                       backdrop-blur-sm">
              Découvrir
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

          </div>
        </div>

        {/* ---------- SECTION SIGNATURE ---------- */}
        <div className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-[#F9F4ED] via-[#F3EAE0] to-[#EFE6D8]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-[#D4C5B0]/30 p-8 sm:p-12">
              <div className="text-center">
                <div className="inline-block mb-6">
                  <div className="w-20 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent mb-5"></div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-[#3D3021] mb-5 font-medium">
                    L&apos;Art de la Parure
                  </h2>
                  <div className="w-20 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
                </div>
                <p className="text-base sm:text-lg text-[#2D2416] leading-relaxed tracking-wide font-normal">
                  Chaque bijou est une promesse d&apos;élégance intemporelle.<br className="hidden sm:block" />
                  Des pièces soigneusement sélectionnées pour magnifier votre style unique.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CONTENT ---------- */}
        <div id="collection" className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 px-4 scroll-mt-8">

          <div className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-r from-[#F5EFE7]/50 via-[#E8DCCE]/40 to-[#F5EFE7]/50 rounded-2xl p-8 sm:p-10 text-center shadow-sm border border-[#D4C5B0]/20">
              <div className="w-16 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
              <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.25em] text-[#2D2416] mb-3">
                Notre Collection
              </h1>
              <p className="text-sm sm:text-base text-[#3D3021] tracking-wider font-normal">
                Explorez nos créations
              </p>
            </div>
          </div>

          {/* ---------- CATEGORIES ---------- */}
          {Object.entries(productsByCategory).map(
            ([category, categoryProducts]) => {
              const CategoryIcon = CATEGORY_ICONS[category] || SparklesIcon;

              return (
                <div
                  key={category}
                  id={category}
                  className="mb-12 sm:mb-16 scroll-mt-20"
                >
                  {/* HEADER */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#E8DCCE]/30 to-transparent rounded-lg px-4 py-3 mb-6 sm:mb-8 border-l-4 border-[#9D8B6F]">
                    <CategoryIcon 
                      className="w-6 h-6 text-[#6B5635]"
                    />
                    <h2 className="text-lg sm:text-xl font-normal uppercase tracking-[0.2em] text-[#2D2416]">
                      {CATEGORY_LABELS[category] || category}
                    </h2>
                  </div>

                  {/* CAROUSEL - Scrollable horizontal */}
                  <div className="relative -mx-4 sm:mx-0">
                    <div 
                      className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-0 pb-2
                                scrollbar-hide snap-x snap-mandatory
                                scroll-smooth"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                      }}
                    >
                      {categoryProducts.slice(0, 4).map((product) => (
                        <div 
                          key={product.slug}
                          className="flex-none w-[45vw] sm:w-[38vw] md:w-[28vw] lg:w-[20vw] snap-start"
                        >
                          <ProductItem
                            product={product}
                            addToCartHandler={addToCartHandler}
                          />
                        </div>
                      ))}
                      
                      {/* Bouton "Voir tout" si plus de 4 produits */}
                      {categoryProducts.length > 4 && (
                        <div className="flex-none w-[45vw] sm:w-[38vw] md:w-[28vw] lg:w-[20vw] snap-start">
                          <a
                            href={`/category/${category}`}
                            className="block h-full min-h-[280px] sm:min-h-[320px]
                                     bg-gradient-to-br from-white/80 to-[#F5EFE7]/60
                                     backdrop-blur-sm
                                     rounded-2xl shadow-md hover:shadow-xl
                                     border border-[#D4C5B0]/30
                                     transition-all duration-300
                                     hover:scale-105 hover:border-[#9D8B6F]
                                     flex flex-col items-center justify-center
                                     group p-6 text-center"
                          >
                            <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#9D8B6F] to-[#6B5635]
                                          flex items-center justify-center
                                          group-hover:scale-110 transition-transform duration-300
                                          shadow-lg">
                              <svg 
                                className="w-8 h-8 text-white" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                            <div className="text-sm sm:text-base font-medium text-[#3D3021] uppercase tracking-[0.15em] mb-2">
                              Voir tout
                            </div>
                            <div className="text-xs text-[#6B5635] tracking-wide">
                              {categoryProducts.length} produits
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                    
                    {/* Gradient fade sur les bords */}
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-[#EFE6D8] to-transparent sm:hidden"></div>
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-[#EFE6D8] to-transparent sm:hidden"></div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </Layout>
  );
}

/* ---------- SSR ---------- */
export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find();
  const featuredProducts = await Product.find({ isFeatured: true });

  await db.disconnect();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    },
  };
}
