import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { LoyaltyAccount, RewardVoucher, LoyaltyTier } from '../types';
import { BrandLogo } from '../components/brand/BrandLogo';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Award, 
  Gift, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Coffee, 
  Croissant, 
  Star,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const LoyaltyPage: React.FC = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const [activeAccount, setActiveAccount] = useState<LoyaltyAccount | null>(null);
  const [rewards, setRewards] = useState<RewardVoucher[]>([]);
  const [actionNotice, setActionNotice] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    // Load available rewards
    DataService.getRewards().then(setRewards);
    // Auto-load sample account for immediate rich preview
    DataService.getLoyaltyAccountByPhone('+91 98765 43210').then(acc => {
      if (acc) setActiveAccount(acc);
    });
  }, []);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);
    if (!phoneInput.trim()) return;

    const acc = await DataService.getLoyaltyAccountByPhone(phoneInput);
    if (acc) {
      setActiveAccount(acc);
    } else {
      setIsRegistering(true);
      setActionNotice({
        text: 'No account found with this phone number. Complete the quick form below to earn 50 Welcome Points!',
        isError: false,
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);

    if (!nameInput.trim() || !phoneInput.trim()) {
      setActionNotice({ text: 'Name and phone number are required.', isError: true });
      return;
    }

    const acc = await DataService.registerLoyaltyAccount(nameInput, phoneInput, emailInput);
    setActiveAccount(acc);
    setIsRegistering(false);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5E7B2', '#EBCBCB', '#F4D6C6', '#795548'],
      });
    } catch (e) {}

    setActionNotice({
      text: 'Welcome to Mist Moments! 50 bonus points have been added to your card.',
      isError: false,
    });
  };

  const handleRedeem = async (reward: RewardVoucher) => {
    if (!activeAccount) {
      setActionNotice({ text: 'Please sign in with your phone number first.', isError: true });
      return;
    }

    const res = await DataService.redeemLoyaltyPoints(
      activeAccount.customerPhone,
      reward.pointsCost,
      reward.title
    );

    if (res.success && res.account) {
      setActiveAccount(res.account);
      try {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
        });
      } catch (e) {}
      setActionNotice({ text: res.message, isError: false });
    } else {
      setActionNotice({ text: res.message, isError: true });
    }
  };

  const getTierProgress = (tier: LoyaltyTier, lifetime: number) => {
    if (tier === 'Mist Insider') return { next: 'Top Tier Reached', progress: 100 };
    if (tier === 'Coffee Lover') {
      const remaining = Math.max(0, 600 - lifetime);
      const pct = Math.min(100, Math.round(((lifetime - 200) / 400) * 100));
      return { next: `${remaining} pts to Mist Insider`, progress: pct };
    }
    const remaining = Math.max(0, 200 - lifetime);
    const pct = Math.min(100, Math.round((lifetime / 200) * 100));
    return { next: `${remaining} pts to Coffee Lover`, progress: pct };
  };

  const tierInfo = activeAccount ? getTierProgress(activeAccount.tier, activeAccount.lifetimePoints) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pastelPeach-200 border border-pastelPeach-300 text-espresso-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-butterYellow-600" />
          <span>Mist Moments Rewards</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso-600">
          Sip. Earn. Delight.
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500 leading-relaxed font-sans">
          Our way of sharing gratitude for every morning you spend in our cozy sanctuary. Earn points on all brews and baked goods.
        </p>
      </div>

      {actionNotice && (
        <div
          className={`p-4 rounded-2xl max-w-xl mx-auto text-xs flex items-center gap-2.5 ${
            actionNotice.isError
              ? 'bg-rose-50 border border-rose-200 text-rose-800'
              : 'bg-sageGreen-100 border border-sageGreen-200 text-sageGreen-800'
          }`}
        >
          {actionNotice.isError ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          )}
          <span>{actionNotice.text}</span>
        </div>
      )}

      {/* Account Lookup / Register Section */}
      {!activeAccount ? (
        <div className="max-w-md mx-auto bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft">
          {!isRegistering ? (
            <form onSubmit={handleLookup} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-espresso-700 text-center">
                Check Your Moments Balance
              </h3>
              <p className="text-xs text-cocoaBrown-500 text-center">
                Enter your mobile number to view points or redeem rewards.
              </p>

              <div>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500 text-center font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-semibold transition-all shadow-soft"
              >
                Find My Membership
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-xs text-cocoaBrown-500 hover:text-espresso-700 underline"
                >
                  New guest? Register here for 50 free points
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-espresso-700 text-center">
                Join Mist Moments
              </h3>
              <p className="text-xs text-cocoaBrown-500 text-center">
                Instantly receive 50 welcome points towards your first free drink or bake.
              </p>

              <input
                type="text"
                required
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Full Name *"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />

              <input
                type="tel"
                required
                value={phoneInput}
                onChange={e => setPhoneInput(e.target.value)}
                placeholder="Phone Number *"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />

              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="Email Address (optional)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-semibold transition-all shadow-soft"
              >
                Claim 50 Welcome Points
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs text-cocoaBrown-400 hover:underline"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Active Account View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Digital Card & Tier Stats (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Membership Card */}
            <div className="rounded-3xl bg-gradient-to-br from-espresso-800 to-espresso-950 text-cream-50 p-6 sm:p-7 shadow-2xl border-2 border-dustyPink-300/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-dustyPink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-8">
                <BrandLogo variant="minimal" size="sm" />
                <span className="text-[10px] tracking-widest uppercase font-mono px-3 py-1 rounded-full bg-espresso-700 border border-espresso-600 text-butterYellow-300">
                  {activeAccount.tier}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-[10px] text-cream-300/70 uppercase tracking-widest">
                  Available Balance
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-bold text-4xl text-butterYellow-200">
                    {activeAccount.currentPoints}
                  </span>
                  <span className="text-sm font-sans text-cream-200">Points</span>
                </div>
              </div>

              {/* Progress bar to next tier */}
              {tierInfo && (
                <div className="mb-6 bg-espresso-900/60 p-3 rounded-2xl border border-espresso-700">
                  <div className="flex justify-between text-[11px] mb-1.5 text-cream-200">
                    <span>{activeAccount.tier}</span>
                    <span className="text-butterYellow-300">{tierInfo.next}</span>
                  </div>
                  <div className="w-full bg-espresso-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-dustyPink-300 to-butterYellow-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${tierInfo.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-espresso-700/80 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-cream-300/60 uppercase">Member Name</p>
                  <p className="font-serif font-bold text-sm text-cream-50">{activeAccount.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-cream-300/60 uppercase">Registered Mobile</p>
                  <p className="font-mono text-xs text-cream-300">{activeAccount.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-cocoaBrown-400">
                Lifetime Earned: <strong>{activeAccount.lifetimePoints} pts</strong>
              </span>
              <button
                onClick={() => setActiveAccount(null)}
                className="text-xs text-cocoaBrown-500 hover:text-espresso-800 underline"
              >
                Switch Account
              </button>
            </div>

            {/* Transaction Activity Log */}
            <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-4">
              <h4 className="font-serif font-bold text-base text-espresso-700">
                Recent Moments Activity
              </h4>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activeAccount.transactions.map(tx => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between text-xs border-b border-cream-200 pb-2.5"
                  >
                    <div>
                      <p className="font-semibold text-espresso-700">{tx.description}</p>
                      <p className="text-[10px] text-cocoaBrown-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`font-mono font-bold text-xs ${
                        tx.points > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Available Rewards Catalogue (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
                Rewards Catalogue
              </span>
              <h3 className="font-serif font-bold text-2xl text-espresso-700">
                Redeem Your Points
              </h3>
              <p className="text-xs text-cocoaBrown-500 mt-0.5">
                Redeem instantly for free drinks, artisan pastries, or percentage vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map(reward => {
                const canAfford = (activeAccount.currentPoints || 0) >= reward.pointsCost;

                return (
                  <div
                    key={reward.id}
                    className="bg-cream-50 p-5 rounded-3xl border border-pastelPeach-200 shadow-soft-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-2xl bg-dustyPink-100 text-espresso-700 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-cocoaBrown-600" />
                        </div>
                        <span className="font-serif font-bold text-base text-espresso-700 bg-white px-2.5 py-1 rounded-xl border border-pastelPeach-200 shadow-soft-sm">
                          {reward.pointsCost} pts
                        </span>
                      </div>

                      <h4 className="font-serif font-bold text-base text-espresso-700 mb-1">
                        {reward.title}
                      </h4>
                      <p className="text-xs text-cocoaBrown-500 leading-relaxed mb-4">
                        {reward.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-cream-200">
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold transition-all ${
                          canAfford
                            ? 'bg-espresso-600 hover:bg-espresso-700 text-cream-50 shadow-soft'
                            : 'bg-cream-200 text-cocoaBrown-400 cursor-not-allowed opacity-75'
                        }`}
                      >
                        {canAfford ? 'Redeem Voucher' : `Need ${reward.pointsCost - activeAccount.currentPoints} more pts`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tiers Explanation Grid */}
      <div className="bg-cream-50 p-8 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="font-serif font-bold text-2xl text-espresso-700">
            Membership Tiers &amp; Privileges
          </h3>
          <p className="text-xs text-cocoaBrown-500 mt-1">
            Grow your status with every coffee date.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 border border-pastelPeach-200 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cocoaBrown-400">
              0 – 200 Points
            </span>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              🌱 Little Sipper
            </h4>
            <ul className="text-xs text-cocoaBrown-500 space-y-1.5 list-disc pl-4">
              <li>50 Welcome points on signup</li>
              <li>Earn 1 point per ₹10 spent</li>
              <li>Free Birthday beverage coupon</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-dustyPink-100/60 border border-dustyPink-200 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cocoaBrown-400">
              201 – 600 Points
            </span>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              ☕ Coffee Lover
            </h4>
            <ul className="text-xs text-cocoaBrown-600 space-y-1.5 list-disc pl-4">
              <li>All Little Sipper privileges</li>
              <li>1.25x point multiplier on weekends</li>
              <li>Early access to seasonal single-origin roasts</li>
              <li>Complimentary milk upgrades (Oat/Almond)</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-butterYellow-100/60 border border-butterYellow-200 space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-cocoaBrown-400">
              601+ Points
            </span>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              ✨ Mist Insider
            </h4>
            <ul className="text-xs text-cocoaBrown-600 space-y-1.5 list-disc pl-4">
              <li>All Coffee Lover privileges</li>
              <li>Permanent 10% discount on all food &amp; beans</li>
              <li>Priority table reservation holds</li>
              <li>Invites to private cupping &amp; tasting evenings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
