import React, { useState } from 'react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { X, Sparkles, Star, Plus, Minus, Check, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();

  if (!product) return null;

  const [selectedTemp, setSelectedTemp] = useState<'Hot' | 'Iced'>(
    product.options.temperatures[0] || 'Hot'
  );
  const [selectedMilk, setSelectedMilk] = useState<string>(
    product.options.milks[0] || ''
  );
  const [selectedSweetness, setSelectedSweetness] = useState<string>(
    product.options.sweetnessLevels[0] || ''
  );
  const [selectedIce, setSelectedIce] = useState<string>(
    product.options.iceLevels ? product.options.iceLevels[0] : 'Standard Ice'
  );
  const [extraShots, setExtraShots] = useState<number>(0);
  const [specialNote, setSpecialNote] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  // Dynamic price calculation
  let milkSurcharge = 0;
  if (selectedMilk && selectedMilk.includes('+₹')) {
    const match = selectedMilk.match(/\+₹(\d+)/);
    if (match) milkSurcharge = parseInt(match[1], 10);
  }
  const shotSurcharge = extraShots * 40;
  const currentUnitPrice = product.price + milkSurcharge + shotSurcharge;
  const currentTotalPrice = currentUnitPrice * quantity;

  const handleAdd = () => {
    addToCart(product, {
      selectedMilk: product.options.milks.length > 0 ? selectedMilk : undefined,
      selectedSweetness: product.options.sweetnessLevels.length > 0 ? selectedSweetness : undefined,
      selectedTemperature: product.options.temperatures.length > 0 ? selectedTemp : undefined,
      selectedIce: selectedTemp === 'Iced' && product.options.iceLevels ? selectedIce : undefined,
      extraShots,
      specialNote: specialNote.trim() || undefined,
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-cream-50 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-pastelPeach-200 z-10 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-cream-100/90 hover:bg-cream-200 text-espresso-600 flex items-center justify-center backdrop-blur-md shadow-soft-sm transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image & Badges */}
          <div className="relative h-64 md:h-full min-h-[260px] bg-cream-200 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent md:hidden" />

            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isSignature && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-butterYellow-200 text-espresso-700 shadow-soft-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-butterYellow-600" />
                  Signature Brew
                </span>
              )}
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-dustyPink-300 text-espresso-700 shadow-soft-sm">
                  ★ Bestseller
                </span>
              )}
            </div>

            {/* Origin & Roast tag on bottom left */}
            {product.origin && (
              <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-white/80 backdrop-blur-md text-xs text-espresso-600 border border-cream-200/60 hidden md:block">
                <p className="font-semibold text-[11px] text-cocoaBrown-500 uppercase tracking-wider">
                  Single Origin
                </p>
                <p className="font-serif font-bold text-sm text-espresso-700">{product.origin}</p>
                {product.roastLevel && (
                  <p className="text-[11px] text-cocoaBrown-400 mt-0.5">{product.roastLevel}</p>
                )}
              </div>
            )}
          </div>

          {/* Details & Customizer Panel */}
          <div className="p-6 md:p-7 flex flex-col max-h-[85vh] overflow-y-auto">
            {/* Dietary & Rating */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {product.isVegetarian && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-sageGreen-100 text-sageGreen-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Veg
                  </span>
                )}
                {product.isVegan && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-sageGreen-200 text-sageGreen-800 font-medium">
                    Plant-Based
                  </span>
                )}
                {product.isGlutenFree && (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-butterYellow-100 text-cocoaBrown-700 font-medium">
                    Gluten-Free
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-cocoaBrown-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-butterYellow-400 text-butterYellow-500" />
                <span>{product.rating}</span>
                <span className="text-cocoaBrown-400">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-serif font-bold text-2xl text-espresso-600 mb-2 leading-tight">
              {product.name}
            </h3>
            <p className="text-xs text-cocoaBrown-500 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-cocoaBrown-400 block mb-1.5">
                  Tasting Notes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tastingNotes.map(note => (
                    <span
                      key={note}
                      className="text-xs px-2.5 py-1 rounded-full bg-cream-200 text-cocoaBrown-700 font-serif italic"
                    >
                      "{note}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            <hr className="border-pastelPeach-200 my-2" />

            {/* Customization Options */}
            <div className="space-y-4 my-2 text-xs">
              {/* Temperature toggle if both Hot and Iced */}
              {product.options.temperatures.length > 1 && (
                <div>
                  <label className="font-semibold text-espresso-600 block mb-1.5">
                    Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.options.temperatures.map(temp => (
                      <button
                        key={temp}
                        type="button"
                        onClick={() => setSelectedTemp(temp)}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                          selectedTemp === temp
                            ? 'bg-espresso-600 text-cream-50 border-espresso-600 shadow-soft-sm'
                            : 'bg-white border-pastelPeach-200 text-espresso-600 hover:bg-cream-100'
                        }`}
                      >
                        {temp === 'Hot' ? '☕ Hot Brew' : '🧊 Chilled on Ice'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Options */}
              {product.options.milks.length > 0 && (
                <div>
                  <label className="font-semibold text-espresso-600 block mb-1.5">
                    Choice of Milk
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {product.options.milks.map(milk => (
                      <button
                        key={milk}
                        type="button"
                        onClick={() => setSelectedMilk(milk)}
                        className={`p-2 rounded-xl border text-left text-xs font-medium transition-all ${
                          selectedMilk === milk
                            ? 'bg-dustyPink-200/80 border-cocoaBrown-400 text-espresso-700 shadow-soft-sm'
                            : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
                        }`}
                      >
                        {milk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sweetness */}
              {product.options.sweetnessLevels.length > 0 && (
                <div>
                  <label className="font-semibold text-espresso-600 block mb-1.5">
                    Sweetness Level
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {product.options.sweetnessLevels.map(sw => (
                      <button
                        key={sw}
                        type="button"
                        onClick={() => setSelectedSweetness(sw)}
                        className={`p-2 rounded-xl border text-left text-xs font-medium transition-all ${
                          selectedSweetness === sw
                            ? 'bg-butterYellow-100 border-cocoaBrown-400 text-espresso-700 shadow-soft-sm'
                            : 'bg-white border-pastelPeach-200 text-cocoaBrown-600 hover:bg-cream-100'
                        }`}
                      >
                        {sw}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Espresso Shot */}
              {product.options.extraShotAvailable && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-pastelPeach-200">
                  <div>
                    <p className="font-semibold text-espresso-600 text-xs">Extra Espresso Shot</p>
                    <p className="text-[11px] text-cocoaBrown-400">+₹40 per shot</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={extraShots === 0}
                      onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                      className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 disabled:opacity-40 flex items-center justify-center text-espresso-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs w-4 text-center">{extraShots}</span>
                    <button
                      type="button"
                      disabled={extraShots >= 3}
                      onClick={() => setExtraShots(Math.min(3, extraShots + 1))}
                      className="w-7 h-7 rounded-full bg-cream-200 hover:bg-cream-300 disabled:opacity-40 flex items-center justify-center text-espresso-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Special Note */}
              <div>
                <label className="font-semibold text-espresso-600 block mb-1">
                  Special Notes for Barista
                </label>
                <input
                  type="text"
                  value={specialNote}
                  onChange={e => setSpecialNote(e.target.value)}
                  placeholder="e.g. Extra hot, oat milk froth, less ice..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-pastelPeach-200 bg-white placeholder-cocoaBrown-300 focus:outline-none focus:ring-1 focus:ring-espresso-500"
                />
              </div>
            </div>

            {/* Quantity and Add to Cart Button */}
            <div className="mt-auto pt-4 border-t border-pastelPeach-200 flex items-center gap-3">
              <div className="flex items-center border border-pastelPeach-300 rounded-full bg-white p-1">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-espresso-600 hover:bg-cream-100 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm px-3 text-espresso-600">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-espresso-600 hover:bg-cream-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3.5 px-5 rounded-full bg-espresso-600 hover:bg-espresso-700 text-cream-50 font-medium text-sm flex items-center justify-between transition-all shadow-soft group"
              >
                <span>{isAdded ? 'Added to Basket!' : 'Add to Basket'}</span>
                <span className="font-serif font-bold text-base">₹{currentTotalPrice}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
