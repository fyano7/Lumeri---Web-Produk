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
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addToHistory: (customerInfo: HistoryItem["customerInfo"]) => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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

  const addToCart = (product: any) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      // Parse price "Rp 10.000" to number 10000
      const priceNumber = parseInt(product.price.replace(/[^0-9]/g, ""));

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          priceNumber: priceNumber,
          img: product.img,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
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
      totalPrice: items.reduce(
        (sum, item) => sum + item.priceNumber * item.quantity,
        0,
      ),
      customerInfo: customerInfo,
    };

    setHistory((prev) => [newHistoryItem, ...prev]);
    clearCart();
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.priceNumber * item.quantity,
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
