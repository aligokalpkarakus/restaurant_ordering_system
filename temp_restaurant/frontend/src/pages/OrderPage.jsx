import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../services/api';

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, tableId } = location.state || { cart: [], tableId: null };

  const handleSubmit = async () => {
    const orderPayload = {
      table_id: tableId,
      status: "received",
      items: cart.map(item => ({
        menu_item_id: item.id,
        quantity: item.quantity,
        special_instructions: ""
      }))
    };

    try {
      await createOrder(orderPayload);
      navigate("/track-order", { state: { tableId } });
    } catch (err) {
      console.error(err);
      alert("Sipariş oluşturulurken bir hata oluştu!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center py-12">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 drop-shadow-sm text-center">Sepet Onayı</h1>
        <ul className="divide-y divide-gray-100 mb-6">
          {cart.map(item => (
            <li key={item.id} className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-900">{item.name} <span className="text-gray-500 font-normal">x{item.quantity}</span></span>
              <span className="text-orange-500 font-bold">{(item.price * item.quantity).toFixed(2)}₺</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 py-4 rounded-2xl text-gray-700 font-bold text-lg shadow-xl transition-all duration-200 bg-gray-100 hover:bg-gray-200"
          >
            Geri Dön
          </button>
          <button
            onClick={handleSubmit}
            className="w-1/2 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all duration-200 bg-green-500 hover:bg-green-600"
          >
            Siparişi Onayla
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
