import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Loader2, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import ProductDetailModal from "./ProductDetailModal";

const ProductGrid = ({ coords }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState("Nearest First");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const lat = coords?.lat;
  const lng = coords?.lng;

  const fetchProductDetail = async (product) => {
    const productId = product?._id || product?.id;
    if (!productId) return;

    setSelectedProduct(product);
    setDetailLoading(true);
    setDetailError("");

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/product/${productId}`);
      if (response.data?.success && response.data?.product) {
        setSelectedProduct(response.data.product);
      }
    } catch (error) {
      setDetailError(error.response?.data?.message || "Product details fetch garna sakiyena.");
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllMarketplaceProducts = async () => {
      try {
        setLoading(true);
        let url = `http://localhost:5000/api/auth/all-products?sort=${encodeURIComponent(activeSort)}`;
        
        if (lat && lng) {
          url += `&lat=${lat}&lng=${lng}`;
        }

        console.log("Hitting API via ProductGrid component:", url);
        const response = await axios.get(url);
        
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          setProducts([]); 
        }
      } catch (error) {
        console.error("Product Grid fetching error:", error);
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAllMarketplaceProducts();
  }, [lat, lng, activeSort]);

  return (
    <div className="w-full px-6 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">All Products</h2>
          <p className="text-xs font-bold text-gray-400 mt-0.5">
            {products.length} {products.length === 1 ? 'item' : 'items'} found near you
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-gray-400 flex items-center gap-1 mr-1 text-[11px] tracking-wide uppercase">
            <SlidersHorizontal size={12} /> Sort:
          </span>
          {["Nearest First", "Price: Low→High", "Price: High→Low", "Top Rated"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSort(tab)}
              className={`px-3 py-1.5 rounded-full border transition-all duration-200 active:scale-95 ${
                activeSort === tab
                  ? "bg-[#00B56A] border-[#00B56A] text-white shadow-sm shadow-emerald-100"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-gray-400 text-xs font-semibold">
          <Loader2 className="animate-spin text-[#00B56A]" size={28} />
          <span>Loading nearby marketplace products...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((singleItem) => (
            <ProductCard
              key={singleItem._id || singleItem.id}
              product={singleItem}
              onClick={fetchProductDetail}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-xs font-bold text-gray-400 bg-white rounded-[32px] border border-gray-100 shadow-sm">
          Product block collection available chaina current area radius vitra!
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        loading={detailLoading}
        error={detailError}
        onClose={() => {
          setSelectedProduct(null);
          setDetailError("");
          setDetailLoading(false);
        }}
      />
    </div>
  );
};

export default ProductGrid;