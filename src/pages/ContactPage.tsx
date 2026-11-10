import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { MapPin, Phone, Clock, Mail, CheckCircle2, AlertCircle, Wifi, Dog, Car, Coffee } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await DataService.sendContactMessage(name, email, phone, subject, message);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Contact submit error:', err);
      setErrorMsg('Failed to send message. Please try again or call us directly.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
          Say Hello
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso-600">
          Contact &amp; Find Us
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500 leading-relaxed font-sans">
          Have a question about our bean origins, catering, private book club gatherings, or feedback on your recent cup? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft space-y-6">
            <h3 className="font-serif font-bold text-2xl text-espresso-700">
              The Cafe Sanctuary
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-cocoaBrown-600">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-dustyPink-100 text-espresso-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Address</h4>
                  <p className="text-xs leading-relaxed">
                    14th Main Rd, 100ft Corner, Indiranagar, Bengaluru, Karnataka 560038
                  </p>
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">
                    Landmark: Directly opposite Lotus Park East Gate
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-dustyPink-100 text-espresso-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Telephone</h4>
                  <p className="text-xs">+91 98450 12389</p>
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">Daily between 9:00 AM – 9:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-dustyPink-100 text-espresso-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Opening Hours</h4>
                  <p className="text-xs">Monday – Sunday: 9:00 AM – 9:00 PM</p>
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">Morning bake batch fresh from 9:00 AM</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-dustyPink-100 text-espresso-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Direct Email</h4>
                  <p className="text-xs">hello@mistandcoffee.com</p>
                  <p className="text-xs">roastery@mistandcoffee.com</p>
                </div>
              </div>
            </div>

            {/* Social & Amenities */}
            <div className="pt-4 border-t border-pastelPeach-200">
              <h4 className="font-semibold text-xs text-espresso-700 uppercase tracking-wider mb-3">
                Cafe Amenities
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-cocoaBrown-600">
                <span className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-sageGreen-600" />
                  Free 100Mbps Wi-Fi
                </span>
                <span className="flex items-center gap-1.5">
                  <Dog className="w-3.5 h-3.5 text-sageGreen-600" />
                  Pet Friendly Patio
                </span>
                <span className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-sageGreen-600" />
                  Valet &amp; Bike Parking
                </span>
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-sageGreen-600" />
                  Oat/Almond Milks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-cream-50 p-6 sm:p-8 rounded-4xl border border-pastelPeach-200 shadow-soft">
          <h3 className="font-serif font-bold text-2xl text-espresso-700 mb-2">
            Send a Gentle Note
          </h3>
          <p className="text-xs text-cocoaBrown-500 mb-6">
            We review every message personally over morning espresso.
          </p>

          {isSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-sageGreen-100 border border-sageGreen-200 text-sageGreen-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your note has been delivered. We will get back to you shortly.</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priyanshi Mehta"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. priyanshi@example.com"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-espresso-700 block mb-1">
                  Topic / Subject
                </label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Event / Book Club Booking">Event / Book Club Booking</option>
                  <option value="Whole Bean Roastery Wholesale">Whole Bean Roastery Wholesale</option>
                  <option value="Press &amp; Collaborations">Press &amp; Collaborations</option>
                  <option value="Feedback on Cup">Feedback on Cup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-espresso-700 block mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your thoughts with us..."
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-pastelPeach-300 bg-white focus:outline-none focus:ring-1 focus:ring-espresso-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-espresso-600 hover:bg-espresso-700 disabled:opacity-60 text-cream-50 font-medium text-xs transition-all shadow-soft"
            >
              {isSubmitting ? 'Sending your message...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Full Width Google Maps Embed */}
      <div className="rounded-4xl overflow-hidden shadow-soft border border-pastelPeach-200 aspect-[21/9] bg-cream-200">
        <iframe
          title="Mist and Coffee Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.488390886596!2d77.63223019999999!3d12.978129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a7bb423e65%3A0xb5a76e9389bd608d!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
      </div>
    </div>
  );
};
