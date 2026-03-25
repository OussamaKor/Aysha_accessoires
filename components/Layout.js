import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Menu } from '@headlessui/react';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../utils/Store';
import DropdownLink from './DropdownLink';
import { useRouter } from 'next/router';
import { FaInstagram } from 'react-icons/fa';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import categories from '../utils/categories';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        <title>{title ? title + ' - Aysha Accessoires' : 'Aysha Accessoires'}</title>
        <meta name="description" content="Bijouterie Fine & Accessoires de Luxe" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-20 items-center justify-between px-6 shadow-lg bg-gradient-to-b from-[#F5EFE7] to-white border-b border-[#C9B99A]/40 backdrop-blur-sm">

            {/* LOGO */}
            <Link href="/" className="group flex flex-col leading-none">
              <span className="font-serif italic text-3xl text-[#6B5635] tracking-wide">
                Aysha
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-[0.4em] text-[#5A4D3A] font-normal">
                Accessoires
              </span>
            </Link>

            {/* CATEGORIES */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Menu Bijoux */}
              <Menu as="div" className="relative">
                <Menu.Button className="text-xs uppercase tracking-[0.15em] text-[#5A4D3A] font-normal hover:text-[#3D3021] transition-colors duration-300 flex items-center gap-1">
                  Bijoux
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Menu.Button>
                <Menu.Items className="absolute left-0 mt-3 w-56 origin-top-left bg-white shadow-xl rounded-xl border border-[#C9B99A]/40 py-2 focus:outline-none z-50">
                  {['boucles-oreilles', 'colliers', 'bracelets', 'bagues', 'chokers', 'gourmettes', 'parures', 'bracelets-cheville'].map((key) => {
                    const cat = categories.find(c => c.key === key);
                    return cat ? (
                      <Menu.Item key={cat.key}>
                        {({ active }) => (
                          <Link
                            href={`/#${cat.key}`}
                            className={`block px-4 py-2.5 text-sm text-[#2D2416] hover:bg-[#F5EFE7] transition-colors duration-200 ${active ? 'bg-[#F5EFE7]' : ''}`}
                          >
                            {cat.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ) : null;
                  })}
                </Menu.Items>
              </Menu>

              {/* Menu Accessoires */}
              <Menu as="div" className="relative">
                <Menu.Button className="text-xs uppercase tracking-[0.15em] text-[#5A4D3A] font-normal hover:text-[#3D3021] transition-colors duration-300 flex items-center gap-1">
                  Accessoires
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Menu.Button>
                <Menu.Items className="absolute left-0 mt-3 w-56 origin-top-left bg-white shadow-xl rounded-xl border border-[#C9B99A]/40 py-2 focus:outline-none z-50">
                  {['sacs', 'foulards', 'portefeuilles', 'lunettes'].map((key) => {
                    const cat = categories.find(c => c.key === key);
                    return cat ? (
                      <Menu.Item key={cat.key}>
                        {({ active }) => (
                          <Link
                            href={`/#${cat.key}`}
                            className={`block px-4 py-2.5 text-sm text-[#2D2416] hover:bg-[#F5EFE7] transition-colors duration-200 ${active ? 'bg-[#F5EFE7]' : ''}`}
                          >
                            {cat.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ) : null;
                  })}
                </Menu.Items>
              </Menu>
            </div>

            {/* RIGHT */}
            <div className="flex items-center z-10 gap-2">

              {/* MENU MOBILE BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative flex items-center justify-center p-2 text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* CART */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300"
              >
                <ShoppingBagIcon className="h-6 w-6" />

                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#6B5635] text-[10px] font-medium text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* AUTH / ADMIN */}
              {isAdminRoute && (
                <>
                  {status === 'loading' ? null : session?.user ? (
                    <Menu as="div" className="relative inline-block">
                      <Menu.Button className="text-sm text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300">
                        {session.user.name}
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white shadow-lg rounded-md border border-[#C9B99A]/40">
                        <Menu.Item>
                          <DropdownLink href="/profile">Profile</DropdownLink>
                        </Menu.Item>

                        <Menu.Item>
                          <DropdownLink href="/order-history">
                            Order History
                          </DropdownLink>
                        </Menu.Item>

                        {session.user.isAdmin && (
                          <Menu.Item>
                            <DropdownLink href="/admin/dashboard">
                              Admin Dashboard
                            </DropdownLink>
                          </Menu.Item>
                        )}

                        <Menu.Item>
                          <button
                            className="dropdown-link w-full text-left"
                            onClick={logoutClickHandler}
                          >
                            Logout
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  ) : (
                    <Link href="/login" className="p-2 text-sm text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300">
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* MENU MOBILE SLIDE-IN */}
          <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[60] lg:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
            <div 
              className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-white to-[#F5EFE7] shadow-2xl transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du menu mobile */}
              <div className="flex items-center justify-between p-6 border-b border-[#C9B99A]/40">
                <span className="font-serif italic text-2xl text-[#6B5635]">Aysha</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#5A4D3A] hover:text-[#3D3021] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="overflow-y-auto h-[calc(100%-80px)] p-6">
                {/* Bijoux */}
                <div className="mb-6">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#5A4D3A] font-medium mb-3 px-2">Bijoux</h3>
                  <div className="space-y-1">
                    {['boucles-oreilles', 'colliers', 'bracelets', 'bagues', 'chokers', 'gourmettes', 'parures', 'bracelets-cheville'].map((key) => {
                      const cat = categories.find(c => c.key === key);
                      return cat ? (
                        <Link
                          key={cat.key}
                          href={`/#${cat.key}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-[#2D2416] hover:bg-[#F5EFE7] rounded-lg transition-colors duration-200"
                        >
                          {cat.label}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Accessoires */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] text-[#5A4D3A] font-medium mb-3 px-2">Accessoires</h3>
                  <div className="space-y-1">
                    {['sacs', 'foulards', 'portefeuilles', 'lunettes'].map((key) => {
                      const cat = categories.find(c => c.key === key);
                      return cat ? (
                        <Link
                          key={cat.key}
                          href={`/#${cat.key}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-[#2D2416] hover:bg-[#F5EFE7] rounded-lg transition-colors duration-200"
                        >
                          {cat.label}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#C9B99A]/50 bg-gradient-to-b from-[#F5EFE7] to-[#EFE6D8]">
          <div className="mx-auto max-w-7xl px-6 py-14">

            {/* TOP */}
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 text-center">

              {/* BRAND */}
              <div className="relative">
                <Link href="/" className="group flex flex-col items-center leading-none">
                  <span className="font-serif italic text-3xl text-[#6B5635] tracking-wide">
                    Aysha
                  </span>

                  <span className="mt-0.5 text-[9px] font-sans uppercase tracking-[0.4em] text-[#5A4D3A] font-normal">
                    Accessoires
                  </span>
                </Link>
                <p className="mt-4 text-sm leading-relaxed text-[#5A4D3A] font-normal">
                  Bijouterie fine & Accessoires de luxe
                </p>
              </div>

              {/* CONTACT */}
              <div className="relative">
                <h3 className="text-xs font-normal uppercase tracking-[0.25em] text-[#5A4D3A]/70 mb-4">
                  Contact
                </h3>
                <p className="text-sm text-[#3D3021] font-normal">
                  Téléphone : <span className="font-medium text-[#2D2416]">+216 98 625 049</span>
                </p>
                <p className="mt-2 text-sm text-[#3D3021] font-normal">
                  Nabeul, Tunisie
                </p>
              </div>

              {/* SOCIAL */}
              <div className="relative">
                <h3 className="text-xs font-normal uppercase tracking-[0.25em] text-[#5A4D3A]/70 mb-4">
                  Suivez-nous
                </h3>

                <a
                  href="https://www.instagram.com/aysha_accessoires/?igsh=dWJvMnh3MG1wbnMw"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300 font-normal"
                >
                  <FaInstagram size={18} />
                  Instagram
                </a>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-12 pt-8 border-t border-[#C9B99A]/40 text-center text-xs text-[#5A4D3A]/70 font-normal">
              © {new Date().getFullYear()} Aysha Accessoires — Créé avec élégance par{' '}
              <a
                href="https://www.instagram.com/oussama__kor?igsh=MjUyOTB4c3BtZm51"
                target="_blank"
                rel="noreferrer"
                className="text-[#5A4D3A] hover:text-[#3D3021] transition-colors duration-300"
              >
                Oussama Kordoghli
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
