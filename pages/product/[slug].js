import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductScreen({ product }) {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  /* ---------- DISCOUNT ---------- */
  const discount = Number(product.discount) || 0;
  const hasDiscount = discount > 0;
  const discountedPrice = hasDiscount 
    ? (product.price * (1 - discount / 100)).toFixed(2)
    : product.price;

  /* ---------- VARIANTS ---------- */
  const colors = product?.colors || [];
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const selectedColor = colors[selectedColorIndex];
  const sizes = selectedColor?.sizes || [];

  // Masquer la section taille si elle est unique
  const hasUniqueSizeOnly = sizes.length === 1 && sizes[0].name.toLowerCase() === 'unique';

  /* ---------- IMAGES ---------- */
  const imagesToDisplay = useMemo(() => {
    if (!product) return [];
    if (!colors.length) return [product.image];
    return selectedColor?.images?.length
      ? selectedColor.images
      : [product.image];
  }, [colors, selectedColor, product]);

  /* ---------- CAROUSEL ---------- */
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColorIndex]);

  useEffect(() => {
    // Sélectionner automatiquement la taille si elle est unique
    if (hasUniqueSizeOnly && sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedColorIndex, hasUniqueSizeOnly, sizes]);

  if (!product) {
    return <Layout title="Product Not Found">Product Not Found</Layout>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imagesToDisplay.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesToDisplay.length - 1 : prev - 1
    );
  };

  /* ---------- CART ---------- */
  const addToCartHandler = async () => {
    if (!selectedSize && !hasUniqueSizeOnly) {
      return toast.error('Please select a size');
    }

    const existItem = state.cart.cartItems.find(
      (x) =>
        x.slug === product.slug &&
        x.color === selectedColor.name &&
        x.size === selectedSize.name
    );

    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (selectedSize.countInStock < quantity) {
      return toast.error('Sorry. This size is out of stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        ...product,
        quantity,
        color: selectedColor.name,
        size: selectedSize.name,
        sizeStock: selectedSize.countInStock,
      },
    });

    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8] min-h-screen">

        {/* BACK */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-normal tracking-wide text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span>Retour à la boutique</span>
        </Link>

        <div className="rounded-2xl bg-gradient-to-br from-white to-[#F5EFE7] shadow-lg shadow-[#9D8B6F]/20 p-6 sm:p-10 border border-[#C9B99A]/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ---------- LEFT : CAROUSEL ---------- */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#F5EFE7] to-[#EFE6D8] group shadow-md">

              <Image
                src={imagesToDisplay[currentImageIndex]}
                alt={`${product.name}-${currentImageIndex}`}
                fill
                className="object-cover transition duration-300"
                priority
              />

              {imagesToDisplay.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2
                               rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-lg
                               opacity-0 group-hover:opacity-100
                               transition-all duration-300 hover:bg-[#F5EFE7] hover:scale-110 border border-[#C9B99A]/40"
                  >
                    <ChevronLeft size={20} className="text-[#3D3021]" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2
                               rounded-full bg-white/95 backdrop-blur-sm p-2 shadow-lg
                               opacity-0 group-hover:opacity-100
                               transition-all duration-300 hover:bg-[#F5EFE7] hover:scale-110 border border-[#C9B99A]/40"
                  >
                    <ChevronRight size={20} className="text-[#3D3021]" />
                  </button>
                </>
              )}

              {imagesToDisplay.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {imagesToDisplay.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-300
                        ${
                          index === currentImageIndex
                            ? 'bg-[#6B5635] w-6'
                            : 'bg-[#C9B99A]'
                        }
                      `}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ---------- RIGHT : INFO ---------- */}
            <div className="flex flex-col justify-center gap-6 sm:gap-8 bg-gradient-to-br from-white to-[#FAF7F2] p-6 sm:p-10 rounded-xl shadow-sm">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#9D8B6F] font-normal">
                  {product.brand}
                </p>
                <h1 className="mt-3 text-2xl sm:text-3xl font-normal tracking-wide text-[#2D2416]">
                  {product.name}
                </h1>
                <div className="w-12 h-[2px] mt-4 bg-gradient-to-r from-[#9D8B6F] to-transparent"></div>
              </div>

              <p className="text-[#3D3021] leading-relaxed font-normal text-sm sm:text-base">
                {product.description}
              </p>

              {/* SIZE - Masqué si taille unique */}
              {!hasUniqueSizeOnly && sizes.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <span className="text-sm text-[#5A4D3A] font-normal tracking-wide sm:w-24">Taille</span>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size.name}
                        disabled={size.countInStock === 0}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border text-sm font-normal transition-all duration-300
                          ${
                            selectedSize?.name === size.name
                              ? 'border-[#9D8B6F] bg-gradient-to-br from-[#9D8B6F]/20 to-[#9D8B6F]/10 text-[#2D2416] shadow-md'
                              : 'border-[#C9B99A]/50 text-[#5A4D3A]'
                          }
                          ${
                            size.countInStock === 0
                              ? 'opacity-40 cursor-not-allowed'
                              : 'hover:border-[#9D8B6F]/60 hover:bg-[#F5EFE7]'
                          }
                        `}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COLORS */}
              {colors.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  <span className="text-sm text-[#5A4D3A] font-normal tracking-wide sm:w-24">Couleur</span>
                  <div className="flex gap-3">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        title={color.name}
                        className={`h-7 w-7 rounded-full ring-2 transition-all duration-300 hover:scale-110
                          ${
                            selectedColorIndex === index
                              ? 'ring-[#9D8B6F] ring-offset-2 ring-offset-white shadow-lg'
                              : 'ring-[#C9B99A]'
                          }
                        `}
                        style={{
                          backgroundColor: color.name.toLowerCase(),
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* PRICE & STOCK */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-4 border-t border-[#C9B99A]/40">
                <div className="flex flex-col gap-2">
                  {hasDiscount ? (
                    <>
                      {/* Badge de réduction */}
                      <div className="inline-flex items-center gap-2 mb-1">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white 
                                      px-3 py-1 rounded-full text-xs font-bold shadow-md">
                          -{discount}% DE RÉDUCTION
                        </div>
                      </div>
                      {/* Prix original barré */}
                      <p className="text-base sm:text-lg text-[#6B5635] line-through">
                        {product.price} <span className="text-sm">DT</span>
                      </p>
                      {/* Prix réduit */}
                      <span className="text-3xl sm:text-4xl font-bold text-red-600 tracking-wide">
                        {discountedPrice} <span className="text-2xl">DT</span>
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl sm:text-4xl font-medium text-[#2D2416] tracking-wide">
                      {product.price} <span className="text-2xl">DT</span>
                    </span>
                  )}
                </div>

                {selectedSize ? (
                  selectedSize.countInStock > 0 ? (
                    <span className="text-sm text-[#5A4D3A] font-normal">
                      ✓ En stock
                    </span>
                  ) : (
                    <span className="text-sm text-red-600 font-bold animate-pulse">
                      ✕ Rupture de stock
                    </span>
                  )
                ) : !hasUniqueSizeOnly ? (
                  <span className="text-sm text-[#9D8B6F] font-normal italic">
                    Choisissez une taille
                  </span>
                ) : null}
              </div>

              {/* CTA */}
              <button
                onClick={addToCartHandler}
                disabled={!selectedSize || selectedSize.countInStock === 0}
                className={`relative rounded-xl py-4 px-6 text-sm uppercase tracking-[0.25em] font-normal transition-all duration-500 overflow-hidden
                  ${
                    !selectedSize || selectedSize.countInStock === 0
                      ? 'bg-gray-100 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-2 border-[#9D8B6F]/60 text-[#2D2416] hover:bg-[#F5EFE7] hover:border-[#6B5635] hover:shadow-xl hover:shadow-[#9D8B6F]/20 group'
                  }
                `}
              >
                {/* Effet shimmer au hover */}
                {selectedSize && selectedSize.countInStock > 0 && (
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#9D8B6F]/10 to-transparent"></div>
                )}
                <span className="relative z-10">Ajouter au panier</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ---------- SSR ---------- */
export async function getServerSideProps(context) {
  const { slug } = context.params;

  await db.connect();
  const product = await Product.findOne({ slug });
  await db.disconnect();

  return {
    props: {
      product: product ? JSON.parse(JSON.stringify(product)) : null,
    },
  };
}
