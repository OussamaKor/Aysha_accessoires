import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import { calculateFinalPrice, hasDiscount } from '../../utils/pricing';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return { ...state, loadingDeliver: false, successDeliver: false };

    default:
      return state;
  }
}

function OrderScreen() {
  const { data: session } = useSession();
  const { query } = useRouter();
  const orderId = query.id;

  const [, paypalDispatch] = usePayPalScriptReducer();

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      order._id !== orderId
    ) {
      fetchOrder();
      if (successPay) dispatch({ type: 'PAY_RESET' });
      if (successDeliver) dispatch({ type: 'DELIVER_RESET' });
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successPay, successDeliver]);

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    isPaid,
    isDelivered,
    deliveredAt,
  } = order;




  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      await axios.put(`/api/admin/orders/${order._id}/deliver`);
      dispatch({ type: 'DELIVER_SUCCESS' });
      toast.success('Commande marquée comme livrée');
    } catch (err) {
      dispatch({ type: 'DELIVER_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout title={`Commande ${orderId}`}>
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          
          {/* Titre */}
          <div className="mb-12 text-center">
            <div className="w-16 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.3em] text-[#2D2416]">
              Commande #{orderId?.slice(-8)}
            </h1>
            <div className="w-16 h-[2px] mx-auto mt-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
          </div>

          {/* MESSAGE DE CONFIRMATION */}
          <div className="mb-8 rounded-2xl border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-white p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Icône de validation */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <svg 
                    className="h-8 w-8 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>

              {/* Contenu du message */}
              <div className="flex-1">
                <h3 className="mb-4 text-xl font-normal text-green-800 tracking-wide">
                  Commande enregistrée avec succès !
                </h3>
                <div className="space-y-3 text-sm text-green-700/90 font-normal">
                  <p className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">📞</span>
                    <span>
                      Notre équipe vous <strong className="font-normal">contactera très prochainement</strong> par téléphone pour confirmer votre commande.
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">💰</span>
                    <span>
                      <strong className="font-normal">Paiement à la livraison</strong> — Vous réglez directement au livreur lors de la réception.
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="mt-0.5 text-lg">📦</span>
                    <span>
                      Merci pour votre confiance ! Nous préparons votre commande avec soin.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-white border border-[#C9B99A]/40 p-8 shadow-md text-center">
              <p className="text-[#5A4D3A] font-normal">Chargement…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border-2 border-red-500/20 bg-red-50 p-6 text-red-600 shadow-sm font-normal">
              {error}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

              {/* GAUCHE */}
              <div className="space-y-6">

                {/* LIVRAISON */}
                <div className="rounded-2xl bg-white border border-[#C9B99A]/40 p-6 sm:p-8 shadow-md">
                  <h2 className="mb-4 text-lg font-normal text-[#2D2416] tracking-wide">
                    Adresse de livraison
                  </h2>
                  <div className="w-full h-[1px] mb-4 bg-[#C9B99A]/30"></div>

                  <p className="text-sm text-[#2D2416] font-normal leading-relaxed mb-4">
                    {shippingAddress.fullName}<br />
                    {shippingAddress.address}<br />
                    {shippingAddress.phone}
                  </p>

                  {isDelivered ? (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 border border-green-500/20 px-4 py-2 text-sm font-normal text-green-700">
                      <span>✓</span> Livrée le {deliveredAt}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-500/20 px-4 py-2 text-sm font-normal text-amber-700">
                      <span>⏳</span> En cours de traitement
                    </div>
                  )}
                </div>

                {/* ARTICLES */}
                <div className="rounded-2xl bg-white border border-[#C9B99A]/40 p-6 sm:p-8 shadow-md">
                  <h2 className="mb-4 text-lg font-normal text-[#2D2416] tracking-wide">
                    Articles commandés
                  </h2>
                  <div className="w-full h-[1px] mb-6 bg-[#C9B99A]/30"></div>

                  <div className="space-y-6">
                    {orderItems.map((item) => (
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
                      <span className="text-[#2D2416] font-medium">{itemsPrice?.toFixed(2)} DT</span>
                    </div>
                    <div className="flex justify-between text-[#5A4D3A] font-normal">
                      <span>Livraison</span>
                      <span className="text-[#2D2416] font-medium">7 DT</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xl font-medium mb-6 text-[#2D2416]">
                    <span>Total</span>
                    <span>{(itemsPrice + 7).toFixed(2)} <span className="text-base">DT</span></span>
                  </div>

                  {session?.user?.isAdmin &&
                    isPaid &&
                    !isDelivered && (
                      <div className="mt-6 pt-6 border-t border-[#C9B99A]/40">
                        {loadingDeliver && (
                          <div className="mb-3 text-center text-sm text-[#5A4D3A] font-normal">
                            Traitement…
                          </div>
                        )}
                        <button
                          onClick={deliverOrderHandler}
                          className="w-full relative bg-white border-2 border-[#9D8B6F]/60 text-[#2D2416] py-3 text-sm uppercase tracking-[0.3em] font-normal rounded-xl hover:bg-[#F5EFE7] hover:border-[#6B5635] hover:shadow-xl hover:shadow-[#9D8B6F]/20 transition-all duration-500 overflow-hidden group"
                        >
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#9D8B6F]/10 to-transparent"></div>
                          <span className="relative z-10">Marquer livrée</span>
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default OrderScreen;
