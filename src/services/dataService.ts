import { 
  Product, 
  Category, 
  Order, 
  Reservation, 
  LoyaltyAccount, 
  RewardVoucher, 
  BusinessSettings, 
  ContactMessage,
  LoyaltyTier,
  OrderStatus,
  ReservationStatus
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_REWARDS, 
  INITIAL_SETTINGS, 
  INITIAL_LOYALTY_ACCOUNTS 
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  CATEGORIES: 'mist_categories_v1',
  PRODUCTS: 'mist_products_v1',
  ORDERS: 'mist_orders_v1',
  RESERVATIONS: 'mist_reservations_v1',
  LOYALTY: 'mist_loyalty_v1',
  REWARDS: 'mist_rewards_v1',
  SETTINGS: 'mist_settings_v1',
  CONTACTS: 'mist_contacts_v1',
};

function getStorage<T>(key: string, defaultVal: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(val);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return defaultVal;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
}

export const DataService = {
  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            slug: d.slug,
            description: d.description || '',
            iconName: d.icon_name || 'Coffee',
            displayOrder: d.display_order || 0,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch categories fallback:', err);
      }
    }
    return getStorage<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            categoryId: d.category_id,
            name: d.name,
            description: d.description,
            price: Number(d.price),
            image: d.image,
            isVegetarian: d.is_vegetarian ?? true,
            isVegan: d.is_vegan ?? false,
            isGlutenFree: d.is_gluten_free ?? false,
            isBestSeller: d.is_best_seller ?? false,
            isSignature: d.is_signature ?? false,
            isAvailable: d.is_available ?? true,
            rating: Number(d.rating || 4.8),
            reviewsCount: Number(d.reviews_count || 10),
            origin: d.origin,
            roastLevel: d.roast_level,
            tastingNotes: d.tasting_notes || [],
            options: {
              milks: d.available_milks || ['Whole Milk', 'Oat Milk (+₹45)', 'Almond Milk (+₹45)'],
              sweetnessLevels: d.available_sweetness || ['Unsweetened', 'Subtle (25%)', 'Standard (50%)'],
              temperatures: d.available_temperatures || ['Hot', 'Iced'],
              iceLevels: ['Standard Ice', 'Less Ice', 'No Ice'],
              extraShotAvailable: true,
            },
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch products fallback:', err);
      }
    }
    return getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async saveProduct(product: Product): Promise<Product> {
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === product.id);
    let updatedProducts: Product[];
    if (index >= 0) {
      updatedProducts = [...products];
      updatedProducts[index] = product;
    } else {
      updatedProducts = [product, ...products];
    }
    setStorage(STORAGE_KEYS.PRODUCTS, updatedProducts);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').upsert({
          id: product.id,
          category_id: product.categoryId,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          is_vegetarian: product.isVegetarian,
          is_vegan: product.isVegan,
          is_gluten_free: product.isGlutenFree,
          is_best_seller: product.isBestSeller,
          is_signature: product.isSignature,
          is_available: product.isAvailable,
          rating: product.rating,
          reviews_count: product.reviewsCount,
          origin: product.origin,
          roast_level: product.roastLevel,
          tasting_notes: product.tastingNotes,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Supabase product save error:', err);
      }
    }

    return product;
  },

  async deleteProduct(productId: string): Promise<boolean> {
    const products = getStorage<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = products.filter(p => p.id !== productId);
    setStorage(STORAGE_KEYS.PRODUCTS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').delete().eq('id', productId);
      } catch (err) {
        console.error('Supabase product delete error:', err);
      }
    }
    return true;
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            customerName: d.customer_name,
            customerPhone: d.customer_phone,
            customerEmail: d.customer_email,
            orderType: d.order_type,
            deliveryAddress: d.delivery_address,
            preferredTime: d.preferred_time,
            specialInstructions: d.special_instructions,
            items: d.items,
            subtotal: Number(d.subtotal),
            discount: Number(d.discount || 0),
            deliveryFee: Number(d.delivery_fee || 0),
            tax: Number(d.tax || 0),
            total: Number(d.total),
            paymentMethod: d.payment_method,
            status: d.status,
            estimatedMinutes: d.estimated_minutes,
            createdAt: d.created_at,
            updatedAt: d.updated_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch orders fallback:', err);
      }
    }
    return getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(o => o.id.toUpperCase() === cleanId) || null;
  },

  async createOrder(order: Order): Promise<Order> {
    const orders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = [order, ...orders];
    setStorage(STORAGE_KEYS.ORDERS, updated);

    // Also credit loyalty points automatically if customer has phone
    if (order.customerPhone) {
      const earnedPoints = Math.floor(order.total / 10);
      if (earnedPoints > 0) {
        await this.addLoyaltyPoints(
          order.customerPhone,
          order.customerName,
          order.customerEmail,
          earnedPoints,
          `Earned points for order #${order.id}`,
          order.id
        );
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').insert({
          id: order.id,
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          customer_email: order.customerEmail,
          order_type: order.orderType,
          delivery_address: order.deliveryAddress,
          preferred_time: order.preferredTime,
          special_instructions: order.specialInstructions,
          items: order.items,
          subtotal: order.subtotal,
          discount: order.discount,
          delivery_fee: order.deliveryFee,
          tax: order.tax,
          total: order.total,
          payment_method: order.paymentMethod,
          status: order.status,
          estimated_minutes: order.estimatedMinutes,
          created_at: order.createdAt,
        });
      } catch (err) {
        console.error('Supabase order insert error:', err);
      }
    }

    return order;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
    const orders = getStorage<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const updated = orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
    setStorage(STORAGE_KEYS.ORDERS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('orders').update({
          status,
          updated_at: new Date().toISOString(),
        }).eq('id', orderId);
      } catch (err) {
        console.error('Supabase order status error:', err);
      }
    }
    return true;
  },

  // --- RESERVATIONS ---
  async getReservations(): Promise<Reservation[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('date', { ascending: true });
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            customerName: d.customer_name,
            customerPhone: d.customer_phone,
            customerEmail: d.customer_email,
            date: d.date,
            timeSlot: d.time_slot,
            guests: d.guests,
            seatingPreference: d.seating_preference,
            specialRequests: d.special_requests,
            status: d.status,
            createdAt: d.created_at,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch reservations fallback:', err);
      }
    }
    return getStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
  },

  async createReservation(reservation: Reservation): Promise<Reservation> {
    const list = getStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    const updated = [reservation, ...list];
    setStorage(STORAGE_KEYS.RESERVATIONS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reservations').insert({
          id: reservation.id,
          customer_name: reservation.customerName,
          customer_phone: reservation.customerPhone,
          customer_email: reservation.customerEmail,
          date: reservation.date,
          time_slot: reservation.timeSlot,
          guests: reservation.guests,
          seating_preference: reservation.seatingPreference,
          special_requests: reservation.specialRequests,
          status: reservation.status,
          created_at: reservation.createdAt,
        });
      } catch (err) {
        console.error('Supabase reservation insert error:', err);
      }
    }
    return reservation;
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
    const list = getStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    const updated = list.map(r => r.id === id ? { ...r, status } : r);
    setStorage(STORAGE_KEYS.RESERVATIONS, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reservations').update({ status }).eq('id', id);
      } catch (err) {
        console.error('Supabase reservation status error:', err);
      }
    }
    return true;
  },

  // --- LOYALTY (MIST MOMENTS) ---
  async getLoyaltyAccountByPhone(phone: string): Promise<LoyaltyAccount | null> {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const accounts = getStorage<LoyaltyAccount[]>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY_ACCOUNTS);
    const match = accounts.find(a => a.customerPhone.replace(/[\s-]/g, '') === cleanPhone);
    return match || null;
  },

  async getAllLoyaltyAccounts(): Promise<LoyaltyAccount[]> {
    return getStorage<LoyaltyAccount[]>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY_ACCOUNTS);
  },

  async registerLoyaltyAccount(name: string, phone: string, email?: string): Promise<LoyaltyAccount> {
    const accounts = getStorage<LoyaltyAccount[]>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY_ACCOUNTS);
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const existing = accounts.find(a => a.customerPhone.replace(/[\s-]/g, '') === cleanPhone);
    if (existing) {
      return existing;
    }

    const newAccount: LoyaltyAccount = {
      id: `loy-${Date.now().toString().slice(-6)}`,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      currentPoints: 50, // Welcome gift 50 points
      lifetimePoints: 50,
      tier: 'Little Sipper',
      createdAt: new Date().toISOString(),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'bonus',
          points: 50,
          description: 'Welcome Bonus: 50 Mist Moments Points!',
        },
      ],
    };

    setStorage(STORAGE_KEYS.LOYALTY, [newAccount, ...accounts]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('loyalty_accounts').insert({
          id: newAccount.id,
          customer_name: newAccount.customerName,
          customer_phone: newAccount.customerPhone,
          customer_email: newAccount.customerEmail,
          current_points: 50,
          lifetime_points: 50,
          tier: 'Little Sipper',
        });
        await supabase.from('loyalty_transactions').insert({
          id: newAccount.transactions[0].id,
          loyalty_account_id: newAccount.id,
          type: 'bonus',
          points: 50,
          description: newAccount.transactions[0].description,
        });
      } catch (err) {
        console.error('Supabase loyalty insert error:', err);
      }
    }

    return newAccount;
  },

  async addLoyaltyPoints(
    phone: string, 
    name: string, 
    email?: string, 
    points: number = 0, 
    description: string = 'Purchased coffee', 
    orderId?: string
  ): Promise<LoyaltyAccount> {
    let account = await this.getLoyaltyAccountByPhone(phone);
    if (!account) {
      account = await this.registerLoyaltyAccount(name, phone, email);
    }

    const accounts = getStorage<LoyaltyAccount[]>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY_ACCOUNTS);
    const newCurrent = (account.currentPoints || 0) + points;
    const newLifetime = (account.lifetimePoints || 0) + points;

    let tier: LoyaltyTier = 'Little Sipper';
    if (newLifetime >= 600) tier = 'Mist Insider';
    else if (newLifetime >= 200) tier = 'Coffee Lover';

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'earned' as const,
      points,
      description,
      orderId,
    };

    const updatedAccount: LoyaltyAccount = {
      ...account,
      currentPoints: newCurrent,
      lifetimePoints: newLifetime,
      tier,
      transactions: [newTx, ...account.transactions],
    };

    const updatedList = accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a);
    setStorage(STORAGE_KEYS.LOYALTY, updatedList);

    return updatedAccount;
  },

  async redeemLoyaltyPoints(phone: string, pointsToRedeem: number, rewardTitle: string): Promise<{ success: boolean; message: string; account?: LoyaltyAccount }> {
    const account = await this.getLoyaltyAccountByPhone(phone);
    if (!account) {
      return { success: false, message: 'No loyalty membership found for this phone number.' };
    }

    if (account.currentPoints < pointsToRedeem) {
      return { 
        success: false, 
        message: `Insufficient points. You have ${account.currentPoints} pts, but ${pointsToRedeem} pts are required.` 
      };
    }

    const accounts = getStorage<LoyaltyAccount[]>(STORAGE_KEYS.LOYALTY, INITIAL_LOYALTY_ACCOUNTS);
    const newCurrent = account.currentPoints - pointsToRedeem;

    const newTx = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      type: 'redeemed' as const,
      points: -pointsToRedeem,
      description: `Redeemed: ${rewardTitle}`,
    };

    const updatedAccount: LoyaltyAccount = {
      ...account,
      currentPoints: newCurrent,
      transactions: [newTx, ...account.transactions],
    };

    const updatedList = accounts.map(a => a.id === updatedAccount.id ? updatedAccount : a);
    setStorage(STORAGE_KEYS.LOYALTY, updatedList);

    return { success: true, message: `Successfully redeemed for ${rewardTitle}!`, account: updatedAccount };
  },

  // --- REWARDS ---
  async getRewards(): Promise<RewardVoucher[]> {
    return getStorage<RewardVoucher[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
  },

  async saveReward(reward: RewardVoucher): Promise<RewardVoucher> {
    const list = getStorage<RewardVoucher[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    const idx = list.findIndex(r => r.id === reward.id);
    let updated: RewardVoucher[];
    if (idx >= 0) {
      updated = [...list];
      updated[idx] = reward;
    } else {
      updated = [reward, ...list];
    }
    setStorage(STORAGE_KEYS.REWARDS, updated);
    return reward;
  },

  async deleteReward(id: string): Promise<boolean> {
    const list = getStorage<RewardVoucher[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS);
    setStorage(STORAGE_KEYS.REWARDS, list.filter(r => r.id !== id));
    return true;
  },

  // --- SETTINGS ---
  async getSettings(): Promise<BusinessSettings> {
    return getStorage<BusinessSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async updateSettings(settings: BusinessSettings): Promise<BusinessSettings> {
    setStorage(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  },

  // --- CONTACT INQUIRIES ---
  async sendContactMessage(name: string, email: string, phone: string, subject: string, message: string): Promise<boolean> {
    const list = getStorage<ContactMessage[]>(STORAGE_KEYS.CONTACTS, []);
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };
    setStorage(STORAGE_KEYS.CONTACTS, [newMsg, ...list]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_messages').insert({
          name,
          email,
          phone,
          subject,
          message,
        });
      } catch (err) {
        console.error('Supabase contact message error:', err);
      }
    }
    return true;
  },

  // Reset to factory seed data
  resetAllData() {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.LOYALTY);
    localStorage.removeItem(STORAGE_KEYS.REWARDS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    window.location.reload();
  }
};
