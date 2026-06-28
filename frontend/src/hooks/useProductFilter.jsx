import { useState } from "react";

export const useProductFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return {
    selectedCategory,
    setSelectedCategory,
  };
};