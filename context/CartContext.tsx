"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceNumber: number;
  img: string;
  quantity: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  items: CartItem[];
  totalPrice: number;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  history: HistoryItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToHistory: (customerInfo: HistoryItem["customerInfo"]) => void;
  totalItems: number;
  totalPrice: number;
  getItemPrice: (item: CartItem) => number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Pricing Logic:
// Piscok: 10k for 3, then +3k per extra piece
// Samyang: 12k for 3, then +4k per extra piece
export const getItemPriceTotal = (item: CartItem) => {
  const itemName = String(item.name || "").toLowerCase();
  const isSamyang = itemName.includes("samyang") || String(item.id || "").toLowerCase().includes("samyang");

  const basePriceFromVariant = item.priceNumber || (isSamyang ? 12000 : 10000);
  const extraPrice = isSamyang ? 4000 : 3000;

  if (item.quantity <= 3) return basePriceFromVariant;
  return basePriceFromVariant + (item.quantity - 3) * extraPrice;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("lumeria-cart");
    const savedHistory = localStorage.getItem("lumeria-history");

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }

    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }

    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("lumeria-cart", JSON.stringify(items));
    }
  }, [items, isInitialized]);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("lumeria-history", JSON.stringify(history));
    }
  }, [history, isInitialized]);

  const addToCart = (product: any, initialQuantity?: number) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (initialQuantity || 1) }
            : item,
        );
      }

      // Parse price safely; support both string and number source.
      const rawPrice = product.price ?? product.priceNumber ?? "0";
      const parsedPrice =
        typeof rawPrice === "number"
          ? rawPrice
          : typeof rawPrice === "string"
          ? Number(rawPrice.replace(/[^0-9]/g, "")) || 0
          : 0;

      const productName = String(product.name || "").toLowerCase();
      const fallbackBase = productName.includes("samyang") ? 12000 : 10000;
      const priceNumber = parsedPrice || fallbackBase;

      const imageSrc =
        product.displayImg ||
        product.image_url ||
        product.img ||
        product.image ||
        "/placeholder-piscok.png";

      const formattedPrice =
        typeof product.price === "string"
          ? product.price
          : `Rp ${priceNumber.toLocaleString("id-ID")}`;

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: formattedPrice,
          priceNumber,
          img: imageSrc,
          quantity: initialQuantity || 3,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 3) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const addToHistory = (customerInfo: HistoryItem["customerInfo"]) => {
    if (items.length === 0) return;

    const newHistoryItem: HistoryItem = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      totalPrice: items.reduce((sum, item) => sum + getItemPriceTotal(item), 0),
      customerInfo: customerInfo,
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    clearCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + getItemPriceTotal(item),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        history,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToHistory,
        getItemPrice: getItemPriceTotal,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
