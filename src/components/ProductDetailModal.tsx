import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getShoeImage, handleImageError } from '../utils/imageHelper';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  Star, 
  Ruler, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  MessageSquarePlus
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    closeProductDetail, 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openSizeGuide,
    addProductReview 
  } = useShop();

  if (!selectedProduct) return null;

  const [selectedColorway, setSelectedColorway] = useState(selectedProduct.colorways[0]);
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[2] || selectedProduct.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isWishlisted = isInWishlist(selectedProduct.id);
  const discountPercent = Math.round(
    ((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) return;

    addProductReview(selectedProduct.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      title: reviewTitle.trim() || 'Great shoe!',
      comment: reviewComment.trim(),
    });

    setReviewAuthor('');
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColorway.name, quantity);
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={closeProductDetail}
    >
      <div
        id="product-detail-dialog"
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-detail-modal-btn"
          onClick={closeProductDetail}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Gallery & Color Showcase */}
          <div
            className="p-8 sm:p-12 flex flex-col justify-between items-center relative transition-colors duration-500"
            style={{ backgroundColor: selectedColorway.bgHex || '#F8FAFC' }}
          >
            {/* Top tags */}
            <div className="w-full flex items-center justify-between z-10">
              <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
                {selectedProduct.category} · {selectedProduct.gender}
              </span>
              {discountPercent > 0 && (
                <span className="bg-rose-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Featured Image with dynamic hover rotation */}
            <div className="my-8 relative flex items-center justify-center">
              <img
                src={getShoeImage(selectedColorway.image || selectedProduct.image)}
                alt={`${selectedProduct.name} - ${selectedColorway.name}`}
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-72 sm:w-80 h-auto object-contain drop-shadow-2xl transform hover:scale-110 hover:-rotate-6 transition-transform duration-500"
              />
            </div>

            {/* Colorway Switcher */}
            <div className="w-full z-10">
              <div className="text-xs font-semibold text-slate-600 mb-2">
                Colorway: <span className="text-slate-900 font-bold">{selectedColorway.name}</span>
              </div>
              <div className="flex items-center gap-2.5">
                {selectedProduct.colorways.map((cw) => (
                  <button
                    key={cw.name}
                    onClick={() => setSelectedColorway(cw)}
                    className={`group relative p-1 rounded-xl transition-all cursor-pointer ${
                      selectedColorway.name === cw.name
                        ? 'ring-2 ring-slate-950 scale-105 bg-white shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg border border-slate-300"
                      style={{ backgroundColor: cw.hex }}
                    />
                    <span className="sr-only">{cw.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Information, Sizes, Action, Specs & Reviews */}
          <div className="p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Rating header */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(selectedProduct.rating) ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{selectedProduct.rating}</span>
                  <span className="text-slate-600 font-normal">
                    ({selectedProduct.reviewsCount} verified reviews)
                  </span>
                </div>
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stock} pairs)
                </span>
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {selectedProduct.name}
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedProduct.subtitle}</p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-3xl font-black text-slate-950">
                  {formatPrice(selectedProduct.price)}
                </span>
                <span className="text-base text-rose-500 line-through font-medium">
                  {formatPrice(selectedProduct.originalPrice)}
                </span>
              </div>

              {/* Size Selector Header */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Select Size (US)
                  </label>
                  <button
                    onClick={openSizeGuide}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                {/* Size Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      id={`modal-size-btn-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-slate-950 text-white shadow-md ring-2 ring-slate-950'
                          : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Quantity:
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedProduct.stock, quantity + 1))}
                    className="px-3 py-1.5 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions: Add to Cart & Wishlist */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-sm transition-all duration-200 shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart · {formatPrice(selectedProduct.price * quantity)}</span>
                </button>

                <button
                  id="modal-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                      : 'bg-white text-slate-700 border-slate-300 hover:text-rose-500 hover:border-rose-300'
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Tabs: Overview, Specs, Reviews */}
              <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-2 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'specs'
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Lab Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'reviews'
                        ? 'border-sky-500 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Reviews ({selectedProduct.reviewsCount})
                  </button>
                </div>

                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="py-4 space-y-3 text-xs text-slate-600 leading-relaxed">
                    <p>{selectedProduct.description}</p>
                    <ul className="space-y-1.5 pt-2">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tab 2: Specs */}
                {activeTab === 'specs' && (
                  <div className="py-4 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-600 font-semibold block">Cushioning</span>
                      <span className="font-bold text-slate-900">{selectedProduct.specs.cushioning}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-600 font-semibold block">Drop</span>
                      <span className="font-bold text-slate-900">{selectedProduct.specs.drop}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-600 font-semibold block">Weight</span>
                      <span className="font-bold text-slate-900">{selectedProduct.specs.weight}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                      <span className="text-slate-600 font-semibold block">Terrain</span>
                      <span className="font-bold text-slate-900">{selectedProduct.specs.terrain}</span>
                    </div>
                  </div>
                )}

                {/* Tab 3: Reviews */}
                {activeTab === 'reviews' && (
                  <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Runner Feedback</span>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
                      </button>
                    </div>

                    {/* Write Review Form */}
                    {showReviewForm && (
                      <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase">Your Name</label>
                          <input
                            type="text"
                            required
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="e.g. Alex Rivera"
                            className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase">Rating</label>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    star <= reviewRating ? 'fill-current' : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase">Review Title</label>
                          <input
                            type="text"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            placeholder="e.g. Responsive bounce for tempo runs"
                            className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 uppercase">Your Feedback</label>
                          <textarea
                            required
                            rows={3}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Tell other runners about the fit, responsiveness, and feel..."
                            className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          Submit Verified Review
                        </button>
                      </form>
                    )}

                    {/* Existing reviews list */}
                    <div className="space-y-3">
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{rev.author}</span>
                              <span className="text-slate-600 text-[10px]">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-slate-300'}`}
                                />
                              ))}
                              {rev.verified && (
                                <span className="text-[10px] text-emerald-700 font-semibold ml-2">
                                  ✓ Verified Runner
                                </span>
                              )}
                            </div>
                            <p className="font-semibold text-slate-800 pt-0.5">{rev.title}</p>
                            <p className="text-slate-600">{rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Guarantees bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>Free shipping &gt; $100</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-teal-500" />
                  <span>30-day wear test</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>2-year guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
