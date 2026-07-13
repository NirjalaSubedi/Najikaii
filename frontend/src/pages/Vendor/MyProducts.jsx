import React, { useEffect, useState } from 'react';
import { Search, Edit2, Trash2, AlertTriangle, X } from 'lucide-react';
import { getImageUrl } from '../../utils/image';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ sellingPrice: '', stock: '' });

  const fetchMyProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/my-products', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (data.success) setProducts(data.products || []);
    } catch (error) { console.error("Error:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMyProducts(); }, []);

  // Delete Function
  const handleDelete = async (id) => {
    if (!window.confirm("product delete confirmation")) return;
    try {
      await fetch(`http://localhost:5000/api/auth/delete-product/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMyProducts();
    } catch (error) { console.error("Delete Error:", error); }
  };

  // Edit Handlers
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({ sellingPrice: product.sellingPrice, stock: product.stock });
    setIsModalOpen(true);
  };

  const saveProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/updateProduct/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsModalOpen(false);
        fetchMyProducts();
      }
    } catch (error) { console.error("Update Error:", error); }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs max-w-6xl mx-auto mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Products</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none bg-gray-50/50" />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50 rounded-t-xl">
              <th className="py-4 px-4">Product</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Stock</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {filteredProducts.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-4 px-4"><div className="flex items-center gap-3"><img src={getImageUrl(item.image)} className="w-10 h-10 rounded-lg object-cover" /> {item.name}</div></td>
                <td className="py-4 px-4 capitalize">{item.category}</td>
                <td className="py-4 px-4 font-bold">Rs. {item.sellingPrice}</td>
                <td className="py-4 px-4">{item.stock} {item.unitType}</td>
                <td className="py-4 px-4"><span className={`px-2 py-1 rounded-full text-xs ${item.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{item.stock > 0 ? 'Active' : 'Out of Stock'}</span></td>
                <td className="py-4 px-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => openEditModal(item)} className="p-1.5 text-gray-400 hover:text-emerald-600"><Edit2 size={15} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 text-gray-400 hover:text-rose-600"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between mb-4"><h3 className="font-bold">Edit Product</h3><button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
            <label className="text-xs font-semibold text-gray-500">Selling Price</label>
            <input type="number" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} className="w-full p-2 border rounded-lg mb-4" />
            <label className="text-xs font-semibold text-gray-500">Stock</label>
            <input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full p-2 border rounded-lg mb-4" />
            <button onClick={saveProduct} className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;