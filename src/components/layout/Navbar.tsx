import React, { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Calendar, Award, Compass, Sparkles, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isAdmin,
  onToggleAdmin,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu & Order' },
    { id: 'reservations', label: 'Table Booking' },
    { id: 'loyalty', label: 'Mist Moments' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'about', label: 'Our Story' },
    { id: 'contact', label: 'Contact & Map' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/90 backdrop-blur-md border-b border-pastelPeach-200/70 transition-all">
      {/* Top vintage notice bar */}
      <div className="bg-espresso-600 text-cream-100 py-1.5 px-4 text-center text-xs tracking-wider flex items-center justify-center gap-2 font-sans font-medium">
        <Sparkles className="w-3.5 h-3.5 text-butterYellow-300 animate-pulse" />
        <span>
          A Little Escape in Every Cup • Use code <strong className="text-butterYellow-200 underline">FIRSTMIST</strong> for 15% off your first order!
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div onClick={() => handleNavClick('home')}>
            <BrandLogo variant="horizontal" size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map(link => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-dustyPink-300 text-espresso-700 shadow-soft-sm font-bold'
                      : 'text-cocoaBrown-600 hover:text-espresso-700 hover:bg-cream-200/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Basket */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Admin Switcher pill */}
            <button
              onClick={() => {
                if (currentPage === 'admin') {
                  handleNavClick('home');
                } else {
                  handleNavClick('admin');
                }
              }}
              title="Admin Cafe Management Dashboard"
              className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 transition-all border ${
                currentPage === 'admin'
                  ? 'bg-espresso-600 text-white border-espresso-700 shadow-soft-sm'
                  : 'bg-cream-200/70 text-cocoaBrown-500 border-pastelPeach-300 hover:bg-pastelPeach-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Table Reservation Button */}
            <button
              onClick={() => handleNavClick('reservations')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-pastelPeach-300 hover:border-cocoaBrown-400 bg-white/60 text-xs font-medium text-espresso-600 transition-colors shadow-soft-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-cocoaBrown-500" />
              <span>Reserve Table</span>
            </button>

            {/* Basket Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 font-medium text-xs transition-all shadow-soft"
              aria-label="View basket"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Basket</span>
              {totalItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-butterYellow-300 text-espresso-800 text-[11px] font-bold flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-espresso-600 hover:bg-cream-200 transition-colors"
              aria-label="Open mobile navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-cream-50/98 border-b border-pastelPeach-200 px-5 pt-3 pb-6 shadow-xl space-y-2">
          {navLinks.map(link => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-dustyPink-300 text-espresso-700 font-bold'
                    : 'text-espresso-600 hover:bg-cream-200'
                }`}
              >
                <span>{link.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-espresso-600" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-pastelPeach-200 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('reservations')}
              className="w-full py-2.5 px-4 rounded-xl border border-pastelPeach-300 bg-white text-xs font-semibold text-espresso-600 text-center"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-2.5 px-4 rounded-xl bg-cocoaBrown-500 text-cream-50 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Cafe Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
