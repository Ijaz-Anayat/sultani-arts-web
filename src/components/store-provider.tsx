"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CART_STORAGE_KEY, WISHLIST_STORAGE_KEY } from "@/lib/constants";
import type { CartItem } from "@/lib/types";

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  globalDiscountPercent: number;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string, size: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  clearCart: () => void;
  toast: string | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({
  children,
  globalDiscountPercent = 0,
}: {
  children: ReactNode;
  globalDiscountPercent?: number;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(readStorage<CartItem[]>(CART_STORAGE_KEY, []));
    setWishlist(readStorage<string[]>(WISHLIST_STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const quantity = item.quantity ?? 1;
      setCart((current) => {
        const existing = current.find(
          (entry) => entry.productId === item.productId && entry.size === item.size,
        );
        if (existing) {
          return current.map((entry) =>
            entry.productId === item.productId && entry.size === item.size
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry,
          );
        }
        return [
          ...current,
          {
            productId: item.productId,
            title: item.title,
            image: item.image,
            size: item.size,
            price: item.price,
            originalPrice: item.originalPrice,
            quantity,
          },
        ];
      });
      showToast("Added to cart");
    },
    [showToast],
  );

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((current) =>
      current.filter((item) => !(item.productId === productId && item.size === size)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((current) => {
        if (current.includes(id)) {
          return current.filter((item) => item !== id);
        }
        showToast("Saved to wishlist");
        return [...current, id];
      });
    },
    [showToast],
  );

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartCount,
      globalDiscountPercent,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      cartOpen,
      setCartOpen,
      clearCart,
      toast,
    }),
    [
      cart,
      wishlist,
      cartCount,
      globalDiscountPercent,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      cartOpen,
      clearCart,
      toast,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 px-0 sm:w-auto">
          <p className="border border-gold/40 bg-ink px-4 py-2.5 text-center font-sans text-[0.65rem] tracking-[0.16em] text-ivory uppercase shadow-lg sm:px-5 sm:text-xs sm:tracking-[0.22em]">
            {toast}
          </p>
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}
