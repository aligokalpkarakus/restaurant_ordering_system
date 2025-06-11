import React from 'react';
import KitchenView from './KitchenView';
import KitchenInventory from './KitchenInventory';

const KitchenDashboard = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', padding: 24 }}>
      <div style={{ display: 'flex', gap: 24, maxWidth: 1600, margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          <KitchenView />
        </div>
        <div style={{ flex: 1 }}>
          <KitchenInventory />
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard; 