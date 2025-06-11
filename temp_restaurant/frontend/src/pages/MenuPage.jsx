import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import OrderSummary from '../components/OrderSummary';
import { useParams, useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const { id: tableId } = useParams();
  const navigate = useNavigate();
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/menu/')
      .then(res => {
        setMenuItems(res.data);
        const uniqueCategories = [...new Set(res.data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const storedOrderId = localStorage.getItem('lastOrderId');
    if (storedOrderId) setLastOrderId(storedOrderId);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleProceedToPayment = () => {
    navigate(`/payment/${tableId}`, {
      state: {
        cart,
        tableId: parseInt(tableId)
      }
    });
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/90 shadow-md sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow-sm">Table {tableId}</h1>
            <p className="mt-1 text-base text-gray-500">Digital Menu</p>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button onClick={() => navigate('/track-order', { state: { tableId: parseInt(tableId) } })} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all text-base">
              My Orders
            </button>
            <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all text-base">
              My Cart ({cart.length})
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          <span className="text-2xl">🍽️</span> Categories
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 border-2 border-orange-200 ${
              selectedCategory === 'all' 
                ? 'bg-orange-500 text-white border-orange-500 scale-105' 
                : 'bg-white text-orange-600 hover:bg-orange-50'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all duration-200 border-2 border-orange-200 ${
                selectedCategory === category 
                  ? 'bg-orange-500 text-white border-orange-500 scale-105' 
                  : 'bg-white text-orange-600 hover:bg-orange-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <MenuItemCard 
              key={item.id} 
              item={item} 
              onAdd={() => addToCart(item)}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <OrderSummary 
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onProceedToPayment={handleProceedToPayment}
      />

      {lastOrderId && (
        <button
          className="fixed bottom-28 right-8 px-6 py-3 bg-green-600 text-white rounded-full shadow-xl hover:bg-green-700 transition text-lg font-semibold z-30 border-2 border-white/80"
          onClick={() => {
            localStorage.removeItem('lastOrderId');
            setLastOrderId(null);
            navigate(`/track-order/${lastOrderId}`);
          }}
        >
          Track Order
        </button>
      )}
    </div>
  );
};

export default MenuPage;
