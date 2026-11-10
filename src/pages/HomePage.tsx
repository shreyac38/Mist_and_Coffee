import React from 'react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { Product, Category } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Star, 
  Award, 
  Heart, 
  Coffee, 
  Compass, 
  Calendar, 
  Gift, 
  CheckCircle2, 
  Plus 
} from 'lucide-react';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  onNavigate: (page: string) => void;
  onOpenProductModal: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  onNavigate,
  onOpenProductModal,
}) => {
  const bestsellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const signatureDrinks = products.filter(p => p.isSignature).slice(0, 3);

  const testimonials = [
    {
      id: 1,
      quote: "The Mist Cloud Latte feels like a warm hug on a rainy Bangalore afternoon. Truly the most aesthetic and peaceful cafe experience.",
      author: "Ananya Deshmukh",
      role: "Architect & Daily Regular",
      rating: 5,
      favorite: "The Mist Cloud Latte",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 2,
      quote: "Their single-origin Chemex pour-over opened my eyes to delicate floral notes in coffee. Pair it with the almond croissant — heaven.",
      author: "Vikram Sengupta",
      role: "Speciality Coffee Enthusiast",
      rating: 5,
      favorite: "Chemex & Croissant",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: 3,
      quote: "The cozy window nooks, pastel ceramics, and calm vinyl jazz make Mist and Coffee my favorite creative haven to write and think.",
      author: "Tanvi Rao",
      role: "Author & Illustrator",
      rating: 5,
      favorite: "Ceremonial Matcha Latte",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    },
  ];

  const atmosphereGallery = [
    {
      title: "The Slow Bar & Espresso Machine",
      tag: "Handcrafted Pulls",
      aspect: "row-span-2",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Warm Sunlit Window Nooks",
      tag: "Morning Solitude",
      aspect: "",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Fresh Morning Pastries",
      tag: "Daily Bakes",
      aspect: "",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Quiet Reading Sanctuary",
      tag: "Vinyl & Books",
      aspect: "row-span-2",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=900&auto=format&fit=crop",
    },
    {
      title: "Hand-poured Ceramic Cups",
      tag: "Tactile Joy",
      aspect: "",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop",
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32">
      {/* 1. HERO SECTION (Editorial Pinterest Layout) */}
      <section className="relative pt-6 md:pt-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 z-10">
              {/* Brand Tag & Season */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pastelPeach-100/90 border border-pastelPeach-300 text-espresso-700 text-xs font-medium shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-sageGreen-500 animate-ping" />
                <span className="font-serif italic text-sm">Mist &amp; Coffee</span>
                <span className="text-cocoaBrown-400">•</span>
                <span className="tracking-wider uppercase text-[10px]">Indiranagar, Bengaluru</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-espresso-600 leading-[1.08]">
                  A Little Escape in{' '}
                  <span className="italic font-normal underline decoration-dustyPink-400 decoration-wavy decoration-2">
                    Every Cup.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-cocoaBrown-500 font-sans leading-relaxed max-w-xl pt-2">
                  Slow down, sip something beautiful, and make yourself at home. Handcrafted single-estate coffee, cloud lattes, and buttery French pastries in a peaceful pastel haven.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('menu')}
                  className="px-8 py-4 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 font-medium text-sm flex items-center gap-2.5 transition-all shadow-soft-lg group"
                >
                  <span>Explore Menu</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => onNavigate('reservations')}
                  className="px-7 py-4 rounded-full bg-white/80 hover:bg-cream-200 border border-pastelPeach-300 text-espresso-700 font-medium text-sm flex items-center gap-2 transition-all shadow-soft-sm"
                >
                  <Calendar className="w-4 h-4 text-cocoaBrown-500" />
                  <span>Reserve a Table</span>
                </button>

                <button
                  onClick={() => onNavigate('loyalty')}
                  className="px-5 py-3 rounded-full bg-dustyPink-200/80 hover:bg-dustyPink-300 text-espresso-700 font-medium text-xs flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-espresso-600" />
                  <span>Join Mist Moments (50 pts free)</span>
                </button>
              </div>

              {/* Editorial Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-pastelPeach-200/70 max-w-lg">
                <div>
                  <p className="font-serif font-bold text-2xl text-espresso-600">100%</p>
                  <p className="text-xs text-cocoaBrown-400">Single Estate Arabica</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-2xl text-espresso-600">18hr</p>
                  <p className="text-xs text-cocoaBrown-400">Slow Cold Extractions</p>
                </div>
                <div>
                  <p className="font-serif font-bold text-2xl text-espresso-600">Fresh</p>
                  <p className="text-xs text-cocoaBrown-400">Morning Butter Bakes</p>
                </div>
              </div>
            </div>

            {/* Right Editorial Visual & Emblem Stacking (5 cols) */}
            <div className="lg:col-span-5 relative">
              {/* Large organic frame */}
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background pastel patch */}
                <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl bg-pastelPeach-200 -rotate-2 -z-10" />
                <div className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl bg-dustyPink-200 rotate-2 -z-10" />

                {/* Main Hero Photo */}
                <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border-4 border-cream-50 aspect-[4/5] group">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                    alt="Artisan coffee pour at Mist and Coffee"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />

                  {/* Overlaid quote badge */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-cream-50/90 backdrop-blur-md border border-pastelPeach-200/80 shadow-soft">
                    <p className="font-handwriting text-lg text-espresso-700 leading-snug">
                      "Where gentle morning mist meets fresh dark roasted beans."
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cream-200 text-[11px] text-cocoaBrown-500">
                      <span>Slow Bar • Pour Over • Bakery</span>
                      <span className="font-serif font-bold text-espresso-600">Bengaluru</span>
                    </div>
                  </div>
                </div>

                {/* Floating Emblem Seal badge */}
                <div className="absolute -top-8 -right-6 md:-right-8 bg-cream-50 p-3 rounded-full shadow-2xl border-2 border-pastelPeach-300 animate-float-slow">
                  <BrandLogo variant="emblem" size="md" />
                </div>

                {/* Floating mini sticker card */}
                <div className="absolute -bottom-6 -left-6 bg-butterYellow-100/95 backdrop-blur-md p-3.5 rounded-2xl shadow-soft border border-butterYellow-300 hidden sm:block max-w-[170px]">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-cocoaBrown-600">
                    House Speciality
                  </p>
                  <p className="font-serif font-bold text-xs text-espresso-700">
                    The Mist Cloud Latte
                  </p>
                  <span className="text-[11px] font-sans font-semibold text-cocoaBrown-500">
                    ₹320 • Whipped Cream
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
              Daily Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
              Featured Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-cocoaBrown-500 mt-1">
              Loved by our regulars, hand-poured with love each morning.
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cocoaBrown-600 hover:text-espresso-800 transition-colors mt-4 md:mt-0 underline underline-offset-4"
          >
            <span>View Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map(product => (
            <div
              key={product.id}
              onClick={() => onOpenProductModal(product)}
              className="bg-white/90 rounded-3xl p-4 border border-pastelPeach-200/80 shadow-soft-sm pinterest-card cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-cream-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-50/90 text-espresso-700 shadow-soft-sm">
                  ★ {product.rating}
                </span>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onOpenProductModal(product);
                  }}
                  className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 flex items-center justify-center shadow-soft transition-transform hover:scale-105"
                  title="Customize & Add"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-cocoaBrown-400 uppercase tracking-wider">
                    {product.categoryId.replace('cat-', '').replace('-', ' ')}
                  </span>
                  <span className="font-serif font-bold text-espresso-600 text-base">
                    ₹{product.price}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-espresso-600 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-cocoaBrown-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-cream-200 flex items-center justify-between text-xs text-cocoaBrown-400">
                <span>{product.isVegetarian ? '🌱 100% Veg' : ''}</span>
                <span className="text-espresso-600 font-semibold group-hover:underline">
                  Customize &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIGNATURE DRINKS SPOTLIGHT */}
      <section className="bg-cream-200/50 py-20 border-y border-pastelPeach-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
              Exclusive House Alchemy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-600 mb-3">
              Our Signature Drinks
            </h2>
            <p className="text-sm text-cocoaBrown-500 leading-relaxed font-sans">
              Formulated by our master baristas. Subtle infusions of damask rose, wild vanilla bean, smoked maple, and velvety textured clouds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureDrinks.map((drink, index) => (
              <div
                key={drink.id}
                onClick={() => onOpenProductModal(drink)}
                className="bg-cream-50 rounded-3xl p-6 border border-pastelPeach-200 shadow-soft pinterest-card cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Vintage number badge */}
                <div className="absolute top-4 right-4 font-serif text-3xl font-bold text-pastelPeach-300 select-none">
                  0{index + 1}
                </div>

                <div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                    <img
                      src={drink.image}
                      alt={drink.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-butterYellow-200 text-espresso-700">
                      Signature Alchemy
                    </span>
                    <span className="text-xs text-cocoaBrown-400">★ {drink.rating}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-espresso-600 mb-2">
                    {drink.name}
                  </h3>

                  <p className="text-xs text-cocoaBrown-500 leading-relaxed mb-4">
                    {drink.description}
                  </p>

                  {/* Tasting notes */}
                  {drink.tastingNotes && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {drink.tastingNotes.map(n => (
                        <span
                          key={n}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-cream-200 text-cocoaBrown-600 font-serif italic"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-pastelPeach-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-cocoaBrown-400 uppercase tracking-wider block">
                      Price
                    </span>
                    <span className="font-serif font-bold text-xl text-espresso-600">
                      ₹{drink.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onOpenProductModal(drink);
                    }}
                    className="px-4 py-2 rounded-full bg-espresso-600 text-cream-50 text-xs font-semibold hover:bg-espresso-700 transition-colors shadow-soft-sm"
                  >
                    Customize Brew
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT MIST AND COFFEE — "More Than Coffee. A Feeling." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Asymmetrical photo collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=700&auto=format&fit=crop"
                  alt="Coffee pouring"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-dustyPink-100 border border-dustyPink-200 text-center">
                <p className="font-handwriting text-xl text-espresso-700">"Pour slow, live gentle."</p>
                <p className="text-[10px] text-cocoaBrown-400 uppercase tracking-wider mt-1">
                  Est. Bangalore
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[1/1]">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=700&auto=format&fit=crop"
                  alt="Fresh brioche cinnamon roll"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-soft aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=700&auto=format&fit=crop"
                  alt="Cafe atmosphere"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Story Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
              Our Story &amp; Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-600 leading-tight">
              More Than Coffee.{' '}
              <span className="italic font-normal block text-cocoaBrown-500">
                A Feeling.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-cocoaBrown-600 leading-relaxed">
              Mist and Coffee was born out of a quiet morning atop the misty hills of Chikmagalur. Watching the fog drift slowly across coffee plants, we wanted to capture that exact stillness — a moment where the world pauses, thoughts untangle, and life becomes simple again.
            </p>

            <div className="space-y-3.5 pt-2 text-xs sm:text-sm text-cocoaBrown-700">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sageGreen-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Single-Estate Shade Grown:</strong> Ethically sourced micro-lots harvested at optimal elevation from sustainable growers.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sageGreen-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Handcrafted Pottery:</strong> Every hot beverage is poured into bespoke tactile ceramics made by local independent potters.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sageGreen-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>The Slow Bar:</strong> No rushed buttons. We celebrate the meditative art of manual espresso extraction and gentle pour overs.
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-semibold tracking-wide transition-all shadow-soft"
              >
                Read Full Story
              </button>
              <button
                onClick={() => onNavigate('reservations')}
                className="px-6 py-3 rounded-full border border-pastelPeach-300 bg-white text-espresso-700 text-xs font-semibold hover:bg-cream-100 transition-colors"
              >
                Experience the Cafe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EXPLORE OUR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
            Crafted with Care
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600 mb-2">
            Explore Our Menu
          </h2>
          <p className="text-xs sm:text-sm text-cocoaBrown-500">
            From morning espresso to sunset botanical coolers and warm brioche tartines.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('menu')}
              className="p-5 rounded-3xl bg-cream-50 border border-pastelPeach-200/80 hover:border-dustyPink-400 shadow-soft-sm hover:shadow-soft transition-all cursor-pointer group text-center flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-pastelPeach-100 group-hover:bg-dustyPink-200 text-espresso-600 flex items-center justify-center transition-colors">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-espresso-600 group-hover:text-espresso-800">
                {cat.name}
              </h3>
              <p className="text-[11px] text-cocoaBrown-400 line-clamp-2 leading-tight">
                {cat.description}
              </p>
              <span className="text-[10px] font-bold text-cocoaBrown-500 pt-1 group-hover:underline">
                View &rarr;
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CAFE ATMOSPHERE GALLERY (Pinterest Moodboard) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
              Atmosphere &amp; Space
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
              Cafe Atmosphere Gallery
            </h2>
            <p className="text-xs sm:text-sm text-cocoaBrown-500 mt-1">
              Soft sunlight, curated vinyl records, green botanical corners, and calm tables.
            </p>
          </div>
          <p className="text-xs font-handwriting text-xl text-dustyPink-500 mt-2 md:mt-0">
            "Your cozy third place"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {atmosphereGallery.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl overflow-hidden shadow-soft-sm border border-pastelPeach-200 aspect-[4/3] bg-cream-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-[10px] uppercase font-bold tracking-wider text-dustyPink-200 block">
                  {item.tag}
                </span>
                <p className="font-serif font-bold text-lg">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="bg-pastelPeach-100/50 py-20 border-y border-pastelPeach-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
              Words From Our Guests
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600 mb-2">
              Stories From the Slow Bar
            </h2>
            <p className="text-xs sm:text-sm text-cocoaBrown-500">
              Why our guests keep returning for quiet mornings and golden hour lattes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="p-6 rounded-3xl bg-cream-50 border border-pastelPeach-200 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-butterYellow-400 text-butterYellow-400" />
                    ))}
                  </div>

                  <p className="font-serif italic text-base sm:text-lg text-espresso-700 leading-relaxed mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-200 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover border border-dustyPink-300"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-espresso-700">
                      {t.author}
                    </h4>
                    <p className="text-[11px] text-cocoaBrown-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LOYALTY REWARDS INTRODUCTION: MIST MOMENTS REWARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-4xl bg-gradient-to-br from-cream-100 via-dustyPink-100 to-pastelPeach-200 p-8 sm:p-12 border border-pastelPeach-300 shadow-soft-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-butterYellow-200/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-50/90 border border-dustyPink-300 text-espresso-700 text-xs font-semibold">
                <Gift className="w-3.5 h-3.5 text-dustyPink-500" />
                <span>Mist Moments Rewards Program</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-espresso-600 leading-tight">
                Every Sip Earns You{' '}
                <span className="italic font-normal underline decoration-dustyPink-400">
                  Sweet Moments.
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-cocoaBrown-600 max-w-xl leading-relaxed">
                Join our beloved rewards club and start earning 1 point for every ₹10 spent. Unlock complimentary artisan croissants, signature lattes, and exclusive table privileges.
              </p>

              {/* Tiers highlight */}
              <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
                <div className="p-3 rounded-2xl bg-cream-50/80 border border-pastelPeach-200 text-center">
                  <p className="text-[10px] uppercase font-bold text-cocoaBrown-400">Tier 1</p>
                  <p className="font-serif font-bold text-sm text-espresso-700">Little Sipper</p>
                  <p className="text-[10px] text-cocoaBrown-500">50 pts welcome</p>
                </div>
                <div className="p-3 rounded-2xl bg-cream-50/80 border border-pastelPeach-200 text-center">
                  <p className="text-[10px] uppercase font-bold text-cocoaBrown-400">Tier 2</p>
                  <p className="font-serif font-bold text-sm text-espresso-700">Coffee Lover</p>
                  <p className="text-[10px] text-cocoaBrown-500">Free bakes &amp; drops</p>
                </div>
                <div className="p-3 rounded-2xl bg-cream-50/80 border border-pastelPeach-200 text-center">
                  <p className="text-[10px] uppercase font-bold text-cocoaBrown-400">Tier 3</p>
                  <p className="font-serif font-bold text-sm text-espresso-700">Mist Insider</p>
                  <p className="text-[10px] text-cocoaBrown-500">20% off all orders</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('loyalty')}
                  className="px-7 py-3.5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-semibold flex items-center gap-2 transition-all shadow-soft"
                >
                  <span>Activate Your Membership (Instant 50 Pts)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Digital Membership Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-espresso-800 text-cream-50 p-6 shadow-2xl border-2 border-dustyPink-400/40 relative">
                <div className="flex items-center justify-between mb-6">
                  <BrandLogo variant="minimal" size="sm" />
                  <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-0.5 rounded-full bg-espresso-700 text-butterYellow-300">
                    VIP Member
                  </span>
                </div>

                <div className="my-6">
                  <p className="text-[10px] text-cream-300/60 uppercase tracking-widest">
                    Available Balance
                  </p>
                  <p className="font-serif font-bold text-3xl text-butterYellow-200">
                    240 <span className="text-sm font-sans font-normal text-cream-200">Points</span>
                  </p>
                </div>

                <div className="pt-4 border-t border-espresso-700 flex items-center justify-between text-xs">
                  <div>
                    <p className="text-[10px] text-cream-300/60 uppercase">Tier</p>
                    <p className="font-semibold text-dustyPink-300">Coffee Lover</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-cream-300/60 uppercase">Card No.</p>
                    <p className="font-mono text-[11px] text-cream-200">MIST-8492-901</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TABLE RESERVATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-espresso-800 text-cream-50 p-8 sm:p-12 overflow-hidden shadow-soft-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-bold text-dustyPink-300 block font-sans">
                Reserve Your Quiet Nook
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Planning a Slow Coffee Date or Creative Work Session?
              </h2>
              <p className="text-xs sm:text-sm text-cream-300/80 leading-relaxed">
                Reserve your preferred seating ahead of time — whether it's our sun-drenched outdoor patio, a quiet window bench with power outlets, or our cozy book corner.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('reservations')}
                  className="px-6 py-3.5 rounded-full bg-dustyPink-300 hover:bg-dustyPink-400 text-espresso-900 font-semibold text-xs tracking-wide transition-all shadow-soft"
                >
                  Book Table Online
                </button>
                <span className="text-xs text-cream-300/60">No booking fees • Instant SMS/Email confirm</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-[16/10] border border-espresso-700">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop"
                alt="Cafe seating"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCATION & OPENING HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-50 rounded-4xl p-8 sm:p-12 border border-pastelPeach-200/80 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
              Find Us
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
              Visit The Cafe
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-cocoaBrown-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pastelPeach-200 text-espresso-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Address</h4>
                  <p>14th Main Rd, 100ft Corner, Indiranagar, Bengaluru, Karnataka 560038</p>
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">Landmark: Opposite Lotus Park</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pastelPeach-200 text-espresso-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-espresso-700">Opening Hours</h4>
                  <p>Monday – Sunday: 9:00 AM – 9:00 PM</p>
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">Bakery fresh from 9:00 AM daily</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-2.5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 text-xs font-medium transition-colors"
              >
                View Directions &amp; Contact
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl overflow-hidden aspect-[16/9] border border-pastelPeach-200 relative shadow-soft-sm bg-cream-200">
            {/* Visual map preview placeholder */}
            <iframe
              title="Mist and Coffee Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15551.488390886596!2d77.63223019999999!3d12.978129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a7bb423e65%3A0xb5a76e9389bd608d!2sIndiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 11. INSTAGRAM COMMUNITY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="font-handwriting text-2xl text-dustyPink-500">#MistMoments</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-espresso-600">
            Follow Our Daily Sips
          </h2>
          <p className="text-xs text-cocoaBrown-400 mt-1">
            Tag us at <strong className="text-espresso-600">@mistandcoffee</strong> to be featured on our community wall.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop',
          ].map((img, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden aspect-square border border-pastelPeach-200 group relative shadow-soft-sm cursor-pointer"
            >
              <img
                src={img}
                alt="Instagram moment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-espresso-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Heart className="w-5 h-5 fill-white" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
