import React, { useState } from "react";
import { LayoutGrid, Sprout, Leaf, Coffee, Utensils } from 'lucide-react';

const CategorySelector = () => {
  const categories = [
    { 
      id: 1, 
      name: 'All', 
      icon: LayoutGrid, 
      bgColor: 'bg-[#12B76A]', 
      activeTextColor: 'text-[#12B76A]', 
      passiveIconColor: 'text-white' ,
      fontsize:'bold'
    },
    { 
      id: 2, 
      name: 'Vegetables', 
      icon: Sprout, 
      bgColor: 'bg-green-100', 
      activeTextColor: 'text-gray-500', 
      passiveIconColor: 'text-green-700' 
    },
    { 
      id: 3, 
      name: 'Fruits', 
      icon: Leaf, 
      bgColor: 'bg-orange-100', 
      activeTextColor: 'text-gray-500', 
      passiveIconColor: 'text-orange-700'
    },
    { 
      id: 4, 
      name: 'Dairy', 
      icon: Coffee, 
      bgColor: 'bg-yellow-100', 
      activeTextColor: 'text-gray-500', 
      passiveIconColor: 'text-yellow-700'
    },
    { 
      id: 5, 
      name: 'Meat', 
      icon: Utensils, 
      bgColor: 'bg-red-100', 
      activeTextColor: 'text-gray-500', 
      passiveIconColor: 'text-red-700'
    },
  ];

  const [activeCategoryId, setActiveCategoryId] = useState(1);

  return (
    <div className="flex gap-4 p-4 flex-wrap">
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;
        const IconComponent = category.icon;

        return (
          <div 
            key={category.id} 
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => setActiveCategoryId(category.id)}
          >
            <div className={`w-16 h-16 flex items-center justify-center rounded-[18px] transition-all ${isActive ? 'bg-[#12B76A]' : category.bgColor}`}>
              <IconComponent 
                size={24} 
                strokeWidth={2.5}
                className={`${isActive ? 'text-white' : category.passiveIconColor}`}
              />
            </div>
            
            <p className={`text-[13px] font-medium transition-colors ${isActive ? 'text-[#12B76A]' : 'text-gray-500'}`}>
              {category.name}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelector;