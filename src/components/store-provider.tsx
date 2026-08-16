"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/data";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type StoreContextValue = {
  cart: CartItem[];
  wishlist: string[];
  cartCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toast: string | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      setCart((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          },
        ];
      });
      showToast("Added to cart");
    },
    [showToast],
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((current) => current.filter((item) => item.id !== id));
  }, []);

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
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      cartOpen,
      setCartOpen,
      toast,
    }),
    [
      cart,
      wishlist,
      cartCount,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
      cartOpen,
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
