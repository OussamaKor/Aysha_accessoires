import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { useRouter } from 'next/router';

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress = {} } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue('fullName', shippingAddress.fullName);
    setValue('address', shippingAddress.address);
    setValue('phone', shippingAddress.phone);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, phone }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, address, phone },
    });

    dispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: 'CashOnDelivery',
    });

    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: { fullName, address, phone },
        paymentMethod: 'CashOnDelivery',
      })
    );

    router.push('/placeorder');
  };

  return (
    <Layout title="Adresse de livraison">
      <CheckoutWizard activeStep={1} />

      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE7] to-[#EFE6D8] py-16">
        <div className="mx-auto max-w-2xl px-6">
          
          {/* En-tête */}
          <div className="mb-10 text-center">
            <div className="w-16 h-[2px] mx-auto mb-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
            <h1 className="text-2xl sm:text-3xl font-normal uppercase tracking-[0.3em] text-[#2D2416] mb-3">
              Livraison
            </h1>
            <p className="text-sm text-[#5A4D3A] font-normal">
              Renseignez vos coordonnées de livraison
            </p>
            <div className="w-16 h-[2px] mx-auto mt-6 bg-gradient-to-r from-transparent via-[#9D8B6F] to-transparent"></div>
          </div>

          <form
            onSubmit={handleSubmit(submitHandler)}
            className="rounded-2xl bg-white border border-[#C9B99A]/40 p-8 sm:p-10 shadow-xl shadow-[#9D8B6F]/10"
          >
            {/* Nom & Prénom */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-normal text-[#2D2416] tracking-wide">
                Nom et prénom
              </label>
              <input
                autoFocus
                className="w-full rounded-lg border border-[#C9B99A]/50 bg-white px-4 py-3 text-[#2D2416] font-normal
                           placeholder:text-[#9D8B6F]/50
                           focus:border-[#9D8B6F]/70 focus:outline-none focus:ring-1 focus:ring-[#9D8B6F]/40
                           transition-all duration-300"
                placeholder=""
                {...register('fullName', {
                  required: 'Veuillez entrer votre nom et prénom',
                })}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500 font-normal">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Adresse complète */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-normal text-[#2D2416] tracking-wide">
                Adresse complète
              </label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-[#C9B99A]/50 bg-white px-4 py-3 text-[#2D2416] font-normal
                           placeholder:text-[#9D8B6F]/50
                           focus:border-[#9D8B6F]/70 focus:ring-1 focus:ring-[#9D8B6F]/40
                           transition-all duration-300 resize-none"
                placeholder=""
                {...register('address', {
                  required: 'Veuillez entrer votre adresse',
                  minLength: {
                    value: 5,
                    message: 'Adresse trop courte',
                  },
                })}
              />
              {errors.address && (
                <p className="mt-2 text-sm text-red-500 font-normal">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="mb-8">
              <label className="mb-2 block text-sm font-normal text-[#2D2416] tracking-wide">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-[#C9B99A]/50 bg-white px-4 py-3 text-[#2D2416] font-normal
                           placeholder:text-[#9D8B6F]/50
                           focus:border-[#9D8B6F]/70 focus:ring-1 focus:ring-[#9D8B6F]/40
                           transition-all duration-300"
                placeholder=""
                {...register('phone', {
                  required: 'Veuillez entrer votre numéro',
                  pattern: {
                    value: /^[0-9+\s-]{6,}$/,
                    message: 'Numéro invalide',
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-500 font-normal">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Séparateur */}
            <div className="w-full h-[1px] mb-8 bg-gradient-to-r from-transparent via-[#C9B99A]/40 to-transparent"></div>

            <button
              type="submit"
              className="w-full relative bg-white border-2 border-[#9D8B6F]/60 text-[#2D2416] py-4 text-sm uppercase tracking-[0.3em] font-normal rounded-xl hover:bg-[#F5EFE7] hover:border-[#6B5635] hover:shadow-xl hover:shadow-[#9D8B6F]/20 transition-all duration-500 overflow-hidden group"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-[#9D8B6F]/10 to-transparent"></div>
              <span className="relative z-10">Continuer</span>
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
