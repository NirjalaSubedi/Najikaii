import React, { useState } from 'react';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    actualPrice: '',
    sellingPrice: '',
    category: '',
    unitType: '',
    stock: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('actualPrice', product.actualPrice); 
    formData.append('sellingPrice', product.sellingPrice); 
    formData.append('category', product.category);
    formData.append('unitType', product.unitType); 
    formData.append('stock', product.stock);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5000/api/auth/add-products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok || data.success) {
        alert('Product added successfully!');
        setProduct({ 
          name: '', 
          description: '', 
          actualPrice: '', 
          sellingPrice: '', 
          category: '', 
          unitType: '', 
          stock: '' 
        });
        setImage(null);
        setImagePreview(null);
      } else {
        alert(data.message || 'Error occurred while saving');
      }
    } catch (error) {
      console.error("API Connection Error:", error);
      alert('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto mt-4 text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Add New Product</h2>
      <p className="text-xs text-gray-400 mb-6">List a new item for real-time local customer search inside Najikai network.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product Title *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="e.g., Organic Fresh Milk"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                placeholder="Briefly state your item details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price (Rs.) *</label>
                <input
                  type="number"
                  name="actualPrice"
                  value={product.actualPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="250"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Offer/Selling Price (Rs.) *</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={product.sellingPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="220"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="">Select Category</option>
                <option value="groceries">Groceries & Daily Essentials</option>
                <option value="electronics">Electronics & Gadgets</option>
                <option value="bakery">Bakery & Cafe Menu</option>
                <option value="clothing">Clothing & Fashion</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Stock Count *</label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="15"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Unit Type *</label>
                <select
                  name="unitType"
                  value={product.unitType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                >
                  <option value="">Select Unit</option>
                  <option value="pcs">pcs (Pieces)</option>
                  <option value="kg">kg (Kilogram)</option>
                  <option value="ltr">ltr (Litre)</option>
                  <option value="packet">packet</option>
                  <option value="gram">gram</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Product Showcase Image *</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 relative min-h-[120px] flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg mb-1" />
                    <p className="text-[10px] text-gray-400">Click to swap media file</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-400 font-bold text-xl block">+</span>
                    <p className="text-xs font-medium text-gray-500">Upload Media Attachment</p>
                    <p className="text-[10px] text-gray-300">JPG, PNG format standard</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 text-sm font-semibold text-white rounded-xl shadow-sm ${
              loading ? 'bg-emerald-300 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all'
            }`}
          >
            {loading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;