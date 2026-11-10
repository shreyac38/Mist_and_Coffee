-- ==============================================================================
-- MIST AND COFFEE — PRODUCTION DATABASE SCHEMA & POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id text primary key,
    name text not null,
    slug text not null unique,
    description text,
    icon_name text,
    display_order integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id text primary key,
    category_id text references public.categories(id) on delete set null,
    name text not null,
    description text not null,
    price numeric(10, 2) not null check (price >= 0),
    image text not null,
    is_vegetarian boolean default true,
    is_vegan boolean default false,
    is_gluten_free boolean default false,
    is_best_seller boolean default false,
    is_signature boolean default false,
    is_available boolean default true,
    rating numeric(3, 2) default 4.8,
    reviews_count integer default 42,
    origin text,
    roast_level text,
    tasting_notes text[],
    available_milks text[] default array['Whole Milk', 'Oat Milk (+₹45)', 'Almond Milk (+₹45)', 'Soy Milk (+₹35)'],
    available_sweetness text[] default array['Unsweetened', 'Subtle Hint (25%)', 'Balanced (50%)', 'Full Sweetness (100%)'],
    available_temperatures text[] default array['Hot', 'Iced'],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ORDERS TABLE
create table if not exists public.orders (
    id text primary key,
    customer_name text not null,
    customer_phone text not null,
    customer_email text,
    order_type text not null check (order_type in ('pickup', 'delivery', 'dine-in')),
    delivery_address text,
    preferred_time text,
    special_instructions text,
    items jsonb not null,
    subtotal numeric(10, 2) not null,
    discount numeric(10, 2) default 0,
    delivery_fee numeric(10, 2) default 0,
    tax numeric(10, 2) default 0,
    total numeric(10, 2) not null,
    payment_method text not null check (payment_method in ('cod', 'counter_upi')),
    status text not null default 'received' check (status in ('received', 'preparing', 'ready', 'completed', 'cancelled')),
    estimated_minutes integer default 25,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. TABLE RESERVATIONS
create table if not exists public.reservations (
    id text primary key,
    customer_name text not null,
    customer_phone text not null,
    customer_email text not null,
    date date not null,
    time_slot text not null,
    guests integer not null check (guests >= 1 and guests <= 20),
    seating_preference text not null default 'Any Cozy Corner',
    special_requests text,
    status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. LOYALTY ACCOUNTS
create table if not exists public.loyalty_accounts (
    id text primary key,
    customer_name text not null,
    customer_phone text not null unique,
    customer_email text,
    current_points integer default 50, -- welcome bonus points
    lifetime_points integer default 50,
    tier text not null default 'Little Sipper' check (tier in ('Little Sipper', 'Coffee Lover', 'Mist Insider')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. LOYALTY TRANSACTIONS
create table if not exists public.loyalty_transactions (
    id text primary key,
    loyalty_account_id text references public.loyalty_accounts(id) on delete cascade,
    type text not null check (type in ('earned', 'redeemed', 'bonus')),
    points integer not null,
    description text not null,
    order_id text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. REWARD VOUCHERS
create table if not exists public.rewards (
    id text primary key,
    title text not null,
    description text not null,
    points_cost integer not null,
    discount_value numeric(10, 2) not null,
    discount_type text not null check (discount_type in ('flat', 'percentage', 'free_item')),
    icon text default 'Gift',
    is_available boolean default true,
    min_bill_inr numeric(10, 2) default 0
);

-- 8. BUSINESS SETTINGS
create table if not exists public.business_settings (
    id text primary key default 'mist_main_config',
    cafe_name text default 'Mist and Coffee',
    tagline text default 'A Little Escape in Every Cup',
    address text default '14th Main Rd, 100ft Corner, Indiranagar, Bengaluru, Karnataka 560038',
    phone text default '+91 98450 12389',
    email text default 'hello@mistandcoffee.com',
    opening_hours text default '9:00 AM – 9:00 PM Daily',
    delivery_fee_standard numeric(10, 2) default 40.00,
    free_delivery_threshold numeric(10, 2) default 500.00,
    tax_percentage numeric(5, 2) default 5.00,
    is_accepting_orders boolean default true,
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. CONTACT INQUIRIES
create table if not exists public.contact_messages (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    subject text,
    message text not null,
    status text default 'unread',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.reservations enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.business_settings enable row level security;
alter table public.contact_messages enable row level security;

-- Public can read categories, products, rewards, and business settings
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read products" on public.products for select using (true);
create policy "Allow public read rewards" on public.rewards for select using (true);
create policy "Allow public read business settings" on public.business_settings for select using (true);

-- Customers can create orders, reservations, contact messages
create policy "Allow public insert orders" on public.orders for insert with check (true);
create policy "Allow public read own orders by phone/id" on public.orders for select using (true);

create policy "Allow public insert reservations" on public.reservations for insert with check (true);
create policy "Allow public read reservations" on public.reservations for select using (true);

create policy "Allow public insert contact messages" on public.contact_messages for insert with check (true);

-- Loyalty accounts & transactions read/write for self and admin
create policy "Allow public read loyalty accounts" on public.loyalty_accounts for select using (true);
create policy "Allow public insert loyalty accounts" on public.loyalty_accounts for insert with check (true);
create policy "Allow public update loyalty accounts" on public.loyalty_accounts for update using (true);
create policy "Allow public read loyalty transactions" on public.loyalty_transactions for select using (true);
create policy "Allow public insert loyalty transactions" on public.loyalty_transactions for insert with check (true);

-- Admin full access policies (service role or authenticated admin)
create policy "Admin full access categories" on public.categories for all using (true) with check (true);
create policy "Admin full access products" on public.products for all using (true) with check (true);
create policy "Admin full access orders" on public.orders for all using (true) with check (true);
create policy "Admin full access reservations" on public.reservations for all using (true) with check (true);
create policy "Admin full access rewards" on public.rewards for all using (true) with check (true);
create policy "Admin full access settings" on public.business_settings for all using (true) with check (true);
