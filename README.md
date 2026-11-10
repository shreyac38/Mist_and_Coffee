# MIST AND COFFEE — Speciality Cafe & Roastery Web Platform

> *"A Little Escape in Every Cup. Slow down, sip something beautiful, and make yourself at home."*

A production-ready website for **Mist and Coffee**, an independent speciality cafe brand. Designed with Pinterest-inspired pastel aesthetics, soft natural tones, vintage editorial layouts, tactile ceramics imagery, and a full cafe management and online ordering system.

---

## 🎨 Brand Identity & Color Palette

- **Cream:** `#FFF8F0` (warm base)
- **Dusty Pink:** `#EBCBCB` (editorial accents)
- **Pastel Peach:** `#F4D6C6` (cards & badges)
- **Sage Green:** `#C8D5C0` (botanical highlights)
- **Butter Yellow:** `#F5E7B2` (tasting notes & tags)
- **Cocoa Brown:** `#795548` (typography & outlines)
- **Espresso:** `#35251F` (deep headers & buttons)

### Typography
- **Headings:** *Cormorant Garamond* / *Playfair Display*
- **Body:** *Plus Jakarta Sans*
- **Accents:** *Caveat* (handwritten notes)

---

## 🌟 Key Features

1. **Brand Emblem & Identity:**
   - Bespoke circular botanical emblem with custom curved lettering, ceramic mug, and rising mist swirls.
   - Minimalist favicon stamp and packaging badge variants.

2. **Interactive Menu (8 Categories):**
   - Signature Coffee, Hot Coffee, Cold Coffee, Matcha & Tea, Refreshments, Bakery, Desserts, Snacks & Meals.
   - Product Customization Modal: Choice of milk (Whole, Oat, Almond, Soy), sweetness levels, temperature (Hot vs. Iced), extra espresso shots, and special barista instructions with dynamic price calculation.
   - Dietary filters (🌱 Vegetarian, 🍃 Plant-Based/Vegan, 🌾 Gluten-Free, ★ Bestsellers, ✨ Signatures).

3. **Complete Online Ordering & Basket:**
   - Slide-over basket drawer with free delivery progress meter (free over ₹500).
   - Promo coupon engine (`FIRSTMIST` for 15% off, `COZY50` for ₹50 off, `MISTMOMENTS`).
   - Doorstep Delivery, Self-Pickup, and Dine-In flows.
   - Cash on Delivery (COD) & Pay at Counter / UPI options.
   - Confetti celebration upon order placement.

4. **Live Customer Order Tracking:**
   - Step progress indicator: *Order Received ➔ Preparing & Brewing ➔ Out for Delivery / Ready for Pickup ➔ Completed*.
   - Live Order ID search and itemized breakdown.

5. **Table Reservation System:**
   - Date picker, guests count (1 to 10+), curated time slots (Morning Stillness, Brunch, Golden Hour, Evening Jazz).
   - Seating preferences: Window Nook, Outdoor Garden Patio, Cozy Library Corner, Slow Bar Stools.
   - Instant confirmation with booking reference code (`RES-XXXX`).

6. **Mist Moments Loyalty Rewards:**
   - 3 Tiers: *Little Sipper*, *Coffee Lover*, *Mist Insider*.
   - Automatic point accrual: 1 point per ₹10 spent.
   - 50 Welcome bonus points on registration.
   - Voucher redemption catalogue with server-side validation.
   - Live activity ledger & digital membership card.

7. **Admin Operations Suite:**
   - Real-time business metrics (Total Revenue, Orders, Reservations, Points Issued).
   - Menu Management: Add/edit/delete products, price adjustments, in-stock/out-of-stock toggles.
   - Order Management: 1-click status updates (`Received` ➔ `Preparing` ➔ `Ready` ➔ `Completed`).
   - Reservation Management: Confirm, complete, or cancel table bookings.
   - Customer & Loyalty: View accounts, grant goodwill points.
   - Business & Supabase Settings: Runtime project configuration & seed data reset.

---

## 🚀 Running the Project

```bash
# Navigate to project directory
cd "C:\Users\SHREYA C\.gemini\antigravity\scratch\mist-and-coffee"

# Start Vite development server
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🗄️ Supabase PostgreSQL Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Open [`supabase_schema.sql`](./supabase_schema.sql) and execute the SQL script.
4. Copy your **Project URL** and **Anon Key** from *Project Settings ➔ API*.
5. Either add them to a `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   Or paste them directly in the **Admin Dashboard ➔ Settings & Supabase** tab in the running app!
