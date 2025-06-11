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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1976d2', marginBottom: 32, textAlign: 'center' }}>Waiter Panel</h1>
        {loading ? (
          <div style={{ textAlign: 'center', fontSize: 20, color: '#888' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 32 }}>
            {tables.map(table => {
              const session = sessions[table.id];
              return (
                <div
                  key={table.id}
                  style={{
                    background: table.is_occupied
                      ? 'linear-gradient(135deg, #ffe0e3 0%, #fff 100%)'
                      : 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
                    borderRadius: 20,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
                    padding: 28,
                    minHeight: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                    border: 'none',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative',
                    ':hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: '0 16px 48px 0 rgba(25,118,210,0.15)'
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: '#1976d2' }}>Table {table.id}</span>
                    <span style={{
                      background: table.is_occupied ? '#ffebee' : '#e8f5e9',
                      color: table.is_occupied ? '#d32f2f' : '#2e7d32',
                      padding: '6px 18px',
                      borderRadius: 16,
                      fontWeight: 600,
                      fontSize: 15
                    }}>{table.is_occupied ? 'Occupied' : 'Empty'}</span>
                  </div>
                  {session ? (
                    <>
                      <div style={{ fontSize: 15, color: '#555', marginBottom: 8 }}>Active Session: #{session.id}</div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <button
                          onClick={() => handleEndSession(session.id)}
                          style={{ background: '#ff9800', color: '#fff', padding: '8px 20px', borderRadius: 8, fontWeight: 600, fontSize: 15, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                        >End Session</button>
                      </div>
                      <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginTop: 8 }}>
                        <div style={{ fontWeight: 600, color: '#1976d2', marginBottom: 8 }}>Orders</div>
                        {orders[session.id] && orders[session.id].length > 0 ? (
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {orders[session.id].map((order, idx) => (
                              <li key={order.id} style={{ borderBottom: '1px solid #e0e0e0', padding: '8px 0', marginBottom: 4 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 700, color: '#333' }}>Order #{idx + 1}</span>
                                  <span style={{ fontSize: 13, padding: '3px 10px', borderRadius: 12, background: '#e3f2fd', color: '#1976d2', fontWeight: 600 }}>{order.status}</span>
                                </div>
                                <ul style={{ marginLeft: 12, fontSize: 14, color: '#555', marginTop: 4 }}>
                                  {order.items.map(item => (
                                    <li key={item.id}>
                                      {item.menu_item_name} <span style={{ color: '#ff9800', fontWeight: 700 }}>x{item.quantity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div style={{ color: '#bbb', fontSize: 14 }}>No orders</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleStartSession(table.id)}
                      style={{ background: '#1976d2', color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                    >Start Session</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaiterPanel; 