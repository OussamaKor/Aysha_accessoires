import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  /* ---------- SUPPRIMER ---------- */
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };

  /* ---------- METTRE À JOUR QTY ---------- */
  const updateCartHandler = (item, qty) => {
    const quantity = Number(qty);

    if (item.sizeStock < quantity) {
      return toast.error('Désolé, cette taille est en rupture de stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });

    toast.success('Produit mis à jour dans le panier');
  };

  return (
    <Layout title="Mon Panier">
      <div className="mx-auto max-w-7xl px-6 py-16 min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8]">

        {/* TITRE */}
        <div className="mb-12 text-center">
          <div className="w-16 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
          <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.3em] text-[#2D2416]">
            mon panier
          </h1>
          <div className="w-16 h-[2px] mx-auto mt-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#C9B99A]/40 shadow-md">
            <p className="text-[#5A4D3A] font-normal text-lg mb-4">
              Votre panier est vide.
            </p>
            <Link 
              href="/" 
              className="inline-block text-[#2D2416] font-normal border-b-2 border-[#9D8B6F]/60 hover:border-[#6B5635] transition-colors duration-300"
            >
              Continuez vos achats !
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">

            {/* ---------- ARTICLES ---------- */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item.slug}-${item.color}-${item.size}`}
                  className="flex gap-6 p-6 bg-white rounded-xl border border-[#C9B99A]/40 hover:border-[#9D8B6F]/60 hover:shadow-xl hover:shadow-[#9D8B6F]/10 transition-all duration-300"
                >
                  {/* IMAGE */}
                  <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-lg overflow-hidden border border-[#C9B99A]/40 hover:border-[#9D8B6F]/60 transition-all duration-300 group">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  {/* INFOS */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="block text-base sm:text-lg font-normal text-[#2D2416] hover:text-[#5A4D3A] transition-colors duration-300"
                      >
                        {item.name}
                      </Link>

                      {/* VARIANTES */}
                      <p className="mt-3 text-sm text-[#5A4D3A] font-normal">
                        Couleur : <span className="font-medium text-[#2D2416]">{item.color}</span>
                      </p>
                      <p className="text-sm text-[#5A4D3A] font-normal">
                        Taille : <span className="font-medium text-[#2D2416]">{item.size}</span>
                      </p>

                      <p className="mt-4 text-lg font-medium text-[#2D2416]">
                        {item.price} <span className="text-base">DT</span>
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3 text-sm mt-4 flex-wrap">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartHandler(item, e.target.value)
                        }
                        className="rounded-lg border border-[#C9B99A]/50 bg-white px-4 py-2 text-sm text-[#2D2416] font-normal hover:border-[#9D8B6F]/70 focus:outline-none focus:ring-1 focus:ring-[#9D8B6F]/40 transition-all duration-300"
                      >
                        {[...Array(item.sizeStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            Quantité {x + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeItemHandler(item)}
                        className="text-[#5A4D3A] hover:text-[#9D8B6F] transition-colors duration-300 p-2 hover:bg-[#F5EFE7] rounded-lg flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------- RÉCAPITULATIF ---------- */}
            <div className="sticky top-32 h-fit rounded-2xl border border-[#9D8B6F]/50 bg-white p-8 shadow-xl shadow-[#9D8B6F]/10">
              <h2 className="mb-6 text-sm font-normal uppercase tracking-[0.3em] text-[#2D2416] text-center">
                Récapitulatif
              </h2>
              
              <div className="w-12 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>

              <div className="flex justify-between text-sm mb-4 text-[#5A4D3A] font-normal">
                <span>Articles</span>
                <span className="text-[#2D2416] font-medium">
                  {cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between text-xl font-medium mb-8 pt-6 border-t border-[#C9B99A]/40 text-[#2D2416]">
                <span>Total</span>
                <span>
                  {cartItems.reduce(
                    (a, c) => a + c.quantity * c.price,
                    0
                  )} <span className="text-base">DT</span>
                </span>
              </div>

              <button
                onClick={() => router.push('/shipping')}
                className="w-full relative bg-white border-2 border-[#9D8B6F]/60 text-[#2D2416] py-4 text-sm uppercase tracking-[0.3em] font-normal rounded-xl hover:bg-[#F5EFE7] hover:border-[#6B5635] hover:shadow-xl hover:shadow-[#9D8B6F]/20 transition-all duration-500 overflow-hidden group"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#9D8B6F]/10 to-transparent"></div>
                <span className="relative z-10">Finaliser la commande</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });