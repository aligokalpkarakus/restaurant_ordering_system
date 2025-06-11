import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusMap = {
  received: { label: 'Order Received', color: 'bg-yellow-400 text-yellow-900' },
  preparing: { label: 'Preparing', color: 'bg-blue-500 text-white' },
  ready: { label: 'Ready', color: 'bg-green-500 text-white' },
};

const TrackOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tableId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (!tableId) {
      navigate('/');
      return;
    }

    const fetchSessionAndOrders = async () => {
      setLoading(true);
      try {
        // Önce aktif oturumu çek
        const sessionRes = await axios.get(`http://localhost:8000/tables/session/active/${tableId}`);
        setSessionId(sessionRes.data.id);
        // Sonra o oturuma ait siparişleri çek
        const ordersRes = await axios.get(`http://localhost:8000/order/session/${sessionRes.data.id}`);
        setOrders(ordersRes.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndOrders();
    const interval = setInterval(fetchSessionAndOrders, 4000);
    return () => clearInterval(interval);
  }, [tableId, navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col items-center py-12">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
          <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow-sm text-center mb-6">Your Orders</h1>
          <p className="text-center text-gray-600">No orders found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex flex-col items-center py-12">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-blue-900 drop-shadow-sm text-center mb-6">Your Orders</h1>
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-900">Order #{idx + 1}</h2>
                <span className={`px-5 py-2 rounded-full text-lg font-bold shadow ${statusMap[order.status]?.color || 'bg-gray-300 text-gray-700'}`}>
                  {statusMap[order.status]?.label || order.status}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 bg-orange-50 rounded-l text-gray-700">Product</th>
                      <th className="py-2 px-2 bg-orange-50 text-gray-700">Quantity</th>
                      <th className="py-2 px-2 bg-orange-50 rounded-r text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="bg-gray-50">
                        <td className="py-2 px-2 rounded-l font-medium text-gray-900">{item.menu_item_name}</td>
                        <td className="py-2 px-2 text-center text-orange-600 font-bold">{item.quantity}</td>
                        <td className="py-2 px-2 rounded-r text-right text-orange-600 font-bold">
                          {(item.price * item.quantity).toFixed(2)}₺
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold text-orange-600">
                    {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}₺
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
