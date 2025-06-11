import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WaiterPanel = () => {
  const [tables, setTables] = useState([]);
  const [sessions, setSessions] = useState({}); // { tableId: session }
  const [orders, setOrders] = useState({}); // { sessionId: [orders] }
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Kullanıcı bilgisini localStorage'dan al (örnek)
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/tables/');
      // Masaları id'ye göre sırala
      const sortedTables = res.data.sort((a, b) => a.id - b.id);
      setTables(sortedTables);
      // Her masa için aktif oturumu çek
      const sessionData = {};
      const orderData = {};
      await Promise.all(sortedTables.map(async (table) => {
        try {
          const sres = await axios.get(`http://localhost:8000/tables/session/active/${table.id}`);
          sessionData[table.id] = sres.data;
          // Aktif oturuma ait siparişleri çek
          const ores = await axios.get(`http://localhost:8000/order/session/${sres.data.id}`);
          orderData[sres.data.id] = ores.data;
        } catch (err) {
          sessionData[table.id] = null;
        }
      }));
      setSessions(sessionData);
      setOrders(orderData);
    } catch (err) {
      alert('Masa verileri alınamadı!');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async (tableId) => {
    try {
      await axios.post('http://localhost:8000/tables/session/start', {
        table_id: tableId,
        waiter_id: user?.id
      });
      fetchTables();
    } catch (err) {
      alert('Oturum başlatılamadı!');
    }
  };

  const handleEndSession = async (sessionId) => {
    try {
      await axios.post(`http://localhost:8000/tables/session/end/${sessionId}`);
      fetchTables();
    } catch (err) {
      alert('Oturum kapatılamadı!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-8">
      <h1 className="text-3xl font-bold text-blue-900 mb-8">Garson Paneli</h1>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {tables.map(table => {
            const session = sessions[table.id];
            return (
              <div key={table.id} className="bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col gap-3 min-h-[260px]">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-800">Masa {table.id}</span>
                  <span className={table.is_occupied ? 'bg-red-100 text-red-700 px-3 py-1 rounded-full' : 'bg-green-100 text-green-700 px-3 py-1 rounded-full'}>
                    {table.is_occupied ? 'Dolu' : 'Boş'}
                  </span>
                </div>
                {session ? (
                  <>
                    <div className="text-sm text-gray-600">Aktif Oturum: #{session.id}</div>
                    <div className="flex gap-2 mb-2">
                      <button onClick={() => handleEndSession(session.id)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold">Oturumu Bitir</button>
                    </div>
                    {/* Aktif oturuma ait siparişler */}
                    <div className="bg-gray-50 rounded-xl p-3 mt-2">
                      <div className="font-semibold text-blue-900 mb-2">Siparişler</div>
                      {orders[session.id] && orders[session.id].length > 0 ? (
                        <ul className="space-y-1">
                          {orders[session.id].map((order, idx) => (
                            <li key={order.id} className="border-b last:border-b-0 py-1">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">Sipariş #{idx + 1}</span>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{order.status}</span>
                              </div>
                              <ul className="ml-2 text-sm text-gray-700">
                                {order.items.map(item => (
                                  <li key={item.id}>
                                    {item.menu_item_name} <span className="text-orange-600 font-bold">x{item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-400 text-sm">Sipariş yok</div>
                      )}
                    </div>
                  </>
                ) : (
                  <button onClick={() => handleStartSession(table.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">Oturum Başlat</button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaiterPanel; 