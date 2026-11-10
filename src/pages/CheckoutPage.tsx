import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { DataService } from '../services/dataService';
import { Order, OrderType, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Truck,
  Store,
  Utensils
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigateToTracking: (orderId: string) => void;
  onNavigateToMenu: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateToTracking,
  onNavigateToMenu,
}) => {
  const {
    cart,
    subtotal,
    discount,
    deliveryFee,
    tax,
    grandTotal,
    clearCart,
    appliedPromoCode,
  } = useCart();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [preferredTime, setPreferredTime] = useState('As soon as possible (20-30 mins)');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-pastelPeach-100 flex items-center justify-center mx-auto text-cocoaBrown-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif font-bold text-3xl text-espresso-600">Your basket is empty</h2>
        <p className="text-xs sm:text-sm text-cocoaBrown-500">
          Add some single-estate brews or artisan pastries before proceeding to checkout.
        </p>
        <button
          onClick={onNavigateToMenu}
          className="px-6 py-3 rounded-full bg-espresso-600 text-cream-50 font-medium text-xs shadow-soft"
        >
          Explore Menu
        </button>
      </div>
    );
  }

  const calculatedDeliveryFee = orderType === 'delivery' ? deliveryFee : 0;
  const finalPayable = Math.max(0, subtotal - discount + calculatedDeliveryFee + tax);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide a complete delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique order ID: MIST-XXXX
      const randomFour = Math.floor(1000 + Math.random() * 9000);
      const orderId = `MIST-${randomFour}`;

      const newOrder: Order = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        preferredTime,
        specialInstructions: specialInstructions.trim() || undefined,
        items: [...cart],
        subtotal,
        discount,
        deliveryFee: calculatedDeliveryFee,
        tax,
        total: finalPayable,
        paymentMethod,
        status: 'received',
        estimatedMinutes: orderType === 'delivery' ? 30 : 15,
        createdAt: new Date().toISOString(),
      };

      await DataService.createOrder(newOrder);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFF8F0', '#EBCBCB', '#F4D6C6', '#C8D5C0', '#F5E7B2', '#795548'],
        });
      } catch (e) {
        // Confetti is decorative
      }

      clearCart();
      setIsSubmitting(false);

      // Redirect to tracking page
      onNavigateToTracking(orderId);
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage('Could not place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
          Fast &amp; Fresh
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
          Complete Your Order
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500 mt-1">
          Review your slow bar items and choose how you would like to receive them.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Customer & Delivery Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Order Type Selection */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-3">
            <h3 className="font-serif font-bold text-lg text-espresso-600">
              1. Choose Order Type
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  orderType === 'delivery'
                    ? 'bg-espresso-600 text-cream-50 border-espresso-600 shadow-soft-sm'
                    : 'bg-white border-pastelPeach-200 text-espresso-600 hover:bg-cream-100'
                }`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs font-semibold">Doorstep Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  orderType === 'pickup'
                    ? 'bg-espresso-600 text-cream-50 border-espresso-600 shadow-soft-sm'
                    : 'bg-white border-pastelPeach-200 text-espresso-600 hover:bg-cream-100'
                }`}
              >
                <Store className="w-5 h-5" />
                <span className="text-xs font-semibold">Self Pickup</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  orderType === 'dine-in'
                    ? 'bg-espresso-600 text-cream-50 border-espresso-600 shadow-soft-sm'
                    : 'bg-white border-pastelPeach-200 text-espresso-600 hover:bg-cream-100'
                }`}
              >
                <Utensils className="w-5 h-5" />
                <span className="text-xs font-semibold">Dine-in Order</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Contact */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-espresso-600">
              2. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-espresso-600 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-600 block mb-1">
                  Phone Number (for SMS Tracking &amp; Loyalty) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-espresso-600 block mb-1">
                Email Address (optional, for digital receipt)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="e.g. maya@example.com"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />
            </div>
          </div>

          {/* 3. Address & Timing */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-espresso-600">
              3. {orderType === 'delivery' ? 'Delivery Details' : orderType === 'pickup' ? 'Pickup Details' : 'Table Details'}
            </h3>

            {orderType === 'delivery' && (
              <div>
                <label className="text-xs font-semibold text-espresso-600 block mb-1">
                  Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Apartment / Flat number, Building name, Street, Indiranagar..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-espresso-600 block mb-1">
                {orderType === 'delivery' ? 'Preferred Delivery Time' : orderType === 'pickup' ? 'Preferred Pickup Time' : 'Table Number'}
              </label>
              <input
                type="text"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                placeholder={orderType === 'dine-in' ? 'e.g. Table #3' : 'e.g. In 20 minutes'}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-espresso-600 block mb-1">
                Special Instructions for Barista or Delivery
              </label>
              <input
                type="text"
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Ring the bell twice, pack warm croissants separately..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-3">
            <h3 className="font-serif font-bold text-lg text-espresso-600">
              4. Payment Option
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-dustyPink-200/80 border-cocoaBrown-500 shadow-soft-sm'
                    : 'bg-white border-pastelPeach-200 hover:bg-cream-100'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-espresso-600"
                />
                <div>
                  <p className="text-xs font-bold text-espresso-700">Cash on Delivery</p>
                  <p className="text-[11px] text-cocoaBrown-400">Pay cash upon delivery arrival</p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'counter_upi'
                    ? 'bg-dustyPink-200/80 border-cocoaBrown-500 shadow-soft-sm'
                    : 'bg-white border-pastelPeach-200 hover:bg-cream-100'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'counter_upi'}
                  onChange={() => setPaymentMethod('counter_upi')}
                  className="accent-espresso-600"
                />
                <div>
                  <p className="text-xs font-bold text-espresso-700">Pay at Counter / UPI</p>
                  <p className="text-[11px] text-cocoaBrown-400">GPay, PhonePe, Paytm, or Card</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft space-y-4 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-pastelPeach-200">
              <h3 className="font-serif font-bold text-xl text-espresso-600">
                Order Summary
              </h3>
              <span className="text-xs text-cocoaBrown-400 font-medium">
                {cart.length} items
              </span>
            </div>

            {/* Item list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start text-xs gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-espresso-700">
                      {item.quantity}x {item.product.name}
                    </p>
                    <div className="text-[11px] text-cocoaBrown-400 space-x-1">
                      {item.selectedTemperature && <span>[{item.selectedTemperature}]</span>}
                      {item.selectedMilk && <span>• {item.selectedMilk}</span>}
                      {item.selectedSweetness && <span>• {item.selectedSweetness}</span>}
                    </div>
                  </div>
                  <span className="font-serif font-bold text-espresso-600">
                    ₹{item.lineTotal}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-pastelPeach-200 space-y-2 text-xs text-cocoaBrown-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-espresso-600">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Code ({appliedPromoCode})</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {orderType !== 'delivery' ? (
                    <span className="text-cocoaBrown-400">N/A</span>
                  ) : calculatedDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    `₹${calculatedDeliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-cocoaBrown-400">
                <span>GST (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="pt-3 border-t border-cream-300 flex justify-between items-center text-lg font-serif font-bold text-espresso-600">
                <span>Total Amount</span>
                <span>₹{finalPayable}</span>
              </div>
            </div>

            {/* Loyalty points preview */}
            <div className="p-3 rounded-2xl bg-butterYellow-100/70 border border-butterYellow-200 text-xs text-cocoaBrown-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-butterYellow-600 flex-shrink-0" />
              <span>
                You will earn <strong className="text-espresso-700">{Math.floor(finalPayable / 10)} Mist Moments points</strong> on this order!
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-full bg-espresso-600 hover:bg-espresso-700 disabled:opacity-60 text-cream-50 font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-soft-lg"
            >
              {isSubmitting ? (
                <span>Brewing your order...</span>
              ) : (
                <span>Confirm &amp; Place Order (₹{finalPayable})</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
