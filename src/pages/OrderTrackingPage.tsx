import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Order, OrderStatus } from '../types';
import { 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Coffee, 
  Truck, 
  PackageCheck, 
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Phone
} from 'lucide-react';

interface OrderTrackingPageProps {
  initialOrderId?: string | null;
  onNavigateToMenu: () => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderId,
  onNavigateToMenu,
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchOrder = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setNotFound(false);

    const order = await DataService.getOrderById(id.trim());
    if (order) {
      setCurrentOrder(order);
      setNotFound(false);
    } else {
      setCurrentOrder(null);
      setNotFound(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchId(initialOrderId);
      fetchOrder(initialOrderId);
    } else {
      // Default load recent sample order for immediate instant preview!
      fetchOrder('MIST-9214');
    }
  }, [initialOrderId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(searchId);
  };

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'received',
      label: 'Order Received',
      desc: 'Ticket printed at slow bar',
      icon: Clock,
    },
    {
      key: 'preparing',
      label: 'Preparing & Brewing',
      desc: 'Barista grinding & steaming',
      icon: Coffee,
    },
    {
      key: 'ready',
      label: currentOrder?.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup',
      desc: currentOrder?.orderType === 'delivery' ? 'On its way to you' : 'Waiting at counter',
      icon: currentOrder?.orderType === 'delivery' ? Truck : ShoppingBag,
    },
    {
      key: 'completed',
      label: 'Completed',
      desc: 'Enjoy your coffee escape',
      icon: PackageCheck,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'completed': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
          Live Status
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
          Track Your Coffee Order
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500">
          Follow your freshly ground beans from the grinder to your hands.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cocoaBrown-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder="Enter Order ID (e.g. MIST-9214)"
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-pastelPeach-300 bg-white placeholder-cocoaBrown-300 uppercase font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-espresso-500 shadow-soft-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 rounded-2xl bg-espresso-600 hover:bg-espresso-700 text-cream-50 font-medium text-xs shadow-soft transition-colors flex items-center gap-1.5"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Track</span>}
        </button>
      </form>

      {/* Not Found Notice */}
      {notFound && (
        <div className="p-6 rounded-3xl bg-dustyPink-100 border border-dustyPink-300 text-center max-w-md mx-auto space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-espresso-700">Order Not Found</h3>
          <p className="text-xs text-cocoaBrown-500">
            We couldn't find an order matching "<strong>{searchId}</strong>". Please verify your Order ID or phone number.
          </p>
        </div>
      )}

      {/* Live Order Card */}
      {currentOrder && (
        <div className="bg-cream-50 rounded-4xl border border-pastelPeach-200 shadow-soft-lg overflow-hidden">
          {/* Card Header */}
          <div className="p-6 sm:p-8 bg-cream-100/90 border-b border-pastelPeach-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-espresso-700 bg-white px-2.5 py-1 rounded-md border border-pastelPeach-300">
                  #{currentOrder.id}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-pastelPeach-200 text-espresso-700 font-semibold uppercase tracking-wider">
                  {currentOrder.orderType}
                </span>
              </div>
              <p className="text-xs text-cocoaBrown-400">
                Placed on {new Date(currentOrder.createdAt).toLocaleDateString()} at{' '}
                {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchOrder(currentOrder.id)}
                className="p-2 rounded-xl bg-white border border-pastelPeach-300 text-cocoaBrown-600 hover:bg-cream-200 transition-colors"
                title="Refresh live status"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="text-right">
                <p className="text-[11px] text-cocoaBrown-400 uppercase tracking-wider">Status</p>
                <p className="font-serif font-bold text-lg capitalize text-espresso-700">
                  {currentOrder.status}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Progress Stepper */}
          <div className="p-6 sm:p-8 border-b border-pastelPeach-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;
                const IconComponent = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-2.5 ${
                        isCurrent
                          ? 'bg-espresso-600 text-cream-50 ring-4 ring-dustyPink-300 shadow-md scale-110'
                          : isPassed
                          ? 'bg-sageGreen-400 text-espresso-800'
                          : 'bg-cream-200 text-cocoaBrown-400'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>

                    <h4
                      className={`font-serif text-sm font-bold ${
                        isPassed ? 'text-espresso-700' : 'text-cocoaBrown-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-cocoaBrown-400 max-w-[120px] mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Products Breakdown */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-espresso-700 border-b border-pastelPeach-200 pb-2">
                Items in this Order
              </h4>

              <div className="space-y-3">
                {currentOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-xs gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-espresso-700">
                        {item.quantity}x {item.product.name}
                      </p>
                      <div className="text-[11px] text-cocoaBrown-400 space-x-1">
                        {item.selectedTemperature && <span>[{item.selectedTemperature}]</span>}
                        {item.selectedMilk && <span>• {item.selectedMilk}</span>}
                        {item.selectedSweetness && <span>• {item.selectedSweetness}</span>}
                        {item.extraShots > 0 && <span>• +{item.extraShots} Shot</span>}
                      </div>
                      {item.specialNote && (
                        <p className="text-[10px] text-cocoaBrown-400 italic">
                          "{item.specialNote}"
                        </p>
                      )}
                    </div>
                    <span className="font-serif font-bold text-espresso-600">
                      ₹{item.lineTotal}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price summary */}
              <div className="pt-3 border-t border-pastelPeach-200 space-y-1.5 text-xs text-cocoaBrown-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{currentOrder.subtotal}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-₹{currentOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{currentOrder.deliveryFee === 0 ? 'FREE' : `₹${currentOrder.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-[11px] text-cocoaBrown-400">
                  <span>GST</span>
                  <span>₹{currentOrder.tax}</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-espresso-700 pt-2 border-t border-cream-300">
                  <span>Total Paid / Payable</span>
                  <span>₹{currentOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Destination & Contact info */}
            <div className="space-y-4">
              <h4 className="font-serif font-bold text-base text-espresso-700 border-b border-pastelPeach-200 pb-2">
                Delivery &amp; Customer Information
              </h4>

              <div className="space-y-3 text-xs text-cocoaBrown-600">
                <div>
                  <p className="font-semibold text-espresso-700">Customer</p>
                  <p>{currentOrder.customerName}</p>
                  <p className="text-cocoaBrown-400">{currentOrder.customerPhone}</p>
                </div>

                {currentOrder.orderType === 'delivery' && (
                  <div>
                    <p className="font-semibold text-espresso-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cocoaBrown-400" />
                      Delivery Address
                    </p>
                    <p>{currentOrder.deliveryAddress}</p>
                  </div>
                )}

                <div>
                  <p className="font-semibold text-espresso-700">Payment Method</p>
                  <p className="capitalize">
                    {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Pay at Counter / UPI'}
                  </p>
                </div>

                {currentOrder.specialInstructions && (
                  <div>
                    <p className="font-semibold text-espresso-700">Special Instructions</p>
                    <p className="italic">"{currentOrder.specialInstructions}"</p>
                  </div>
                )}
              </div>

              {/* Need help badge */}
              <div className="mt-6 p-4 rounded-2xl bg-cream-200/60 border border-pastelPeach-200 text-xs text-cocoaBrown-600 space-y-1">
                <p className="font-semibold text-espresso-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cocoaBrown-500" />
                  Need to modify your order?
                </p>
                <p className="text-[11px]">
                  Call our Indiranagar slow bar directly at <strong>+91 98450 12389</strong> with order #{currentOrder.id}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
