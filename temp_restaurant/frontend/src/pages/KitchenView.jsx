import React, { useEffect, useState } from 'react';
import axios from 'axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-blue-100 text-blue-800',
  ready: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: 'Bekliyor',
  preparing: 'Hazırlanıyor',
  ready: 'Hazır',
};

const KitchenView = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [tableFilter, setTableFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/order/paid');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('http://localhost:8000/menu/');
      const itemsMap = {};
      res.data.forEach(item => {
        itemsMap[item.id] = item;
      });
      setMenuItems(itemsMap);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Bildirim
  useEffect(() => {
    if (orders.some(order => order.status === 'ready')) {
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Bir sipariş hazır!');
      } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Bir sipariş hazır!');
          }
        });
      }
    }
  }, [orders]);

  const nextStatus = (current) => {
    if (current === 'pending') return 'preparing';
    if (current === 'preparing') return 'ready';
    return current;
  };

  const updateStatus = async (orderId, currentStatus) => {
    const status = nextStatus(currentStatus);
    try {
      await axios.put(`http://localhost:8000/order/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtreler
  const uniqueTables = Array.from(new Set(orders.map(o => o.table_id)));
  const filteredOrders = orders.filter(order =>
    (tableFilter === 'all' || order.table_id === Number(tableFilter)) &&
    (statusFilter === 'all' || order.status === statusFilter)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Mutfak Paneli</h1>
          <div className="flex gap-4 flex-wrap">
            <select
              className="px-3 py-2 rounded border border-gray-300 bg-white shadow-sm"
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
            >
              <option value="all">Tüm Masalar</option>
              {uniqueTables.map(tableId => (
                <option key={tableId} value={tableId}>Masa {tableId}</option>
              ))}
            </select>
            <select
              className="px-3 py-2 rounded border border-gray-300 bg-white shadow-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Bekliyor</option>
              <option value="preparing">Hazırlanıyor</option>
              <option value="ready">Hazır</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Sipariş No</th>
                <th className="py-3 px-4 text-left font-semibold">Masa</th>
                <th className="py-3 px-4 text-left font-semibold">Durum</th>
                <th className="py-3 px-4 text-left font-semibold">Ürünler</th>
                <th className="py-3 px-4 text-left font-semibold">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">Sipariş yok</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-bold">#{order.id}</td>
                    <td className="py-3 px-4">{order.table_id}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                    </td>
                    <td className="py-3 px-4">
                      <ul className="list-disc pl-5 space-y-1">
                        {order.items.map(item => (
                          <li key={item.id}>{menuItems[item.menu_item_id]?.name || item.menu_item_name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 px-4">
                      {order.status !== 'ready' && (
                        <button
                          onClick={() => updateStatus(order.id, order.status)}
                          className={`px-4 py-2 rounded-lg text-white font-medium shadow transition ${
                            order.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {order.status === 'pending' ? 'Hazırlamaya Başla' : 'Hazır Olarak İşaretle'}
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <span className="text-green-600 font-semibold">Hazır</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KitchenView;
