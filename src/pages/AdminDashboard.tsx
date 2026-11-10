import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { 
  Product, 
  Category, 
  Order, 
  Reservation, 
  LoyaltyAccount, 
  RewardVoucher, 
  BusinessSettings,
  OrderStatus,
  ReservationStatus 
} from '../types';
import { 
  isSupabaseConfigured, 
  supabaseUrl, 
  saveRuntimeSupabaseConfig, 
  clearRuntimeSupabaseConfig 
} from '../services/supabaseClient';
import { 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Award, 
  Settings, 
  Coffee, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Clock, 
  Database, 
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'reservations' | 'loyalty' | 'rewards' | 'settings'>('overview');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<LoyaltyAccount[]>([]);
  const [rewards, setRewards] = useState<RewardVoucher[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  // Menu Edit / Add Modal state
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  // Supabase Runtime credentials inputs
  const [supaUrlInput, setSupaUrlInput] = useState(supabaseUrl);
  const [supaKeyInput, setSupaKeyInput] = useState('');

  const loadAllData = async () => {
    setIsLoading(true);
    const [p, c, o, r, l, rew, s] = await Promise.all([
      DataService.getProducts(),
      DataService.getCategories(),
      DataService.getOrders(),
      DataService.getReservations(),
      DataService.getAllLoyaltyAccounts(),
      DataService.getRewards(),
      DataService.getSettings(),
    ]);

    setProducts(p);
    setCategories(c);
    setOrders(o);
    setReservations(r);
    setLoyaltyAccounts(l);
    setRewards(rew);
    setSettings(s);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // --- STATS OVERVIEW ---
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'received' || o.status === 'preparing');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const activeReservations = reservations.filter(r => r.status === 'confirmed');
  const totalPointsIssued = loyaltyAccounts.reduce((sum, a) => sum + a.lifetimePoints, 0);

  // --- ORDER STATUS UPDATE ---
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await DataService.updateOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showNotice(`Order #${orderId} updated to "${newStatus}"`);
  };

  // --- RESERVATION STATUS UPDATE ---
  const handleReservationStatusChange = async (resId: string, newStatus: ReservationStatus) => {
    await DataService.updateReservationStatus(resId, newStatus);
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: newStatus } : r));
    showNotice(`Reservation #${resId} marked as "${newStatus}"`);
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenAddProduct = () => {
    setProductForm({
      id: `prod-${Date.now()}`,
      categoryId: categories[0]?.id || 'cat-hot-coffee',
      name: '',
      description: '',
      price: 250,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop',
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isBestSeller: false,
      isSignature: false,
      isAvailable: true,
      rating: 4.9,
      reviewsCount: 1,
      tastingNotes: ['Silky', 'Rich'],
      options: {
        milks: ['Whole Milk', 'Oat Milk (+₹45)', 'Almond Milk (+₹45)'],
        sweetnessLevels: ['Unsweetened', 'Subtle (25%)', 'Standard (50%)'],
        temperatures: ['Hot', 'Iced'],
        extraShotAvailable: true,
      },
    });
    setIsEditingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setProductForm({ ...prod });
    setIsEditingProduct(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    const saved = await DataService.saveProduct(productForm as Product);
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });

    setIsEditingProduct(false);
    showNotice(`Saved product "${saved.name}"`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;
    await DataService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotice(`Deleted product "${name}"`);
  };

  const handleToggleProductAvailability = async (prod: Product) => {
    const updated = { ...prod, isAvailable: !prod.isAvailable };
    await DataService.saveProduct(updated);
    setProducts(prev => prev.map(p => p.id === prod.id ? updated : p));
    showNotice(`"${prod.name}" marked as ${updated.isAvailable ? 'In Stock' : 'Out of Stock'}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Admin Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pastelPeach-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-cocoaBrown-500 font-sans">
              Mist &amp; Coffee • Operations Suite
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
            Cafe Admin Dashboard
          </h1>
          <p className="text-xs text-cocoaBrown-400">
            Real-time management for orders, table bookings, menu offerings, and loyalty moments.
          </p>
        </div>

        {/* Database Status pill & refresh */}
        <div className="flex items-center gap-2.5">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border ${
              isSupabaseConfigured
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-butterYellow-50 border-butterYellow-300 text-cocoaBrown-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Live Sync' : 'Local Storage Engine (Active)'}</span>
          </div>

          <button
            onClick={loadAllData}
            className="p-2 rounded-xl bg-cream-50 hover:bg-cream-200 border border-pastelPeach-300 text-espresso-600 transition-colors"
            title="Reload latest data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-sageGreen-100 border border-sageGreen-200 text-sageGreen-800 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-2 border-b border-pastelPeach-200/60">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'menu', label: `Menu (${products.length})`, icon: Coffee },
          { id: 'reservations', label: `Reservations (${reservations.length})`, icon: Calendar },
          { id: 'loyalty', label: `Loyalty Members (${loyaltyAccounts.length})`, icon: Users },
          { id: 'rewards', label: `Rewards (${rewards.length})`, icon: Award },
          { id: 'settings', label: 'Settings & Supabase', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-espresso-600 text-cream-50 shadow-soft-sm'
                  : 'bg-cream-50 text-cocoaBrown-600 hover:bg-cream-200 border border-pastelPeach-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: OVERVIEW METRICS --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-cream-50 border border-pastelPeach-200 shadow-soft-sm">
              <span className="text-[11px] text-cocoaBrown-400 uppercase tracking-wider font-semibold">
                Total Revenue
              </span>
              <p className="font-serif font-bold text-3xl text-espresso-700 mt-1">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium">All non-cancelled orders</span>
            </div>

            <div className="p-5 rounded-3xl bg-cream-50 border border-pastelPeach-200 shadow-soft-sm">
              <span className="text-[11px] text-cocoaBrown-400 uppercase tracking-wider font-semibold">
                Pending Orders
              </span>
              <p className="font-serif font-bold text-3xl text-espresso-700 mt-1">
                {pendingOrders.length}
              </p>
              <span className="text-[10px] text-cocoaBrown-500 font-medium">Brewing &amp; in-transit</span>
            </div>

            <div className="p-5 rounded-3xl bg-cream-50 border border-pastelPeach-200 shadow-soft-sm">
              <span className="text-[11px] text-cocoaBrown-400 uppercase tracking-wider font-semibold">
                Active Bookings
              </span>
              <p className="font-serif font-bold text-3xl text-espresso-700 mt-1">
                {activeReservations.length}
              </p>
              <span className="text-[10px] text-cocoaBrown-500 font-medium">Upcoming table reservations</span>
            </div>

            <div className="p-5 rounded-3xl bg-cream-50 border border-pastelPeach-200 shadow-soft-sm">
              <span className="text-[11px] text-cocoaBrown-400 uppercase tracking-wider font-semibold">
                Loyalty Points Issued
              </span>
              <p className="font-serif font-bold text-3xl text-espresso-700 mt-1">
                {totalPointsIssued}
              </p>
              <span className="text-[10px] text-cocoaBrown-500 font-medium">Across {loyaltyAccounts.length} members</span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-cream-50 p-6 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-pastelPeach-200">
              <h3 className="font-serif font-bold text-xl text-espresso-700">
                Recent Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-cocoaBrown-600 hover:text-espresso-800 font-semibold underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-200 text-cocoaBrown-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5">Order ID</th>
                    <th className="py-2.5">Customer</th>
                    <th className="py-2.5">Type</th>
                    <th className="py-2.5">Amount</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {orders.slice(0, 5).map(order => (
                    <tr key={order.id} className="hover:bg-cream-100/60">
                      <td className="py-3 font-mono font-bold text-espresso-700">#{order.id}</td>
                      <td className="py-3">
                        <span className="font-semibold text-espresso-700 block">{order.customerName}</span>
                        <span className="text-[10px] text-cocoaBrown-400">{order.customerPhone}</span>
                      </td>
                      <td className="py-3 capitalize">{order.orderType}</td>
                      <td className="py-3 font-serif font-bold text-espresso-700">₹{order.total}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'completed'
                              ? 'bg-sageGreen-200 text-sageGreen-800'
                              : order.status === 'ready'
                              ? 'bg-butterYellow-200 text-cocoaBrown-800'
                              : order.status === 'preparing'
                              ? 'bg-dustyPink-200 text-espresso-800'
                              : 'bg-cream-200 text-cocoaBrown-600'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {order.status === 'received' && (
                          <button
                            onClick={() => handleOrderStatusChange(order.id, 'preparing')}
                            className="px-2.5 py-1 rounded-lg bg-espresso-600 text-cream-50 text-[10px] font-semibold"
                          >
                            Start Brewing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleOrderStatusChange(order.id, 'ready')}
                            className="px-2.5 py-1 rounded-lg bg-dustyPink-400 text-espresso-900 text-[10px] font-semibold"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleOrderStatusChange(order.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-semibold"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: ORDER MANAGEMENT --- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-2xl text-espresso-700">
                Order Management
              </h3>
              <p className="text-xs text-cocoaBrown-400">
                Filter orders, update live preparation status, and review customer notes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-pastelPeach-200">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded-xl border border-pastelPeach-200 text-espresso-700">
                      #{order.id}
                    </span>
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-dustyPink-200 text-espresso-800">
                      {order.orderType}
                    </span>
                    <span className="text-xs text-cocoaBrown-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Status buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    {(['received', 'preparing', 'ready', 'completed', 'cancelled'] as OrderStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => handleOrderStatusChange(order.id, st)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-semibold uppercase tracking-wider transition-all ${
                          order.status === st
                            ? 'bg-espresso-600 text-cream-50 shadow-soft-sm'
                            : 'bg-white border border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Items */}
                  <div>
                    <h5 className="font-bold text-espresso-700 mb-2">Ordered Items:</h5>
                    <div className="space-y-1.5">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-cocoaBrown-600">
                          <span>
                            {item.quantity}x {item.product.name}
                            {item.selectedMilk && <span className="text-[10px] text-cocoaBrown-400"> ({item.selectedMilk})</span>}
                            {item.selectedTemperature && <span className="text-[10px] text-cocoaBrown-400"> [{item.selectedTemperature}]</span>}
                          </span>
                          <span className="font-semibold text-espresso-700">₹{item.lineTotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer info & instructions */}
                  <div className="space-y-1.5 text-cocoaBrown-600">
                    <p>
                      <strong>Customer:</strong> {order.customerName} ({order.customerPhone})
                    </p>
                    {order.deliveryAddress && (
                      <p>
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                    )}
                    {order.specialInstructions && (
                      <p className="italic text-cocoaBrown-500">
                        <strong>Note:</strong> "{order.specialInstructions}"
                      </p>
                    )}
                    <p className="pt-1 font-serif font-bold text-base text-espresso-700">
                      Total: ₹{order.total} ({order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Counter / UPI'})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 3: MENU MANAGEMENT --- */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-2xl text-espresso-700">
                Menu Offerings ({products.length})
              </h3>
              <p className="text-xs text-cocoaBrown-400">
                Add new products, adjust pricing, manage categories, and toggle in-stock status.
              </p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="px-5 py-2.5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-semibold flex items-center gap-2 shadow-soft self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <div
                key={prod.id}
                className="bg-cream-50 p-5 rounded-3xl border border-pastelPeach-200 shadow-soft-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-cream-200 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleProductAvailability(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-soft-sm ${
                          prod.isAvailable
                            ? 'bg-emerald-500 text-white'
                            : 'bg-rose-500 text-white'
                        }`}
                      >
                        {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-cocoaBrown-400 mb-1">
                    <span className="uppercase tracking-wider font-medium">
                      {prod.categoryId.replace('cat-', '').replace('-', ' ')}
                    </span>
                    <span className="font-serif font-bold text-base text-espresso-700">
                      ₹{prod.price}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-espresso-700 mb-1">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-cocoaBrown-500 line-clamp-2 leading-relaxed mb-3">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {prod.isSignature && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-butterYellow-200 font-bold text-espresso-800">
                        Signature
                      </span>
                    )}
                    {prod.isBestSeller && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-dustyPink-200 font-bold text-espresso-800">
                        Bestseller
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 rounded-lg bg-white border border-pastelPeach-300 text-espresso-700 hover:bg-cream-100"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      className="p-1.5 rounded-lg bg-white border border-pastelPeach-300 text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 4: RESERVATIONS --- */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif font-bold text-2xl text-espresso-700">
              Table Reservations ({reservations.length})
            </h3>
            <p className="text-xs text-cocoaBrown-400">
              Confirm or manage guest bookings, slot times, and seating requests.
            </p>
          </div>

          <div className="space-y-4">
            {reservations.map(res => (
              <div
                key={res.id}
                className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm bg-white px-2.5 py-0.5 rounded-lg border border-pastelPeach-200 text-espresso-700">
                      #{res.id}
                    </span>
                    <h4 className="font-serif font-bold text-lg text-espresso-700">
                      {res.customerName}
                    </h4>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pastelPeach-200 text-espresso-700 font-semibold">
                      {res.guests} Guests
                    </span>
                  </div>

                  <p className="text-xs text-cocoaBrown-500">
                    <strong>Date &amp; Slot:</strong> {res.date} • {res.timeSlot}
                  </p>
                  <p className="text-xs text-cocoaBrown-500">
                    <strong>Preference:</strong> {res.seatingPreference}
                  </p>
                  <p className="text-xs text-cocoaBrown-400">
                    <strong>Contact:</strong> {res.customerPhone} • {res.customerEmail}
                  </p>
                  {res.specialRequests && (
                    <p className="text-xs italic text-dustyPink-700">
                      <strong>Special Request:</strong> "{res.specialRequests}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      res.status === 'confirmed'
                        ? 'bg-sageGreen-200 text-sageGreen-800'
                        : res.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-butterYellow-200 text-cocoaBrown-800'
                    }`}
                  >
                    {res.status}
                  </span>

                  {res.status === 'pending' && (
                    <button
                      onClick={() => handleReservationStatusChange(res.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-espresso-600 text-cream-50 text-xs font-semibold"
                    >
                      Confirm Booking
                    </button>
                  )}
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => handleReservationStatusChange(res.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Complete
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => handleReservationStatusChange(res.id, 'cancelled')}
                      className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 5: LOYALTY MANAGEMENT --- */}
      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif font-bold text-2xl text-espresso-700">
              Registered Loyalty Accounts ({loyaltyAccounts.length})
            </h3>
            <p className="text-xs text-cocoaBrown-400">
              View customer points balance, tiers, and grant bonus points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loyaltyAccounts.map(account => (
              <div
                key={account.id}
                className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded-md border border-pastelPeach-200">
                    {account.id}
                  </span>
                  <span className="text-xs font-bold text-dustyPink-600 px-2 py-0.5 rounded-full bg-dustyPink-100">
                    {account.tier}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-lg text-espresso-700">
                  {account.customerName}
                </h4>
                <p className="text-xs text-cocoaBrown-400">{account.customerPhone}</p>

                <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-cocoaBrown-400 block text-[10px] uppercase">Available</span>
                    <span className="font-serif font-bold text-xl text-espresso-700">
                      {account.currentPoints} pts
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-cocoaBrown-400 block text-[10px] uppercase">Lifetime</span>
                    <span className="font-serif font-bold text-base text-cocoaBrown-600">
                      {account.lifetimePoints} pts
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={async () => {
                      await DataService.addLoyaltyPoints(
                        account.customerPhone,
                        account.customerName,
                        account.customerEmail,
                        50,
                        'Admin Goodwill Bonus: 50 pts'
                      );
                      loadAllData();
                      showNotice(`Added 50 bonus points to ${account.customerName}`);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-espresso-600 text-cream-50 text-xs font-semibold"
                  >
                    +50 Bonus Pts
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: REWARDS CONFIGURATION --- */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-serif font-bold text-2xl text-espresso-700">
              Rewards Vouchers Configuration ({rewards.length})
            </h3>
            <p className="text-xs text-cocoaBrown-400">
              Control points costs, discount vouchers, and complimentary items.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map(rew => (
              <div
                key={rew.id}
                className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 shadow-soft-sm flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-cocoaBrown-500" />
                    <h4 className="font-serif font-bold text-lg text-espresso-700">
                      {rew.title}
                    </h4>
                  </div>
                  <p className="text-xs text-cocoaBrown-500 mb-2">{rew.description}</p>
                  <p className="text-xs font-semibold text-espresso-700">
                    Points Cost: <span className="font-bold text-base text-cocoaBrown-600">{rew.pointsCost} pts</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 7: SETTINGS & SUPABASE ENGINE --- */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Supabase Connection Setup (7 cols) */}
          <div className="lg:col-span-7 bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-pastelPeach-200">
              <Database className="w-6 h-6 text-espresso-600" />
              <div>
                <h3 className="font-serif font-bold text-xl text-espresso-700">
                  Supabase Backend Configuration
                </h3>
                <p className="text-xs text-cocoaBrown-400">
                  Connect your live Supabase project URL &amp; Anon Key.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-pastelPeach-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-espresso-700">Connection Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
                  isSupabaseConfigured
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-butterYellow-100 text-cocoaBrown-800'
                }`}>
                  {isSupabaseConfigured ? 'Connected to Supabase' : 'Local Fallback Storage Active'}
                </span>
              </div>
              <p className="text-cocoaBrown-500 text-[11px] leading-relaxed">
                When credentials are provided, data synchronizes to your PostgreSQL database. When left empty, the site runs seamlessly with persistent localStorage and seed data!
              </p>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                saveRuntimeSupabaseConfig(supaUrlInput, supaKeyInput);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Supabase Project URL (VITE_SUPABASE_URL)
                </label>
                <input
                  type="url"
                  value={supaUrlInput}
                  onChange={e => setSupaUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)
                </label>
                <input
                  type="password"
                  value={supaKeyInput}
                  onChange={e => setSupaKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white font-mono focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-espresso-600 text-cream-50 text-xs font-semibold hover:bg-espresso-700 transition-colors shadow-soft"
                >
                  Save &amp; Reload Connection
                </button>
                {isSupabaseConfigured && (
                  <button
                    type="button"
                    onClick={clearRuntimeSupabaseConfig}
                    className="px-4 py-2.5 rounded-full border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Business Defaults & Factory Reset (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-4 text-xs">
              <h3 className="font-serif font-bold text-xl text-espresso-700">
                Cafe Store Operations
              </h3>

              <div className="space-y-2 text-cocoaBrown-600">
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span>Standard Delivery Fee:</span>
                  <span className="font-semibold text-espresso-700">₹40</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span>Free Delivery Over:</span>
                  <span className="font-semibold text-emerald-700">₹500</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span>GST Rate:</span>
                  <span className="font-semibold text-espresso-700">5%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-cream-200">
                  <span>Loyalty Ratio:</span>
                  <span className="font-semibold text-espresso-700">1 pt per ₹10 spent</span>
                </div>
              </div>

              <div className="pt-4 border-t border-pastelPeach-200">
                <button
                  onClick={() => {
                    if (window.confirm('Reset all demo orders, reservations, and products to initial seed data?')) {
                      DataService.resetAllData();
                    }
                  }}
                  className="w-full py-2.5 rounded-xl border border-pastelPeach-300 bg-white text-xs font-semibold text-cocoaBrown-600 hover:bg-cream-200 transition-colors"
                >
                  Restore Factory Seed Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PRODUCT EDIT / ADD MODAL --- */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm"
            onClick={() => setIsEditingProduct(false)}
          />

          <div className="relative bg-cream-50 w-full max-w-lg rounded-3xl shadow-2xl border border-pastelPeach-200 p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditingProduct(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-200 text-espresso-700 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-espresso-700 mb-4">
              {productForm.name ? `Edit: ${productForm.name}` : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name || ''}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Vanilla Cloud Cortado"
                  className="w-full px-3 py-2 rounded-xl border border-pastelPeach-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-espresso-700 block mb-1">Category *</label>
                  <select
                    value={productForm.categoryId || 'cat-hot-coffee'}
                    onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-pastelPeach-300 bg-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-espresso-700 block mb-1">Price (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.price || 0}
                    onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-pastelPeach-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={productForm.description || ''}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe tasting notes, brew method, textures..."
                  className="w-full px-3 py-2 rounded-xl border border-pastelPeach-300 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-espresso-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={productForm.image || ''}
                  onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-pastelPeach-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isSignature || false}
                    onChange={e => setProductForm({ ...productForm, isSignature: e.target.checked })}
                    className="accent-espresso-600"
                  />
                  <span>Signature Brew</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestSeller || false}
                    onChange={e => setProductForm({ ...productForm, isBestSeller: e.target.checked })}
                    className="accent-espresso-600"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isVegetarian ?? true}
                    onChange={e => setProductForm({ ...productForm, isVegetarian: e.target.checked })}
                    className="accent-espresso-600"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isAvailable ?? true}
                    onChange={e => setProductForm({ ...productForm, isAvailable: e.target.checked })}
                    className="accent-espresso-600"
                  />
                  <span>In Stock</span>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-espresso-600 text-cream-50 font-semibold"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-5 py-3 rounded-full border border-pastelPeach-300 bg-white text-espresso-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
