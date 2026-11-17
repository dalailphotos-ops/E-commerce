"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

export const STORAGE_KEY = "asson_quote_v1";

export interface CartItemPrint {
  position: "front" | "back" | "left" | "right" | "neck" | string;
  sizeKey: string;
  sizeLabel?: string;
  dimensions?: string;
  cost: number;
  isWaived?: boolean;
  previewUrl?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSpec?: string;
  color: string;
  colorHex?: string;
  sizes: Record<string, number>;
  quantity: number;
  prints?: CartItemPrint[];
  mockupFrontUrl?: string;
  mockupBackUrl?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { productId: string; unitPrice: number }) => CartItem;
  updateItem: (id: string, updates: Partial<CartItem>) => CartItem;
  removeItem: (id: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  gst: number;
  grandTotal: number;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function computeQuantity(sizes?: Record<string, number>, fallbackQty?: number): number {
  if (sizes && typeof sizes === "object") {
    const sum = Object.values(sizes).reduce((acc, n) => acc + (Number(n) || 0), 0);
    if (sum > 0) return sum;
  }
  return Math.max(1, Math.abs(Number(fallbackQty) || 1));
}

function computeTotalPrice(unitPrice: number, quantity: number): number {
  return Math.round((Number(unitPrice) || 0) * (Number(quantity) || 1) * 100) / 100;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const idCounterRef = useRef(0);

  const saveToStorage = useCallback((currentItems: CartItem[]) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
      } catch (err) {
        console.error("Failed to save cart to localStorage:", err);
      }
    }
  }, []);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load cart from localStorage:", err);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  const generateId = useCallback(() => {
    idCounterRef.current += 1;
    return `item_${Date.now()}_${idCounterRef.current}_${Math.random().toString(36).substring(2, 7)}`;
  }, []);

  const addItem = useCallback(
    (item: Partial<CartItem> & { productId: string; unitPrice: number }): CartItem => {
      const quantity = computeQuantity(item.sizes, item.quantity);
      const unitPrice = Number(item.unitPrice) || 0;
      const totalPrice = computeTotalPrice(unitPrice, quantity);

      const newItem: CartItem = {
        id: item.id || generateId(),
        productId: item.productId || "unknown",
        productName: item.productName || "Unnamed Garment",
        productSpec: item.productSpec || "",
        color: item.color || "Black",
        colorHex: item.colorHex || "#000000",
        sizes: item.sizes ? { ...item.sizes } : { M: quantity },
        quantity,
        prints: Array.isArray(item.prints) ? [...item.prints] : [],
        mockupFrontUrl: item.mockupFrontUrl || "",
        mockupBackUrl: item.mockupBackUrl || "",
        unitPrice,
        totalPrice,
      };

      setItems((prev) => {
        const next = [...prev, newItem];
        saveToStorage(next);
        return next;
      });

      return newItem;
    },
    [generateId, saveToStorage]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<CartItem>): CartItem => {
      let updatedItem: CartItem | null = null;

      setItems((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) {
          throw new Error(`CartItem with ID ${id} not found`);
        }

        const current = prev[index];
        const newSizes = updates.sizes !== undefined ? { ...updates.sizes } : current.sizes;
        const newQuantity =
          updates.quantity !== undefined
            ? Math.max(1, Math.abs(Number(updates.quantity) || 1))
            : computeQuantity(newSizes, current.quantity);
        const newUnitPrice =
          updates.unitPrice !== undefined ? Number(updates.unitPrice) : current.unitPrice;
        const newTotalPrice = computeTotalPrice(newUnitPrice, newQuantity);

        const merged: CartItem = {
          ...current,
          ...updates,
          sizes: newSizes,
          quantity: newQuantity,
          unitPrice: newUnitPrice,
          totalPrice: newTotalPrice,
        };

        updatedItem = merged;
        const next = [...prev];
        next[index] = merged;
        saveToStorage(next);
        return next;
      });

      if (!updatedItem) {
        throw new Error(`CartItem with ID ${id} not found`);
      }
      return updatedItem;
    },
    [saveToStorage]
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((item) => item.id !== id);
        saveToStorage(next);
        return next;
      });
    },
    [saveToStorage]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    saveToStorage([]);
  }, [saveToStorage]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const raw = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
    return Math.round(raw * 100) / 100;
  }, [items]);

  const gst = useMemo(() => {
    return Math.round(subtotal * 0.05 * 100) / 100;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.round((subtotal + gst) * 100) / 100;
  }, [subtotal, gst]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateItem,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
      gst,
      grandTotal,
      isLoaded,
    }),
    [items, addItem, updateItem, removeItem, clearCart, itemCount, subtotal, gst, grandTotal, isLoaded]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
