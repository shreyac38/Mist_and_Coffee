import React from 'react';
import { BrandLogo } from '../components/brand/BrandLogo';
import { Sparkles, Heart, Leaf, Award, Coffee, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigateToMenu: () => void;
  onNavigateToReservations: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToMenu,
  onNavigateToReservations,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-20 md:space-y-28">
      {/* 1. HERO STORYTELLING */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pastelPeach-200 border border-pastelPeach-300 text-espresso-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-butterYellow-600" />
          <span>Our Story &amp; Ethos</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-espresso-600 leading-tight">
          More Than Coffee.{' '}
          <span className="italic font-normal block text-cocoaBrown-500">
            A Feeling.
          </span>
        </h1>

        <p className="font-handwriting text-2xl sm:text-3xl text-dustyPink-500 pt-1">
          "Slow down, sip something beautiful, and make yourself at home."
        </p>

        <p className="text-sm sm:text-base text-cocoaBrown-500 leading-relaxed font-sans max-w-2xl mx-auto pt-2">
          Mist and Coffee was born out of a quiet morning atop the emerald ridges of Chikmagalur, where early fog hugs the coffee blossoms and time appears to stop. We wanted to bring that stillness to the bustling streets of Bengaluru.
        </p>
      </section>

      {/* 2. EDITORIAL PHOTO COLLAGE */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 space-y-4">
          <div className="rounded-4xl overflow-hidden shadow-soft border border-pastelPeach-200 aspect-[4/5] bg-cream-200">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=900&auto=format&fit=crop"
              alt="Artisan Barista pulling espresso"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="font-serif italic text-xs text-cocoaBrown-400 text-center">
            Precision extraction on our custom chrome espresso machine.
          </p>
        </div>

        <div className="md:col-span-7 space-y-6 md:pl-6">
          <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
            The Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
            From Misty Hills to Ceramic Mugs
          </h2>
          <p className="text-xs sm:text-sm text-cocoaBrown-600 leading-relaxed">
            In 2024, our founders set out on a journey across Karnataka and Kerala's high-altitude micro-lots. We met multi-generational farmers who hand-pick only the reddest coffee cherries, cultivating biodiversity alongside wild pepper vines, silver oaks, and cardamom shrubs.
          </p>
          <p className="text-xs sm:text-sm text-cocoaBrown-600 leading-relaxed">
            Every batch of green beans arriving at Mist and Coffee is sample-roasted in small 5kg drums, rigorously tested on the cupping table, and allowed to rest until its sweet natural honey notes, jasmine aromas, and stone fruit acidity bloom to perfection.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-cream-50 border border-pastelPeach-200">
              <p className="font-serif font-bold text-xl text-espresso-700">1,250m+</p>
              <p className="text-xs text-cocoaBrown-400">High Altitude Shade Grown</p>
            </div>
            <div className="p-4 rounded-2xl bg-cream-50 border border-pastelPeach-200">
              <p className="font-serif font-bold text-xl text-espresso-700">100% Direct</p>
              <p className="text-xs text-cocoaBrown-400">Directly Traded Micro-lots</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PILLARS */}
      <section className="bg-cream-50 p-8 sm:p-14 rounded-4xl border border-pastelPeach-200 shadow-soft">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block mb-2 font-sans">
            Guiding Values
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
            Our Cafe Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-pastelPeach-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-dustyPink-100 flex items-center justify-center text-espresso-700">
              <Coffee className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              The Slow Bar
            </h4>
            <p className="text-xs text-cocoaBrown-500 leading-relaxed">
              We never cut corners. Manual pour-overs, calibrated brew ratios, and velvet micro-foam textured to exact temperatures.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-pastelPeach-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sageGreen-100 flex items-center justify-center text-espresso-700">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              Pure Botanicals
            </h4>
            <p className="text-xs text-cocoaBrown-500 leading-relaxed">
              We whisk first-harvest Uji matcha, steep organic Egyptian chamomile, and perfume our syrups with real damask rose and lavender.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-pastelPeach-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-butterYellow-100 flex items-center justify-center text-espresso-700">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              Artisan Viennoiserie
            </h4>
            <p className="text-xs text-cocoaBrown-500 leading-relaxed">
              French butter laminated by hand, slow-fermented overnight brioche, and golden flaky croissants baked fresh every morning.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-pastelPeach-200 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pastelPeach-100 flex items-center justify-center text-espresso-700">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-lg text-espresso-700">
              Cozy Haven
            </h4>
            <p className="text-xs text-cocoaBrown-500 leading-relaxed">
              Pinterest pastel spaces filled with soft jazz, plant cuttings, linen cushions, and warm ceramic cups designed for long reading sessions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. THE ROASTERY & PACKAGING */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
            Packaging &amp; Craft
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-600">
            Tactile Ceramics &amp; Eco Bags
          </h2>
          <p className="text-xs sm:text-sm text-cocoaBrown-600 leading-relaxed">
            We believe the tactile touch of your cup is as important as the brew inside. We partner with local independent pottery studios in Bangalore to shape our bespoke curved ceramic cups, glazed in gentle cream, dusty peach, and muted sage.
          </p>
          <p className="text-xs sm:text-sm text-cocoaBrown-600 leading-relaxed">
            Our whole-bean retail bags and takeaway coffee cups are 100% plant-compostable, printed with non-toxic vegetable inks and stamped with our vintage botanical emblem.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={onNavigateToMenu}
              className="px-6 py-3 rounded-full bg-espresso-600 text-cream-50 text-xs font-semibold hover:bg-espresso-700 transition-colors shadow-soft"
            >
              Order Takeaway or Delivery
            </button>
            <button
              onClick={onNavigateToReservations}
              className="px-6 py-3 rounded-full border border-pastelPeach-300 bg-white text-espresso-700 text-xs font-semibold hover:bg-cream-100 transition-colors"
            >
              Visit Our Space
            </button>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-soft border border-pastelPeach-200 aspect-[4/3] bg-cream-200">
          <img
            src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=900&auto=format&fit=crop"
            alt="Ceramic cup and coffee"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};
