import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id || item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          (item._id === product._id || item.id === product.id)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // 2. Decrease quantity handle
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === productId || item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevItems.filter((item) => item._id !== productId && item.id !== productId);
      }
      return prevItems.map((item) =>
        (item._id === productId || item.id === productId)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);