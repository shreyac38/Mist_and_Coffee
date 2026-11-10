import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Reservation } from '../types';
import confetti from 'canvas-confetti';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Coffee, 
  AlertCircle,
  X 
} from 'lucide-react';

export const ReservationsPage: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM – 12:30 PM');
  const [guests, setGuests] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState('Window Nook (Warm Sunlight)');
  const [specialRequests, setSpecialRequests] = useState('');

  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available Time Slots
  const availableSlots = [
    { time: '9:30 AM – 11:00 AM', tag: 'Morning Stillness' },
    { time: '11:00 AM – 12:30 PM', tag: 'Brunch & Pastries' },
    { time: '1:00 PM – 2:30 PM', tag: 'Midday Slow Down' },
    { time: '3:30 PM – 5:00 PM', tag: 'Afternoon Tea & Bakes' },
    { time: '5:30 PM – 7:00 PM', tag: 'Golden Hour Chill' },
    { time: '7:30 PM – 9:00 PM', tag: 'Evening Jazz & Sips' },
  ];

  const seatingOptions = [
    'Window Nook (Warm Sunlight & Street View)',
    'Outdoor Garden Patio (Shaded Botanicals)',
    'Cozy Library Corner (Books & Quiet)',
    'Slow Bar High Stools (Barista View)',
    'Any Available Cozy Table',
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!customerEmail.trim()) {
      setErrorMsg('Please enter your email for booking confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
      const newReservation: Reservation = {
        id: resId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        date,
        timeSlot,
        guests,
        seatingPreference,
        specialRequests: specialRequests.trim() || undefined,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      await DataService.createReservation(newReservation);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFF8F0', '#EBCBCB', '#F4D6C6', '#C8D5C0'],
        });
      } catch (e) {}

      setConfirmedReservation(newReservation);
      setIsSubmitting(false);
    } catch (err) {
      console.error('Reservation error:', err);
      setErrorMsg('Failed to confirm reservation. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
          Sanctuary Bookings
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso-600">
          Reserve a Cozy Table
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500 leading-relaxed font-sans">
          Whether you're catching up over pour-overs, diving into a favorite novel, or gathering with dear friends, we will have your special corner ready.
        </p>
      </div>

      {/* Confirmation Card View */}
      {confirmedReservation ? (
        <div className="max-w-xl mx-auto bg-cream-50 rounded-4xl border border-pastelPeach-300 shadow-soft-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-sageGreen-200 text-sageGreen-700 flex items-center justify-center mx-auto shadow-soft-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-cocoaBrown-400">
              Reservation Confirmed
            </span>
            <h2 className="font-serif font-bold text-3xl text-espresso-700 mt-1">
              We Look Forward to Welcoming You!
            </h2>
            <p className="text-xs text-cocoaBrown-500 mt-1">
              Your table booking details have been stored and confirmed.
            </p>
          </div>

          {/* Details breakdown */}
          <div className="bg-white/80 rounded-2xl p-5 border border-pastelPeach-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <span className="text-cocoaBrown-400">Booking Reference</span>
              <span className="font-mono font-bold text-espresso-700">{confirmedReservation.id}</span>
            </div>
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <span className="text-cocoaBrown-400">Reserved For</span>
              <span className="font-semibold text-espresso-700">{confirmedReservation.customerName} ({confirmedReservation.guests} Guests)</span>
            </div>
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <span className="text-cocoaBrown-400">Date &amp; Time Slot</span>
              <span className="font-semibold text-espresso-700">{confirmedReservation.date} • {confirmedReservation.timeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-cream-200 pb-2">
              <span className="text-cocoaBrown-400">Seating Area</span>
              <span className="font-semibold text-espresso-700">{confirmedReservation.seatingPreference}</span>
            </div>
            {confirmedReservation.specialRequests && (
              <div className="flex justify-between">
                <span className="text-cocoaBrown-400">Special Note</span>
                <span className="italic text-espresso-700">"{confirmedReservation.specialRequests}"</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setConfirmedReservation(null)}
              className="px-6 py-3 rounded-full bg-espresso-600 text-cream-50 text-xs font-semibold hover:bg-espresso-700 transition-colors"
            >
              Book Another Table
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reservation Form (7 cols) */}
          <form
            onSubmit={handleBookingSubmit}
            className="lg:col-span-7 bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-6"
          >
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Date & Guest Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Reservation Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Number of Guests *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6, 8].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        guests === num
                          ? 'bg-espresso-600 text-white border-espresso-600'
                          : 'bg-white border-pastelPeach-200 text-espresso-600 hover:bg-cream-100'
                      }`}
                    >
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="text-xs font-semibold text-espresso-700 block mb-2">
                Select Preferred Time Slot *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableSlots.map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setTimeSlot(slot.time)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      timeSlot === slot.time
                        ? 'bg-dustyPink-200 border-cocoaBrown-500 shadow-soft-sm'
                        : 'bg-white border-pastelPeach-200 hover:bg-cream-100'
                    }`}
                  >
                    <p className="text-xs font-bold text-espresso-700">{slot.time}</p>
                    <p className="text-[10px] text-cocoaBrown-500 font-sans mt-0.5">{slot.tag}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="text-xs font-semibold text-espresso-700 block mb-2">
                Seating Atmosphere &amp; Preference
              </label>
              <select
                value={seatingPreference}
                onChange={e => setSeatingPreference(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              >
                {seatingOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 pt-2 border-t border-pastelPeach-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cocoaBrown-400">
                Your Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Your Full Name *"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="Phone Number *"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <input
                type="email"
                required
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                placeholder="Email Address (for confirmation) *"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />

              <input
                type="text"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="Any special requests? (Birthday, quiet writing desk, power socket...)"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-espresso-600 hover:bg-espresso-700 disabled:opacity-60 text-cream-50 font-medium text-sm transition-all shadow-soft"
            >
              {isSubmitting ? 'Confirming with Slow Bar...' : 'Confirm Table Booking'}
            </button>
          </form>

          {/* Right Info & Seating Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-soft border border-pastelPeach-200 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop"
                alt="Cafe Interior"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-cream-50 p-6 rounded-3xl border border-pastelPeach-200 space-y-3 text-xs text-cocoaBrown-600">
              <h4 className="font-serif font-bold text-base text-espresso-700">
                Reservation Policy &amp; Care
              </h4>
              <ul className="space-y-2 list-disc pl-4 text-[11px] leading-relaxed">
                <li>Tables are reserved for 90 minutes to ensure every guest enjoys peaceful coffee moments.</li>
                <li>We hold tables for up to 15 minutes past the slot before releasing to walk-in sippers.</li>
                <li>Complimentary high-speed Wi-Fi and power outlets available in all window nooks.</li>
                <li>Pet-friendly outdoor garden patio with fresh water bowls available.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
