import { useState, useMemo } from "react";

export const useProductFilter = (initialProducts) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return initialProducts;
    return initialProducts.filter(product => product.category === selectedCategory);
  }, [selectedCategory, initialProducts]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredProducts
  };
};