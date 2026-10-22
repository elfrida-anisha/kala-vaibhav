'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/types';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  artisanName?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kv_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem('kv_cart', JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const addToCart = (product: Product, quantity = 1) => {
    const existing = items.find((i) => i.productId === product.id);
    let updated: CartItem[];
    if (existing) {
      updated = items.map((i) =>
        i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      updated = [
        ...items,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=400&q=80',
          artisanName: product.artisanName,
          quantity,
        },
      ];
    }
    saveCart(updated);
  };

  const removeFromCart = (productId: string) => {
    const updated = items.filter((i) => i.productId !== productId);
    saveCart(updated);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = items.map((i) =>
      i.productId === productId ? { ...i, quantity } : i
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
