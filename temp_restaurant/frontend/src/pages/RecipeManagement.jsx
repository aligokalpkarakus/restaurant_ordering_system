import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ menu_item_id: '', inventory_item_id: '', amount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAll = async () => {
    const [r, m, i] = await Promise.all([
      axios.get('http://localhost:8000/recipe/'),
      axios.get('http://localhost:8000/menu/'),
      axios.get('http://localhost:8000/inventory/')
    ]);
    setRecipes(r.data);
    setMenuItems(m.data);
    setInventory(i.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpen = () => {
    setForm({ menu_item_id: '', inventory_item_id: '', amount: '' });
    setError('');
    setSuccess('');
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setError('');
    setSuccess('');
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    if (!form.menu_item_id || !form.inventory_item_id || !form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Please fill all fields with valid values!');
      return;
    }
    try {
      await axios.post('http://localhost:8000/recipe/', {
        menu_item_id: Number(form.menu_item_id),
        inventory_item_id: Number(form.inventory_item_id),
        amount: Number(form.amount)
      });
      setSuccess('Recipe added successfully!');
      fetchAll();
      setTimeout(() => handleClose(), 1000);
    } catch (err) {
      setError('Failed to add recipe!');
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/recipe/${id}`);
      fetchAll();
    } catch (err) {
      alert('Failed to delete recipe!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #a1c4fd 100%)', p: 4 }}>
      <Paper elevation={6} sx={{ maxWidth: 1100, mx: 'auto', p: 4, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">Recipe Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>Add Recipe</Button>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Menu Item</TableCell>
                <TableCell>Ingredient</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map(r => (
                <TableRow key={r.id}>
                  <TableCell>{menuItems.find(m => m.id === r.menu_item_id)?.name || r.menu_item_id}</TableCell>
                  <TableCell>{inventory.find(i => i.id === r.inventory_item_id)?.item_name || r.inventory_item_id}</TableCell>
                  <TableCell>{r.amount}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => handleDelete(r.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Recipe</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <FormControl fullWidth>
            <InputLabel>Menu Item</InputLabel>
            <Select name="menu_item_id" value={form.menu_item_id} label="Menu Item" onChange={handleChange}>
              {menuItems.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Ingredient</InputLabel>
            <Select name="inventory_item_id" value={form.inventory_item_id} label="Ingredient" onChange={handleChange}>
              {inventory.map(i => <MenuItem key={i.id} value={i.id}>{i.item_name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} type="number" fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeManagement; 