import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Sparkles, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onNavigateToMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onNavigateToCheckout,
  onNavigateToMenu,
}) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
    grandTotal,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoInput('');
    }
  };

  const freeDeliveryTarget = 500;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryTarget - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryTarget) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col border-l border-pastelPeach-200">
          {/* Header */}
          <div className="p-5 border-b border-pastelPeach-200/80 bg-cream-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-dustyPink-200 flex items-center justify-center text-espresso-600">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-espresso-600">Your Basket</h2>
                <p className="text-xs text-cocoaBrown-400">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in your slow bar bag
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-cocoaBrown-400 hover:text-red-500 underline transition-colors px-1"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 text-espresso-600 flex items-center justify-center transition-colors"
                aria-label="Close basket"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free delivery bar */}
          {cart.length > 0 && (
            <div className="px-5 py-3 bg-pastelPeach-50 border-b border-pastelPeach-200/60">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-espresso-600">
                  <Sparkles className="w-3.5 h-3.5 text-butterYellow-500" />
                  {remainingForFreeDelivery === 0 ? (
                    <span className="text-emerald-700 font-semibold">You unlocked FREE Doorstep Delivery!</span>
                  ) : (
                    <span>Add ₹{remainingForFreeDelivery} more for FREE delivery</span>
                  )}
                </span>
                <span className="text-cocoaBrown-500 text-[11px]">{freeDeliveryPercent}%</span>
              </div>
              <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pastelPeach-400 to-sageGreen-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 rounded-full bg-dustyPink-100 flex items-center justify-center mb-4 text-cocoaBrown-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-espresso-600 mb-2">
                  Your cup is empty
                </h3>
                <p className="text-sm text-cocoaBrown-400 max-w-xs mb-6">
                  Fill it with artisanal single-origin brews, cloud lattes, or warm flaky croissants.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToMenu();
                  }}
                  className="px-6 py-3 rounded-full bg-espresso-600 text-cream-50 font-medium text-sm hover:bg-espresso-700 transition-all shadow-soft"
                >
                  Explore Cafe Menu
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/80 border border-pastelPeach-200/60 shadow-soft-sm flex gap-3 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-xl flex-shrink-0"
                    style={{ width: '72px', height: '72px' }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-base text-espresso-600 truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-cocoaBrown-300 hover:text-red-500 p-1 -mr-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 my-1 text-[11px] text-cocoaBrown-500">
                      {item.selectedTemperature && (
                        <span className="px-2 py-0.5 rounded-md bg-cream-200 font-medium text-espresso-600">
                          {item.selectedTemperature}
                        </span>
                      )}
                      {item.selectedMilk && (
                        <span className="px-2 py-0.5 rounded-md bg-sageGreen-100 text-sageGreen-700">
                          {item.selectedMilk}
                        </span>
                      )}
                      {item.selectedSweetness && (
                        <span className="px-2 py-0.5 rounded-md bg-dustyPink-100 text-cocoaBrown-600">
                          {item.selectedSweetness}
                        </span>
                      )}
                      {item.extraShots > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-butterYellow-100 text-cocoaBrown-700">
                          +{item.extraShots} Shot
                        </span>
                      )}
                    </div>

                    {item.specialNote && (
                      <p className="text-[11px] text-cocoaBrown-400 italic mb-1.5 truncate">
                        Note: "{item.specialNote}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-cream-200">
                      <div className="flex items-center border border-pastelPeach-200 rounded-full bg-cream-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-espresso-600 hover:bg-pastelPeach-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 text-espresso-600">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center text-espresso-600 hover:bg-pastelPeach-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif font-bold text-espresso-600 text-base">
                        ₹{item.lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-pastelPeach-200/80 bg-cream-100/90 space-y-3.5">
              {/* Promo code input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-cocoaBrown-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={e => {
                      setPromoInput(e.target.value);
                      setPromoMsg(null);
                    }}
                    placeholder="Try 'FIRSTMIST' or 'COZY50'"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-pastelPeach-300 bg-white placeholder-cocoaBrown-300 focus:outline-none focus:ring-1 focus:ring-espresso-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-cocoaBrown-500 text-white text-xs font-medium hover:bg-cocoaBrown-600 transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoMsg && (
                <p className={`text-xs ${promoMsg.isError ? 'text-rose-600' : 'text-emerald-700 font-medium'}`}>
                  {promoMsg.text}
                </p>
              )}

              {appliedPromoCode && (
                <div className="flex items-center justify-between text-xs bg-sageGreen-100/80 text-sageGreen-800 px-3 py-1.5 rounded-lg border border-sageGreen-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-sageGreen-600" />
                    Code <strong>{appliedPromoCode}</strong> applied (-₹{discount})
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-cocoaBrown-600 border-t border-cream-200 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso-600">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-medium">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-[11px] text-cocoaBrown-400">
                  <span>Taxes (5% GST)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-espresso-600 pt-1.5 border-t border-cream-300">
                  <span>Total Amount</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full py-3.5 px-5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-soft group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
