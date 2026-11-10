import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Plus, 
  Coffee, 
  X, 
  Star, 
  Check, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';

interface MenuPageProps {
  products: Product[];
  categories: Category[];
  onOpenProductModal: (product: Product) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  products,
  categories,
  onOpenProductModal,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVegOnly, setFilterVegOnly] = useState<boolean>(false);
  const [filterVeganOnly, setFilterVeganOnly] = useState<boolean>(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState<boolean>(false);
  const [filterBestsellers, setFilterBestsellers] = useState<boolean>(false);
  const [filterSignature, setFilterSignature] = useState<boolean>(false);

  // Quick instant add
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedNotice(`Added "${product.name}" to basket`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesNotes = item.tastingNotes?.some(n => n.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesNotes) {
          return false;
        }
      }
      // Dietary filters
      if (filterVegOnly && !item.isVegetarian) return false;
      if (filterVeganOnly && !item.isVegan) return false;
      if (filterGlutenFree && !item.isGlutenFree) return false;
      if (filterBestsellers && !item.isBestSeller) return false;
      if (filterSignature && !item.isSignature) return false;

      return true;
    });
  }, [
    products, 
    selectedCategory, 
    searchQuery, 
    filterVegOnly, 
    filterVeganOnly, 
    filterGlutenFree, 
    filterBestsellers, 
    filterSignature
  ]);

  const activeFiltersCount = 
    (filterVegOnly ? 1 : 0) +
    (filterVeganOnly ? 1 : 0) +
    (filterGlutenFree ? 1 : 0) +
    (filterBestsellers ? 1 : 0) +
    (filterSignature ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setFilterVegOnly(false);
    setFilterVeganOnly(false);
    setFilterGlutenFree(false);
    setFilterBestsellers(false);
    setFilterSignature(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase tracking-widest font-bold text-cocoaBrown-400 block font-sans">
          The Slow Bar Menu
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-espresso-600">
          Handcrafted Sips &amp; Bakes
        </h1>
        <p className="text-xs sm:text-sm text-cocoaBrown-500 leading-relaxed font-sans">
          Every espresso is pulled with deliberate attention, steamed with velvety textured milk, and paired with morning-baked French viennoiserie.
        </p>
      </div>

      {/* Quick notice toast */}
      {addedNotice && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 bg-espresso-800 text-cream-50 px-4 py-3 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-dustyPink-300 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{addedNotice}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs text-butterYellow-300 font-bold underline pl-2"
          >
            View Basket &rarr;
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-cream-50 p-4 sm:p-6 rounded-3xl border border-pastelPeach-200/80 shadow-soft-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-cocoaBrown-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search brews, cold coffees, croissants, tasting notes..."
              className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-pastelPeach-300 bg-white placeholder-cocoaBrown-300 focus:outline-none focus:ring-1 focus:ring-espresso-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cocoaBrown-400 hover:text-espresso-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear button */}
          {(activeFiltersCount > 0 || selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2.5 rounded-2xl border border-pastelPeach-300 bg-white text-xs text-cocoaBrown-600 hover:bg-cream-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Dietary and Tag Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-cocoaBrown-400 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" />
            Filters:
          </span>

          <button
            onClick={() => setFilterVegOnly(!filterVegOnly)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              filterVegOnly
                ? 'bg-sageGreen-200 border-sageGreen-400 text-espresso-700 font-bold'
                : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
            }`}
          >
            🌱 Vegetarian Only
          </button>

          <button
            onClick={() => setFilterVeganOnly(!filterVeganOnly)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              filterVeganOnly
                ? 'bg-sageGreen-300 border-sageGreen-500 text-espresso-700 font-bold'
                : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
            }`}
          >
            🍃 Plant-Based / Vegan
          </button>

          <button
            onClick={() => setFilterGlutenFree(!filterGlutenFree)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              filterGlutenFree
                ? 'bg-butterYellow-200 border-butterYellow-400 text-espresso-700 font-bold'
                : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
            }`}
          >
            🌾 Gluten-Free
          </button>

          <button
            onClick={() => setFilterBestsellers(!filterBestsellers)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              filterBestsellers
                ? 'bg-dustyPink-300 border-dustyPink-400 text-espresso-700 font-bold'
                : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
            }`}
          >
            ★ Bestsellers
          </button>

          <button
            onClick={() => setFilterSignature(!filterSignature)}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              filterSignature
                ? 'bg-pastelPeach-300 border-pastelPeach-400 text-espresso-700 font-bold'
                : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
            }`}
          >
            ✨ Signature Recipes
          </button>
        </div>

        {/* Category Pills Navigation */}
        <div className="pt-2 border-t border-pastelPeach-200/60 overflow-x-auto pb-1 flex items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-espresso-600 text-cream-50 shadow-soft-sm'
                : 'bg-white border border-pastelPeach-200 text-espresso-600 hover:bg-cream-200'
            }`}
          >
            All Items ({products.length})
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-espresso-600 text-cream-50 shadow-soft-sm'
                    : 'bg-white border border-pastelPeach-200 text-espresso-600 hover:bg-cream-200'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-espresso-700 text-cream-100' : 'bg-cream-200 text-cocoaBrown-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Current Active View */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-cocoaBrown-400 px-1">
        <span>
          Showing <strong>{filteredProducts.length}</strong> creations
          {selectedCategory !== 'all' && (
            <span> in <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
          )}
        </span>
        <span className="font-handwriting text-base sm:text-lg text-dustyPink-500">
          Click any product to customize milk &amp; sweetness
        </span>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-cream-50 rounded-3xl border border-dashed border-pastelPeach-300 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-pastelPeach-100 text-cocoaBrown-400 mx-auto flex items-center justify-center">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-2xl text-espresso-600">
            No matching coffees or bakes found
          </h3>
          <p className="text-xs text-cocoaBrown-400 max-w-sm mx-auto">
            Try adjusting your search query or removing dietary filters to see our full artisan collection.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-full bg-espresso-600 text-cream-50 text-xs font-semibold"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => onOpenProductModal(product)}
              className="bg-white/90 rounded-3xl p-4 border border-pastelPeach-200 shadow-soft-sm pinterest-card cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3.5 bg-cream-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {product.isSignature && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-butterYellow-200 text-espresso-800 shadow-soft-sm">
                        Signature
                      </span>
                    )}
                    {product.isBestSeller && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-dustyPink-300 text-espresso-800 shadow-soft-sm">
                        ★ Bestseller
                      </span>
                    )}
                  </div>

                  {/* Dietary indicator dot on top right */}
                  <div className="absolute top-2.5 right-2.5">
                    {product.isVegetarian && (
                      <span className="w-5 h-5 rounded-md bg-white/90 backdrop-blur-sm border border-emerald-600 flex items-center justify-center shadow-soft-sm" title="Vegetarian">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      </span>
                    )}
                  </div>

                  {/* Quick Add Floating Button */}
                  <button
                    type="button"
                    onClick={e => handleQuickAdd(product, e)}
                    className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 flex items-center justify-center shadow-soft transition-all duration-300 hover:scale-110"
                    title="Quick add to basket"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Category & Rating */}
                <div className="flex items-center justify-between text-[11px] text-cocoaBrown-400 mb-1">
                  <span className="uppercase tracking-wider font-medium">
                    {product.categoryId.replace('cat-', '').replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-butterYellow-400 text-butterYellow-400" />
                    <span className="font-semibold text-espresso-600">{product.rating}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-serif font-bold text-lg text-espresso-600 mb-1 group-hover:text-espresso-800 line-clamp-1">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-cocoaBrown-500 line-clamp-2 leading-relaxed mb-3">
                  {product.description}
                </p>

                {/* Tasting notes */}
                {product.tastingNotes && product.tastingNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tastingNotes.slice(0, 2).map(n => (
                      <span
                        key={n}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-cream-100 text-cocoaBrown-600 font-serif italic border border-pastelPeach-200"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price & Action row */}
              <div className="pt-3 border-t border-cream-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cocoaBrown-400 uppercase tracking-wider block">
                    Price
                  </span>
                  <span className="font-serif font-bold text-lg text-espresso-600">
                    ₹{product.price}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onOpenProductModal(product);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-cream-200 hover:bg-dustyPink-200 text-espresso-700 text-xs font-semibold transition-colors border border-pastelPeach-300"
                >
                  Customize
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
