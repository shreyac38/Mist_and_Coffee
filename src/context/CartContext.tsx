import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    customization?: {
      selectedMilk?: string;
      selectedSweetness?: string;
      selectedTemperature?: 'Hot' | 'Iced';
      selectedIce?: string;
      extraShots?: number;
      specialNote?: string;
      quantity?: number;
    }
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  appliedPromoCode: string | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  grandTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'mist_cart_items_v1';
const PROMO_STORAGE_KEY = 'mist_applied_promo_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(() => {
    return localStorage.getItem(PROMO_STORAGE_KEY) || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to storage', e);
    }
  }, [cart]);

  useEffect(() => {
    if (appliedPromoCode) {
      localStorage.setItem(PROMO_STORAGE_KEY, appliedPromoCode);
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  }, [appliedPromoCode]);

  const addToCart = (
    product: Product,
    customization?: {
      selectedMilk?: string;
      selectedSweetness?: string;
      selectedTemperature?: 'Hot' | 'Iced';
      selectedIce?: string;
      extraShots?: number;
      specialNote?: string;
      quantity?: number;
    }
  ) => {
    const qty = customization?.quantity || 1;
    const milk = customization?.selectedMilk || (product.options.milks.length > 0 ? product.options.milks[0] : undefined);
    const sweetness = customization?.selectedSweetness || (product.options.sweetnessLevels.length > 0 ? product.options.sweetnessLevels[0] : undefined);
    const temp = customization?.selectedTemperature || (product.options.temperatures.length > 0 ? product.options.temperatures[0] : undefined);
    const ice = customization?.selectedIce;
    const extraShots = customization?.extraShots || 0;
    const specialNote = customization?.specialNote;

    // Calculate milk surcharge
    let milkSurcharge = 0;
    if (milk && milk.includes('+₹')) {
      const match = milk.match(/\+₹(\d+)/);
      if (match) milkSurcharge = parseInt(match[1], 10);
    }

    const shotCost = extraShots * 40; // ₹40 per extra espresso shot
    const itemPrice = product.price + milkSurcharge + shotCost;

    // Find if identical customized item exists
    const existingIndex = cart.findIndex(
      item =>
        item.product.id === product.id &&
        item.selectedMilk === milk &&
        item.selectedSweetness === sweetness &&
        item.selectedTemperature === temp &&
        item.selectedIce === ice &&
        item.extraShots === extraShots
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      const newQty = updated[existingIndex].quantity + qty;
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        lineTotal: itemPrice * newQty,
      };
      setCart(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        product,
        quantity: qty,
        selectedMilk: milk,
        selectedSweetness: sweetness,
        selectedTemperature: temp,
        selectedIce: ice,
        extraShots,
        specialNote,
        itemPrice,
        lineTotal: itemPrice * qty,
      };
      setCart(prev => [newItem, ...prev]);
    }

    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              lineTotal: item.itemPrice * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromoCode(null);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  // Delivery fee: ₹40, or free if subtotal >= 500
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 40;

  // Promo code calculation
  let discount = 0;
  if (appliedPromoCode) {
    const code = appliedPromoCode.toUpperCase();
    if (code === 'FIRSTMIST') {
      discount = Math.round(subtotal * 0.15); // 15% off first order
    } else if (code === 'COZY50') {
      discount = Math.min(subtotal, 50); // Flat ₹50 off
    } else if (code === 'MISTMOMENTS') {
      discount = Math.round(subtotal * 0.20); // 20% loyalty reward
    } else if (code.startsWith('REWARD-')) {
      discount = 100; // Generic voucher
    }
  }

  // Tax: 5% GST
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05 * 100) / 100;

  const grandTotal = Math.max(0, taxableAmount + deliveryFee + tax);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a promo code.' };

    if (clean === 'FIRSTMIST') {
      setAppliedPromoCode('FIRSTMIST');
      return { success: true, message: 'FIRSTMIST applied! 15% discount activated.' };
    }
    if (clean === 'COZY50') {
      if (subtotal < 250) {
        return { success: false, message: 'COZY50 requires a minimum order of ₹250.' };
      }
      setAppliedPromoCode('COZY50');
      return { success: true, message: 'COZY50 applied! ₹50 off your order.' };
    }
    if (clean === 'MISTMOMENTS') {
      setAppliedPromoCode('MISTMOMENTS');
      return { success: true, message: 'Mist Moments 20% Loyalty perk applied!' };
    }

    return { success: false, message: 'Invalid or expired promo code.' };
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        appliedPromoCode,
        applyPromoCode,
        removePromoCode,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
