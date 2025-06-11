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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', padding: 32 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#1976d2', textAlign: 'center' }}>Kitchen Panel</h1>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            <select
              style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #bdbdbd', background: '#fff', boxShadow: '0 2px 8px #0001', fontWeight: 600 }}
              value={tableFilter}
              onChange={e => setTableFilter(e.target.value)}
            >
              <option value="all">All Tables</option>
              {uniqueTables.map(tableId => (
                <option key={tableId} value={tableId}>Table {tableId}</option>
              ))}
            </select>
            <select
              style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #bdbdbd', background: '#fff', boxShadow: '0 2px 8px #0001', fontWeight: 600 }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', background: '#fff' }}>
          <table style={{ width: '100%', fontSize: 15, borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%)', position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 700, fontSize: 16 }}>Order No</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 700, fontSize: 16 }}>Table</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 700, fontSize: 16 }}>Status</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 700, fontSize: 16 }}>Items</th>
                <th style={{ padding: '18px 16px', textAlign: 'left', fontWeight: 700, fontSize: 16 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: '#bbb', fontSize: 18 }}>No orders</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e0e0e0', transition: 'background 0.2s', cursor: 'pointer', ':hover': { background: '#e3f2fd' } }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1976d2' }}>#{order.id}</td>
                    <td style={{ padding: '16px' }}>{order.table_id}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '6px 18px', borderRadius: 16, fontWeight: 600, fontSize: 15, background: order.status === 'pending' ? '#fffde7' : order.status === 'preparing' ? '#e3f2fd' : '#e8f5e9', color: order.status === 'pending' ? '#fbc02d' : order.status === 'preparing' ? '#1976d2' : '#2e7d32' }}>{statusLabels[order.status]}</span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}>
                        {order.items.map(item => (
                          <li key={item.id}>{menuItems[item.menu_item_id]?.name || item.menu_item_name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.status !== 'ready' && (
                        <button
                          onClick={() => updateStatus(order.id, order.status)}
                          style={{
                            padding: '10px 24px',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            color: '#fff',
                            background: order.status === 'pending' ? '#fbc02d' : '#1976d2',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px #0001',
                            transition: 'background 0.2s',
                            marginRight: 8
                          }}
                        >
                          {order.status === 'pending' ? 'Start Preparing' : 'Mark as Ready'}
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <span style={{ color: '#2e7d32', fontWeight: 700, fontSize: 16 }}>Ready</span>
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
