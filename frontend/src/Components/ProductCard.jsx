import React from 'react';
import {heart,star,plus} from 'lucide-react';
const ProductCard = ({product})=>{
    if(!product)return null;

    const {
    name = "Unnamed Product",
    sellingPrice = 0,      
    actualPrice,          
    discountPercentage,   
    image = "https://via.placeholder.com/300",
    unitType = "item",   
    distance,          
    isFastDelivery = false,
    stock = 0,
    vendor = {}
  } = product;

  const calculatedDiscount = discountPercentage 
    ? discountPercentage 
    : (actualPrice && actualPrice > sellingPrice) 
      ? Math.round(((actualPrice - sellingPrice) / actualPrice) * 100) 
      : null;

  const isOutOfStock = stock <= 0;

  

    return(
        <>
        </>
    )
}
export default ProductCard;