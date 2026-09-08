import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, CurrencyCode, CurrencyConfig, FilterState, ProductReview } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { getShoeImage } from '../utils/imageHelper';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // productIds
  orders: Order[];
  currency: CurrencyConfig;
  filters: FilterState;
  toasts: ToastMessage[];
  
  // UI states
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderTrackingOpen: boolean;
  isSizeGuideOpen: boolean;
  selectedProduct: Product | null;
  latestOrder: Order | null;
  activePromoCode: string | null;
  promoDiscountPercent: number;

  // Actions
  setCurrencyCode: (code: CurrencyCode) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  formatPrice: (amountInUSD: number) => string;
  
  // Cart Actions
  addToCart: (product: Product, size: number, colorName: string, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveWishlistToCart: (product: Product) => void;

  // Review & Orders
  addProductReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verified'>) => void;
  placeOrder: (shippingAddress: any, paymentMethod: string, shippingSpeed: string) => Order;

  // Modal controls
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  openOrderTracking: (orderId?: string) => void;
  closeOrderTracking: () => void;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
  dismissOrderConfirmation: () => void;

  // Calculations
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTax: number;
  cartTotal: number;
  cartItemCount: number;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'All',
  gender: 'All',
  selectedSize: null,
  maxPrice: 250,
  sortBy: 'featured',
  searchQuery: '',
  onSaleOnly: false,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pegasus_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        // Merge with current INITIAL_PRODUCTS so any updated bundled images and colorways take effect
        return INITIAL_PRODUCTS.map((initProd) => {
          const matched = parsed.find((p) => p.id === initProd.id);
          if (!matched) return initProd;
          return {
            ...matched,
            image: initProd.image,
            colorways: initProd.colorways,
          };
        });
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('pegasus_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          image: getShoeImage(item.image),
        }));
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('pegasus_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pegasus_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES.USD);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('pegasus_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pegasus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pegasus_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pegasus_products', JSON.stringify(products));
  }, [products]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrency(CURRENCIES[code] || CURRENCIES.USD);
  };

  const formatPrice = (amountInUSD: number): string => {
    const converted = amountInUSD * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Cart operations
  const addToCart = (product: Product, size: number, colorName: string, quantity = 1) => {
    const selectedColorway = product.colorways.find((c) => c.name === colorName) || product.colorways[0];
    const cartItemId = `${product.id}-${size}-${selectedColorway.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          size,
          color: selectedColorway.name,
          image: selectedColorway.image || product.image,
          quantity,
          maxStock: product.stock,
        },
      ];
    });

    showToast(`Added ${product.name} (US ${size}) to cart!`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: Math.min(newQuantity, item.maxStock) } : item
      )
    );
  };

  const removeFromCart = (cartItemId: string) => {
    const itemToRemove = cart.find((i) => i.id === cartItemId);
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    if (itemToRemove) {
      showToast(`Removed ${itemToRemove.name} from cart`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'PEGASUS20') {
      setActivePromoCode(normalized);
      setPromoDiscountPercent(20);
      showToast('20% promo discount applied!', 'success');
      return true;
    } else if (normalized === 'WELCOME10') {
      setActivePromoCode(normalized);
      setPromoDiscountPercent(10);
      showToast('10% welcome discount applied!', 'success');
      return true;
    } else if (normalized === 'RUNNER15') {
      setActivePromoCode(normalized);
      setPromoDiscountPercent(15);
      showToast('15% runner discount applied!', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try PEGASUS20 or WELCOME10', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setActivePromoCode(null);
    setPromoDiscountPercent(0);
    showToast('Promo code removed', 'info');
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const moveWishlistToCart = (product: Product) => {
    addToCart(product, product.sizes[0] || 9, product.colorways[0].name, 1);
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  // Reviews
  const addProductReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'verified'>
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedReviews = [newReview, ...(p.reviews || [])];
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...p,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: newAvg,
          };
        }
        return p;
      })
    );

    // Also update selected product if currently open
    if (selectedProduct && selectedProduct.id === productId) {
      const updatedReviews = [newReview, ...(selectedProduct.reviews || [])];
      const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
      setSelectedProduct({
        ...selectedProduct,
        reviews: updatedReviews,
        reviewsCount: updatedReviews.length,
        rating: Number((totalRating / updatedReviews.length).toFixed(1)),
      });
    }

    showToast('Thank you! Your verified review has been posted.', 'success');
  };

  // Order Placement
  const placeOrder = (shippingAddress: any, paymentMethod: string, shippingSpeed: string): Order => {
    const baseShipping = shippingSpeed === 'express' ? 15 : shippingSpeed === 'nextday' ? 25 : 0;
    const finalShipping = cartSubtotal >= 100 && shippingSpeed === 'standard' ? 0 : baseShipping;
    const discount = (cartSubtotal * promoDiscountPercent) / 100;
    const tax = Number(((cartSubtotal - discount) * 0.0825).toFixed(2));
    const total = Number((cartSubtotal - discount + finalShipping + tax).toFixed(2));

    const newOrder: Order = {
      id: `PEG-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Order Placed',
      trackingNumber: `1Z9999999${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal: Number(cartSubtotal.toFixed(2)),
      shipping: finalShipping,
      discount: Number(discount.toFixed(2)),
      tax,
      total,
      shippingAddress,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLatestOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    showToast(`Order #${newOrder.id} successfully placed!`, 'success');
    return newOrder;
  };

  // Totals calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartDiscount = (cartSubtotal * promoDiscountPercent) / 100;
  const cartShipping = cartSubtotal >= 100 || cartSubtotal === 0 ? 0 : 9.99;
  const cartTax = (cartSubtotal - cartDiscount) * 0.0825;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping + cartTax);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currency,
        filters,
        toasts,
        isCartOpen,
        isWishlistOpen,
        isCheckoutOpen,
        isOrderTrackingOpen,
        isSizeGuideOpen,
        selectedProduct,
        latestOrder,
        activePromoCode,
        promoDiscountPercent,

        setCurrencyCode,
        setFilters,
        resetFilters,
        formatPrice,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,

        toggleWishlist,
        isInWishlist,
        moveWishlistToCart,

        addProductReview,
        placeOrder,

        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openWishlist: () => setIsWishlistOpen(true),
        closeWishlist: () => setIsWishlistOpen(false),
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),
        openProductDetail: (product: Product) => setSelectedProduct(product),
        closeProductDetail: () => setSelectedProduct(null),
        openOrderTracking: () => setIsOrderTrackingOpen(true),
        closeOrderTracking: () => setIsOrderTrackingOpen(false),
        openSizeGuide: () => setIsSizeGuideOpen(true),
        closeSizeGuide: () => setIsSizeGuideOpen(false),
        dismissOrderConfirmation: () => setLatestOrder(null),

        cartSubtotal,
        cartDiscount,
        cartShipping,
        cartTax,
        cartTotal,
        cartItemCount,
        showToast,
        removeToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
