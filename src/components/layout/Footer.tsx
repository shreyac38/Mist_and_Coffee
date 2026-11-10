import React, { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { MapPin, Phone, Clock, Mail, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="bg-espresso-900 text-cream-100 pt-16 pb-10 border-t border-espresso-800 relative overflow-hidden">
      {/* Subtle background mist gradient */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cocoaBrown-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-dustyPink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-espresso-800">
          {/* Brand & Story Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div onClick={() => onNavigate('home')}>
              <BrandLogo variant="horizontal" size="md" inverted={true} />
            </div>

            <p className="text-cream-300/80 text-xs leading-relaxed max-w-sm pt-2 font-sans">
              A cozy sanctuary where artisanal single-estate beans, slow morning pours, and handcrafted bakes come together. Made for dreamers, thinkers, and slow sippers.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-dustyPink-200">
              <span className="w-2 h-2 rounded-full bg-sageGreen-400 animate-ping" />
              <span>Slow brew bar open daily • 9:00 AM – 9:00 PM</span>
            </div>

            {/* Emblem stamp badge */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-espresso-800/80 border border-espresso-700 text-[11px] text-cream-200">
                <Sparkles className="w-3.5 h-3.5 text-butterYellow-300" />
                <span>100% Ethical Chikmagalur &amp; Wayanad Arabica</span>
              </div>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-bold text-cream-50 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80 font-medium">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-butterYellow-200 transition-colors"
                >
                  Full Cafe Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reservations')}
                  className="hover:text-butterYellow-200 transition-colors"
                >
                  Book a Table
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('loyalty')}
                  className="hover:text-butterYellow-200 transition-colors"
                >
                  Mist Moments Rewards
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tracking')}
                  className="hover:text-butterYellow-200 transition-colors"
                >
                  Track Your Order
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-butterYellow-200 transition-colors"
                >
                  Our Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Cafe Location & Hours (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-cream-50 tracking-wide">
              Visit The Cafe
            </h4>
            <div className="space-y-2.5 text-xs text-cream-300/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pastelPeach-300 flex-shrink-0 mt-0.5" />
                <span>
                  14th Main Rd, 100ft Corner, Indiranagar, Bengaluru, Karnataka 560038
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-pastelPeach-300 flex-shrink-0" />
                <span>+91 98450 12389</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-pastelPeach-300 flex-shrink-0" />
                <span>9:00 AM – 9:00 PM (Monday – Sunday)</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-pastelPeach-300 flex-shrink-0" />
                <span>hello@mistandcoffee.com</span>
              </p>
            </div>
          </div>

          {/* Newsletter & Community (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-cream-50 tracking-wide">
              The Morning Gazette
            </h4>
            <p className="text-xs text-cream-300/70 leading-relaxed">
              Subscribe for micro-lot roast drops, secret seasonal menu passes, and curated reading lists.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Your favorite email address..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-espresso-800 border border-espresso-700 text-cream-100 placeholder-cream-300/40 focus:outline-none focus:border-dustyPink-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-dustyPink-400 hover:bg-dustyPink-500 text-espresso-900 font-semibold text-xs tracking-wide transition-colors"
              >
                Join the Circle
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-sageGreen-300 flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sageGreen-400" />
                <span>Welcome to the morning circle! Check your inbox soon.</span>
              </p>
            )}

            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-cream-300/60 font-sans">Connect:</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-espresso-800 hover:bg-espresso-700 flex items-center justify-center text-cream-200 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <span className="text-xs text-dustyPink-300 font-handwriting text-base">@mistandcoffee</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-300/60 gap-4">
          <p>© {new Date().getFullYear()} Mist and Coffee Speciality Roastery. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-dustyPink-400 fill-dustyPink-400 inline" /> for slow coffee lovers
            </span>
            <span>•</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-cream-300/40 hover:text-cream-200 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
