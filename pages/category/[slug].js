import axios from 'axios';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import ProductItem from '../../components/ProductItem';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { 
  ArrowLeftIcon,
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

export default function CategoryPage({ products, category, availableCategories }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const CategoryIcon = CATEGORY_ICONS[category] || SparklesIcon;
  const categoryLabel = CATEGORY_LABELS[category] || category;

  /* ---------- CART ---------- */
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Désolé. Produit en rupture de stock');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Produit ajouté au panier');
  };

  return (
    <Layout title={categoryLabel} availableCategories={availableCategories}>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8]">
        
        {/* ---------- CONTAINER ---------- */}
        <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4">
          
          {/* ---------- BOUTON RETOUR ---------- */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/')}
              className="group inline-flex items-center gap-2 
                       px-4 sm:px-6 py-2.5 sm:py-3
                       text-sm tracking-wide
                       text-[#3D3021] font-medium
                       bg-white/60 backdrop-blur-sm
                       border border-[#D4C5B0]/40
                       rounded-full
                       hover:bg-white/80 hover:border-[#9D8B6F]
                       hover:shadow-md
                       transition-all duration-300
                       transform hover:scale-105"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Retour
            </button>
          </div>

          {/* ---------- HEADER CATEGORY ---------- */}
          <div className="mb-10 sm:mb-14">
            <div className="bg-gradient-to-r from-white/70 via-[#F5EFE7]/60 to-white/70 
                          backdrop-blur-sm rounded-3xl p-8 sm:p-12 
                          text-center shadow-lg border border-[#D4C5B0]/30">
              
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 
                            rounded-full bg-gradient-to-br from-[#9D8B6F] to-[#6B5635]
                            shadow-lg mb-6">
                <CategoryIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>

              {/* Divider */}
              <div className="w-20 h-[2px] mx-auto mb-5 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif italic text-[#2D2416] mb-4 font-medium">
                {categoryLabel}
              </h1>
              
              {/* Divider */}
              <div className="w-20 h-[2px] mx-auto mb-5 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
              
              {/* Count */}
              <p className="text-sm sm:text-base text-[#6B5635] tracking-wide">
                {products.length} {products.length > 1 ? 'produits' : 'produit'}
              </p>
            </div>
          </div>

          {/* ---------- PRODUCTS GRID ---------- */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                        gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.slug}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                />
              </div>
            ))}
          </div>

          {/* ---------- EMPTY STATE ---------- */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 inline-block border border-[#D4C5B0]/30">
                <SparklesIcon className="w-16 h-16 text-[#9D8B6F] mx-auto mb-4 opacity-50" />
                <p className="text-lg text-[#6B5635]">
                  Aucun produit dans cette catégorie pour le moment
                </p>
              </div>
            </div>
          )}

          {/* ---------- BOUTON RETOUR EN BAS ---------- */}
          {products.length > 0 && (
            <div className="mt-12 sm:mt-16 text-center">
              <button
                onClick={() => router.push('/')}
                className="group inline-flex items-center gap-2 
                         px-6 sm:px-8 py-3 sm:py-4
                         text-sm tracking-wide uppercase
                         text-[#3D3021] font-medium
                         bg-white/60 backdrop-blur-sm
                         border-2 border-[#D4C5B0]/50
                         rounded-full
                         hover:bg-white/80 hover:border-[#9D8B6F]
                         hover:shadow-lg
                         transition-all duration-300
                         transform hover:scale-105"
              >
                <ArrowLeftIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                Retour à l&apos;accueil
              </button>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}

/* ---------- SSR ---------- */
export async function getServerSideProps(context) {
  const { slug } = context.params;

  await db.connect();
  const products = await Product.find({ category: slug });
  
  // Get all available categories
  const allProducts = await Product.find({});
  const availableCategories = [...new Set(allProducts.map(p => p.category))];
  
  await db.disconnect();

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      category: slug,
      availableCategories,
    },
  };
}
