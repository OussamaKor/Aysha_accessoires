import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';
import { calculateFinalPrice, hasDiscount } from '../utils/pricing';

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const round2 = (num) =>
    Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.quantity * calculateFinalPrice(c.price, c.discount), 0)
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      dispatch({
        type: 'SAVE_PAYMENT_METHOD',
        payload: 'CashOnDelivery',
      });
    }
  }, [paymentMethod, dispatch]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });

      dispatch({ type: 'CART_CLEAR_ITEMS' });
      Cookies.set(
        'cart',
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );

      router.push(`/order/${data._id}`);
    } catch (err) {
      toast.error(getError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Passer la commande">
      <CheckoutWizard activeStep={3} />

      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Titre */}
          <div className="mb-12 text-center">
            <div className="w-16 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.3em] text-[#2D2416]">
              Confirmation
            </h1>
            <div className="w-16 h-[2px] mx-auto mt-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#C9B99A]/40 shadow-md">
              <p className="text-[#5A4D3A] font-normal">
                Votre panier est vide.{' '}
                <Link href="/" className="text-[#2D2416] border-b-2 border-[#9D8B6F]/60 hover:border-[#6B5635] transition-colors duration-300">
                  Continuer vos achats
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* GAUCHE */}
              <div className="space-y-6">

                {/* ADRESSE */}
                <div className="rounded-2xl bg-white border border-[#C9B99A]/40 p-6 sm:p-8 shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-normal text-[#2D2416] tracking-wide">
                      Adresse de livraison
                    </h2>
                    <Link
                      href="/shipping"
                      className="text-sm font-normal text-[#5A4D3A] hover:text-[#9D8B6F] transition-colors duration-300"
                    >
                      Modifier
                    </Link>
                  </div>
                  <div className="w-full h-[1px] mb-4 bg-[#C9B99A]/30"></div>
                  <p className="text-sm text-[#2D2416] font-normal leading-relaxed">
                    {shippingAddress.fullName}<br />
                    {shippingAddress.address}<br />
                    {shippingAddress.phone}
                  </p>
                </div>

                {/* ARTICLES */}
                <div className="rounded-2xl bg-white border border-[#C9B99A]/40 p-6 sm:p-8 shadow-md">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-normal text-[#2D2416] tracking-wide">
                      Articles commandés
                    </h2>
                    <Link
                      href="/cart"
                      className="text-sm font-normal text-[#5A4D3A] hover:text-[#9D8B6F] transition-colors duration-300"
                    >
                      Modifier
                    </Link>
                  </div>
                  <div className="w-full h-[1px] mb-6 bg-[#C9B99A]/30"></div>

                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.slug}-${item.color}-${item.size}`}
                        className="flex gap-4 pb-6 border-b border-[#C9B99A]/30 last:border-none last:pb-0"
                      >
                        <Link href={`/product/${item.slug}`} className="flex-shrink-0">
                          <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border border-[#C9B99A]/40">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className="text-base font-normal text-[#2D2416] hover:text-[#5A4D3A] transition-colors duration-300"
                            >
                              {item.name}
                            </Link>
                            <p className="text-xs text-[#5A4D3A] font-normal mt-1">
                              {item.color} • {item.size}
                            </p>
                          </div>
                          
                          <div className="flex items-end justify-between mt-3">
                            <p className="text-sm text-[#5A4D3A] font-normal">
                              Quantité : <span className="text-[#2D2416] font-medium">{item.quantity}</span>
                            </p>
                            <div className="text-right">
                              {hasDiscount(item.discount) ? (
                                <div className="flex flex-col gap-1">
                                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold inline-block">
                                    -{item.discount}%
                                  </span>
                                  <p className="text-xs text-[#6B5635] line-through">
                                    {item.quantity * item.price} <span className="text-xs">DT</span>
                                  </p>
                                  <p className="text-base font-bold text-red-600">
                                    {(item.quantity * calculateFinalPrice(item.price, item.discount)).toFixed(2)} <span className="text-sm">DT</span>
                                  </p>
                                </div>
                              ) : (
                                <p className="text-base font-medium text-[#2D2416]">
                                  {item.quantity * item.price} <span className="text-sm">DT</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DROITE */}
              <div>
                <div className="sticky top-24 rounded-2xl border border-[#9D8B6F]/50 bg-white p-8 shadow-xl shadow-[#9D8B6F]/10">
                  <h2 className="mb-6 text-sm font-normal uppercase tracking-[0.3em] text-[#2D2416] text-center">
                    Récapitulatif
                  </h2>
                  
                  <div className="w-12 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>

                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-[#5A4D3A] font-normal">
                      <span>Sous-total</span>
                      <span className="text-[#2D2416] font-medium">{itemsPrice.toFixed(2)} DT</span>
                    </div>
                    <div className="flex justify-between text-[#5A4D3A] font-normal">
                      <span>Livraison</span>
                      <span className="text-[#2D2416] font-medium">7 DT</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-medium pt-6 border-t border-[#C9B99A]/40 text-[#2D2416] mb-8">
                    <span>Total</span>
                    <span>{(itemsPrice + 7).toFixed(2)} <span className="text-base">DT</span></span>
                  </div>

                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="w-full relative bg-white border-2 border-[#9D8B6F]/60 text-[#2D2416] py-4 text-sm uppercase tracking-[0.3em] font-normal rounded-xl hover:bg-[#F5EFE7] hover:border-[#6B5635] hover:shadow-xl hover:shadow-[#9D8B6F]/20 transition-all duration-500 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#9D8B6F]/10 to-transparent"></div>
                    <span className="relative z-10">{loading ? 'Traitement...' : 'Confirmer'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

