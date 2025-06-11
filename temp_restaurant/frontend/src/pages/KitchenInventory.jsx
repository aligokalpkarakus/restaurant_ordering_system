import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';

const KitchenInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:8000/inventory/');
      setInventory(res.data);
    } catch (err) {
      setError('Failed to fetch inventory!');
    }
  };

  useEffect(() => {
    fetchInventory();
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setAddAmount('');
    setError('');
    setSuccess('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setError('');
    setSuccess('');
  };
  const handleAddStock = async () => {
    if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) {
      setError('Please enter a valid amount!');
      return;
    }
    try {
      await axios.patch(`http://localhost:8000/inventory/${selectedItem.id}/add`, { amount: Number(addAmount) });
      setSuccess('Stock updated successfully!');
      fetchInventory();
      setTimeout(() => handleClose(), 1000);
    } catch (err) {
      setError('Failed to update stock!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>Kitchen Inventory</Typography>
        {inventory.map(item => (
          <Paper key={item.id} elevation={2} sx={{ p: 2, borderRadius: 3, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: item.quantity <= item.low_stock_threshold ? '#fff3e0' : 'white' }}>
            <Box>
              <Typography variant="h6">{item.item_name}</Typography>
              <Typography color={item.quantity <= item.low_stock_threshold ? 'error' : 'text.secondary'}>
                Quantity: {item.quantity} {item.quantity <= item.low_stock_threshold && <b> (Low stock!)</b>}
              </Typography>
              <Typography variant="caption" color="text.secondary">Low stock threshold: {item.low_stock_threshold}</Typography>
            </Box>
            <Button variant="contained" onClick={() => handleOpen(item)}>Add Stock</Button>
          </Paper>
        ))}
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Stock</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Typography>Item: <b>{selectedItem?.item_name}</b></Typography>
          <TextField label="Amount to add" value={addAmount} onChange={e => setAddAmount(e.target.value)} type="number" fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddStock} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KitchenInventory; 