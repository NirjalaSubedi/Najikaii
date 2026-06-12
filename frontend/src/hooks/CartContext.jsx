import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        'http://localhost:5000/api/auth/GetCart', 
        getAuthHeaders()
      );
      
      if (response.data && response.data.success) {
        setCartItems(response.data.cart || []);
      }
    } catch (error) {
      console.error("Fetch cart error:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productData) => {
    const productId = productData._id || productData.id || productData.productid;
    if (!productId) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/AddToCart',
        {
          productid: String(productId).trim(),
          quantity: 1
        },
        getAuthHeaders()
      );

      if (response.data && response.data.success) {
        console.log("Cart updated on database successfully!");
        await fetchCart();
      }
    } catch (error) {
      console.error("Frontend AddToCart Error:", error.response?.data || error.message);
      
      alert(error.response?.data?.message || "Cart update failed! Check console.");
    }
  };

  const removeFromCart = async (productId) => {
    if (!productId) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/auth/remove-item/${productId}`,
        getAuthHeaders()
      );
      
      if (response.data && response.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Remove item error:", error.response?.data || error.message);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);